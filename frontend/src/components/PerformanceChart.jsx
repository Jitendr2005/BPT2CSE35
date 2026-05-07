import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function PerformanceChart({ profile }) {
  const data = [
    { name: "Marks", value: profile?.marks || 0 },
    { name: "Attendance", value: profile?.attendance || 0 },
    { name: "Assignments", value: profile?.assignments || 0 },
    { name: "Prev", value: profile?.previousMarks || 0 },
    { name: "Predicted", value: profile?.predictedScore || 0 }
  ];

  return (
    <div className="chart-card">
      <div className="card-heading">
        <h3>Performance Snapshot</h3>
        <p className="muted">Academic indicators compared on a 0-100 scale.</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#1e847f" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;
