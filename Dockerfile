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

# Expose the port the app runs on
EXPOSE 8000

# Set environment variable for persistent DB storage (mapped in docker-compose)
ENV DATABASE_URL="sqlite:////data/mel_pares.db"

# Change working directory to backend to run uvicorn
WORKDIR /app/backend

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
