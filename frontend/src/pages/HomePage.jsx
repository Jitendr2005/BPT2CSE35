import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">AI-Powered Academic Intelligence</p>
          <h1>Student Performance Analysis & Smart Chatbot System</h1>
          <p>
            A full-stack platform for secure role-based access, performance prediction,
            classroom analytics, and AI-powered academic support.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/auth/login">
              Login
            </Link>
            <Link className="secondary-link" to="/auth/signup">
              Create Account
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="spotlight-card">
            <strong>Modules included</strong>
            <ul>
              <li>JWT authentication with Student and Teacher roles</li>
              <li>React dashboards with live charts</li>
              <li>Express APIs with MongoDB persistence</li>
              <li>FastAPI + Random Forest prediction engine</li>
              <li>Rule-based smart chatbot with chat history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
