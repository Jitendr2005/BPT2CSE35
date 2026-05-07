import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import { getPrediction } from "../services/predictionService.js";

const buildPredictionPayload = (profile) => ({
  studyHours: Number(profile.studyHours || 0),
  attendance: Number(profile.attendance || 0),
  assignments: Number(profile.assignments || 0),
  previousMarks: Number(profile.previousMarks || 0),
  marks: Number(profile.marks || 0)
});

const enrichStudentProfile = async (profile) => {
  const prediction = await getPrediction(buildPredictionPayload(profile));

  profile.predictedScore = prediction.predictedScore;
  profile.performanceCategory = prediction.performanceCategory;
  profile.alerts = prediction.alerts;

  await profile.save();
  return profile;
};

export const getStudentDashboard = async (req, res) => {
  const profile = await StudentProfile.findOne({ student: req.user._id }).populate(
    "student",
    "name email role"
  );

  if (!profile) {
    return res.status(404).json({ message: "Student profile not found" });
  }

  return res.json({ profile });
};

export const updateOwnProfile = async (req, res) => {
  const profile = await StudentProfile.findOne({ student: req.user._id });

  if (!profile) {
    return res.status(404).json({ message: "Student profile not found" });
  }

  const editableFields = [
    "rollNumber",
    "course",
    "marks",
    "attendance",
    "studyHours",
    "assignments",
    "previousMarks"
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      profile[field] = req.body[field];
    }
  });

  await enrichStudentProfile(profile);

  return res.json({ message: "Profile updated", profile });
};

export const listStudents = async (_req, res) => {
  const profiles = await StudentProfile.find().populate("student", "name email role");
  return res.json({ profiles });
};

export const upsertStudentByTeacher = async (req, res) => {
  const { studentId } = req.params;
  const student = await User.findById(studentId);

  if (!student || student.role !== "student") {
    return res.status(404).json({ message: "Student not found" });
  }

  let profile = await StudentProfile.findOne({ student: studentId });
  if (!profile) {
    profile = await StudentProfile.create({ student: studentId });
  }

  const editableFields = [
    "rollNumber",
    "course",
    "marks",
    "attendance",
    "studyHours",
    "assignments",
    "previousMarks"
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      profile[field] = req.body[field];
    }
  });

  await enrichStudentProfile(profile);
  const populated = await profile.populate("student", "name email role");

  return res.json({ message: "Student profile updated", profile: populated });
};

export const getClassAnalytics = async (_req, res) => {
  const profiles = await StudentProfile.find().populate("student", "name email");

  const totalStudents = profiles.length;
  const avgMarks =
    totalStudents === 0
      ? 0
      : Number(
          (
            profiles.reduce((sum, profile) => sum + (profile.marks || 0), 0) / totalStudents
          ).toFixed(2)
        );
  const avgPredictedScore =
    totalStudents === 0
      ? 0
      : Number(
          (
            profiles.reduce((sum, profile) => sum + (profile.predictedScore || 0), 0) /
            totalStudents
          ).toFixed(2)
        );

  const categories = profiles.reduce(
    (accumulator, profile) => {
      accumulator[profile.performanceCategory] += 1;
      return accumulator;
    },
    { Good: 0, Average: 0, Weak: 0 }
  );

  const weakStudents = profiles.filter((profile) => profile.performanceCategory === "Weak");

  return res.json({
    summary: {
      totalStudents,
      avgMarks,
      avgPredictedScore,
      weakStudentCount: weakStudents.length
    },
    categories,
    weakStudents
  });
};
