// client/src/components/BackgroundAnimation/HighwayAnimation.jsx
import React from 'react';

const HighwayAnimation = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-800">
        <div className="relative h-full">
          {/* Road lines */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-16 bg-yellow-400"
              style={{
                left: `${i * 20}%`,
                top: '50%',
                transform: 'translateY(-50%)',
                animation: `moveLines ${8 + i * 0.5}s linear infinite`
              }}
            />
          ))}
        </div>
      </div>

      {/* Moving cars */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`car-${i}`}
          className="absolute"
          style={{
            bottom: `${100 + (i % 2) * 40}px`,
            left: `${-150 - i * 100}px`,
            width: '120px',
            height: '50px',
            animation: `moveCar ${15 + i * 2}s linear infinite`,
            animationDelay: `${i * 2}s`
          }}
        >
          <div className="relative w-full h-full">
            {/* Car body */}
            <div className="absolute inset-0 bg-red-600 rounded-t-lg" />
            {/* Car roof */}
            <div
              className="absolute bg-red-700"
              style={{
                width: '50%',
                height: '20px',
                top: '-15px',
                left: '25%',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px'
              }}
            />
            {/* Wheels */}
            <div
              className="absolute bg-gray-900 rounded-full"
              style={{
                width: '20px',
                height: '20px',
                bottom: '-10px',
                left: '20px',
                animation: 'rotateWheel 1s linear infinite'
              }}
            />
            <div
              className="absolute bg-gray-900 rounded-full"
              style={{
                width: '20px',
                height: '20px',
                bottom: '-10px',
                right: '20px',
                animation: 'rotateWheel 1s linear infinite'
              }}
            />
          </div>
        </div>
      ))}

      {/* Stars in the sky */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute bg-white rounded-full"
          style={{
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`
          }}
        />
      ))}

      {/* Moon */}
      <div
        className="absolute bg-yellow-100 rounded-full"
        style={{
          width: '80px',
          height: '80px',
          top: '10%',
          right: '10%',
          boxShadow: '0 0 20px rgba(255, 255, 200, 0.5)'
        }}
      />

      <style jsx>{`
        @keyframes moveLines {
          0% { transform: translateX(0); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes moveCar {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }
        
        @keyframes rotateWheel {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HighwayAnimation;