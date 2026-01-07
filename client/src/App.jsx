import { useState } from "react";
import "./index.css";
import { sendMessage } from "./api";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [suggestions, setSuggestions] = useState([
    "Tell me about fuel-efficient cars",
    "Compare Toyota Corolla vs Honda Civic",
    "What's the maintenance cost for trucks?",
    "Which EV has the best mileage?"
  ]);

  // Function to handle suggestion clicks
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input; // Store the input before clearing it
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-4 flex flex-col h-[80vh]">
        <h1 className="text-xl font-semibold mb-2">
          Automobile AI Chatbot
        </h1>

        <div className="flex-1 overflow-y-auto space-y-2 mb-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={
                m.role === "user"
                  ? "text-right"
                  : "text-left text-emerald-300"
              }
            >
              <span className="inline-block px-3 py-2 rounded bg-slate-700">
                {m.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-left text-gray-400 text-sm">
              Typing...
            </div>
          )}
        </div>

        {/* Show suggestions when there are no messages or after a few messages */}
        {(messages.length === 0 || messages.length % 5 === 0) && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full text-xs text-gray-300"
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            className="flex-1 bg-slate-700 rounded p-2 text-sm resize-none"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about mileage, maintenance, comparisons..."
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded text-sm disabled:bg-emerald-800 disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;