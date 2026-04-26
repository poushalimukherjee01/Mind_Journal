export const MOODS = [
  { emoji: "😄", label: "Great", value: 5, color: "#6ee7b7" },
  { emoji: "🙂", label: "Good", value: 4, color: "#93c5fd" },
  { emoji: "😐", label: "Okay", value: 3, color: "#fcd34d" },
  { emoji: "😔", label: "Low", value: 2, color: "#fca5a5" },
  { emoji: "😢", label: "Awful", value: 1, color: "#f87171" },
];

export const PROMPTS = [
  "What made you smile today, even if just a little?",
  "What's one thing you'd like to let go of right now?",
  "Describe your energy today in three words.",
  "What's something you're grateful for in this moment?",
  "What's been weighing on your mind lately?",
  "What would make tomorrow feel a little easier?",
  "Write about a moment today when you felt at peace.",
  "What do you need most right now — rest, connection, or movement?",
  "What's one kind thing you can do for yourself today?",
  "If your emotions were weather, what would today's forecast be?",
];

export const PANIC_TIPS = [
  { icon: "🫁", title: "4-7-8 Breathing", desc: "Inhale for 4 seconds, hold for 7, exhale slowly for 8. Repeat 4 times." },
  { icon: "🖐️", title: "5-4-3-2-1 Grounding", desc: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste." },
  { icon: "❄️", title: "Cold Water Technique", desc: "Splash cold water on your face or hold an ice cube. This activates your dive reflex and calms the nervous system." },
  { icon: "💪", title: "Progressive Muscle Relaxation", desc: "Tense each muscle group for 5 seconds, then release. Start from your toes, work upward." },
  { icon: "🧠", title: "Cognitive Defusion", desc: "Say to yourself: 'I notice I am having the thought that I am in danger.' Observe the thought without becoming it." },
  { icon: "🌍", title: "Safe Place Visualization", desc: "Close your eyes. Imagine a place where you feel completely safe. Notice every detail — sounds, smells, warmth." },
];

export const TABS = ["Today", "Prompts", "Tracker", "Journal", "🆘 Panic Help"];

export const fmt = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

export const dateKey = (iso) => iso.split("T")[0];