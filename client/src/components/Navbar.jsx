import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = ({ onClearChat }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">DriveSense</h1>
        <div className="navbar-controls">
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