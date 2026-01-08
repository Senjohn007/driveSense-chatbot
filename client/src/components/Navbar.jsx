// client/src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useAnimation } from '../context/AnimationContext';
import '../styles/Navbar.css';

const Navbar = ({ onClearChat }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { selectedAnimation, setSelectedAnimation } = useAnimation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const animations = [
    { id: 'highway', name: 'Highway' },
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'engine', name: 'Engine Parts' },
    { id: 'cityscape', name: 'Cityscape' },
    { id: 'blueprint', name: 'Blueprint' }
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">DriveSense</h1>
        <div className="navbar-controls">
          <div className="dropdown-container">
            <button
              className="icon-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Select animation"
            >
              🎨
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {animations.map(animation => (
                  <button
                    key={animation.id}
                    className={`dropdown-item ${selectedAnimation === animation.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedAnimation(animation.id);
                      setDropdownOpen(false);
                    }}
                  >
                    {animation.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="icon-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <button
            onClick={onClearChat}
            className="icon-btn clear-btn"
            aria-label="Clear conversation"
          >
            🗑️
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;