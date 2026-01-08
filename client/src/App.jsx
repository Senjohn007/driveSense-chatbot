import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/BackgroundAnimation/AnimatedBackground';
import ChatHome from './pages/ChatHome';
import './index.css'; // Contains Tailwind and CSS variables

function App() {
  const handleClearChat = () => {
    // This function will be passed down to ChatHome to clear the state
    // We'll use a key on the route to force re-render, which resets state
    window.location.reload(); // Simplest way for now, or use a state management lift
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="app-layout">
          <AnimatedBackground />
          <Navbar onClearChat={handleClearChat} />
          <main className="main-content">
            <Routes>
              {/* Using a key allows remounting the component, clearing its state */}
              <Route path="/" element={<ChatHome key={Date.now()} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;