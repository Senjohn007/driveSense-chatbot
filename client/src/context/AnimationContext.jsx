// client/src/context/AnimationContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [selectedAnimation, setSelectedAnimation] = useState('highway');

  return (
    <AnimationContext.Provider value={{ selectedAnimation, setSelectedAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);