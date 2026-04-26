import { useState, useEffect } from "react";
import { TABS } from "./constants";
import Today from "./components/Today";
import Prompts from "./components/prompts";
import Tracker from "./components/Tracker";
import Journal from "./components/journal";
import PanicHelp from "./components/PanicHelp";

export default function App() {
  const [tab, setTab] = useState(0);
  const [allEntries, setAllEntries] = useState([]);

  // Load persisted entries on mount
  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem("mhj-all-entries");
        if (raw) setAllEntries(JSON.parse(raw));
      } catch {}
    };
    load();
  }, []);

  const persist = (updated) => {
    setAllEntries(updated);
    localStorage.setItem("mhj-all-entries", JSON.stringify(updated));
  };

  const handleSave = (data) => {
    const newEntry = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...data };
    persist([newEntry, ...allEntries]);
  };

  const handleDelete = (id) => persist(allEntries.filter(e => e.id !== id));

  const tabComponents = [
    <Today allEntries={allEntries} onSave={handleSave} onDelete={handleDelete} />,
    <Prompts onSave={handleSave} />,
    <Tracker allEntries={allEntries} />,
    <Journal allEntries={allEntries} onDelete={handleDelete} />,
    <PanicHelp />,
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf9", fontFamily: "'Segoe UI', sans-serif", color: "#2d3748" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0ed", padding: "18px 24px 0" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#2d6a4f" }}>🌿 My Journal</h1>
          <p style={{ margin: "2px 0 14px", fontSize: 13, color: "#74a08a" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
            {" · "}{allEntries.length} {allEntries.length === 1 ? "entry" : "entries"} saved
          </p>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 1 }}>
            {TABS.map((t, i) => (
              <button key={i} onClick={() => setTab(i)} style={{
                background: tab === i ? "#2d6a4f" : "transparent",
                color: tab === i ? "#fff" : "#74a08a",
                border: "none", borderRadius: "8px 8px 0 0", padding: "8px 14px",
                fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px" }}>
        {tabComponents[tab]}
      </div>
    </div>
  );
}