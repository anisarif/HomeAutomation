/*
 * ac_controller.ino
 *
 * Dedicated ESP8266 that controls an air conditioner over IR, using two
 * mechanisms:
 *
 *   1. Learn & replay (universal): an IR receiver captures each remote button
 *      and publishes the decoded code to  ac/<TOPIC_KEY>/captured . The backend
 *      stores it; later the app asks us to replay the raw timing.
 *
 *   2. Protocol state (when recognised): the app sends {mode,temp,fan,power}
 *      on  ac/<TOPIC_KEY>/send  and we build the full frame with IRac.
 *
 * MQTT topics (JSON payloads):
 *   ac/<TOPIC_KEY>/send      (in)  {"kind":"raw","freq":38,"raw":[...]} or
 *                                  {"kind":"state","protocol":"COOLIX",...}
 *   ac/<TOPIC_KEY>/learn     (in)  {"enable":true,"ttl":30}
 *   ac/<TOPIC_KEY>/captured  (out) {"capture_id":N,"protocol":"COOLIX",
 *                                   "value":"0x..","bits":24,"freq":38,"raw":[...]}
 *
 * Libraries required (install via Arduino Library Manager):
 *   - IRremoteESP8266
 *   - ArduinoJson (v6)
 *   - PubSubClient
 */

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include <IRremoteESP8266.h>
#include <IRrecv.h>
#include <IRsend.h>
#include <IRac.h>
#include <IRutils.h>

// ---------------------------------------------------------------- config ---
const char* ssid        = "HIKVISION_0620";
const char* password    = "arifwifi";
const char* mqtt_server = "192.168.0.112";
const int   mqtt_port   = 1885;   // Pi Mosquitto (host-mapped port)

// Must match ACUnit.topic_key in the backend.
const char* TOPIC_KEY   = "ac_controller";

// IR hardware pins (NodeMCU). RECV_PIN = receiver module, SEND_PIN = IR LED.
const uint16_t kRecvPin = D5;   // GPIO14
const uint16_t kSendPin = D2;   // GPIO4

// Raw IR arrays are large; PubSubClient's default 256-byte buffer silently
// drops them in BOTH directions. This must be big enough for the JSON payload.
const uint16_t kMqttBufferSize = 3072;

// IR capture tuning.
const uint16_t kCaptureBufferSize = 1024;  // supports large AC frames
const uint8_t  kCaptureTimeout    = 50;    // ms of no signal = end of message
const uint16_t kMinUnknownSize    = 12;    // ignore tiny/noise UNKNOWN decodes

// ---------------------------------------------------------------- globals --
WiFiClient   espClient;
PubSubClient client(espClient);

IRrecv irrecv(kRecvPin, kCaptureBufferSize, kCaptureTimeout, true);
IRsend irsend(kSendPin);
IRac   ac(kSendPin);
decode_results results;

bool          learnEnabled  = false;
unsigned long learnDeadline = 0;      // millis() when learn auto-exits
unsigned long lastCaptureMs = 0;      // debounce repeated frames
uint32_t      captureCounter = 0;     // monotonic capture_id

char topicSend[48];
char topicLearn[48];
char topicCaptured[48];

// ---------------------------------------------------------- string->enum ---
stdAc::opmode_t modeFromString(const char* m) {
  if (!strcmp(m, "cool")) return stdAc::opmode_t::kCool;
  if (!strcmp(m, "heat")) return stdAc::opmode_t::kHeat;
  if (!strcmp(m, "dry"))  return stdAc::opmode_t::kDry;
  if (!strcmp(m, "fan"))  return stdAc::opmode_t::kFan;
  return stdAc::opmode_t::kAuto;
}

stdAc::fanspeed_t fanFromString(const char* f) {
  if (!strcmp(f, "low"))  return stdAc::fanspeed_t::kLow;
  if (!strcmp(f, "med"))  return stdAc::fanspeed_t::kMedium;
  if (!strcmp(f, "high")) return stdAc::fanspeed_t::kHigh;
  return stdAc::fanspeed_t::kAuto;
}

// ------------------------------------------------------------------ wifi ---
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
}

// -------------------------------------------------------------- sending ---
void sendRawCommand(JsonDocument& doc) {
  uint16_t freq = doc["freq"] | 38;
  JsonArray raw = doc["raw"].as<JsonArray>();
  uint16_t len = raw.size();
  if (len == 0) {
    Serial.println("raw command has no data");
    return;
  }
  uint16_t* buf = (uint16_t*) malloc(sizeof(uint16_t) * len);
  if (!buf) {
    Serial.println("malloc failed for raw buffer");
    return;
  }
  uint16_t i = 0;
  for (JsonVariant v : raw) buf[i++] = v.as<uint16_t>();
  irsend.sendRaw(buf, len, freq);
  free(buf);
  Serial.printf("sent raw command (%u entries @ %ukHz)\n", len, freq);
}

