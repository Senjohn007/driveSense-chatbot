// client/src/components/BackgroundAnimation/BlueprintAnimation.jsx
import React from 'react';

const BlueprintAnimation = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={`h-line-${i}`}
            className="absolute bg-cyan-500"
            style={{
              width: '100%',
              height: '1px',
              top: `${i * 5}%`
            }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <div
            key={`v-line-${i}`}
            className="absolute bg-cyan-500"
            style={{
              width: '1px',
              height: '100%',
              left: `${i * 5}%`
            }}
          />
        ))}
      </div>
      
      {/* Car blueprint */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
        {/* Car outline */}
        <div
          className="absolute border-2 border-cyan-400"
          style={{
            width: '70%',
            height: '30%',
            top: '40%',
            left: '15%',
            borderTopLeftRadius: '50px',
            borderTopRightRadius: '100px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px'
          }}
        >
          {/* Car roof */}
          <div
            className="absolute border-2 border-cyan-400 border-b-0"
            style={{
              width: '40%',
              height: '50%',
              top: '-50%',
              left: '30%',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px'
            }}
          />
          
          {/* Windows */}
          <div
            className="absolute border-2 border-cyan-400"
            style={{
              width: '35%',
              height: '40%',
              top: '-40%',
              left: '32.5%'
            }}
          />
          
          {/* Wheels */}
          <div
            className="absolute border-2 border-cyan-400 rounded-full"
            style={{
              width: '15%',
              height: '60%',
              top: '20%',
              left: '15%',
              transform: 'translateY(50%)'
            }}
          />
          <div
            className="absolute border-2 border-cyan-400 rounded-full"
            style={{
              width: '15%',
              height: '60%',
              top: '20%',
              right: '15%',
              transform: 'translateY(50%)'
            }}
          />
          
          {/* Headlights */}
          <div
            className="absolute border-2 border-cyan-400 rounded-full"
            style={{
              width: '5%',
              height: '20%',
              top: '30%',
              right: '-2.5%',
              transform: 'translateY(-50%)'
            }}
          />
          
          {/* Tail lights */}
          <div
            className="absolute border-2 border-cyan-400 rounded-full"
            style={{
              width: '5%',
              height: '20%',
              top: '30%',
              left: '-2.5%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
        
        {/* Measurement lines */}
        <div
          className="absolute border-t-2 border-dashed border-cyan-400"
          style={{
            width: '70%',
            top: '75%',
            left: '15%'
          }}
        >
          {/* Arrow heads */}
          <div
            className="absolute border-l-2 border-cyan-400"
            style={{
              height: '10px',
              top: '-5px',
              left: '0',
              transform: 'rotate(-45deg)',
              transformOrigin: 'bottom left'
            }}
          />
          <div
            className="absolute border-r-2 border-cyan-400"
            style={{
              height: '10px',
              top: '-5px',
              right: '0',
              transform: 'rotate(45deg)',
              transformOrigin: 'bottom right'
            }}
          />
          
          {/* Measurement text */}
          <div
            className="absolute text-cyan-400 text-xs"
            style={{
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            4500mm
          </div>
        </div>
        
        <div
          className="absolute border-l-2 border-dashed border-cyan-400"
          style={{
            height: '30%',
            top: '40%',
            left: '10%'
          }}
        >
          {/* Arrow heads */}
          <div
            className="absolute border-t-2 border-cyan-400"
            style={{
              width: '10px',
              left: '-5px',
              top: '0',
              transform: 'rotate(45deg)',
              transformOrigin: 'top right'
            }}
          />
          <div
            className="absolute border-b-2 border-cyan-400"
            style={{
              width: '10px',
              left: '-5px',
              bottom: '0',
              transform: 'rotate(-45deg)',
              transformOrigin: 'bottom right'
            }}
          />
          
          {/* Measurement text */}
          <div
            className="absolute text-cyan-400 text-xs"
            style={{
              left: '-40px',
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              transformOrigin: 'center'
            }}
          >
            1800mm
          </div>
        </div>
        
        {/* Technical details */}
        <div
          className="absolute text-cyan-400 text-xs font-mono"
          style={{
            top: '20%',
            left: '10%'
          }}
        >
          <div>MODEL: SEDAN-X</div>
          <div>YEAR: 2023</div>
          <div>ENGINE: 2.0L TURBO</div>
          <div>POWER: 250HP</div>
        </div>
        
        {/* Component labels with lines */}
        <div
          className="absolute text-cyan-400 text-xs"
          style={{
            top: '25%',
            left: '60%'
          }}
        >
          ENGINE
        </div>
        <div
          className="absolute border-t border-cyan-400"
          style={{
            width: '50px',
            top: '25%',
            left: '45%',
            transform: 'translateY(-50%)'
          }}
        />
        
        <div
          className="absolute text-cyan-400 text-xs"
          style={{
            top: '60%',
            left: '5%'
          }}
        >
          WHEEL
        </div>
        <div
          className="absolute border-t border-cyan-400"
          style={{
            width: '40px',
            top: '60%',
            left: '15%',
            transform: 'translateY(-50%)'
          }}
        />
      </div>
      
      {/* Animated blueprint lines */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`line-${i}`}
          className="absolute bg-cyan-400 opacity-30"
          style={{
            height: '1px',
            width: '100px',
            top: `${20 + i * 15}%`,
            left: '-100px',
            animation: `drawLine ${5 + i}s linear infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}
      
      {/* Scanning effect */}
      <div
        className="absolute bg-cyan-400 opacity-10"
        style={{
          width: '100%',
          height: '50px',
          top: '-50px',
          animation: 'scan 8s linear infinite'
        }}
      />

      <style jsx>{`
        @keyframes drawLine {
          0% { left: -100px; width: 0; }
          50% { width: 100px; }
          100% { left: 100%; width: 0; }
        }
        
        @keyframes scan {
          0% { top: -50px; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default BlueprintAnimation;