import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function DashboardShell({ title, subtitle, actions, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">{user?.role === "teacher" ? "Teacher Portal" : "Student Portal"}</p>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="header-actions">
          {actions}
          <button className="ghost-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default DashboardShell;
