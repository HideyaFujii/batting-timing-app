export default function App() {
  const playSound = () => {
    const audio = new Audio("/sounds/release_louder.wav");
    audio.play().catch((e) => alert("音がブロックされました: " + e.message));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>テスト：ボタンを押して音が鳴るか</h2>
      <button onClick={playSound}>テスト再生</button>
    </div>
  );
}

