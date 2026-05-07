import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    rollNumber: {
      type: String,
      default: ""
    },
    course: {
      type: String,
      default: "General"
    },
    marks: {
      type: Number,
      default: 0
    },
    attendance: {
      type: Number,
      default: 0
    },
    studyHours: {
      type: Number,
      default: 0
    },
    assignments: {
      type: Number,
      default: 0
    },
    previousMarks: {
      type: Number,
      default: 0
    },
    predictedScore: {
      type: Number,
      default: 0
    },
    performanceCategory: {
      type: String,
      enum: ["Good", "Average", "Weak"],
      default: "Average"
    },
    alerts: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
