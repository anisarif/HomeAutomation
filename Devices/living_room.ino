#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>   // Adafruit DHT sensor library (depends on Adafruit Unified Sensor)

// WiFi credentials
const char* ssid = "HIKVISION_0620";
const char* password = "arifwifi";

// MQTT server (Pi Mosquitto, host-mapped port)
const char* mqtt_server = "192.168.0.112";
const int   mqtt_port   = 1885;

// Safe GPIOs for ESP8266
const int lockerGPIO1 = 5;   // D1
const int lightGPIO1  = 12;  // D6
const int lightGPIO2  = 14;  // D5

// DHT11 temp/humidity sensor
// Wiring: VCC->3V3, GND->GND, DATA->D2 (GPIO4), 10k pull-up DATA->3V3.
#define DHTPIN  4          // D2 (free pin; D1/D5/D6 are used by the relays)
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

// Timing for non-blocking locker control
unsigned long lockerTimer = 0;
bool lockerActive = false;

// Timing for non-blocking sensor sampling (DHT11 needs >=1s between reads)
unsigned long lastSensorRead = 0;
const unsigned long sensorInterval = 10000; // 10s

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    yield(); // prevent WDT reset
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("ESP IP address: ");
  Serial.println(WiFi.localIP());
}

// ✅ Correct callback signature
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);

  String messageTemp;
  for (unsigned int i = 0; i < length; i++) {
    messageTemp += (char)payload[i];
  }

  Serial.print("Message: ");
  Serial.println(messageTemp);

  // Locker control (topic "5")
  if (String(topic) == "5") {
    if (messageTemp == "1") {
      Serial.println("Locker ON (3 sec)");
      digitalWrite(lockerGPIO1, HIGH);
      lockerActive = true;
      lockerTimer = millis();
    }
  }

  // Light 1 control (topic "1")
  if (String(topic) == "1") {
    if (messageTemp == "0") {
      digitalWrite(lightGPIO1, HIGH);
      Serial.println("Light1 ON");
    } else if (messageTemp == "1") {
      digitalWrite(lightGPIO1, LOW);
      Serial.println("Light1 OFF");
    }
  }

  // Light 2 control (topic "7")
  if (String(topic) == "7") {
    if (messageTemp == "0") {
      digitalWrite(lightGPIO2, HIGH);
      Serial.println("Light2 ON");
    } else if (messageTemp == "1") {
      digitalWrite(lightGPIO2, LOW);
      Serial.println("Light2 OFF");
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    if (client.connect("Anis")) {
      Serial.println("connected");

      client.subscribe("1");
      client.subscribe("5");
      client.subscribe("7");

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5 seconds");

      delay(5000);
      yield();
    }
  }
}

void setup() {
  pinMode(lightGPIO1, OUTPUT);
  pinMode(lightGPIO2, OUTPUT);
  pinMode(lockerGPIO1, OUTPUT);

  digitalWrite(lightGPIO1, LOW);
  digitalWrite(lightGPIO2, LOW);
  digitalWrite(lockerGPIO1, LOW);

  Serial.begin(115200);

  dht.begin();
  setup_wifi();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  // Non-blocking locker auto OFF after 3 seconds
  if (lockerActive && millis() - lockerTimer > 3000) {
    digitalWrite(lockerGPIO1, LOW);
    lockerActive = false;
    Serial.println("Locker OFF");
  }

  // Non-blocking DHT11 sampling: publish temp/humidity to t/h every 10s
  if (millis() - lastSensorRead > sensorInterval) {
    lastSensorRead = millis();
    float t = dht.readTemperature();   // Celsius
    float h = dht.readHumidity();
    if (isnan(t) || isnan(h)) {
      Serial.println("Failed to read from DHT11 sensor!");
    } else {
      client.publish("t", String(t).c_str());
      client.publish("h", String(h).c_str());
      Serial.print("Temp: ");
      Serial.print(t);
      Serial.print(" C\tHumidity: ");
      Serial.print(h);
      Serial.println(" %");
    }
  }
}
