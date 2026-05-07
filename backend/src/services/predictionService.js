import axios from "axios";

const createAlerts = ({ attendance, studyHours, assignments, predictedScore, category }) => {
  const alerts = [];

  if (attendance < 70) alerts.push("Attendance is below the safe threshold.");
  if (studyHours < 2) alerts.push("Study hours are low. Encourage a daily schedule.");
  if (assignments < 60) alerts.push("Assignment completion needs improvement.");
  if (predictedScore < 50 || category === "Weak") {
    alerts.push("Student is at risk and may need intervention.");
  }

  return alerts;
};

export const getPrediction = async (payload) => {
  const baseURL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

  try {
    const response = await axios.post(`${baseURL}/predict`, payload, {
      timeout: 5000
    });

    return {
      predictedScore: response.data.predicted_score,
      performanceCategory: response.data.performance_category,
      alerts: createAlerts({
        ...payload,
        predictedScore: response.data.predicted_score,
        category: response.data.performance_category
      })
    };
  } catch (_error) {
    const estimatedScore =
      payload.previousMarks * 0.35 +
      payload.marks * 0.25 +
      payload.attendance * 0.15 +
      payload.assignments * 0.15 +
      payload.studyHours * 2;

    const boundedScore = Math.max(0, Math.min(100, Number(estimatedScore.toFixed(2))));
    const performanceCategory =
      boundedScore >= 75 ? "Good" : boundedScore >= 50 ? "Average" : "Weak";

    return {
      predictedScore: boundedScore,
      performanceCategory,
      alerts: createAlerts({
        ...payload,
        predictedScore: boundedScore,
        category: performanceCategory
      })
    };
  }
};
