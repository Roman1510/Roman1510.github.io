import { Play, Pause, FastForward, SkipForward } from "lucide-react";
import Experience from "./Experience";
import "./Page4.css";
import { useState } from "react";

export function Page4() {
  const [playing, setPlaying] = useState(false);

  const handleTogglePlay = () => {
    setPlaying(prevState => !prevState);
  };

  return (
    <div className="section">
      <Experience />
      <div className="player-container">
        <button
          className="player-button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={handleTogglePlay}
        >
          {playing ? (
            <Pause size={32} className="player-icon" />
          ) : (
            <Play size={32} className="player-icon" />
          )}
        </button>
        <button
          className="player-button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={handleTogglePlay}
        >
          <FastForward size={32} className="player-icon" />
        </button>
        <button
          className="player-button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={handleTogglePlay}
        >
          <SkipForward size={32} className="player-icon" />
        </button>
      </div>
    </div>
  );
}

export default Page4;