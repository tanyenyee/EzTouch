import { useState } from "react";

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: 52, height: 28, borderRadius: 14, background: value ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.25s" }}>
      <div style={{ position: "absolute", top: 3, left: value ? 26 : 3, width: 22, height: 22, borderRadius: 11, background: "white", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: value ? 6 : "auto", right: value ? "auto" : 6, fontSize: 9, fontWeight: 700, color: "white", fontFamily: "system-ui, sans-serif" }}>{value ? "ON" : "OFF"}</span>
    </button>
  );
}

const durations = [
  { label: "10 Seconds", color: "#FFE8D0", desc: "Quick undo — best for fast typists" },
  { label: "30 Seconds", color: "#FFD0E0", desc: "Standard window — recommended" },
  { label: "60 Seconds", color: "#D0E8FF", desc: "Extended window — best for hand impairments" },
];

export default function UndoSettingScreen({ onBack }) {
  const [undoOn, setUndoOn] = useState(true);
  const [enableFor, setEnableFor] = useState({ sendMsg: true, deletedMsg: false, likeComment: true, groupJoin: true });
  const [duration, setDuration] = useState("60 Seconds");
  const [demoMsg, setDemoMsg] = useState(null);
  const [undid, setUndid] = useState(false);

  const toggle = key => val => setEnableFor(e => ({ ...e, [key]: val }));

  const tryDemo = () => {
    setDemoMsg("Hey! See you at 3pm 👋");
    setUndid(false);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Undo Setting</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 36px" }}>

        {/* OKU benefit */}
        <div style={{ background: "#FFF3CD", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 20 }}>↩</span>
          <p style={{ fontSize: 13, color: "#856404", margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
            Undo lets you quickly cancel an accidental message or action within a set time window — especially helpful when hand tremors cause unexpected sends.
          </p>
        </div>

        {/* Master Undo toggle */}
        <div style={{ background: "white", borderRadius: 18, padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(107,63,160,0.1)" }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", margin: "0 0 3px", fontFamily: "system-ui, sans-serif" }}>Undo Feature</p>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "system-ui, sans-serif" }}>Allow undoing recent actions</p>
          </div>
          <Toggle value={undoOn} onChange={setUndoOn} />
        </div>

        {undoOn && (
          <>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Enable Undo For:</p>

            {[
              { key: "sendMsg", label: "Sending Message", color: "#E8E0F8", icon: "💬" },
              { key: "deletedMsg", label: "Deleted Messages", color: "#FFE0E8", icon: "🗑️" },
              { key: "likeComment", label: "Liking/Commenting Posts", color: "#D8F5E8", icon: "❤️" },
              { key: "groupJoin", label: "Group Join Request", color: "#E0F0FF", icon: "👥" },
            ].map(item => (
              <div key={item.key} style={{ background: item.color, borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{item.label}</span>
                </div>
                <Toggle value={enableFor[item.key]} onChange={toggle(item.key)} />
              </div>
            ))}

            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "16px 0 10px", fontFamily: "system-ui, sans-serif" }}>Undo Duration:</p>
            {durations.map(d => (
              <button key={d.label} onClick={() => setDuration(d.label)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: d.color, border: "none", borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", margin: "0 0 2px", fontFamily: "system-ui, sans-serif" }}>{d.label}</p>
                  {duration === d.label && <p style={{ fontSize: 12, color: "#5A3A8A", margin: 0, fontFamily: "system-ui, sans-serif" }}>{d.desc}</p>}
                </div>
                {duration === d.label && <span style={{ fontSize: 22, color: "#6B3FA0" }}>☑</span>}
              </button>
            ))}

            {/* Live demo */}
            <div style={{ background: "white", borderRadius: 18, padding: "18px", marginTop: 8, boxShadow: "0 2px 10px rgba(107,63,160,0.08)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#6B3FA0", margin: "0 0 12px", fontFamily: "system-ui, sans-serif" }}>🧪 Try Undo Demo ({duration})</p>

              {!demoMsg && (
                <button onClick={tryDemo}
                  style={{ width: "100%", height: 52, borderRadius: 14, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>
                  Simulate Accidental Send
                </button>
              )}

              {demoMsg && !undid && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", marginBottom: 10 }}>
                    <button onClick={() => setUndid(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: "#6B3FA0" }}>↩</button>
                    <div style={{ background: "#6B3FA0", color: "white", borderRadius: "20px 20px 4px 20px", padding: "12px 16px", fontSize: 15, fontFamily: "system-ui, sans-serif" }}>{demoMsg}</div>
                  </div>
                  <p style={{ fontSize: 13, color: "#E87030", textAlign: "center", fontFamily: "system-ui, sans-serif", margin: 0 }}>
                    ↩ Tap the arrow to undo within {duration}
                  </p>
                </div>
              )}

              {demoMsg && undid && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <span style={{ fontSize: 32 }}>✅</span>
                  <p style={{ fontSize: 15, color: "#4CAF50", fontWeight: 700, margin: "8px 0 0", fontFamily: "system-ui, sans-serif" }}>Message undone successfully!</p>
                  <button onClick={() => setDemoMsg(null)} style={{ marginTop: 12, height: 44, padding: "0 24px", borderRadius: 12, background: "#F0EBFF", color: "#6B3FA0", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>Try Again</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}