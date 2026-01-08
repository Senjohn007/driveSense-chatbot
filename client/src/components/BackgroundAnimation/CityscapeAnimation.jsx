// client/src/components/BackgroundAnimation/CityscapeAnimation.jsx
import React from 'react';

const CityscapeAnimation = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-indigo-900 to-purple-900">
      {/* Sky */}
      <div className="absolute inset-0">
        {/* Sun */}
        <div
          className="absolute bg-yellow-300 rounded-full"
          style={{
            width: '80px',
            height: '80px',
            top: '10%',
            right: '15%',
            boxShadow: '0 0 40px rgba(255, 255, 0, 0.5)'
          }}
        />
        
        {/* Clouds */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute bg-white rounded-full opacity-70"
            style={{
              width: `${80 + Math.random() * 40}px`,
              height: `${40 + Math.random() * 20}px`,
              top: `${5 + Math.random() * 20}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatCloud ${20 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* City buildings */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Background buildings */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`building-bg-${i}`}
            className="absolute bg-gray-800"
            style={{
              width: `${80 + Math.random() * 60}px`,
              height: `${150 + Math.random() * 200}px`,
              bottom: '0',
              left: `${i * 12.5}%`,
              opacity: 0.7
            }}
          >
            {/* Windows */}
            {[...Array(Math.floor(5 + Math.random() * 10))].map((_, j) => (
              <div
                key={`window-bg-${i}-${j}`}
                className="absolute bg-yellow-300"
                style={{
                  width: '10px',
                  height: '15px',
                  top: `${20 + j * 20}px`,
                  left: `${10 + (j % 3) * 20}px`,
                  opacity: Math.random() > 0.3 ? 0.8 : 0.1
                }}
              />
            ))}
          </div>
        ))}
        
        {/* Foreground buildings */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`building-fg-${i}`}
            className="absolute bg-gray-900"
            style={{
              width: `${100 + Math.random() * 80}px`,
              height: `${200 + Math.random() * 250}px`,
              bottom: '0',
              left: `${i * 20}%`
            }}
          >
            {/* Windows */}
            {[...Array(Math.floor(7 + Math.random() * 12))].map((_, j) => (
              <div
                key={`window-fg-${i}-${j}`}
                className="absolute bg-yellow-300"
                style={{
                  width: '12px',
                  height: '18px',
                  top: `${20 + j * 25}px`,
                  left: `${15 + (j % 4) * 20}px`,
                  opacity: Math.random() > 0.3 ? 0.9 : 0.1
                }}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-700">
        {/* Road lines */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`road-line-${i}`}
            className="absolute h-1 w-12 bg-yellow-400"
            style={{
              bottom: '50%',
              left: `${i * 5}%`,
              animation: `moveRoadLine ${3}s linear infinite`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
      
      {/* Moving cars */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`car-${i}`}
          className="absolute"
          style={{
            bottom: `${20 + (i % 2) * 30}px`,
            left: `${-150 - i * 100}px`,
            width: '80px',
            height: '30px',
            animation: `moveCar ${8 + i * 1.5}s linear infinite`,
            animationDelay: `${i * 1.5}s`
          }}
        >
          <div className="relative w-full h-full">
            {/* Car body */}
            <div
              className="absolute inset-0 rounded-t-lg"
              style={{
                backgroundColor: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#3b82f6' : '#10b981'
              }}
            />
            {/* Car roof */}
            <div
              className="absolute rounded-t-lg"
              style={{
                width: '40%',
                height: '15px',
                top: '-12px',
                left: '30%',
                backgroundColor: i % 3 === 0 ? '#dc2626' : i % 3 === 1 ? '#2563eb' : '#059669'
              }}
            />
            {/* Headlights */}
            <div
              className="absolute bg-yellow-200 rounded-full"
              style={{
                width: '10px',
                height: '6px',
                top: '12px',
                right: '0',
                boxShadow: '0 0 10px rgba(255, 255, 0, 0.7)'
              }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes floatCloud {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        
        @keyframes moveRoadLine {
          0% { transform: translateX(0); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes moveCar {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }
      `}</style>
    </div>
  );
};

export default CityscapeAnimation;