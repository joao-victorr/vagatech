/**********************************************************************
  Filename    : Camera Web Server
  Description : The camera images captured by the ESP32S3 are displayed on the web page.
  Auther      : www.freenove.com
  Modification: 2024/07/01
**********************************************************************/
#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h> // Incluir biblioteca para fazer requisições HTTP

// ===================
// Select camera model
// ===================

#define CAMERA_MODEL_ESP32S3_EYE // Has PSRAM

#define trigPin 13 // define TrigPin
#define echoPin 14 // define EchoPin.
#define MAX_DISTANCE 700 // Maximum sensor distance is rated at 400-500cm.
//timeOut= 2*MAX_DISTANCE /100 /340 *1000000 = MAX_DISTANCE*58.8
#define DISTANCE_THRESHOLD 60 // Distância limite de 60 cm
#define CONSECUTIVE_THRESHOLD 10 // Número de medições consecutivas

int vacancyNumber = 1;

float timeOut = MAX_DISTANCE * 60; 
int soundVelocity = 340; // define sound speed=340m/s

int consecutiveBelowThreshold = 0;
int consecutiveAboveThreshold = 0;
const char* apiBaseUrl = "http://192.168.0.2:4000";

boolean detected = false;


#include "camera_pins.h"

// ===========================
// Enter your WiFi credentials
// ===========================
const char* ssid = "TP-Link_EAA4";
const char* password = "17749961";

void startCameraServer();

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  pinMode(trigPin,OUTPUT);// set trigPin to output mode
  pinMode(echoPin,INPUT); // set echoPin to input mode

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG; // for streaming
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;
  
  // if PSRAM IC present, init with UXGA resolution and higher JPEG quality
  // for larger pre-allocated frame buffer.
  if(psramFound()){
    config.jpeg_quality = 10;
    config.fb_count = 2;
    config.grab_mode = CAMERA_GRAB_LATEST;
  } else {
    // Limit the frame size when PSRAM is not available
    config.frame_size = FRAMESIZE_SVGA;
    config.fb_location = CAMERA_FB_IN_DRAM;
  }

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t * s = esp_camera_sensor_get();
  // initial sensors are flipped vertically and colors are a bit saturated
  s->set_vflip(s, 0); // flip it back
  s->set_brightness(s, 0); // up the brightness just a bit
  s->set_saturation(s, -1); // lower the saturation
  
  WiFi.begin(ssid, password);
  WiFi.setSleep(false);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  while (WiFi.STA.hasIP() != true) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connected");

  startCameraServer();

  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");
}


// Função para enviar o status para a API
void sendToAPI(boolean detectedStatus) {
  HTTPClient http;
  String fullUrl = String(apiBaseUrl) + "/detectedVehicle";
  http.begin(fullUrl); // URL da API

  http.addHeader("Content-Type", "application/json"); // Define o tipo de conteúdo como JSON
  
    // Monta o corpo da requisição, incluindo o IP do ESP
  // Monta o corpo da requisição, incluindo o IP do ESP
  String ipAddress = WiFi.localIP().toString(); // Obtém o endereço IP local
  String requestBody = "{\"detected\":"; 
  requestBody += (detectedStatus ? "true" : "false");
  requestBody += ", \"ip\":\"" + ipAddress + "\""; // Adiciona o IP no corpo da requisição
  requestBody += ", \"vacancyNumber\":" + String(vacancyNumber) + "}"; // Adiciona o vacancyNumber como número



  int httpResponseCode = http.POST(requestBody); // Envia a requisição POST
  
  if (httpResponseCode > 0) {
    Serial.printf("HTTP Response code: %d\n", httpResponseCode); // Exibe o código de resposta HTTP
  } else {
    Serial.printf("Erro na requisição: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end(); // Finaliza a conexão
}


void loop() {
  delay(500); // Espera 500ms entre as medições
  
  float distance = getSonar(); // Obter a distância do sensor
  
  Serial.printf("Distance: %.2f cm\n", distance); // Exibir a distância

  // Verificar se a distância está abaixo do limite e sem veículo detectado
  if (distance < DISTANCE_THRESHOLD && !detected) {
    consecutiveBelowThreshold++; // Aumentar o contador se estiver abaixo do limite
    
    // Se houver 10 medições consecutivas abaixo do limite, exibir a mensagem de presença
    if (consecutiveBelowThreshold >= CONSECUTIVE_THRESHOLD) {
      Serial.println("PRESENÇA DETECTADA --------------HELLO---------------");
      sendToAPI(true); // Enviar status 'true' para a API
      consecutiveBelowThreshold = 0; // Resetar o contador após detectar a presença
      consecutiveAboveThreshold = 0; // Resetar o contador de ausência para evitar erros
      detected = true;
    }
    
  } 
  // Se a distância está acima do limite e já foi detectada presença
  else if (distance > DISTANCE_THRESHOLD && detected) {
    consecutiveAboveThreshold++; // Aumentar o contador se estiver acima do limite
    
    // Se houver 10 medições consecutivas acima do limite, exibir a mensagem de ausência
    if (consecutiveAboveThreshold >= CONSECUTIVE_THRESHOLD) {
      Serial.println("PRESENÇA PERDIDA --------------BAY---------------");
      sendToAPI(false); // Enviar status 'false' para a API
      consecutiveAboveThreshold = 0; // Resetar o contador após perder a presença
      consecutiveBelowThreshold = 0; // Resetar o contador de detecção para evitar erros
      detected = false;
    }
  } 
  // Se a distância estiver acima do limite e nenhuma presença foi detectada
  else {
    Serial.printf("Detected: %.2f cm\n", detected);
    consecutiveBelowThreshold = 0; // Resetar o contador de detecção se a distância for maior
  }
}



float getSonar() {
  unsigned long pingTime;
  float distance;
  // make trigPin output high level lasting for 10μs to triger HC_SR04
  digitalWrite(trigPin, HIGH); 
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Wait HC-SR04 returning to the high level and measure out this waitting time
  pingTime = pulseIn(echoPin, HIGH, timeOut); 
  // calculate the distance according to the time
  distance = (float)pingTime * soundVelocity / 2 / 10000; 
  return distance; // return the distance value
}
