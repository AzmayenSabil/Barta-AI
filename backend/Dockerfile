FROM python:3.9-slim

WORKDIR /app

# Install system dependencies and ffmpeg
RUN apt-get update && apt-get install -y \
    gcc \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy source code
COPY backend/ .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the FastAPI application with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
