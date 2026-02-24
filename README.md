# MEL-PARES Dashboard

Dashboard web para el Sistema MEL del Proyecto PARES (CATIE).

## Estructura

```
backend/         → API REST con FastAPI + SQLite
frontend/        → Aplicación SPA con HTML/JS/CSS
```

## Requisitos

- Python 3.9+
- pip

## Instalación

```bash
cd backend
pip install -r requirements.txt
```

## Ejecución

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Abrir http://localhost:8000 en el navegador.
