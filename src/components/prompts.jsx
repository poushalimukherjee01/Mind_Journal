//─────────────────────────────────────────
// src/components/Prompts.jsx
// ─────────────────────────────────────────
import { useState } from "react";
import { PROMPTS } from "../constants";

export default function Prompts({ onSave }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length));
  const [text, setText] = useState("");
  const [flash, setFlash] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    await onSave({ entry: text.trim(), prompt: PROMPTS[idx], type: "prompt" });
    setText("");
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  };

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2d6a4f", marginBottom: 6 }}>Guided Reflection</h2>
      <p style={{ fontSize: 13, color: "#74a08a", marginBottom: 16 }}>Let a question lead the way.</p>
      <div style={{ background: "#fff", borderRadius: 14, padding: "18px", border: "1px solid #d1e8dc", marginBottom: 12 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#2d3748", lineHeight: 1.6, margin: 0 }}>"{PROMPTS[idx]}"</p>
      </div>
      <button onClick={() => { setIdx(Math.floor(Math.random() * PROMPTS.length)); setText(""); }}
        style={{ background: "transparent", border: "1px solid #b7dfc9", color: "#2d6a4f", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", marginBottom: 14 }}>
        🔀 New Prompt
      </button>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Your thoughts..."
        style={{ width: "100%", minHeight: 150, borderRadius: 12, border: "1px solid #d1e8dc",
          padding: "14px", fontSize: 14, lineHeight: 1.7, background: "#fff",
          resize: "vertical", color: "#2d3748", boxSizing: "border-box", outline: "none" }} />
      <button onClick={handleSave} style={{ marginTop: 12, width: "100%", padding: "12px", background: "#2d6a4f", color: "#fff",
        border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        {flash ? "✓ Saved!" : "Save Reflection"}
      </button>
    </div>
  );
}
