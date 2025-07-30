// Configuração do Firebase
// Substitui estes valores pelos teus próprios do Firebase Console

const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Configurações da coleção Firestore
const FIRESTORE_CONFIG = {
    collectionName: "sensor_data",
    maxDocuments: 1000, // Número máximo de documentos a manter
    updateInterval: 5000 // Intervalo de atualização em ms
};

// Regras de segurança para Firestore (para copiar para o Firebase Console)
const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sensor_data/{document} {
      allow read, write: if true; // Para desenvolvimento - alterar para produção
    }
  }
}
`;

// Estrutura dos dados
const DATA_STRUCTURE = {
    humidity: "number",      // Humidade em percentagem
    temperature: "number",    // Temperatura em Celsius
    timestamp: "timestamp",  // Timestamp da leitura
    deviceId: "string",      // ID do dispositivo ESP32
    location: "string"       // Localização do sensor (opcional)
};

// Função para validar dados
function validateSensorData(data) {
    return {
        humidity: typeof data.humidity === 'number' && data.humidity >= 0 && data.humidity <= 100,
        temperature: typeof data.temperature === 'number' && data.temperature >= -40 && data.temperature <= 80,
        timestamp: data.timestamp instanceof Date || typeof data.timestamp === 'string',
        deviceId: typeof data.deviceId === 'string',
        location: typeof data.location === 'string' || data.location === undefined
    };
}

// Função para formatar dados para envio
function formatDataForFirebase(humidity, temperature, deviceId = "ESP32_001", location = "Casa") {
    return {
        humidity: Math.round(humidity * 10) / 10, // Arredondar para 1 casa decimal
        temperature: Math.round(temperature * 10) / 10,
        timestamp: new Date().toISOString(),
        deviceId: deviceId,
        location: location
    };
}

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FIREBASE_CONFIG,
        FIRESTORE_CONFIG,
        FIRESTORE_RULES,
        DATA_STRUCTURE,
        validateSensorData,
        formatDataForFirebase
    };
} else {
    // Para uso no browser
    window.FIREBASE_CONFIG = FIREBASE_CONFIG;
    window.FIRESTORE_CONFIG = FIRESTORE_CONFIG;
    window.FIRESTORE_RULES = FIRESTORE_RULES;
    window.DATA_STRUCTURE = DATA_STRUCTURE;
    window.validateSensorData = validateSensorData;
    window.formatDataForFirebase = formatDataForFirebase;
} 