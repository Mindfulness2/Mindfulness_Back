const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const AI_SERVER_PORT = 5003;
const OLLAMA_URL = 'http://127.0.0.1:11434/generate';

let textData = null;
let emotionData = null;

const aiApp = express();
aiApp.use(bodyParser.json());

aiApp.post('/text', (req, res) => {
    textData = req.body.text;
    checkAndProcessAI();
    res.send({ status: 'Text received' });
});

aiApp.post('/emotion', (req, res) => {
    emotionData = req.body.emotion;
    checkAndProcessAI();
    res.send({ status: 'Emotion received' });
});

function checkAndProcessAI() {
    if (textData && emotionData) {
        const prompt = `${textData},${JSON.stringify(emotionData)}`;
        axios.post(OLLAMA_URL, { prompt })
            .then(response => {
                console.log('AI Response:', response.data);
                textData = null;
                emotionData = null;
            })
            .catch(error => console.error('Ollama Error:', error));
    }
}

aioApp.listen(AI_SERVER_PORT, () => console.log(`AI Server running on port ${AI_SERVER_PORT}`));
