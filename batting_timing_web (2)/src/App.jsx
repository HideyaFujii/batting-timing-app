export default function App() {
  const playSequence = () => {
    const start = new Audio("/sounds/start_louder.wav");
    const release = new Audio("/sounds/release_louder.wav");
    const impact = new Audio("/sounds/impact_refined_louder.wav");

    start.play().catch((e) => alert("ザッの再生失敗: " + e.message));
    setTimeout(() => {
      release.play().catch((e) => alert("ピッの再生失敗: " + e.message));
    }, 200);
    setTimeout(() => {
      impact.play().catch((e) => alert("ドンッの再生失敗: " + e.message));
    }, 500); // 合計0.5秒後（ピッから0.3秒）
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>テスト：ザッ→ピッ→ドンッの一連再生</h2>
      <button onClick={playSequence}>再生する</button>
    </div>
  );
}
