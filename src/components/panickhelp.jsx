// src/components/PanicHelp.jsx
// ─────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { PANIC_TIPS } from "../constants";

export default function PanicHelp() {
  const [breathPhase, setBreathPhase] = useState("idle");
  const [breathCount, setBreathCount] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);
  const [panicAI, setPanicAI] = useState("");
  const [panicLoading, setPanicLoading] = useState(false);
  const breathRef = useRef(null);

  const startBreathing = () => { setBreathPhase("inhale"); setBreathTimer(4); setBreathCount(0); };

  useEffect(() => {
    if (breathPhase === "idle" || breathPhase === "done") return;
    breathRef.current = setInterval(() => {
      setBreathTimer(t => {
        if (t > 1) return t - 1;
        setBreathPhase(phase => {
          if (phase === "inhale") { setBreathTimer(7); return "hold"; }
          if (phase === "hold") { setBreathTimer(8); return "exhale"; }
          if (phase === "exhale") {
            setBreathCount(c => {
              if (c + 1 >= 4) { clearInterval(breathRef.current); setBreathPhase("done"); return c+1; }
              setBreathTimer(4); setBreathPhase("inhale"); return c+1;
            });
          }
          return phase;
        });
        return t;
      });
    }, 1000);
    return () => clearInterval(breathRef.current);
  }, [breathPhase]);

  const breathLabel = { inhale:"Inhale...", hold:"Hold...", exhale:"Exhale...", done:"Well done 💚", idle:"" };
  const breathColor = { inhale:"#6ee7b7", hold:"#93c5fd", exhale:"#fca5a5", done:"#6ee7b7", idle:"#e5e7eb" };

  const getAISupport = async () => {
    setPanicLoading(true); setPanicAI("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: "I'm having a panic attack right now. Give me 3 short, immediate, practical things I can do to calm down. Be warm, gentle, and direct. Number them clearly." }]
        })
      });
      const d = await res.json();
      setPanicAI(d.content?.map(c=>c.text||"").join("")||"You are safe. Breathe slowly. 💚");
    } catch { setPanicAI("You are safe. Take a slow breath. Place your feet flat on the floor. 💚"); }
    setPanicLoading(false);
  };

  return (
    <div>
      <div style={{ background:"#fff3f3", border:"1px solid #fca5a5", borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:17, fontWeight:700, color:"#b91c1c" }}>🆘 Panic Attack Support</h2>
        <p style={{ margin:"6px 0 0", fontSize:13, color:"#7f1d1d" }}>You are safe. This feeling will pass.</p>
      </div>

      {/* Breathing */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #d1e8dc", padding:"20px", marginBottom:14, textAlign:"center" }}>
        <h3 style={{ margin:"0 0 4px", color:"#2d6a4f" }}>🫁 4-7-8 Breathing</h3>
        <p style={{ fontSize:13, color:"#74a08a", margin:"0 0 16px" }}>Tap start and follow the guide.</p>
        {breathPhase !== "idle" ? (
          <div>
            <div style={{ width:120, height:120, borderRadius:"50%", margin:"0 auto 14px",
              background:breathColor[breathPhase]+"33", border:`4px solid ${breathColor[breathPhase]}`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              transition:"transform 0.5s", transform:breathPhase==="inhale"?"scale(1.15)":breathPhase==="exhale"?"scale(0.9)":"scale(1)" }}>
              <span style={{ fontSize:28, fontWeight:700 }}>{breathPhase!=="done"?breathTimer:"✓"}</span>
              <span style={{ fontSize:12, color:"#74a08a" }}>{breathLabel[breathPhase]}</span>
            </div>
            {breathPhase!=="done" && <p style={{ color:"#74a08a", fontSize:13 }}>Cycle {Math.min(breathCount+1,4)} of 4</p>}
            {breathPhase==="done" && (
              <button onClick={()=>{setBreathPhase("idle");setBreathCount(0);}}
                style={{ background:"#2d6a4f", color:"#fff", border:"none", borderRadius:8, padding:"10px 24px", fontSize:14, cursor:"pointer" }}>Done 💚</button>
            )}
          </div>
        ) : (
          <button onClick={startBreathing} style={{ background:"#2d6a4f", color:"#fff", border:"none", borderRadius:10, padding:"12px 32px", fontSize:15, fontWeight:600, cursor:"pointer" }}>
            Start Breathing
          </button>
        )}
      </div>

      {/* AI Support */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #d1e8dc", padding:"16px 18px", marginBottom:14 }}>
        <h3 style={{ margin:"0 0 4px", color:"#2d6a4f", fontSize:15 }}>✨ AI Calm Suggestion</h3>
        <p style={{ fontSize:13, color:"#74a08a", margin:"0 0 12px" }}>Get a personalized calming message right now.</p>
        <button onClick={getAISupport} style={{ background:"#e8f5ee", color:"#2d6a4f", border:"1px solid #b7dfc9", borderRadius:8, padding:"10px 20px", fontSize:14, fontWeight:600, cursor:"pointer" }}>
          {panicLoading ? "✨ Getting help..." : "✨ Get AI Support"}
        </button>
        {panicAI && (
          <div style={{ marginTop:14, background:"#f0faf4", borderRadius:10, padding:"12px 14px" }}>
            <p style={{ margin:0, fontSize:13, lineHeight:1.8, color:"#2d5a3d", whiteSpace:"pre-wrap" }}>{panicAI}</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <h3 style={{ fontSize:15, fontWeight:700, color:"#2d6a4f", marginBottom:10 }}>Quick Techniques</h3>
      {PANIC_TIPS.map((tip,i) => (
        <div key={i} style={{ background:"#fff", borderRadius:12, border:"1px solid #d1e8dc", padding:"14px 16px", marginBottom:10 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{tip.icon}</span>
            <div>
              <p style={{ margin:"0 0 4px", fontWeight:700, fontSize:14, color:"#2d3748" }}>{tip.title}</p>
              <p style={{ margin:0, fontSize:13, color:"#5a7a6a", lineHeight:1.6 }}>{tip.desc}</p>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop:14, background:"#fff3f3", borderRadius:12, padding:"14px 16px", border:"1px solid #fca5a5" }}>
        <p style={{ margin:0, fontSize:13, color:"#7f1d1d", lineHeight:1.6 }}>
          🆘 If you feel in immediate danger, call <strong>iCall: 9152987821</strong> (India) or local emergency services.
        </p>
      </div>
    </div>
  );
}