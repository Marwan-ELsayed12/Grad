FROM python:3.9-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Pre-install compatible versions of Cython and NumPy
RUN pip install --no-cache-dir \
    'cython<3.0.0' \
    'numpy<1.26.0'

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create static directory
RUN mkdir -p /app/static/admin

# Copy static files
COPY static/admin/login.html /app/static/admin/

# Copy scripts and make them executable
COPY scripts/prestart.sh /app/scripts/
RUN chmod +x /app/scripts/prestart.sh

# Copy the rest of the application
COPY . .

# Add a health check to verify scikit-surprise installation
RUN python -c "import surprise; print('scikit-surprise successfully installed')"

# The command will be overridden by docker-compose.yml in development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 