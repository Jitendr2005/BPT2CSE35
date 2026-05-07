import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import StudentDashboardPage from "./pages/StudentDashboardPage.jsx";
import TeacherDashboardPage from "./pages/TeacherDashboardPage.jsx";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/:mode" element={<AuthPage />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
