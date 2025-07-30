# 🌡️ Monitor de Humidade ESP32

Uma aplicação web moderna para visualizar dados de humidade e temperatura em tempo real do ESP32.

## 📋 Características

- **Interface Moderna**: Design responsivo com gradientes e efeitos de vidro
- **Tempo Real**: Atualizações automáticas a cada 5 segundos
- **Gráficos Interativos**: Histórico visual com Chart.js
- **Estatísticas**: Máximo, mínimo e média dos valores
- **Responsivo**: Funciona perfeitamente em mobile e desktop
- **Preparado para Firebase**: Estrutura pronta para integração com Firebase

## 🚀 Como Usar

### 1. Visualização Local
1. Abre o ficheiro `index.html` no teu navegador
2. A aplicação irá simular dados automaticamente
3. Vê os valores a atualizarem em tempo real

### 2. Deploy no GitHub Pages
1. Faz push do código para um repositório GitHub
2. Vai para Settings > Pages
3. Seleciona a branch main
4. A tua página estará disponível em `https://teu-username.github.io/teu-repo`

## 🔧 Estrutura do Projeto

```
ESP32/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md          # Esta documentação
```

## 📊 Funcionalidades

### Dashboard Principal
- **Leitura Atual**: Valor atual de humidade em destaque
- **Temperatura**: Temperatura ambiente
- **Estatísticas**: Máximo, mínimo e média
- **Status de Conexão**: Indicador visual do estado

### Gráfico Interativo
- **Histórico**: Visualização temporal dos dados
- **Múltiplas Séries**: Humidade e temperatura
- **Controles de Tempo**: 1H, 6H, 24H
- **Zoom e Pan**: Interação completa

### Informações do Sistema
- Última atualização
- Intervalo de leitura
- Tipo de sensor
- Versão do firmware

## 🔥 Integração com Firebase

### 1. Configurar Firebase
1. Cria um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ativa o Firestore Database
3. Copia a configuração do projeto

### 2. Atualizar Configuração
No ficheiro `script.js`, atualiza a configuração:

```javascript
const CONFIG = {
    firebaseConfig: {
        apiKey: "TUA_API_KEY",
        authDomain: "teu-projeto.firebaseapp.com",
        projectId: "teu-projeto-id",
        storageBucket: "teu-projeto.appspot.com",
        messagingSenderId: "123456789",
        appId: "teu-app-id"
    }
};
```

### 3. Adicionar Firebase SDK
Adiciona estas linhas no `index.html` antes do `script.js`:

```html
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js"></script>
```

### 4. Ativar Firebase
Descomenta as linhas no `script.js`:
- `initializeFirebase()` na função de inicialização
- `firebase.initializeApp()` na função `initializeFirebase()`

## 📱 ESP32 - Código Arduino

### Hardware Necessário
- ESP32
- Sensor DHT22 (ou DHT11)
- Breadboard e jumpers

### Conexões
```
DHT22 -> ESP32
VCC   -> 3.3V
GND   -> GND
DATA  -> GPIO4 (ou outro pino digital)
```

### Código Arduino
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "TUA_WIFI_SSID";
const char* password = "TUA_WIFI_PASSWORD";
const char* firebaseUrl = "https://teu-projeto.firebaseio.com/sensor_data.json";

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi!");
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  if (!isnan(humidity) && !isnan(temperature)) {
    sendToFirebase(humidity, temperature);
    Serial.printf("Humidade: %.1f%%, Temperatura: %.1f°C\n", humidity, temperature);
  }
  
  delay(5000); // Enviar a cada 5 segundos
}

void sendToFirebase(float humidity, float temperature) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(firebaseUrl);
    http.addHeader("Content-Type", "application/json");
    
    String json = "{\"humidity\":" + String(humidity) + 
                  ",\"temperature\":" + String(temperature) + 
                  ",\"timestamp\":\"" + getCurrentTimestamp() + "\"}";
    
    int httpResponseCode = http.POST(json);
    http.end();
  }
}

String getCurrentTimestamp() {
  // Implementar timestamp se necessário
  return "2024-01-01T00:00:00Z";
}
```

## 🎨 Personalização

### Cores
Edita as variáveis CSS no `styles.css`:
```css
:root {
    --primary-color: #4299e1;
    --secondary-color: #ed8936;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Intervalos
No `script.js`, altera:
```javascript
const CONFIG = {
    updateInterval: 5000,        // Intervalo de atualização
    chartUpdateInterval: 1000,   // Intervalo do gráfico
    maxDataPoints: 100          // Pontos máximos no histórico
};
```

## 📈 Próximos Passos

1. **Configurar Firebase** quando tiveres a conta
2. **Programar o ESP32** com o código Arduino
3. **Testar a conexão** entre ESP32 e Firebase
4. **Deploy no GitHub Pages** para acesso público
5. **Adicionar alertas** para valores críticos
6. **Implementar autenticação** se necessário

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Lógica da aplicação
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia Inter

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuições

Sugestões e melhorias são sempre bem-vindas! 

## 📞 Suporte

Se tiveres dúvidas ou problemas:
1. Verifica a consola do navegador (F12)
2. Confirma que todos os ficheiros estão na mesma pasta
3. Testa num servidor local se necessário

---

**Desenvolvido com ❤️ para IoT e monitorização ambiental** 