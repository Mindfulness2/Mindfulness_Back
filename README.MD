# Mindfulness App Backend Server

Welcome to the backend server for our Mindfulness App! This project powers a sophisticated chat application with AI-driven features, including local AI interactions, database management, audio processing, emotion recognition, and voice-to-text capabilities. The server is built with Node.js for core functionalities and Python for specialized tasks.

## Project Structure

The backend is organized into several key components, each housed in its own directory or file:

- **AIServer**: Handles interactions with a local [Ollama](https://ollama.ai/) instance for AI-driven chat responses.
- **MongoDB**: Manages database operations for storing and retrieving chat data using MongoDB.
- **VoiceReceiver**: Processes incoming audio files sent to the server.
- **Emotion.ipynb**: A Jupyter Notebook for emotion recognition from text or audio inputs.
- **VoiceToText.py**: Performs local voice-to-text conversion using PaddleSpeech.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Python](https://www.python.org/) (v3.8 or higher)
- [PaddlePaddle](https://www.paddlepaddle.org.cn/) (for voice-to-text functionality)
- [Ollama](https://ollama.ai/) (for local AI model interactions)
- [Jupyter Notebook](https://jupyter.org/) (for running Emotion.ipynb)

## Setup Instructions

Follow these steps to get the backend server up and running:

### 1. Clone the Repository

```bash
git clone https://github.com/Mindfulness2/Mindfulness_Back.git
cd Mindfulness_Back-master
```

### 2. Initialize Node.js Projects

The `AIServer`, `MongoDB`, and `VoiceReceiver` directories contain Node.js projects. For each directory, run the following commands to install dependencies:

```bash
cd AIServer
npm install
cd ../MongoDB
npm install
cd ../VoiceReceiver
npm install
cd ..
```

Ensure you configure environment variables (e.g., `.env` files) for each project, specifying details like MongoDB connection strings or Ollama endpoints. Refer to the respective `README` or configuration files in each directory for details.

### 3. Set Up Emotion Recognition

The `Emotion.ipynb` Jupyter Notebook handles emotion recognition. To run it:

1. Open the notebook in Jupyter:
   ```bash
   jupyter notebook Emotion.ipynb
   ```
2. Execute the first cell to install required dependencies (e.g., `numpy`, `pandas`, or machine learning libraries).
3. Run the remaining cells in sequence to perform emotion recognition.

> **Note**: Ensure you have an active internet connection for dependency installation, and verify that your Python environment matches the notebook's requirements.

### 4. Configure Voice-to-Text with PaddleSpeech

The `VoiceToText.py` script uses PaddleSpeech for local voice-to-text conversion. To set it up:

1. Install PaddlePaddle and PaddleSpeech:
   ```bash
   pip install paddlepaddle
   pip install paddlespeech
   ```
2. Start the PaddleSpeech server:
   ```bash
   paddlespeech_server start --config_file ./paddlespeech/server/conf/application.yaml
   ```
3. Run the `VoiceToText.py` script:
   ```bash
   python VoiceToText.py
   ```

### 5. Start the Backend Services

Once all dependencies are installed and configured:

- Start the Node.js services in `AIServer`, `MongoDB`, and `VoiceReceiver` by running `npm start` in each directory (or as specified in their respective documentation).
- Verify that the PaddleSpeech server is running for voice-to-text functionality.
- Test the emotion recognition notebook to ensure it processes inputs correctly.

## Usage

Please use it with the front-end project of this project. You can enable some components to support available functions.