
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include <SHT21.h>  

SHT21 sht; 

const char* ssid = "TOPNET_NVQB";
const char* password = "jdevd76393";

const char* mqtt_server = "192.168.1.111";

WiFiClient espClient;
PubSubClient client(espClient);

float temp; 	// variable to store temperature
float humidity; // variable to store hemidity

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

  Wire.begin();		
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
    client.connect("living_room");
    
  temp = sht.getTemperature();  
  humidity = sht.getHumidity();

  Serial.print("Temp: ");			
  Serial.print(temp);
  client.publish("t", String(temp).c_str());
  Serial.print("\t Humidity: ");
  Serial.println(humidity);
  client.publish("h", String(humidity).c_str());

  delay(50000);	// min delay for 14bit temp reading is 85ms
}