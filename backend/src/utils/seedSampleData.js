import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import { getPrediction } from "../services/predictionService.js";

const sampleStudents = [
  {
    name: "Aarav Sharma",
    email: "aarav@student.com",
    role: "student",
    password: "Student@123",
    profile: {
      rollNumber: "STU001",
      course: "Computer Science",
      marks: 78,
      attendance: 88,
      studyHours: 4,
      assignments: 85,
      previousMarks: 73
    }
  },
  {
    name: "Diya Verma",
    email: "diya@student.com",
    role: "student",
    password: "Student@123",
    profile: {
      rollNumber: "STU002",
      course: "Mathematics",
      marks: 48,
      attendance: 62,
      studyHours: 1.5,
      assignments: 55,
      previousMarks: 51
    }
  },
  {
    name: "Kabir Mehta",
    email: "kabir@student.com",
    role: "student",
    password: "Student@123",
    profile: {
      rollNumber: "STU003",
      course: "Physics",
      marks: 66,
      attendance: 74,
      studyHours: 3,
      assignments: 72,
      previousMarks: 64
    }
  }
];

const seed = async () => {
  await connectDB();

  const teacherPassword = await bcrypt.hash("Teacher@123", 10);
  await User.findOneAndUpdate(
    { email: "teacher@school.com" },
    {
      name: "Prof. Nisha Rao",
      email: "teacher@school.com",
      password: teacherPassword,
      role: "teacher"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  for (const item of sampleStudents) {
    const password = await bcrypt.hash(item.password, 10);
    const user = await User.findOneAndUpdate(
      { email: item.email },
      {
        name: item.name,
        email: item.email,
        password,
        role: item.role
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const prediction = await getPrediction(item.profile);

    await StudentProfile.findOneAndUpdate(
      { student: user._id },
      {
        student: user._id,
        ...item.profile,
        predictedScore: prediction.predictedScore,
        performanceCategory: prediction.performanceCategory,
        alerts: prediction.alerts
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log("Sample data seeded successfully");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
