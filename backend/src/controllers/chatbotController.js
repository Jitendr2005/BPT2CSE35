import ChatHistory from "../models/ChatHistory.js";
import StudentProfile from "../models/StudentProfile.js";
import { getChatbotReply } from "../services/chatbotService.js";

export const sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const chatHistory = await ChatHistory.find({ student: req.user._id }).sort({ createdAt: 1 }).limit(10);
  const answer = await getChatbotReply({ message, chatHistory });

  const chatRecord = await ChatHistory.create({
    student: req.user._id,
    question: message,
    answer
  });

  return res.json({ reply: answer, chat: chatRecord });
};

export const getChatHistory = async (req, res) => {
  const history = await ChatHistory.find({ student: req.user._id }).sort({ createdAt: 1 });
  return res.json({ history });
};
