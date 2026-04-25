# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Copy requirement files first (to leverage Docker cache)
COPY backend/requirements.txt ./backend/

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the rest of the application code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Copy the xlsx data file into the image
COPY 20260424_Monitoreo-Cumplimiento-Proyectos-PARES.xlsx /app/data.xlsx

# Expose the port the app runs on
EXPOSE 8000

# Set environment variable for persistent DB storage (mapped in docker-compose)
ENV DATABASE_URL="sqlite:////data/mel_pares.db"

# Change working directory to backend to run uvicorn
WORKDIR /app/backend

# Make start script executable
RUN chmod +x start.sh

# Use startup script (auto-imports data if DB is empty)
CMD ["bash", "start.sh"]
