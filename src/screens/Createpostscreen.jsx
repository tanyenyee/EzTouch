import { useState } from "react";

export default function CreatePostScreen({ onBack, onNext }) {
  const [text, setText] = useState("I love Interactive Design !");
  const [recording, setRecording] = useState(false);
  const [pulse, setPulse] = useState(false);

  const toggleRecord = () => {
    if (!recording) {
      setRecording(true);
      let iv = setInterval(() => setPulse(p => !p), 500);
      setTimeout(() => { clearInterval(iv); setRecording(false); }, 2500);
    } else {
      setRecording(false);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Create Post</h1>
      </div>

      <div style={{ flex: 1, padding: "24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Text area */}
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind?"
          style={{ width: "100%", minHeight: 100, borderRadius: 16, border: "2px solid #D0B8F5", padding: "14px 16px", fontSize: 16, resize: "none", fontFamily: "system-ui, sans-serif", outline: "none", background: "#F5F0FF", color: "#2D1B69", boxSizing: "border-box" }} />

        {/* Add image */}
        <button style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}>
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Add Image</span>
        </button>

        {/* Voice section */}
        <div style={{ background: "white", borderRadius: 20, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}>Voice Message</p>
          <button onClick={toggleRecord} style={{
            width: 72, height: 72, borderRadius: 36,
            background: "linear-gradient(135deg, #F5A06A, #E87030)",
            border: "none", cursor: "pointer", fontSize: 32,
            boxShadow: recording ? "0 0 0 14px rgba(245,160,106,0.25)" : "0 4px 16px rgba(245,160,106,0.4)",
            transition: "box-shadow 0.3s",
          }}>🎙️</button>
          <p style={{ fontSize: 14, color: recording ? "#E87030" : "#888", fontWeight: 600, margin: 0, fontFamily: "system-ui, sans-serif" }}>
            {recording ? "listening..." : "Tap to record"}
          </p>
        </div>

        {/* Converted text */}
        <div style={{ background: "#F5F0FF", borderRadius: 16, border: "2px solid #D0B8F5", padding: "12px 16px", fontSize: 15, color: "#2D1B69", fontFamily: "system-ui, sans-serif", minHeight: 52 }}>
          {text}
        </div>

        {/* Next button */}
        <button onClick={() => onNext && onNext(text)}
          style={{ width: "100%", height: 60, borderRadius: 18, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 19, fontWeight: 700, fontFamily: "system-ui, sans-serif", marginTop: "auto", boxShadow: "0 6px 20px rgba(107,63,160,0.3)" }}>
          NEXT
        </button>
      </div>
    </div>
  );
}