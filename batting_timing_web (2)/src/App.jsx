import { useState, useRef, useEffect } from "react";

// Web Audio APIで精密時間制御（スタート→1.5秒→リリース→速度依存秒後→インパクト）
export default function App() {
  const [speed, setSpeed] = useState("120");
  const [intervalSec, setIntervalSec] = useState(3);
  const ctxRef = useRef(null);
  const buffersRef = useRef({});
  const loopRef = useRef(null);

  // 球速毎のリリース→インパクト間隔（秒）
  const speedDelays = {
    "100": 0.684,
    "110": 0.618,
    "120": 0.555,
    "130": 0.513,
    "140": 0.480,
  };

  // 初回マウント時にAudioContextとバッファを準備
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const sounds = [
      ["start", "/sounds/start_louder.wav"],
      ["release", "/sounds/release_louder.wav"],
      ["impact", "/sounds/impact_crisp_powered.wav"],
    ];
    sounds.forEach(([key, url]) => {
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data))
        .then((buffer) => { buffersRef.current[key] = buffer; })
        .catch((e) => console.warn(`${key} buffer load failed`, e));
    });
  }, []);

  // 正確に各音をスケジューリング
  const playSequence = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const startTime = ctx.currentTime + 0.1;
    const releaseTime = startTime + 1.5; // スタートから1.5秒後
    const impactTime = releaseTime + speedDelays[speed]; // さらに球速依存秒後

    const playBuffer = (key, time) => {
      const buffer = buffersRef.current[key];
      if (!buffer) return;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start(time);
    };

    playBuffer("start", startTime);
    playBuffer("release", releaseTime);
    playBuffer("impact", impactTime);
  };

  // ループ制御
  const startLoop = () => {
    if (loopRef.current) return;
    playSequence();
    loopRef.current = setInterval(playSequence, intervalSec * 1000);
  };
  const stopLoop = () => {
    if (!loopRef.current) return;
    clearInterval(loopRef.current);
    loopRef.current = null;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>バッティングタイミング練習（高精度ループ版）</h2>
      <div style={{ marginBottom: 10 }}>
        <label>球速（km/h）：</label>
        <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
          {Object.keys(speedDelays).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>間隔（秒）：</label>
        <input
          type="number"
          step="0.5"
          min="1"
          max="10"
          value={intervalSec}
          onChange={(e) => setIntervalSec(Number(e.target.value))}
        />
      </div>
      <button onClick={startLoop} style={{ marginRight: 10 }}>スタート</button>
      <button onClick={stopLoop}>ストップ</button>
    </div>
  );
}


