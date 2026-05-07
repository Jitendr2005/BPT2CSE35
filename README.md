# Student Performance Analysis & Smart Chatbot System

Full-stack AI project with:

- JWT-based authentication for Students and Teachers
- Role-based dashboards built in React
- Express + MongoDB backend APIs
- FastAPI ML microservice using a Random Forest model
- Academic support chatbot with chat history saving

## Project Structure

```text
student performamce analyzer/
├── backend/
├── frontend/
├── ml-service/
└── database/
```

## Core Features

### Authentication
- Separate login and signup for students and teachers
- JWT-secured REST APIs
- MongoDB user storage
- Role-based access control middleware

### Student Dashboard
- View marks, attendance, study hours, assignments, and previous marks
- Update personal academic inputs
- View predicted score and category
- Receive weak-performance alerts
- Chat with an AI-style academic assistant

### Teacher Dashboard
- View all students
- Update student academic data
- Analyze class performance with charts
- Identify weak students from ML predictions

### Machine Learning
- Dataset stored in [database/student_performance_dataset.csv](/Users/jitendratyagi/Desktop/student performamce analyzer/database/student_performance_dataset.csv)
- FastAPI prediction service
- Random Forest Regressor for score prediction
- Performance category mapping:
  - `Good` for score `>= 75`
  - `Average` for score `>= 50` and `< 75`
  - `Weak` for score `< 50`

## Tech Stack

- Frontend: React, Vite, Recharts, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- ML Service: Python, FastAPI, scikit-learn, pandas, joblib

## Setup

### 1. MongoDB connection

Use this URI in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://jitendratyagi2005_db_user:jeetu%402005@studentperformanceanaly.igcc7xa.mongodb.net/student-performance?retryWrites=true&w=majority&appName=Studentperformanceanalyzer
```

Note: the password contains `@`, so it must be URL-encoded as `%40`.

### 2. Create environment files

Create these files from the examples:

- [backend/.env.example](/Users/jitendratyagi/Desktop/student performamce analyzer/backend/.env.example)
- [frontend/.env.example](/Users/jitendratyagi/Desktop/student performamce analyzer/frontend/.env.example)
- [ml-service/.env.example](/Users/jitendratyagi/Desktop/student performamce analyzer/ml-service/.env.example)

Recommended `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://jitendratyagi2005_db_user:jeetu%402005@studentperformanceanaly.igcc7xa.mongodb.net/student-performance?retryWrites=true&w=majority&appName=Studentperformanceanalyzer
JWT_SECRET=super-secure-jwt-secret
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://127.0.0.1:8000
CORS_ORIGIN=http://localhost:5173
LLM_API_URL=
LLM_API_KEY=
```

Recommended `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Recommended `ml-service/.env`:

```env
PORT=8000
MODEL_PATH=models/student_performance_model.joblib
DATASET_PATH=../database/student_performance_dataset.csv
```

### 3. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

ML service:

```bash
cd ml-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4. Train the ML model

```bash
cd ml-service
source .venv/bin/activate
python scripts/train_model.py
```

### 5. Seed sample users and student data

```bash
cd backend
npm run seed
```

Sample seeded credentials:

- Teacher: `teacher@school.com` / `Teacher@123`
- Student: `aarav@student.com` / `Student@123`
- Student: `diya@student.com` / `Student@123`
- Student: `kabir@student.com` / `Student@123`

### 6. Run the services

Terminal 1:

```bash
cd ml-service
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

Terminal 2:

```bash
cd backend
npm run dev
```

Terminal 3:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Summary

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Students
- `GET /api/students/me`
- `PUT /api/students/me`
- `GET /api/students`
- `PUT /api/students/:studentId`
- `GET /api/students/analytics/class`

### Predictions
- `POST /api/predict`
- `GET /api/predict/me`

### Chatbot
- `GET /api/chatbot/history`
- `POST /api/chatbot`

## Notes

- If the ML service is unavailable, the backend falls back to a heuristic score estimation so the app still responds.
- Chatbot responses are rule-based by default. You can connect an external LLM-compatible endpoint using `LLM_API_URL` and `LLM_API_KEY`.
- Chat history is stored in MongoDB.
- The interface is responsive for desktop and mobile screens.
