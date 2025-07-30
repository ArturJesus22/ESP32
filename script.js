// Configurações globais
const CONFIG = {
    updateInterval: 5000, // 5 segundos
    chartUpdateInterval: 1000, // 1 segundo para gráfico
    maxDataPoints: 100,
    firebaseConfig: {
        // Configuração do Firebase será adicionada aqui
        apiKey: "YOUR_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id"
    }
};

// Estado da aplicação
let appState = {
    isConnected: false,
    currentHumidity: 0,
    currentTemperature: 0,
    humidityHistory: [],
    temperatureHistory: [],
    maxHumidity: 0,
    minHumidity: 100,
    avgHumidity: 0,
    chart: null,
    lastUpdate: new Date()
};

// Elementos DOM
const elements = {
    humidityValue: document.getElementById('humidityValue'),
    temperatureValue: document.getElementById('temperatureValue'),
    maxHumidity: document.getElementById('maxHumidity'),
    minHumidity: document.getElementById('minHumidity'),
    avgHumidity: document.getElementById('avgHumidity'),
    lastUpdate: document.getElementById('lastUpdate'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    humidityChart: document.getElementById('humidityChart'),
    timeButtons: document.querySelectorAll('.time-btn')
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startDataSimulation();
    initializeChart();
});

// Inicializar aplicação
function initializeApp() {
    console.log('🚀 Inicializando Monitor de Humidade ESP32...');
    updateConnectionStatus(false);
    updateLastUpdate();
}

// Configurar event listeners
function setupEventListeners() {
    // Botões de tempo do gráfico
    elements.timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            elements.timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateChartTimeRange(this.dataset.time);
        });
    });
}

// Simular dados do sensor (será substituído por dados reais do ESP32)
function startDataSimulation() {
    console.log('📊 Iniciando simulação de dados...');
    
    // Simular conexão inicial
    setTimeout(() => {
        updateConnectionStatus(true);
    }, 2000);

    // Atualizar dados a cada 5 segundos
    setInterval(() => {
        if (appState.isConnected) {
            simulateSensorData();
        }
    }, CONFIG.updateInterval);

    // Atualizar gráfico a cada segundo
    setInterval(() => {
        if (appState.isConnected && appState.chart) {
            updateChart();
        }
    }, CONFIG.chartUpdateInterval);
}

// Simular leituras do sensor
function simulateSensorData() {
    // Simular humidade entre 30% e 80%
    const newHumidity = Math.round((Math.random() * 50 + 30) * 10) / 10;
    
    // Simular temperatura entre 15°C e 30°C
    const newTemperature = Math.round((Math.random() * 15 + 15) * 10) / 10;
    
    // Atualizar estado
    appState.currentHumidity = newHumidity;
    appState.currentTemperature = newTemperature;
    appState.lastUpdate = new Date();
    
    // Adicionar ao histórico
    addToHistory(newHumidity, newTemperature);
    
    // Atualizar estatísticas
    updateStatistics();
    
    // Atualizar UI
    updateUI();
    
    console.log(`📈 Nova leitura: ${newHumidity}% humidade, ${newTemperature}°C temperatura`);
}

// Adicionar dados ao histórico
function addToHistory(humidity, temperature) {
    const timestamp = new Date();
    
    appState.humidityHistory.push({
        value: humidity,
        timestamp: timestamp
    });
    
    appState.temperatureHistory.push({
        value: temperature,
        timestamp: timestamp
    });
    
    // Manter apenas os últimos 100 pontos
    if (appState.humidityHistory.length > CONFIG.maxDataPoints) {
        appState.humidityHistory.shift();
        appState.temperatureHistory.shift();
    }
}

// Atualizar estatísticas
function updateStatistics() {
    if (appState.humidityHistory.length === 0) return;
    
    const values = appState.humidityHistory.map(h => h.value);
    
    appState.maxHumidity = Math.max(...values);
    appState.minHumidity = Math.min(...values);
    appState.avgHumidity = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

// Atualizar interface do utilizador
function updateUI() {
    // Atualizar valores principais
    elements.humidityValue.textContent = appState.currentHumidity;
    elements.temperatureValue.textContent = appState.currentTemperature;
    
    // Atualizar estatísticas
    elements.maxHumidity.textContent = `${appState.maxHumidity}%`;
    elements.minHumidity.textContent = `${appState.minHumidity}%`;
    elements.avgHumidity.textContent = `${appState.avgHumidity}%`;
    
    // Atualizar última atualização
    updateLastUpdate();
    
    // Adicionar animação de atualização
    addUpdateAnimation();
}

// Atualizar status de conexão
function updateConnectionStatus(connected) {
    appState.isConnected = connected;
    
    if (connected) {
        elements.statusDot.classList.add('connected');
        elements.statusText.textContent = 'Ligado';
        console.log('✅ Ligado ao ESP32');
    } else {
        elements.statusDot.classList.remove('connected');
        elements.statusText.textContent = 'Desligado';
        console.log('❌ Desligado do ESP32');
    }
}

// Atualizar última atualização
function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-PT');
    elements.lastUpdate.textContent = timeString;
}

