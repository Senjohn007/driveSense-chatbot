// client/src/components/BackgroundAnimation/AnimationSelector.jsx
import React from 'react';
import { useAnimation } from '../../context/AnimationContext';
import HighwayAnimation from './HighwayAnimation';
import DashboardAnimation from './DashboardAnimation';
import EngineAnimation from './EngineAnimation';
import CityscapeAnimation from './CityscapeAnimation';
import BlueprintAnimation from './BlueprintAnimation';

const AnimationSelector = () => {
  const { selectedAnimation } = useAnimation();

  const renderAnimation = () => {
    switch (selectedAnimation) {
      case 'highway':
        return <HighwayAnimation />;
      case 'dashboard':
        return <DashboardAnimation />;
      case 'engine':
        return <EngineAnimation />;
      case 'cityscape':
        return <CityscapeAnimation />;
      case 'blueprint':
        return <BlueprintAnimation />;
      default:
        return <HighwayAnimation />;
    }
  };

  return <>{renderAnimation()}</>;
};

export default AnimationSelector;