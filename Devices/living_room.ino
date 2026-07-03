
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include <DHT.h>   // Adafruit DHT sensor library (depends on Adafruit Unified Sensor)

// DHT11 wiring: VCC->3V3, GND->GND, DATA->DHTPIN (10k pull-up DATA->VCC).
#define DHTPIN  D4       // GPIO2 — change to match your wiring
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "TOPNET_NVQB";
const char* password = "jdevd76393";

const char* mqtt_server = "192.168.1.111";

WiFiClient espClient;
PubSubClient client(espClient);

float temp;     // variable to store temperature
float humidity; // variable to store humidity

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

void callback(String topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    if (client.connect("living_room")) {
      Serial.println("connected");
      client.subscribe("t");
      client.subscribe("h");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  if (!client.loop())
    client.connect("living_room");

  temp = dht.readTemperature();     // Celsius
  humidity = dht.readHumidity();

  // DHT11 returns NaN on a failed read; skip publishing so we don't push garbage.
  if (isnan(temp) || isnan(humidity)) {
    Serial.println("Failed to read from DHT11 sensor!");
  } else {
    Serial.print("Temp: ");
    Serial.print(temp);
    client.publish("t", String(temp).c_str());
    Serial.print("\t Humidity: ");
    Serial.println(humidity);
    client.publish("h", String(humidity).c_str());
  }

  delay(10000);   // DHT11 needs >=1s between reads; 10s refresh
}
