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
      <section className="scene-page" aria-label="Interactive frontflip scene">
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
        <a className="scroll-cue" href="#profile-links">
          <span>Scroll to connect</span>
          <span aria-hidden="true">↓</span>
        </a>
      </section>
      <section className="profile-section" id="profile-links" aria-labelledby="profile-title">
        <div className="profile-heading">
          <span className="profile-eyebrow"><span /> SOCIAL PROFILES</span>
          <h1 id="profile-title">Find me out there.</h1>
          <p>A couple of places I share what I’m building.</p>
        </div>
        <nav className="profile-links" aria-label="Social profiles">
          <a
            className="profile-link"
            href="https://www.linkedin.com/in/romanvinnick/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="profile-icon linkedin-icon" aria-hidden="true">in</span>
            <span className="profile-link-copy">
              <span className="profile-link-name">LinkedIn</span>
              <span className="profile-link-detail">/in/romanvinnick</span>
            </span>
            <span className="profile-link-arrow" aria-hidden="true">↗</span>
          </a>
          <a
            className="profile-link"
            href="https://github.com/Roman1510"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="profile-icon github-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.31-3.76-1.31-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.49 2.2 3.28 1.56.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.23-5.06-5.48 0-1.21.43-2.2 1.15-2.98-.12-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.11 2.94.72.78 1.15 1.77 1.15 2.98 0 4.26-2.6 5.2-5.08 5.48.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
              />
            </svg>
            <span className="profile-link-copy">
              <span className="profile-link-name">GitHub</span>
              <span className="profile-link-detail">/Roman1510</span>
            </span>
            <span className="profile-link-arrow" aria-hidden="true">↗</span>
          </a>
        </nav>
        <span className="profile-index">Both links open in a new tab</span>
      </section>
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
