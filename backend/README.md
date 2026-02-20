# HRMS Lite – Backend

FastAPI + MongoDB backend.

## Quick Start
```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Swagger docs: http://localhost:8000/docs
