import bcrypt from "bcryptjs";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["student", "teacher"].includes(role)) {
    return res.status(400).json({ message: "Role must be student or teacher" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  if (role === "student") {
    await StudentProfile.create({
      student: user._id
    });
  }

  return res.status(201).json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches || user.role !== role) {
    return res.status(401).json({ message: "Invalid credentials or role" });
  }

  return res.json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};
