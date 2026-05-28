#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "HIKVISION_0620";
const char* password = "arifwifi";

// MQTT server
const char* mqtt_server = "192.168.0.112";

// Must match the actuator ID registered in the HomeAutomation dashboard
const int ACTUATOR_ID = 10;

const int RED_PIN   = 14;  // D5
const int GREEN_PIN = 12;  // D6
const int BLUE_PIN  = 13;  // D7

WiFiClient   espClient;
PubSubClient client(espClient);

void setColor(int r, int g, int b) {
    analogWrite(RED_PIN,   r);
    analogWrite(GREEN_PIN, g);
    analogWrite(BLUE_PIN,  b);
}

void callback(char* topic, byte* payload, unsigned int length) {
    StaticJsonDocument<64> doc;
    DeserializationError err = deserializeJson(doc, payload, length);
    if (err) return;

    // Backend sends 0-1023 (ESP8266 analogWrite range)
    int r = doc["r"] | 0;
    int g = doc["g"] | 0;
    int b = doc["b"] | 0;
    setColor(constrain(r, 0, 1023), constrain(g, 0, 1023), constrain(b, 0, 1023));
}

void setupWifi() {
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) delay(500);
    Serial.println("WiFi connected: " + WiFi.localIP().toString());
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("MQTT connecting...");
        if (client.connect("rgb_strip")) {
            char topic[8];
            sprintf(topic, "%d", ACTUATOR_ID);
            client.subscribe(topic);
            Serial.println("connected, subscribed to " + String(topic));
        } else {
            Serial.print("failed rc=");
            Serial.println(client.state());
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
    client.setServer(mqttServer, 1883);
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) reconnect();
    client.loop();
}
