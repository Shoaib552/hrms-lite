HRMS Lite — Human Resource Management System
A full-stack HR management system built with FastAPI + MongoDB (backend) and React + Vite (frontend).

How It Works
Overall Architecture
Browser (React)  →  FastAPI Backend  →  MongoDB Atlas
localhost:5173       localhost:8000       cloud.mongodb.com

The frontend (React) runs in the browser and shows the UI
When you add an employee or mark attendance, React sends an API request to the FastAPI backend using Axios
The backend (FastAPI) receives the request, validates the data using Pydantic, and saves/reads from MongoDB Atlas
MongoDB Atlas is a cloud database — your data is stored there permanently


Backend — How It's Structured
backend/
├── app/
│   ├── main.py          → App entry point, registers all routes, enables CORS
│   ├── database.py      → Connects to MongoDB Atlas, creates indexes
│   ├── schemas/         → Pydantic models — validates incoming request data
│   ├── services/        → Business logic — talks to MongoDB, throws errors
│   └── routes/          → API endpoints — receives requests, calls services
Request flow:
HTTP Request → routes/ → services/ → database (MongoDB) → response back
Frontend — How It's Structured
frontend/src/
├── App.jsx              → Main app, handles page navigation (Employees / Attendance)
├── styles.css           → All styling — dark theme, cards, tables, buttons
├── services/api.js      → All Axios API calls to the backend in one place
├── pages/               → Full pages (EmployeesPage, AttendancePage)
└── components/          → Reusable UI pieces (forms, tables, loader, error)
Data flow:
User clicks button → Page component → api.js (Axios) → Backend API → MongoDB

API Endpoints
MethodEndpointWhat it doesGET/healthCheck if backend is runningPOST/api/employeesAdd a new employeeGET/api/employeesGet all employeesDELETE/api/employees/{employee_id}Delete an employeePOST/api/attendanceMark attendanceGET/api/attendance/{employee_id}Get attendance for an employee

Local Setup
Prerequisites

Python 3.11+
Node.js 18+
MongoDB Atlas account (free)

Backend
bashcd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your MongoDB URL to .env
uvicorn app.main:app --reload --port 8000
Frontend
bashcd frontend
npm install
cp .env.example .env
# .env already set to http://localhost:8000 for local dev
npm run dev
```

### Environment Variables

**backend/.env**
```
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
DB_NAME=hrms_lite
```

**frontend/.env**
```
VITE_API_URL=http://localhost:8000

Deployment
Backend → Render

Push your backend/ folder to a GitHub repo
Go to https://render.com → New → Web Service
Connect your GitHub repo
Set these values:

Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port 10000


Add Environment Variables:

MONGO_URL → your MongoDB Atlas URL
DB_NAME → hrms_lite


Click Deploy
Copy your Render URL e.g. https://hrms-lite-api.onrender.com

Frontend → Vercel

Push your frontend/ folder to a GitHub repo
Go to https://vercel.com → New Project
Connect your GitHub repo
Framework will auto-detect as Vite
Add Environment Variable:

VITE_API_URL → your Render backend URL e.g. https://hrms-lite-api.onrender.com


Click Deploy


Features

Add employees with ID, name, email, department
View all employees in a table
Delete employees
Mark daily attendance (Present / Absent) per employee
View attendance history with Present/Absent stats
Duplicate prevention — same employee ID, email, or attendance date
Full validation on all inputs
Loading, error, and empty states throughout the UI


Tech Stack
LayerTechnologyFrontendReact 18, Vite, AxiosBackendPython 3.12, FastAPI, UvicornDatabaseMongoDB Atlas (free tier)ValidationPydantic v2Deploy BackendRenderDeploy FrontendVercel

Limitations

No login or authentication — anyone with the URL can use it
Deleting an employee does not delete their attendance records
No pagination — loads all employees at once
Single project/single admin only

