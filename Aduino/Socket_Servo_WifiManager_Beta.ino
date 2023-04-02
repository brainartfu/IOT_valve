////////////////////////By  myronenkoyaroslav4@gmail.com///////////////////////////////



#include <WiFiManager.h>
#include <SocketIoClient.h>
#include <Servo.h>
const char* serverAddress = "100.25.155.48"; 
const int serverPort = 443;
unsigned long previousMillis;
SocketIoClient socket;
Servo motor;
int motorAngle = 0;
WiFiManager wm;

void onConnect(const char* payload, size_t length) {
  Serial.println("Connected to Socket.IO server");
  delay(300);
  socket.emit("register", "\"PRODUCT_ID3456\""); //PLEASE CHANGE THIS ID AS NATURAL UNIQUE ID.
}
void onValue(const char* payload, size_t length) {
  String value = String(payload);
  motorAngle = 500+value.toInt()*2000/180;
  motor.write(motorAngle);
  Serial.println("Motor angle set to: " + String(motorAngle));
}

void setup() {
  motor.attach(13);// Pelase connect motor control pin to 13th connectcomputetor. 
  motor.write(0);
  Serial.begin(115200);
  wm.setConnectTimeout(10);    
  bool wmConnectResult =wm.autoConnect("Auto_washer");  // Anonymous AP Name
if (!wmConnectResult) {
Serial.println(">> OOPS... Connection Failed.");
Serial.println(">> Rebooting in 5 Seconds.");
delay(5000);
wm.resetSettings();
ESP.restart();
} else {
Serial.println(">> YAY! We Connected!");
}
  Serial.println(WiFi.localIP().toString());
  socket.begin(serverAddress, serverPort);
  socket.on("connect", onConnect);
  socket.on("value", onValue);
}

void loop() {
  unsigned long currentMillis = millis();
  socket.loop();
  if (currentMillis - previousMillis >= 7000) {
  previousMillis = currentMillis;  
  socket.emit("normal","\"PRODUCT_ID3456\"");//   PLEASE CHANGE THIS ID AS NATURAL UNIQUE ID.
}
}
