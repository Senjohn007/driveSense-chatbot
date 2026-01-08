// client/src/components/BackgroundAnimation/EngineAnimation.jsx
import React from 'react';

const EngineAnimation = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Engine block */}
      <div
        className="absolute bg-gray-800 rounded-lg"
        style={{
          width: '400px',
          height: '300px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Cylinder heads */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`cylinder-${i}`}
            className="absolute bg-gray-700 rounded-t-lg"
            style={{
              width: '70px',
              height: '120px',
              top: '-100px',
              left: `${40 + i * 90}px`
            }}
          >
            {/* Piston */}
            <div
              className="absolute bg-gray-600 rounded-t-lg"
              style={{
                width: '60px',
                height: '40px',
                top: '10px',
                left: '5px',
                animation: `pistonMove ${1.5 + i * 0.2}s ease-in-out infinite`
              }}
            />
          </div>
        ))}
        
        {/* Crankshaft */}
        <div
          className="absolute bg-gray-900 rounded-full"
          style={{
            width: '350px',
            height: '40px',
            bottom: '40px',
            left: '25px',
            animation: 'rotateCrankshaft 2s linear infinite'
          }}
        />
        
        {/* Timing belt */}
        <div
          className="absolute border-4 border-gray-600 rounded-full"
          style={{
            width: '100px',
            height: '100px',
            top: '-50px',
            left: '50px',
            animation: 'rotateBelt 1s linear infinite'
          }}
        />
        
        <div
          className="absolute border-4 border-gray-600 rounded-full"
          style={{
            width: '100px',
            height: '100px',
            top: '-50px',
            right: '50px',
            animation: 'rotateBelt 1s linear infinite'
          }}
        />
        
        {/* Connecting rods */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`rod-${i}`}
            className="absolute bg-gray-700"
            style={{
              width: '10px',
              height: '100px',
              top: '80px',
              left: `${70 + i * 90}px`,
              transformOrigin: 'top center',
              animation: `rodMove ${1.5 + i * 0.2}s ease-in-out infinite`
            }}
          />
        ))}
        
        {/* Valves */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`valve-${i}`}
            className="absolute bg-gray-600 rounded-full"
            style={{
              width: '15px',
              height: '15px',
              top: `${20 + (i % 2) * 30}px`,
              left: `${50 + Math.floor(i / 2) * 90}px`,
              animation: `valveMove ${1.5 + Math.floor(i / 2) * 0.2}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
      
      {/* Oil drops */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`oil-${i}`}
          className="absolute bg-amber-800 rounded-full opacity-70"
          style={{
            width: '5px',
            height: '10px',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `dropOil ${5 + Math.random() * 5}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes pistonMove {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        
        @keyframes rotateCrankshaft {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes rotateBelt {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes rodMove {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes valveMove {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        
        @keyframes dropOil {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default EngineAnimation;