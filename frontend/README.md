# Student Performance Analyzer - React Frontend

Modern React.js frontend for the Student Performance Analyzer with beautiful UI and responsive design.

## Tech Stack
- React 18.2
- Vite 5.0
- React Router DOM 6
- Bootstrap 5
- FontAwesome Icons
- Chart.js (for analytics)

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy to the Flask backend on `http://localhost:8000`

## Build for Production

```bash
npm run build
```

## Features

- Modern responsive UI with dark/light theme support
- Real-time dashboards for students, teachers, and admins
- Student performance tracking and analytics
- Attendance management
- Assignment tracking
- Role-based access control (RBAC)
- Beautiful charts and visualizations
- Mobile-friendly design

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components for routing
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # React DOM entry point
│   └── App.css          # Global styles
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md
```

## Available Routes

### Public
- `/login` - Login page

### Student Routes
- `/student/dashboard` - Student overview
- `/student/marks` - View marks
- `/student/attendance` - View attendance

### Teacher Routes
- `/teacher/dashboard` - Teacher overview
- `/teacher/marks/:id` - Manage student marks
- `/teacher/attendance/:id` - Manage attendance
- `/teacher/assignments/:id` - Manage assignments

### Admin Routes
- `/admin/dashboard` - Admin overview
- `/admin/students` - Manage students
- `/admin/teachers` - Manage teachers
- `/admin/school` - School settings

## Demo Credentials

- **Teacher**: teacher@school.com / teacher123
- **Admin**: admin@school.com / admin123
- **Student**: student@school.com / student123

## Environment Variables

The app proxies to the Flask backend. Make sure Flask is running on http://localhost:8000

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
