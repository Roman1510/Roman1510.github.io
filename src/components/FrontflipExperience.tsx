import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Leva } from 'leva';
import FrontflipScene from './FrontflipScene';
import './FrontflipExperience.css';

const tutorialStorageKey = 'frontflip-interaction-guide-dismissed';
const faviconColors = {
  normal: ['#eadfff', '#bd91ff', '#8b45f6', '#5520b4', '#a86bff'],
  slowMotion: ['#ffe2e2', '#ff8585', '#f04444', '#a9132b', '#ff3b4e'],
};

const getTutorialVisibility = () => {
  try {
    return window.localStorage.getItem(tutorialStorageKey) !== 'true';
  } catch (error) {
    console.error('Unable to read the interaction guide preference.', error);
    return true;
  }
};

export function FrontflipExperience() {
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [showTutorial, setShowTutorial] = useState(getTutorialVisibility);
  const [clickWaves, setClickWaves] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const nextClickWaveId = useRef(0);

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) return;

    const [highlight, light, mid, dark, glow] = isSlowMotion
      ? faviconColors.slowMotion
      : faviconColors.normal;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><radialGradient id="sphere" cx="34%" cy="28%" r="70%"><stop offset="0" stop-color="${highlight}"/><stop offset=".28" stop-color="${light}"/><stop offset=".68" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></radialGradient><radialGradient id="glow"><stop offset="0" stop-color="${glow}" stop-opacity=".5"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient><filter id="blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter></defs><circle cx="32" cy="32" r="30" fill="url(#glow)" filter="url(#blur)"/><circle cx="32" cy="32" r="19" fill="url(#sphere)"/><ellipse cx="25" cy="23" rx="6" ry="3.5" fill="#fff" opacity=".48" transform="rotate(-35 25 23)"/></svg>`;
    favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [isSlowMotion]);

  const dismissTutorial = () => {
    setShowTutorial(false);
    try {
      window.localStorage.setItem(tutorialStorageKey, 'true');
    } catch (error) {
      console.error('Unable to save the interaction guide preference.', error);
    }
  };

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
          style={{ touchAction: 'pan-y' }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setIsSlowMotion(false)}
          onLostPointerCapture={() => setIsSlowMotion(false)}
        >
          <FrontflipScene isSlowMotion={isSlowMotion} />
        </div>
        {showTutorial && (
          <div className="interaction-tutorial">
            <svg
              aria-hidden="true"
              className="tutorial-connector"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M 24 19 C 38 25, 45 39, 64 61" />
            </svg>
            <div className="tutorial-card">
              <div className="tutorial-card-topline">
                <span className="tutorial-kicker"><span /> QUICK GUIDE</span>
                <button
                  type="button"
                  className="tutorial-dismiss"
                  aria-label="Dismiss interaction guide"
                  onClick={dismissTutorial}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <p className="tutorial-title">The scene is interactive.</p>
              <div className="tutorial-instruction">
                <span className="tutorial-number">01</span>
                <span>
                  <strong>Hold anywhere</strong>
                  <small>Slow motion while you press</small>
                </span>
                <span className="tutorial-key" aria-hidden="true">HOLD</span>
              </div>
              <div className="tutorial-instruction">
                <span className="tutorial-number">02</span>
                <span>
                  <strong>Move or drag sideways</strong>
                  <small>Nudge the camera angle</small>
                </span>
                <span className="tutorial-key tutorial-key-move" aria-hidden="true">↔</span>
              </div>
              <span className="tutorial-footnote">TRY IT ON THE SCENE</span>
            </div>
            <div className="hold-target" aria-hidden="true">
              <span className="hold-target-ring" />
              <span className="hold-target-core" />
              <span className="hold-target-label">HOLD TO SLOW</span>
            </div>
          </div>
        )}
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
