import { useState } from "react";

const initMessages = [
  { id: 1, text: "Hey everyone!", mine: false, user: "Anna" },
  { id: 2, text: "Hello! 👋", mine: true },
  { id: 3, text: "Welcome to the group!", mine: false, user: "Ravi" },
];

export default function GroupChatScreen({ group, onBack }) {
  const [messages, setMessages] = useState(initMessages);
  const [mode, setMode] = useState("main");
  const [transcribed, setTranscribed] = useState("I love kitten");
  const [recording, setRecording] = useState(false);
  const [undoId, setUndoId] = useState(null);

  const name = group?.name || "Pet Lover";
  const avatar = group?.avatar || "🐱";
  const avatarColor = group?.color || "#C8A0E8";

  const sendMessage = (text) => {
    const newMsg = { id: Date.now(), text, mine: true };
    setMessages(prev => [...prev, newMsg]);
    setUndoId(newMsg.id);
    setTimeout(() => setUndoId(null), 30000);
    setMode("main");
  };

  const startRecord = () => {
    setRecording(true);
    setTimeout(() => { setRecording(false); setMode("voiceConfirm"); }, 2000);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{avatar}</div>
        <span style={{ flex: 1, fontSize: 20, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{name}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: msg.mine ? "flex-end" : "flex-start" }}>
            {msg.mine && msg.id === undoId && (
              <button onClick={() => { setMessages(p => p.filter(m => m.id !== undoId)); setUndoId(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#6B3FA0" }}>↩</button>
            )}
            <div style={{ maxWidth: "72%", background: msg.mine ? "#6B3FA0" : "#E0D8F8", color: msg.mine ? "white" : "#2D1B69", borderRadius: msg.mine ? "20px 20px 4px 20px" : "20px 20px 20px 4px", padding: "12px 16px", fontSize: 16, fontFamily: "system-ui, sans-serif" }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom panel */}
      <div style={{ background: "white", padding: "12px 16px 16px", borderTop: "1px solid #E8E0F8", flexShrink: 0 }}>
        {mode === "main" && (
          <>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#888", textAlign: "center", margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Action</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setMode("voiceRecord"); startRecord(); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#FDE8D8", border: "none", borderRadius: 18, padding: "12px 8px", cursor: "pointer" }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg, #F5A06A, #E87030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎙️</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Voice Message</span>
              </button>
              <button style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#FDE8D8", border: "none", borderRadius: 18, padding: "12px 8px", cursor: "pointer" }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg, #F5C030, #E89010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💡</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Message</span>
              </button>
            </div>
          </>
        )}

        {mode === "voiceRecord" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: "#6B3FA0", fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>↩ Voice Message</span>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: "linear-gradient(135deg, #F5A06A, #E87030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 0 0 14px rgba(245,160,106,0.2)" }}>🎙️</div>
            <p style={{ fontSize: 14, color: "#E87030", fontWeight: 600, margin: 0, fontFamily: "system-ui, sans-serif" }}>listening...</p>
            <div style={{ width: "100%", background: "#F5F0FF", borderRadius: 12, border: "1px solid #D0B8F5", padding: "10px 14px", fontSize: 15, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{transcribed}</div>
          </div>
        )}

        {mode === "voiceConfirm" && (
          <div style={{ background: "#F0EBFF", borderRadius: 18, padding: 16, border: "2px solid #C4A8F0" }}>
            <p style={{ fontSize: 13, color: "#6B3FA0", fontWeight: 700, margin: "0 0 4px", fontFamily: "system-ui, sans-serif" }}>text successfully transcribed</p>
            <p style={{ fontSize: 13, color: "#2D1B69", fontWeight: 700, margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Message Preview:</p>
            <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", fontSize: 15, color: "#2D1B69", fontFamily: "system-ui, sans-serif", marginBottom: 14, border: "1px solid #D0B8F5" }}>{transcribed}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setMode("main")} style={{ flex: 1, height: 46, borderRadius: 12, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => sendMessage(transcribed)} style={{ flex: 1, height: 46, borderRadius: 12, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>SEND</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}