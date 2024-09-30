import { useEffect, useState, useCallback } from 'react';

import { Stage } from '@pixi/react';
import MainContainer from './MainContainer';

export const PixiGrid = () => {
  const [canvasSize, setCanvasSize] = useState(0);

  const updateCanvasSize = useCallback(() => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    setCanvasSize(size);
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stage
        width={canvasSize}
        height={canvasSize}
        options={{
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
        }}
      >
        <MainContainer canvasSize={canvasSize}></MainContainer>
      </Stage>
    </div>
  );
};
