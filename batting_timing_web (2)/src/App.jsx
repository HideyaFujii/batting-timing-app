import { useState } from "react";

const speedDelays = {
  "100": 0.684,
  "110": 0.618,
  "120": 0.555,
  "130": 0.513,
  "140": 0.480,
};

export default function App() {
  const [speed, setSpeed] = useState("120");

  const playSequence = () => {
    const start = new Audio("/sounds/start_louder.wav");
    const release = new Audio("/sounds/release_louder.wav");
    const impact = new Audio("/sounds/impact_refined_louder.wav");

    const startDelay = 0; // ザッ：即時
    const releaseDelay = 1500; // ピッ：スタートから1.5秒後
    const impactDelay = releaseDelay + speedDelays[speed] * 1000;

    setTimeout(() => {
      start.play().catch((e) => alert("ザッの再生失敗: " + e.message));
    }, startDelay);

    setTimeout(() => {
      release.play().catch((e) => alert("ピッの再生失敗: " + e.message));
    }, releaseDelay);

    setTimeout(() => {
      impact.play().catch((e) => alert("ドンッの再生失敗: " + e.message));
    }, impactDelay);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>球速別：ザッ→ピッ→ドンッ</h2>

      <div style={{ marginBottom: 10 }}>
        <label>球速（km/h）：</label>
        <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
          {Object.keys(speedDelays).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button onClick={playSequence}>再生する</button>
    </div>
  );
}

