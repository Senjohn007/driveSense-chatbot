import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatHome from "./pages/ChatHome";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Routes>
          <Route path="/" element={<ChatHome />} />
          {/* Add more routes here as needed in the future */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;