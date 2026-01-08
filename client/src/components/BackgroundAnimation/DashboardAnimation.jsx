// client/src/components/BackgroundAnimation/DashboardAnimation.jsx
import React from 'react';

const DashboardAnimation = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Dashboard background */}
      <div className="absolute inset-0 bg-black opacity-50" />
      
      {/* Speedometer */}
      <div
        className="absolute rounded-full border-8 border-gray-700"
        style={{
          width: '300px',
          height: '300px',
          top: '10%',
          left: '10%',
          background: 'radial-gradient(circle, #333 0%, #111 100%)'
        }}
      >
        {/* Speedometer markings */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              width: '2px',
              height: '20px',
              top: '10px',
              left: '50%',
              transformOrigin: 'center 140px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              opacity: 0.7
            }}
          />
        ))}
        
        {/* Speedometer needle */}
        <div
          className="absolute bg-red-500"
          style={{
            width: '4px',
            height: '120px',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            animation: 'moveNeedle 4s ease-in-out infinite',
            borderRadius: '2px'
          }}
        />
        
        {/* Center cap */}
        <div
          className="absolute rounded-full bg-gray-700"
          style={{
            width: '40px',
            height: '40px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {/* Tachometer */}
      <div
        className="absolute rounded-full border-8 border-gray-700"
        style={{
          width: '250px',
          height: '250px',
          top: '15%',
          right: '10%',
          background: 'radial-gradient(circle, #333 0%, #111 100%)'
        }}
      >
        {/* Tachometer markings */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              width: '2px',
              height: '15px',
              top: '10px',
              left: '50%',
              transformOrigin: 'center 115px',
              transform: `translateX(-50%) rotate(${i * 36}deg)`,
              opacity: 0.7
            }}
          />
        ))}
        
        {/* Tachometer needle */}
        <div
          className="absolute bg-green-500"
          style={{
            width: '4px',
            height: '100px',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            animation: 'moveNeedle 3s ease-in-out infinite',
            borderRadius: '2px'
          }}
        />
        
        {/* Center cap */}
        <div
          className="absolute rounded-full bg-gray-700"
          style={{
            width: '40px',
            height: '40px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {/* Fuel gauge */}
      <div
        className="absolute rounded-lg border-4 border-gray-700"
        style={{
          width: '200px',
          height: '80px',
          bottom: '20%',
          left: '15%',
          background: 'radial-gradient(ellipse, #333 0%, #111 100%)'
        }}
      >
        {/* Fuel level indicator */}
        <div
          className="absolute bottom-0 left-0 bg-green-500 rounded-b-lg"
          style={{
            width: '100%',
            height: '60%',
            animation: 'changeFuel 8s ease-in-out infinite'
          }}
        />
        
        {/* Fuel markings */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between px-4 py-2">
          <span className="text-white text-xs">F</span>
          <span className="text-white text-xs">E</span>
        </div>
      </div>
      
      {/* Temperature gauge */}
      <div
        className="absolute rounded-lg border-4 border-gray-700"
        style={{
          width: '200px',
          height: '80px',
          bottom: '20%',
          right: '15%',
          background: 'radial-gradient(ellipse, #333 0%, #111 100%)'
        }}
      >
        {/* Temperature level indicator */}
        <div
          className="absolute bottom-0 left-0 bg-blue-500 rounded-b-lg"
          style={{
            width: '100%',
            height: '40%',
            animation: 'changeTemp 6s ease-in-out infinite'
          }}
        />
        
        {/* Temperature markings */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between px-4 py-2">
          <span className="text-white text-xs">C</span>
          <span className="text-white text-xs">H</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes moveNeedle {
          0% { transform: translateX(-50%) rotate(-45deg); }
          50% { transform: translateX(-50%) rotate(45deg); }
          100% { transform: translateX(-50%) rotate(-45deg); }
        }
        
        @keyframes changeFuel {
          0%, 100% { height: 60%; background-color: #10b981; }
          25% { height: 40%; background-color: #eab308; }
          50% { height: 20%; background-color: #ef4444; }
          75% { height: 40%; background-color: #eab308; }
        }
        
        @keyframes changeTemp {
          0%, 100% { height: 40%; background-color: #3b82f6; }
          50% { height: 70%; background-color: #ef4444; }
        }
      `}</style>
    </div>
  );
};

export default DashboardAnimation;