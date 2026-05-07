import StudentProfile from "../models/StudentProfile.js";
import { getPrediction } from "../services/predictionService.js";

export const predictPerformance = async (req, res) => {
  const payload = {
    studyHours: Number(req.body.studyHours || 0),
    attendance: Number(req.body.attendance || 0),
    assignments: Number(req.body.assignments || 0),
    previousMarks: Number(req.body.previousMarks || 0),
    marks: Number(req.body.marks || 0)
  };

  const prediction = await getPrediction(payload);
  return res.json(prediction);
};

export const predictOwnPerformance = async (req, res) => {
  const profile = await StudentProfile.findOne({ student: req.user._id });

  if (!profile) {
    return res.status(404).json({ message: "Student profile not found" });
  }

  const prediction = await getPrediction({
    studyHours: profile.studyHours,
    attendance: profile.attendance,
    assignments: profile.assignments,
    previousMarks: profile.previousMarks,
    marks: profile.marks
  });

  profile.predictedScore = prediction.predictedScore;
  profile.performanceCategory = prediction.performanceCategory;
  profile.alerts = prediction.alerts;
  await profile.save();

  return res.json({ profile, prediction });
};
