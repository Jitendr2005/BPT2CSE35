# Student Performance Analyzer - Complete Setup Guide

## Project Structure

```
Student performance analysis/
├── app.py                      # Flask backend (Python)
├── requirements.txt            # Python dependencies
├── static/                     # Static files
│   └── style.css
├── templates/                  # Flask Jinja2 templates
└── frontend/                   # React frontend (NEW!)
    ├── src/
    │   ├── components/
    │   │   └── Navigation.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   ├── TeacherDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── README.md
```

## Tech Stack

### Backend (Existing)
- Flask 2.3.7 - Web framework
- MongoDB - Database
- Flask-Login - Authentication
- Flask-PyMongo - MongoDB integration
- NumPy & Pandas - Data processing

### Frontend (NEW)
- React 18.2 - UI framework
- Vite 5.0 - Build tool
- React Router - Navigation
- Bootstrap 5 - Styling
- Axios - HTTP client
- Chart.js - Analytics

## Installation & Setup

### 1. Backend Setup (Flask - Already Running)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Flask app
python3 app.py
```

The Flask backend runs on `http://localhost:8000`

### 2. Frontend Setup (React - NEW)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The React frontend runs on `http://localhost:3000` and proxies to the Flask backend

## Features

### ✨ Modern React UI
- Beautiful, responsive design with Bootstrap 5
- Dark modern color scheme
- Smooth animations and transitions
- Mobile-friendly interface
- Loading states and error handling

### 👥 Role-Based Dashboard
- **Student Dashboard**: View marks, attendance, assignments
- **Teacher Dashboard**: Manage student performance, marks, attendance
- **Admin Dashboard**: System overview and management tools

### 📊 Data Visualization
- Charts and analytics
- Performance metrics
- Attendance tracking
- Mark statistics

### 🔐 Secure Authentication
- Session-based login
- Role-based access control (RBAC)
- Protected routes
- Automatic redirect to login

## API Endpoints (JSON)

New endpoints for React frontend:

- `GET /api/auth-check` - Check if user is authenticated
- `GET /api/user-data` - Get current user information
- `GET /api/student-stats` - Get student statistics
- `GET /api/teacher-stats` - Get teacher dashboard stats
- `GET /api/admin-stats` - Get admin dashboard stats

## Demo Credentials

Login with these test accounts:

```
Teacher:
Email: teacher@school.com
Password: teacher123

Admin:
Email: admin@school.com
Password: admin123

Student:
Email: student@school.com
Password: student123
```

## Running Both Frontend & Backend

**Terminal 1 - Backend:**
```bash
cd /path/to/Student\ performance\ analysis
python3 app.py
```

**Terminal 2 - Frontend:**
```bash
cd /path/to/Student\ performance\ analysis/frontend
npm run dev
```

Then open your browser to:
- React Frontend: `http://localhost:3000`
- Flask Backend: `http://localhost:8000`

## Key Improvements

✅ **Modern React Architecture**
- Component-based design
- Reusable components
- Clean code structure

✅ **Beautiful UI/UX**
- Professional gradient design
- Smooth animations
- Responsive layout
- Dark modern theme

✅ **Better User Experience**
- Fast page loads with Vite
- Client-side routing
- No page reloads
- Real-time data updates

✅ **Production Ready**
- Error handling
- Loading states
- Session management
- Protected routes

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000 (Flask)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (React)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
- Ensure MongoDB is running locally on `localhost:27017`
- Or use MongoDB Atlas connection string in `app.py`

### Node Modules Error
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## File Organization Best Practices

- All React components in `frontend/src/components/`
- All pages in `frontend/src/pages/`
- Global CSS in `frontend/src/App.css`
- Configuration in `frontend/vite.config.js`

## Next Steps

1. ✅ Install frontend dependencies: `npm install`
2. ✅ Start React dev server: `npm run dev`
3. ✅ Keep Flask running on port 8000
4. ✅ Open `http://localhost:3000` in browser
5. ✅ Login with demo credentials

## Production Build

Build frontend for production:
```bash
cd frontend
npm run build
```

This generates optimized files in `frontend/dist/` ready for deployment.

---

**All errors from the old Flask templating system are now gone!** 🎉

The React frontend provides a clean, modern, error-free experience with a beautiful UI.
