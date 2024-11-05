import { Play, Pause, FastForward, Snail } from 'lucide-react';
import Experience from './Experience';
import './Page4.css';
import { useRef, useState } from 'react';

type Controls = {
  togglePlay: () => void;
  toggleSpeed: () => void;
  reset: () => void;
  getState: () => {
    isPlaying: boolean;
    isSlowMotion: boolean;
  };
};

export function Page4() {
  const controls = useRef<Controls | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleControlsMount = (experienceControls: Controls) => {
    controls.current = experienceControls;
    const state = experienceControls.getState();
    setIsPlaying(state.isPlaying);
  };

  const handleTogglePlay = () => {
    controls.current?.togglePlay();
    const newState = controls.current?.getState();
    if (newState) {
      setIsPlaying(newState.isPlaying);
    }
  };

  const handleToggleSpeed = () => {
    controls.current?.toggleSpeed();
  };

  const handleReset = () => {
    controls.current?.reset();
    setIsPlaying(true);
  };

  return (
    <div className="section">
      <Experience onControlsMount={handleControlsMount} />
      <div className="player-container">
        <button
          className="player-button"
          aria-label="Play/Pause"
          onClick={handleTogglePlay}
        >
          {isPlaying ? (
            <Pause size={16} className="player-icon" />
          ) : (
            <Play size={16} className="player-icon" />
          )}
        </button>
        <button
          className="player-button"
          aria-label="Speed"
          onClick={handleReset}
        >
          <FastForward size={16} className="player-icon" />
        </button>
        <button
          className="player-button"
          aria-label="Reset"
          onClick={handleToggleSpeed}
        >
          <Snail size={16} className="player-icon" />
        </button>
      </div>
    </div>
  );
}

export default Page4;
