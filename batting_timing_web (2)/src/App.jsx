import { useState, useRef, useEffect } from "react";

const soundMap = {
  start: "/sounds/start_louder.wav",
  release: "/sounds/release_louder.wav",
  impact: "/sounds/impact_refined_louder.wav",
};

const speedDelays = {
  "110": 0.618,
  "120": 0.555,
  "130": 0.513,
  "140": 0.480,
};

export default function App() {
  const [speed, setSpeed] = useState("120");
  const [interval, setInterval] = useState(2.5);
  const [isRunning, setIsRunning] = useState(false);
  const loopRef = useRef(null);

  const audioRefs = {
    start: useRef(null),
    release: useRef(null),
    impact: useRef(null),
  };

  useEffect(() => {
    // preload audios on mount
    audioRefs.start.current = new Audio(soundMap.start);
    audioRefs.release.current = new Audio(soundMap.release);
    audioRefs.impact.current = new Audio(soundMap.impact);
  }, []);

  const playSound = (key) => {
    const sound = audioRefs[key]?.current;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.warn("Playback failed:", e));
    }
  };

  const startLoop = () => {
    if (isRunning) return;
    setIsRunning(true);

    const loop = async () => {
      while (isRunning) {
        playSound("start");
        await new Promise((r) => setTimeout(r, 200));
        playSound("release");
        const delay = speedDelays[speed];
        await new Promise((r) => setTimeout(r, (delay - 0.2) * 1000));
        playSound("impact");
        await new Promise((r) => setTimeout(r, interval * 1000));
      }
    };

    loopRef.current = loop();
  };

  const stopLoop = () => {
    setIsRunning(false);
    loopRef.current = null;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>バッティングタイミング練習（音のみ）</h2>

      <div>
        <label>球速（km/h）</label>
        <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
          {Object.keys(speedDelays).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label>ループ間隔（秒）</label>
        <input
          type="number"
          step="0.5"
          min="1"
          max="10"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={startLoop} style={{ marginRight: 10 }}>スタート</button>
        <button onClick={stopLoop}>ストップ</button>
      </div>
    </div>
  );
}
