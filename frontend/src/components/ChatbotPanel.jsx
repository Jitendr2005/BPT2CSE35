import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import client from "../api/client.js";

function ChatbotPanel() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      const response = await client.get("/chatbot/history");
      setHistory(response.data.history);
    };

    loadHistory().catch(() => {
      setHistory([]);
    });
  }, []);

  // Auto-scroll to bottom whenever history changes
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim() || sending) return;

    const userMessage = { _id: Date.now(), question: message, answer: "..." };
    setHistory((current) => [...current, userMessage]);
    
    setSending(true);
    const originalMessage = message;
    setMessage("");

    try {
      const response = await client.post("/chatbot", { message: originalMessage });
      // Replace the optimistic "..." with the real answer
      setHistory((current) => 
        current.map(msg => msg._id === userMessage._id ? response.data.chat : msg)
      );
    } catch (error) {
      console.error("Chat error:", error);
      setHistory((current) => 
        current.map(msg => msg._id === userMessage._id ? { ...msg, answer: "Sorry, I couldn't process that. Check your connection or API key." } : msg)
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="panel chatbot-panel">
      <div className="card-heading">
        <div className="ai-badge">AI Powered</div>
        <h3>AI Academic Assistant</h3>
        <p className="muted">Experience ChatGPT-level support for studies, motivation, and beyond.</p>
      </div>
      <div className="chat-window" ref={chatWindowRef}>
        {history.length === 0 ? (
          <div className="empty-chat">
            <p>Hi! I'm your AI assistant. Ask me anything about your studies, or just say hello!</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item._id} className="chat-entry">
              <div className="chat-user-row">
                <div className="chat-user">{item.question}</div>
              </div>
              <div className="chat-bot-row">
                <div className="chat-bot">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        {sending && history[history.length - 1]?.answer === "..." && (
          <div className="typing-indicator">Assistant is thinking...</div>
        )}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your question here... (Enter to send)"
          rows={2}
        />
        <button type="submit" disabled={sending || !message.trim()} className="send-btn">
          {sending ? <span className="spinner"></span> : "Send"}
        </button>
      </form>
    </section>
  );
}

export default ChatbotPanel;

