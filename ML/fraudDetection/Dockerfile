FROM python:3.12.5

# Установка системных зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libgomp1 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Явное копирование модели
COPY model906.cbm /app/model906.cbm

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]