// Adicionar animação de atualização
function addUpdateAnimation() {
    elements.humidityValue.style.transform = 'scale(1.1)';
    elements.temperatureValue.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        elements.humidityValue.style.transform = 'scale(1)';
        elements.temperatureValue.style.transform = 'scale(1)';
    }, 200);
}

// Inicializar gráfico
function initializeChart() {
    const ctx = elements.humidityChart.getContext('2d');
    
    appState.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Humidade (%)',
                    data: [],
                    borderColor: '#4299e1',
                    backgroundColor: 'rgba(66, 153, 225, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Temperatura (°C)',
                    data: [],
                    borderColor: '#ed8936',
                    backgroundColor: 'rgba(237, 137, 54, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tempo'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Valores'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Atualizar gráfico
function updateChart() {
    if (!appState.chart || appState.humidityHistory.length === 0) return;
    
    const labels = appState.humidityHistory.map(h => h.timestamp);
    const humidityData = appState.humidityHistory.map(h => h.value);
    const temperatureData = appState.temperatureHistory.map(t => t.value);
    
    appState.chart.data.labels = labels;
    appState.chart.data.datasets[0].data = humidityData;
    appState.chart.data.datasets[1].data = temperatureData;
    
    appState.chart.update('none');
}

// Atualizar intervalo de tempo do gráfico
function updateChartTimeRange(timeRange) {
    console.log(`📊 Alterando intervalo do gráfico para: ${timeRange}`);
    
    // Aqui podes implementar lógica para filtrar dados por intervalo
    // Por enquanto, mantemos todos os dados
}

// ===== FUNÇÕES PARA INTEGRAÇÃO COM FIREBASE =====

// Inicializar Firebase (será chamado quando tiveres a configuração)
function initializeFirebase() {
    console.log('🔥 Inicializando Firebase...');
    
    // Descomenta quando tiveres a configuração do Firebase
    /*
    firebase.initializeApp(CONFIG.firebaseConfig);
    const db = firebase.firestore();
    
    // Configurar listener em tempo real
    db.collection('sensor_data')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    updateFromFirebase(data);
                }
            });
        });
    */
}

// Atualizar dados vindos do Firebase
function updateFromFirebase(data) {
    appState.currentHumidity = data.humidity;
    appState.currentTemperature = data.temperature;
    appState.lastUpdate = new Date(data.timestamp);
    
    addToHistory(data.humidity, data.temperature);
    updateStatistics();
    updateUI();
}

// Enviar dados para Firebase (para o ESP32 usar)
function sendToFirebase(humidity, temperature) {
    console.log('📤 Enviando dados para Firebase...');
    
    // Descomenta quando tiveres Firebase configurado
    /*
    const db = firebase.firestore();
    db.collection('sensor_data').add({
        humidity: humidity,
        temperature: temperature,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    */
}

// ===== FUNÇÕES DE UTILIDADE =====

// Formatar número com casas decimais
function formatNumber(num, decimals = 1) {
    return Number(num).toFixed(decimals);
}

// Obter timestamp atual
function getCurrentTimestamp() {
    return new Date().toISOString();
}

// Log de debug
function debugLog(message, data = null) {
    if (data) {
        console.log(`🔍 ${message}`, data);
    } else {
        console.log(`🔍 ${message}`);
    }
}

// Exportar dados (para download)
function exportData() {
    const data = {
        humidity: appState.humidityHistory,
        temperature: appState.temperatureHistory,
        statistics: {
            max: appState.maxHumidity,
            min: appState.minHumidity,
            average: appState.avgHumidity
        },
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humidity-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Expor funções para uso global
window.ESP32Monitor = {
    initializeFirebase,
    sendToFirebase,
    exportData,
    debugLog
}; 