#define TOMBOL 13
#define LED 18
#define LED_BERHASIL 17
#define LED_CANCEL 16

#include <WiFi.h>
#include <PubSubClient.h>

#define tombol_int  0
#define led_int     2

// WiFi
const char *ssid = ; // Enter your Wi-Fi name
const char *password = ;  // Enter Wi-Fi password

// MQTT Broker
const char *mqtt_broker = ; //Enter IPV4 address of your MQTT broker
const char *topic = "transaksi/saldo";
const char *topic_subscribe = "transaksi/status";
const char *mqtt_username = ; // if needed add username
const char *mqtt_password = ; // if needed add password
const int mqtt_port = 1883;
char msg_out[20];

WiFiClient espClient;
PubSubClient client(espClient);

void connectWifi() {
  WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.printf("Connecting to WiFi..\n");
    }
    printf("Connected to the Wi-Fi network\n");
    //connecting to a mqtt broker
    client.setServer(mqtt_broker, mqtt_port);
    client.setCallback(callback);
    while (!client.connected()) {
        String client_id = "esp32-client-";
        client_id += String(WiFi.macAddress());
        Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
        if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            printf("Public EMQX MQTT broker connected\n");
            client.subscribe(topic_subscribe);
        } else {
            Serial.printf("failed with state ");
            Serial.printf("%d",client.state());
            Serial.printf("\n");
            delay(2000);
        }
    }
}

void setup() {
  Serial.begin(115200);
  pinMode(TOMBOL, INPUT);
  pinMode(LED, OUTPUT);
  pinMode(LED_BERHASIL, OUTPUT);
  pinMode(LED_CANCEL, OUTPUT);
  connectWifi();
}

void success() {
  digitalWrite(LED_BERHASIL, HIGH);
  delay(5000);
  digitalWrite(LED_BERHASIL, LOW);
}

void blinking() {
   for (int i = 0; i < 5; i++) {
      digitalWrite(LED_CANCEL, HIGH);
      delay(500);
      digitalWrite(LED_CANCEL, LOW);
      delay(500);
    }
}

void reconnect_broker() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266Client", mqtt_username, mqtt_password)) {
      Serial.println("connected");
      // Once connected, subscribe to desired topics
      client.subscribe(topic_subscribe);
      printf("Public EMQX MQTT broker connected\n");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");

      // Wait 5 seconds before retrying
      delay(8000);
    }
  }
}


int checkString(char *strcmpr, byte *input, unsigned int length) {
  for (int i=0; i < length; i++) {
    if (strcmpr[i] != (char)input[i]) {
      return 0;
    }
  }
  return 1;
}
void callback(char *topic, byte *payload, unsigned int length) {
    Serial.printf("Message arrived in topic: ");
    Serial.printf(topic);
    Serial.printf(topic_subscribe);
    Serial.printf("\n");
    Serial.printf("Message:");
    for (int i = 0; i < length; i++) {
        Serial.printf("%c", (char)payload[i]);
    }
    char *strcmpr="";
    int instruct=0;
    char temp = (char)payload[0];
    Serial.printf("%c", (char)payload[0]);
    Serial.printf(" another %d", strcmp(topic, topic_subscribe));
    // if (strcmp(topic, topic_subscribe)) {
      if (temp == 'b') {
        strcmpr = "berhasil";
        instruct=1;
      } else if (temp == 'g') {
        strcmpr = "gagal";
        Serial.println(strcmpr);
        instruct=2;
      } else if (temp == 'k') {
        strcmpr = "kurang";
        instruct=3;
      }

      if (checkString(strcmpr, payload, length)) {
        led_function(instruct);
      }
    
    Serial.printf("\n");
    Serial.printf("-----------------------\n");
}

void led_function(int instruction) {
  if (instruction == 1) {
    digitalWrite(LED, LOW);
    success();
  } else if (instruction == 2) {
    digitalWrite(LED, LOW);
    digitalWrite(LED_CANCEL, HIGH);
    delay(3000);
    digitalWrite(LED_CANCEL, LOW);
  } else if (instruction == 3) {
    digitalWrite(LED, LOW);
    blinking();
  } 
}

int buttonState = 0;

void loop() {
  buttonState = digitalRead(TOMBOL);

  if (!client.connected()) {
    reconnect_broker();
  }

  if (client.connected()) {
    client.loop();
  }

  if (buttonState == HIGH) {
    client.publish(topic, "pending");
    digitalWrite(LED, HIGH);
    delay(500);
  }
}
