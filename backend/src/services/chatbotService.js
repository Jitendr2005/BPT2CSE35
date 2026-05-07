import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are a highly intelligent and empathetic academic assistant for the 'Student Performance Analyzer' platform. 
Your goal is to help students understand complex concepts, provide actionable study strategies, and offer genuine motivation. 
You answer any general question with the depth, clarity, and helpfulness of ChatGPT, while maintaining an encouraging and professional tone.
If the student asks about their performance, guide them on how to improve based on general best practices. 
You can answer anything (general knowledge, coding, math, history, etc.), not just academic topics.`;

export const getChatbotReply = async ({ message, chatHistory }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return "I'm currently in 'offline mode' because the Gemini API Key is missing. Please add your API key to the .env file to enable my full ChatGPT-like capabilities!";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", // Updated to the latest stable model
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Format history for Gemini SDK
    const history = chatHistory.map(chat => ([
      { role: "user", parts: [{ text: chat.question }] },
      { role: "model", parts: [{ text: chat.answer }] }
    ])).flat();

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return "I'm reached my AI limit for now (Quota Exhausted). Please check your Google AI Studio account status or try again later.";
    }
    console.error("Gemini API Error:", error);
    return "I encountered an error while processing your request. Please ensure your API key is correct and your account has access to Gemini 2.0 Flash in Google AI Studio.";
  }
};


