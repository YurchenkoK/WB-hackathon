# Выполнили:
  - <h3>Юрченко Кирилл (ML, Front)</h3>
  - <h3>Марянян Артур (Back, Front)</h3>
  - <h3>Варданян Давид (Back, ML)</h3>

---

# Технологии:
  - <h3>Backend ( C# - Asp.Net, Python - Fast API )</h3>
  - <h3>Frontend ( JS - React + vite )</h3>
  - <h3>ML ( Python - CatBoostClassifier )</h3>

---
# Запуск проекта с помощью docker-compose.yml 
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
## Далее в консоли в текущей директории `docker-compose up -d`

<h2>
  Для frontend: http://localhost:5173 <br>
  Для backend (swagger-ui): http://localhost:5050/swagger/index.html <br>
  Для ML (swagger-ui): http://localhost:8000/docs <br>
</h2>
---

# Frontned

![image](https://github.com/user-attachments/assets/34bf422c-2e98-47c1-83b1-b43758e46b3c)

---

# Backend 

![image](https://github.com/user-attachments/assets/b3d6cfde-dee5-4c5f-aea3-2a99bec61682)

---

# ML

![image](https://github.com/user-attachments/assets/d974e512-5725-4456-8dfb-fd113735709e)
