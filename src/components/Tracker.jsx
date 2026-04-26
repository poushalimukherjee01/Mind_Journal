// src/components/Tracker.jsx
// ─────────────────────────────────────────
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MOODS, dateKey } from "../constants";

export default function Tracker({ allEntries }) {
  const chartData = (() => {
    const byDay = {};
    allEntries.filter(e => e.mood).forEach(e => {
      const k = dateKey(e.timestamp);
      if (!byDay[k]) byDay[k] = [];
      byDay[k].push(e.mood);
    });
    return Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).slice(-14).map(([date, moods]) => ({
      date: date.slice(5),
      mood: +(moods.reduce((a,b) => a+b, 0) / moods.length).toFixed(1)
    }));
  })();

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#2d6a4f", marginBottom: 6 }}>Mood Over Time</h2>
      <p style={{ fontSize: 13, color: "#74a08a", marginBottom: 16 }}>Daily average mood — last 14 days.</p>
      {chartData.length < 2 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#74a08a", background: "#fff", borderRadius: 14, border: "1px solid #d1e8dc" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📈</div>
          <p>Log your mood for a few days to see your chart.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 10px", border: "1px solid #d1e8dc" }}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ed" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#74a08a" }} />
              <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} tickFormatter={v => MOODS.find(m=>m.value===v)?.emoji||v} tick={{ fontSize: 14 }} width={30} />
              <Tooltip formatter={(v) => [MOODS.find(m=>m.value===Math.round(v))?.label||v, "Avg Mood"]} />
              <Line type="monotone" dataKey="mood" stroke="#2d6a4f" strokeWidth={2.5} dot={{ r:5, fill:"#6ee7b7", stroke:"#2d6a4f" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        {MOODS.map(m => (
          <span key={m.value} style={{ background: "#fff", border: "1px solid #d1e8dc", borderRadius: 8, padding: "6px 12px", fontSize: 13 }}>
            {m.emoji} {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}