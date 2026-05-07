import { useEffect, useState } from "react";
import client from "../api/client.js";
import ChatbotPanel from "../components/ChatbotPanel.jsx";
import DashboardShell from "../components/DashboardShell.jsx";
import MetricCard from "../components/MetricCard.jsx";
import PerformanceChart from "../components/PerformanceChart.jsx";
import StudentForm from "../components/StudentForm.jsx";

function StudentDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    const response = await client.get("/students/me");
    setProfile(response.data.profile);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const response = await client.put("/students/me", values);
      setProfile(response.data.profile);
    } finally {
      setSaving(false);
    }
  };

  const refreshPrediction = async () => {
    const response = await client.get("/predict/me");
    setProfile(response.data.profile);
  };

  if (!profile) {
    return <div className="page-shell centered">Loading student workspace...</div>;
  }

  return (
    <DashboardShell
      title={`Hello, ${profile.student?.name}`}
      subtitle="Track your academic health, update learning inputs, and get smart guidance."
      actions={
        <button className="primary-button" onClick={refreshPrediction}>
          Refresh Prediction
        </button>
      }
    >
      <section className="metrics-grid">
        <MetricCard label="Current Marks" value={profile.marks} />
        <MetricCard label="Attendance" value={`${profile.attendance}%`} />
        <MetricCard label="Predicted Score" value={profile.predictedScore} tone="accent" />
        <MetricCard label="Category" value={profile.performanceCategory} tone={profile.performanceCategory.toLowerCase()} />
      </section>

      <section className="dashboard-grid">
        <StudentForm
          key={profile._id + saving}
          values={profile}
          onSubmit={handleSave}
          submitLabel={saving ? "Saving..." : "Update Data"}
        />
        <PerformanceChart profile={profile} />
      </section>

      <section className="panel">
        <div className="card-heading">
          <h3>Risk Alerts & Recommendations</h3>
          <p className="muted">Personalized warnings generated from your latest data.</p>
        </div>
        <div className="alert-list">
          {profile.alerts?.length ? (
            profile.alerts.map((alert) => (
              <div key={alert} className="alert-chip">
                {alert}
              </div>
            ))
          ) : (
            <div className="alert-chip success">No active alerts. Keep up the momentum.</div>
          )}
        </div>
      </section>

      <ChatbotPanel />
    </DashboardShell>
  );
}

export default StudentDashboardPage;
