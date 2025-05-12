# Выполнили:
  - Юрченко Кирилл (ML, Front)
  - Марянян Артур (Back, Front)
  - Варданян Давид (Back, ML)

---

#Технологии:
  - Backend ( C# - Asp.Net, Python Fast API )
  - Frontend ( JS + React+vite )
  - ML ( Python + CatBoostClassifier )

---
# Запуск проекта с помощбю docker-compose.yml 
```
services:
  postgres:
    image: postgres:15
    container_name: fraud-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: HakatonWB
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123
    ports:
      - "15432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - fraud-network

  fraud-backend:
    image: bebekon/fraud-back
    container_name: fraud-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - ConnectionStrings__Database=Host=postgres;Port=5432;Database=HakatonWB;User Id=postgres;Password=123;
      - ASPNETCORE_ENVIRONMENT=Development
    ports:
      - "5050:8080"
      - "8081:8081"
    networks:
      - fraud-network
    extra_hosts:
      - "host.docker.internal:host-gateway"
  
  fraud-ml-service:
    image: bebekon/fraud-ml
    container_name: fraud-ml-service
    restart: unless-stopped
    ports:
      - "8000:8000"
    depends_on:
      fraud-backend:
        condition: service_started
    networks:
      - fraud-network

  fraud-frontend:
    image: bebekon/fraud-front
    container_name: fraud-frontend
    restart: unless-stopped
    depends_on:
      - fraud-backend
      - fraud-ml-service
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=development
    volumes:
      - /app/node_modules
      - /app/.vite
    command: [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173" ]
    networks:
      - fraud-network

networks:
  fraud-network:
    driver: bridge

volumes:
  postgres_data:

```
Далее в консоли в текущей директории `docker-compose up -d`
