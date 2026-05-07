import { useEffect, useState } from "react";
import client from "../api/client.js";
import ClassOverviewChart from "../components/ClassOverviewChart.jsx";
import DashboardShell from "../components/DashboardShell.jsx";
import MetricCard from "../components/MetricCard.jsx";
import StudentForm from "../components/StudentForm.jsx";
import StudentsTable from "../components/StudentsTable.jsx";

function TeacherDashboardPage() {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = async () => {
    const [studentsResponse, analyticsResponse] = await Promise.all([
      client.get("/students"),
      client.get("/students/analytics/class")
    ]);

    setStudents(studentsResponse.data.profiles);
    setAnalytics(analyticsResponse.data);
    setSelectedStudent((current) => current || studentsResponse.data.profiles[0] || null);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (values) => {
    if (!selectedStudent) return;

    await client.put(`/students/${selectedStudent.student._id}`, values);
    await loadData();
  };

  if (!analytics) {
    return <div className="page-shell centered">Loading teacher analytics...</div>;
  }

  return (
    <DashboardShell
      title="Teacher Analytics Dashboard"
      subtitle="Monitor class performance, identify weak learners, and update student records."
    >
      <section className="metrics-grid">
        <MetricCard label="Students" value={analytics.summary.totalStudents} />
        <MetricCard label="Avg Marks" value={analytics.summary.avgMarks} />
        <MetricCard label="Avg Predicted" value={analytics.summary.avgPredictedScore} tone="accent" />
        <MetricCard label="Weak Students" value={analytics.summary.weakStudentCount} tone="weak" />
      </section>

      <section className="dashboard-grid">
        <ClassOverviewChart categories={analytics.categories} />
        {selectedStudent ? (
          <StudentForm
            key={selectedStudent._id}
            values={selectedStudent}
            onSubmit={handleUpdate}
            title={`Update ${selectedStudent.student?.name}`}
            submitLabel="Save Student"
          />
        ) : (
          <section className="panel">
            <p className="muted">No students available yet.</p>
          </section>
        )}
      </section>

      <StudentsTable students={students} onEdit={setSelectedStudent} />

      <section className="panel">
        <div className="card-heading">
          <h3>Weak Student Alerts</h3>
          <p className="muted">Students predicted as weak based on the latest model output.</p>
        </div>
        <div className="alert-list">
          {analytics.weakStudents.length ? (
            analytics.weakStudents.map((student) => (
              <div key={student._id} className="alert-chip">
                {student.student?.name}: predicted {student.predictedScore} with {student.attendance}% attendance
              </div>
            ))
          ) : (
            <div className="alert-chip success">No weak students detected right now.</div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

export default TeacherDashboardPage;
