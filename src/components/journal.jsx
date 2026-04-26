// src/components/Journal.jsx
// ─────────────────────────────────────────
import { useState } from "react";
import { MOODS, fmt, fmtDate, dateKey } from "../constants";

export default function Journal({ allEntries, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  const grouped = (() => {
    const map = {};
    allEntries.forEach(e => {
      const k = dateKey(e.timestamp);
      if (!map[k]) map[k] = [];
      map[k].push(e);
    });
    return Object.entries(map).sort(([a],[b]) => b.localeCompare(a));
  })();

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2d6a4f", marginBottom: 6 }}>All Entries</h2>
      <p style={{ fontSize: 13, color: "#74a08a", marginBottom: 16 }}>{allEntries.length} total entries saved.</p>
      {grouped.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#74a08a", background: "#fff", borderRadius: 14, border: "1px solid #d1e8dc" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📖</div>
          <p>No entries yet. Start journaling today!</p>
        </div>
      ) : grouped.map(([date, entries]) => (
        <div key={date} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: "#2d6a4f", fontSize: 14 }}>{fmtDate(date + "T12:00:00")}</span>
            <span style={{ fontSize: 12, color: "#74a08a", background: "#f0faf4", borderRadius: 8, padding: "2px 8px" }}>
              {entries.length} {entries.length===1?"entry":"entries"}
            </span>
          </div>
          {entries.map(e => {
            const m = MOODS.find(x => x.value === e.mood);
            const isExp = expandedId === e.id;
            return (
              <div key={e.id} onClick={() => setExpandedId(isExp ? null : e.id)}
                style={{ background: "#fff", borderRadius: 10, border: "1px solid #d1e8dc", padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {m && <span style={{ fontSize: 18 }}>{m.emoji}</span>}
                    <span style={{ fontSize: 12, color: "#74a08a", fontWeight: 600 }}>{fmt(e.timestamp)}</span>
                    {e.type==="prompt" && <span style={{ fontSize: 11, background: "#e8f5ee", color: "#2d6a4f", borderRadius: 6, padding: "2px 7px" }}>prompt</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#b7dfc9" }}>{isExp ? "▲" : "▼"}</span>
                    <button onClick={ev => { ev.stopPropagation(); onDelete(e.id); }}
                      style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 15 }}>🗑</button>
                  </div>
                </div>
                {isExp ? (
                  <div style={{ marginTop: 10, borderTop: "1px solid #f0faf4", paddingTop: 10 }}>
                    {e.prompt && <p style={{ margin: "0 0 6px", fontSize: 12, color: "#74a08a", fontStyle: "italic" }}>"{e.prompt}"</p>}
                    {e.entry ? <p style={{ margin: 0, fontSize: 13, color: "#4a5568", lineHeight: 1.7 }}>{e.entry}</p>
                      : <p style={{ margin: 0, fontSize: 13, color: "#b7dfc9" }}>No text written.</p>}
                  </div>
                ) : e.entry && (
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "#74a08a", lineHeight: 1.5, overflow: "hidden",
                    display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{e.entry}</p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

