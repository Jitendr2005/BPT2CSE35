import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AuthPage() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSignup = mode === "signup";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = isSignup
        ? form
        : { email: form.email, password: form.password, role: form.role };
      const user = await login(payload, isSignup ? "signup" : "login");
      navigate(user.role === "teacher" ? "/teacher" : "/student");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to continue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">{isSignup ? "New Account" : "Welcome Back"}</p>
        <h1>{isSignup ? "Create your portal access" : "Login to your dashboard"}</h1>
        <p className="muted">
          Choose your role to access either the student workspace or teacher analytics portal.
        </p>
        {isSignup ? (
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
        ) : null}
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="switch-copy">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link to={isSignup ? "/auth/login" : "/auth/signup"}>
            {isSignup ? "Login here" : "Sign up here"}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;
