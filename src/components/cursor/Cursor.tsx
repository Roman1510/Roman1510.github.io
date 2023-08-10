import React, { useState, useEffect } from 'react';
import './Cursor.css';

interface CursorPosition {
  x: number;
  y: number;
}

const Cursor: React.FC = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: -100, y: -100 });

  const onMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <div className="cursor" style={{ left: `${position.x}px`, top: `${position.y}px` }}></div>;
};

export default Cursor;