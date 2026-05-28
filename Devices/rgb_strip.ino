#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid       = "HIKVISION_0620";
const char* password   = "arifwifi";
const char* mqtt_server = "192.168.0.112";

const int ACTUATOR_ID = 10;

const int RED_PIN   = 14;  // D5
const int GREEN_PIN = 12;  // D6
const int BLUE_PIN  = 13;  // D7

WiFiClient   espClient;
PubSubClient client(espClient);

// Current effect state
String currentEffect = "solid";
int effectR = 0, effectG = 0, effectB = 0;
int effectSpeed = 5;  // 1–10

// Animation state
unsigned long lastTick = 0;
float breathVal  = 0.0;
float breathDir  = 1.0;
float cycleHue   = 0.0;
bool  strobeOn   = false;
bool  pulseFadeIn = true;

void setColor(int r, int g, int b) {
    analogWrite(RED_PIN,   constrain(r, 0, 1023));
    analogWrite(GREEN_PIN, constrain(g, 0, 1023));
    analogWrite(BLUE_PIN,  constrain(b, 0, 1023));
}

// h: 0.0–1.0 → outputs 0–1023 per channel
void hsvToRgb(float h, int &r, int &g, int &b) {
    int   i  = (int)(h * 6) % 6;
    float f  = h * 6 - (int)(h * 6);
    float q  = 1.0 - f;
    float t  = f;
    float fr, fg, fb;
    switch (i) {
        case 0: fr=1; fg=t; fb=0; break;
        case 1: fr=q; fg=1; fb=0; break;
        case 2: fr=0; fg=1; fb=t; break;
        case 3: fr=0; fg=q; fb=1; break;
        case 4: fr=t; fg=0; fb=1; break;
        default:fr=1; fg=0; fb=q; break;
    }
    r = (int)(fr * 1023);
    g = (int)(fg * 1023);
    b = (int)(fb * 1023);
}

void callback(char* topic, byte* payload, unsigned int length) {
    StaticJsonDocument<96> doc;
    if (deserializeJson(doc, payload, length)) return;

    currentEffect = doc["effect"] | "solid";
    effectSpeed   = constrain((int)(doc["speed"] | 5), 1, 10);

    // r/g/b arrive as 0-1023 from the backend
    effectR = constrain((int)(doc["r"] | 0), 0, 1023);
    effectG = constrain((int)(doc["g"] | 0), 0, 1023);
    effectB = constrain((int)(doc["b"] | 0), 0, 1023);

    // Reset animation state on new command
    breathVal   = 0.0; breathDir  = 1.0;
    cycleHue    = 0.0; strobeOn   = false;
    pulseFadeIn = true;
}

void runEffects() {
    // interval in ms: speed 1 = 40ms, speed 10 = 4ms
    unsigned long interval = map(effectSpeed, 1, 10, 40, 4);
    unsigned long now = millis();
    if (now - lastTick < interval) return;
    lastTick = now;

    if (currentEffect == "solid") {
        setColor(effectR, effectG, effectB);

    } else if (currentEffect == "breath") {
        breathVal += breathDir * 0.015;
        if (breathVal >= 1.0) { breathVal = 1.0; breathDir = -1.0; }
        if (breathVal <= 0.0) { breathVal = 0.0; breathDir =  1.0; }
        setColor((int)(effectR * breathVal),
                 (int)(effectG * breathVal),
                 (int)(effectB * breathVal));

    } else if (currentEffect == "colorCycle") {
        cycleHue += 0.003;
        if (cycleHue >= 1.0) cycleHue = 0.0;
        int r, g, b;
        hsvToRgb(cycleHue, r, g, b);
        setColor(r, g, b);

    } else if (currentEffect == "strobe") {
        strobeOn = !strobeOn;
        strobeOn ? setColor(effectR, effectG, effectB) : setColor(0, 0, 0);

    } else if (currentEffect == "pulse") {
        if (pulseFadeIn) {
            breathVal += 0.05;
            if (breathVal >= 1.0) { breathVal = 1.0; pulseFadeIn = false; }
        } else {
            breathVal -= 0.02;
            if (breathVal <= 0.0) { breathVal = 0.0; pulseFadeIn = true; }
        }
        setColor((int)(effectR * breathVal),
                 (int)(effectG * breathVal),
                 (int)(effectB * breathVal));
    }
}

void setupWifi() {
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) delay(500);
    Serial.println("WiFi: " + WiFi.localIP().toString());
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("MQTT...");
        client.setKeepAlive(60);
        if (client.connect("rgb_strip")) {
            char topic[8];
            sprintf(topic, "%d", ACTUATOR_ID);
            client.subscribe(topic);
            Serial.println("ok, topic=" + String(topic));
        } else {
            Serial.print("rc="); Serial.println(client.state());
            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(115200);
    pinMode(RED_PIN,   OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
    pinMode(BLUE_PIN,  OUTPUT);
    setColor(0, 0, 0);
    setupWifi();
    client.setServer(mqtt_server, 1885);
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) reconnect();
    client.loop();
    runEffects();
}
