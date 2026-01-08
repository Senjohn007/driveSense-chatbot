// client/src/components/BackgroundAnimation/AnimatedBackground.jsx
import React from 'react';
import './background.css';

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      {/* Road lines for motion effect */}
      <div className="road-lines">
        <div className="road-line line-1"></div>
        <div className="road-line line-2"></div>
        <div className="road-line line-3"></div>
      </div>
      
      {/* Automotive shapes */}
      <div className="shape car-silhouette car-1"></div>
      <div className="shape car-silhouette car-2"></div>
      <div className="shape wheel wheel-1"></div>
      <div className="shape wheel wheel-2"></div>
      <div className="shape gear gear-1"></div>
      <div className="shape gear gear-2"></div>
      <div className="shape speedometer"></div>
    </div>
  );
};

export default AnimatedBackground;