void sendStateCommand(JsonDocument& doc) {
  const char* protocol = doc["protocol"] | "";
  decode_type_t proto = strToDecodeType(protocol);
  if (proto == decode_type_t::UNKNOWN || !IRac::isProtocolSupported(proto)) {
    Serial.printf("protocol '%s' not supported for state control\n", protocol);
    return;
  }
  stdAc::state_t state;
  state.protocol = proto;
  state.model    = 1;
  state.power    = doc["power"] | false;
  state.mode     = modeFromString(doc["mode"] | "auto");
  state.degrees  = doc["temp"] | 22;
  state.fanspeed = fanFromString(doc["fan"] | "auto");
  state.celsius  = true;
  state.swingv   = stdAc::swingv_t::kOff;
  state.swingh   = stdAc::swingh_t::kOff;
  state.light = state.beep = state.econo = state.filter = false;
  state.turbo = state.quiet = state.clean = false;
  state.sleep = -1;
  state.clock = -1;
  ac.sendAc(state, nullptr);
  Serial.printf("sent %s state: power=%d mode=%s temp=%d fan=%s\n",
                protocol, state.power, (const char*)(doc["mode"] | "auto"),
                (int)state.degrees, (const char*)(doc["fan"] | "auto"));
}

// -------------------------------------------------------------- callback ---
void callback(char* topic, byte* payload, unsigned int length) {
  DynamicJsonDocument doc(4096);  // heap: raw arrays would blow the stack
  DeserializationError err = deserializeJson(doc, payload, length);
  if (err) {
    Serial.print("JSON parse failed: ");
    Serial.println(err.c_str());
    return;
  }

  if (!strcmp(topic, topicLearn)) {
    learnEnabled = doc["enable"] | false;
    uint16_t ttl = doc["ttl"] | 30;
    learnDeadline = millis() + (unsigned long)ttl * 1000UL;
    Serial.printf("learn mode -> %d (ttl %us)\n", learnEnabled, ttl);
    if (learnEnabled) irrecv.resume();
    return;
  }

  if (!strcmp(topic, topicSend)) {
    const char* kind = doc["kind"] | "raw";
    if (!strcmp(kind, "state")) sendStateCommand(doc);
    else                        sendRawCommand(doc);
    return;
  }
}

// -------------------------------------------------------------- learning ---
void publishCaptured() {
  // Build the captured JSON. Sized generously for a large AC raw frame.
  DynamicJsonDocument doc(kMqttBufferSize);
  captureCounter++;
  doc["capture_id"] = captureCounter;
  doc["protocol"]   = typeToString(results.decode_type);
  doc["value"]      = resultToHexidecimal(&results);
  doc["bits"]       = results.bits;
  doc["freq"]       = 38;

  uint16_t len = getCorrectedRawLength(&results);
  uint16_t* raw = resultToRawArray(&results);
  JsonArray arr = doc.createNestedArray("raw");
  if (raw != nullptr) {
    for (uint16_t i = 0; i < len; i++) arr.add(raw[i]);
    free(raw);
  }

  size_t n = measureJson(doc);
  char* out = (char*) malloc(n + 1);
  if (!out) {
    Serial.println("malloc failed for captured payload");
    return;
  }
  serializeJson(doc, out, n + 1);
  bool ok = client.publish(topicCaptured, out, false);
  free(out);
  Serial.printf("captured %s (%u bits, %u raw) published=%d\n",
                typeToString(results.decode_type).c_str(),
                results.bits, len, ok);
}

void handleLearn() {
  if (!learnEnabled) return;

  if (millis() > learnDeadline) {
    learnEnabled = false;
    Serial.println("learn mode timed out");
    return;
  }

  if (irrecv.decode(&results)) {
    bool tooSmall = (results.decode_type == decode_type_t::UNKNOWN &&
                     results.bits < kMinUnknownSize);
    bool bounced = (millis() - lastCaptureMs) < 400;  // debounce repeat frames
    if (!tooSmall && !bounced) {
      lastCaptureMs = millis();
      publishCaptured();
    }
    irrecv.resume();
  }
}

// -------------------------------------------------------------- mqtt conn ---
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(TOPIC_KEY)) {
      Serial.println("connected");
      client.subscribe(topicSend);
      client.subscribe(topicLearn);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// ------------------------------------------------------------------ setup ---
void setup() {
  Serial.begin(115200);

  snprintf(topicSend,     sizeof(topicSend),     "ac/%s/send",     TOPIC_KEY);
  snprintf(topicLearn,    sizeof(topicLearn),    "ac/%s/learn",    TOPIC_KEY);
  snprintf(topicCaptured, sizeof(topicCaptured), "ac/%s/captured", TOPIC_KEY);

  setup_wifi();

  irsend.begin();
  ac.next.protocol = decode_type_t::COOLIX;  // sane default; overridden per-send
  irrecv.setUnknownThreshold(kMinUnknownSize);
  irrecv.enableIRIn();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setBufferSize(kMqttBufferSize);  // CRITICAL: default 256B drops raw IR
}

// ------------------------------------------------------------------- loop ---
void loop() {
  if (!client.connected()) reconnect();
  client.loop();
  handleLearn();
}
