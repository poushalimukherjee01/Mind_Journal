import { useState } from "react";
import { MOODS, fmt, dateKey } from "../constants";

export default function Today({ allEntries, onSave, onDelete }) {
  const [mood, setMood] = useState(null);
  const [entry, setEntry] = useState("");
  const [flash, setFlash] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleSave = async () => {
    if (!mood && !entry.trim()) return;
    await onSave({ mood, entry: entry.trim(), type: "journal" });
    setMood(null);
    setEntry("");
    setAiSuggestion("");
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  };

  const getAISuggestion = async () => {
    setAiLoading(true);
    setAiSuggestion("");
    try {
      const selectedMood = MOODS.find(m => m.value === mood);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are a compassionate mental health journaling assistant. The user is feeling "${selectedMood?.label}" and wrote: "${entry || "(no entry yet)"}". Give a brief (2-3 sentences), warm, non-clinical reflection. Be human and kind.` }]
        })
      });
      const d = await res.json();
      setAiSuggestion(d.content?.map(c => c.text || "").join("") || "Stay kind to yourself. 💚");
    } catch {
      setAiSuggestion("Stay kind to yourself today. You're doing better than you think. 💚");
    }
    setAiLoading(false);
  };

  const todayEntries = allEntries.filter(e => dateKey(e.timestamp) === dateKey(new Date().toISOString()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2d6a4f", margin: 0 }}>How are you feeling?</h2>
        <span style={{ fontSize: 12, color: "#74a08a", background: "#f0faf4", borderRadius: 8, padding: "4px 10px" }}>
          🕐 {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {MOODS.map(m => (
          <button key={m.value} onClick={() => setMood(m.value)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 12,
            border: mood === m.value ? `2px solid ${m.color}` : "2px solid transparent",
            background: mood === m.value ? `${m.color}33` : "#fff",
            cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 4px #0001"
          }}>
            <div style={{ fontSize: 24 }}>{m.emoji}</div>
            <div style={{ fontSize: 10, color: "#5a7a6a", marginTop: 3, fontWeight: 600 }}>{m.label}</div>
          </button>
        ))}
      </div>

      <textarea value={entry} onChange={e => setEntry(e.target.value)}
        placeholder="Write freely — you can log multiple times today..."
        style={{ width: "100%", minHeight: 130, borderRadius: 12, border: "1px solid #d1e8dc",
          padding: "14px", fontSize: 14, lineHeight: 1.7, background: "#fff",
          resize: "vertical", color: "#2d3748", boxSizing: "border-box", outline: "none" }} />

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: "12px", background: "#2d6a4f", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer"
        }}>{flash ? "✓ Saved!" : "Save Entry"}</button>
        {mood && (
          <button onClick={getAISuggestion} style={{
            flex: 1, padding: "12px", background: "#e8f5ee", color: "#2d6a4f",
            border: "1px solid #b7dfc9", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer"
          }}>{aiLoading ? "✨ Thinking..." : "✨ AI Reflection"}</button>
        )}
      </div>

      {aiSuggestion && (
        <div style={{ marginTop: 14, background: "#f0faf4", border: "1px solid #b7dfc9", borderRadius: 12, padding: "14px 16px" }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#2d5a3d", fontStyle: "italic" }}>💚 {aiSuggestion}</p>
        </div>
      )}

      {todayEntries.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#74a08a", marginBottom: 10 }}>
            Today's entries ({todayEntries.length})
          </h3>
          {todayEntries.map(e => {
            const m = MOODS.find(x => x.value === e.mood);
            return (
              <div key={e.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #d1e8dc", padding: "12px 14px", marginBottom: 8, display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    {m && <span style={{ fontSize: 18 }}>{m.emoji}</span>}
                    <span style={{ fontSize: 12, color: "#74a08a", fontWeight: 600 }}>{fmt(e.timestamp)}</span>
                  </div>
                  {e.entry && <p style={{ margin: 0, fontSize: 13, color: "#4a5568", lineHeight: 1.6 }}>{e.entry}</p>}
                </div>
                <button onClick={() => onDelete(e.id)} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 16 }}>🗑</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}