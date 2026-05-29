# Fraud Detection System

> Wildberries Hackathon — 2025

A web application for detecting fraudulent transactions using machine learning. The system accepts transaction data via CSV upload or manual entry, scores each record with a CatBoost classifier, and presents results through an interactive dashboard.

## Architecture

| Service | Technology |
|---|---|
| Backend API | C# ASP.NET Core 9, Entity Framework Core, PostgreSQL |
| ML Service | Python, FastAPI, CatBoostClassifier |
| Frontend | JavaScript, React, Vite |
| Infrastructure | Docker Compose |

The C# backend handles data persistence and business logic; the Python ML service exposes a separate FastAPI endpoint that the backend calls for predictions.

## Screenshots

**Frontend — transaction dashboard**

![Frontend](https://github.com/user-attachments/assets/34bf422c-2e98-47c1-83b1-b43758e46b3c)

**Backend — Swagger UI**

![Backend](https://github.com/user-attachments/assets/b3d6cfde-dee5-4c5f-aea3-2a99bec61682)

**ML Service — prediction endpoint**

![ML](https://github.com/user-attachments/assets/d974e512-5725-4456-8dfb-fd113735709e)

## Getting Started

**Requirements:** Docker and Docker Compose.

```bash
docker compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend Swagger | http://localhost:5050/swagger/index.html |
| ML Service docs | http://localhost:8000/docs |

## Project Structure

```
├── Backend/HakatonWB/          # ASP.NET Core API
│   └── FraudDetectionWeb.Api/
│       ├── Controllers/        # REST endpoints
│       ├── Repository/         # Data access layer
│       └── Mappers/            # CSV import helpers
├── Frontend/hakatonwb/         # React + Vite SPA
├── ML/fraudDetection/          # CatBoost model + FastAPI
├── EDA_and_Train_ver16_Prec_Final.ipynb  # Model training notebook
└── docker-compose.yml
```

## Team

| Name | Role |
|---|---|
| Kirill Yurchenko | ML, Frontend |
| Artur Maryanyan | Backend, Frontend |
| David Vardanyan | Backend, ML |
