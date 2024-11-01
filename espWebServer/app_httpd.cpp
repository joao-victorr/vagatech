#include "esp_http_server.h"
#include "esp_camera.h"
#include "esp_log.h"

static const char *TAG = "camera_httpd";
httpd_handle_t camera_httpd = NULL;

// Função de tratamento da rota /capture
static esp_err_t capture_handler(httpd_req_t *req)
{
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb)
    {
        ESP_LOGE(TAG, "Falha ao capturar imagem da câmera");
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }

    // Define o tipo de resposta HTTP como JPEG
    httpd_resp_set_type(req, "image/jpeg");
    httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=capture.jpg");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");

    // Envia a imagem capturada
    esp_err_t res = httpd_resp_send(req, (const char *)fb->buf, fb->len);

    // Retorna o frame buffer para ser reutilizado
    esp_camera_fb_return(fb);

    if (res != ESP_OK)
    {
        ESP_LOGE(TAG, "Erro ao enviar a imagem capturada");
    }

    return res;
}

void startCameraServer()
{
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    config.max_uri_handlers = 16;

    // Define a URI de captura
    httpd_uri_t capture_uri = {
        .uri = "/capture",
        .method = HTTP_GET,
        .handler = capture_handler,
        .user_ctx = NULL
    };

    // Inicia o servidor HTTP
    ESP_LOGI(TAG, "Iniciando servidor da câmera");
    if (httpd_start(&camera_httpd, &config) == ESP_OK)
    {
        // Registra o manipulador da rota /capture
        httpd_register_uri_handler(camera_httpd, &capture_uri);
        ESP_LOGI(TAG, "Servidor da câmera iniciado com sucesso");
    }
    else
    {
        ESP_LOGE(TAG, "Falha ao iniciar o servidor da câmera");
    }
}
