import { useRef, useState, type PointerEvent } from 'react';
import { Leva } from 'leva';
import FrontflipScene from './FrontflipScene';
import './FrontflipExperience.css';

export function FrontflipExperience() {
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [clickWaves, setClickWaves] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const nextClickWaveId = useRef(0);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const id = nextClickWaveId.current++;
    setClickWaves((waves) => [...waves, { id, x: event.clientX, y: event.clientY }]);
    setIsSlowMotion(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const removeClickWave = (id: number) => {
    setClickWaves((waves) => waves.filter((wave) => wave.id !== id));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    setIsSlowMotion(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleCursorMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    setCursor({ x: event.clientX, y: event.clientY, visible: true });
  };

  return (
    <div
      className="frontflip-experience"
      onPointerMove={handleCursorMove}
      onPointerLeave={() => setCursor((current) => ({ ...current, visible: false }))}
    >
      <div
        className="frontflip-canvas"
        style={{ touchAction: 'pan-x pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsSlowMotion(false)}
        onLostPointerCapture={() => setIsSlowMotion(false)}
      >
        <FrontflipScene isSlowMotion={isSlowMotion} />
      </div>
      <Leva collapsed />
      {clickWaves.map((wave) => (
        <div
          key={wave.id}
          aria-hidden="true"
          className="click-wave"
          onAnimationEnd={() => removeClickWave(wave.id)}
          style={{ left: wave.x, top: wave.y }}
        />
      ))}
      {cursor.visible && (
        <div
          aria-hidden="true"
          className="custom-cursor"
          style={{ left: cursor.x, top: cursor.y }}
        />
      )}
    </div>
  );
}

export default FrontflipExperience;
