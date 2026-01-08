import { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ScrollToTop from "../components/ScrollToTop";
import { sendMessage } from "../api";
import "../styles/chatHome.css";

function ChatHome() {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom
  
  const [suggestions, setSuggestions] = useState([
    "Tell me about fuel-efficient cars",
    "Compare Toyota Corolla vs Honda Civic",
    "What's the maintenance cost for trucks?",
    "Which EV has the best mileage?",
    "Show me SUVs under $30,000",
    "What's the best family car?",
    "Compare luxury sedans",
    "Tell me about hybrid vehicles"
  ]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const { data } = await sendMessage(currentInput, sessionId);
      if (!sessionId && data.sessionId) setSessionId(data.sessionId);

      const botMsg = { role: "assistant", content: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const msg =
        e.response?.data?.error || "Error contacting server.";
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: msg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setSessionId(null);
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>Welcome to DriveSense</h2>
              <p>Ask me anything about vehicles - from fuel efficiency to maintenance costs, comparisons, and more!</p>
            </div>
          )}
          
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`message ${m.role === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-content">
                {m.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message bot-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {/* This invisible element will be scrolled into view */}
          <div ref={messagesEndRef} />
        </div>

        {(messages.length === 0 || messages.length % 5 === 0) && (
          <div className="suggestions-container">
            <p>Try asking:</p>
            <div className="suggestions">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-btn"
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-container">
          <textarea
            className="message-input"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about mileage, maintenance, comparisons..."
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="send-btn"
            disabled={loading || !input.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}

export default ChatHome;