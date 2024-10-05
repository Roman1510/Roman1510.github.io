import React, { useMemo } from 'react';
import { Container, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';

interface StarBackgroundProps {
  width: number;
  height: number;
  starCount: number;
  scale?: number;
  offset?:{x:number, y:number};
}

const StarBackground: React.FC<StarBackgroundProps> = ({ 
  width, 
  height, 
  starCount,
  scale = 1,
  offset
  
}) => {
  const stars = useMemo(() => {
    const maxDimension = Math.max(width, height);
    const scaledSize = maxDimension * scale;
    return Array.from({ length: starCount }, () => {
      const r = Math.sqrt(Math.random()) * scaledSize / 2;
      const theta = Math.random() * 2 * Math.PI;
      return {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.5,
      };
    });
  }, [width, height, starCount, scale]);

  const drawBackground = (g: PIXI.Graphics) => {
    const maxDimension = Math.max(width, height);
    const scaledSize = maxDimension * scale;
    g.clear();
    g.beginFill(0x000000);  
    g.drawCircle(offset!.x, offset!.y, scaledSize / 2);
    g.endFill();
  }

  const drawStars = (g: PIXI.Graphics) => {
    g.clear();
    stars.forEach((star) => {
      g.beginFill(0xF0F0F0, star.alpha);
      g.drawCircle(offset!.x+star.x, offset!.y+star.y, star.radius);
      g.endFill();
    });
  };

  return (
    <Container>
      <Graphics draw={drawBackground} />
      <Graphics draw={drawStars} />
    </Container>
  );
};

export default StarBackground;