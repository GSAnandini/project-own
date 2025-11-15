FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Install mermaid-cli for PNG generation
RUN npm install -g @mermaid-js/mermaid-cli

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY server.py .
RUN mkdir -p static

# Build React frontend
COPY flowchart-frontend/package*.json ./flowchart-frontend/
WORKDIR /app/flowchart-frontend
RUN npm ci
COPY flowchart-frontend/ .
RUN npm run build

# Move built React app to Flask static folder
RUN mkdir -p /app/static && cp -r dist/* /app/static/

WORKDIR /app

# Download Ollama model (use small model for faster startup)
RUN ollama serve & \
    sleep 10 && \
    ollama pull llama3.2:1b && \
    pkill ollama

# Hugging Face uses port 7860
EXPOSE 7860

# Start Ollama in background, then Flask
CMD ollama serve & sleep 5 && python server.py