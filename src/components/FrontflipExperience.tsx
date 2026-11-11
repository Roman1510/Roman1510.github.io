import { useState, type PointerEvent } from 'react';
import { Leva } from 'leva';
import FrontflipScene from './FrontflipScene';
import './FrontflipExperience.css';

export function FrontflipExperience() {
  const [isSlowMotion, setIsSlowMotion] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    setIsSlowMotion(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    setIsSlowMotion(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="frontflip-experience">
      <div
        className="frontflip-canvas"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsSlowMotion(false)}
        onLostPointerCapture={() => setIsSlowMotion(false)}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <FrontflipScene isSlowMotion={isSlowMotion} />
      </div>
      <Leva collapsed />
    </div>
  );
}

export default FrontflipExperience;
