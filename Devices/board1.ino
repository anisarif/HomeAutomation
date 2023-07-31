
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "SSID";
const char* password = "password";


const char* mqtt_server = "BrokerIp";

WiFiClient espClient;
PubSubClient client(espClient);


const int lockerGPIO1 = D3;
const int lightGPIO1 = D5;


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

  if(topic=="4"){
      Serial.print("Changing GPIO 0 to ");
      if(messageTemp == "1"){
        digitalWrite(lockerGPIO1, HIGH);
        Serial.print(" On ");
        delay(3000);
        digitalWrite(lockerGPIO1, LOW);
        Serial.print(" Off ");
      }
  }
  if(topic=="5"){
      Serial.print("Changing GPIO 3 to ");
      if(messageTemp == "0"){
        digitalWrite(lightGPIO1, HIGH);
        Serial.print("On");
      }
      else if(messageTemp == "1"){
        digitalWrite(lightGPIO1, LOW);
        Serial.print("Off");
      }
  }
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    if (client.connect("board1")) {
      Serial.println("connected");  
      client.subscribe("4");
      client.subscribe("5");
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
  pinMode(lightGPIO1, OUTPUT);
  pinMode(lockerGPIO1, OUTPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  if(!client.loop())
    client.connect("board1");
}