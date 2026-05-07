import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#247f6b", "#d9a441", "#c45644"];

function ClassOverviewChart({ categories }) {
  const data = Object.entries(categories || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="chart-card">
      <div className="card-heading">
        <h3>Class Performance Mix</h3>
        <p className="muted">Students grouped by predicted performance category.</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ClassOverviewChart;
