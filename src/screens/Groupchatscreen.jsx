import { useState, useRef, useEffect } from "react";

const initMessages = [
  { id: 1, text: "Hey everyone!", mine: false, user: "Anna" },
  { id: 2, text: "Hello! 👋", mine: true },
  { id: 3, text: "Welcome to the group!", mine: false, user: "Ravi" },
];

const quickReplies = [
  { label: "I need help", color: "#B0A8D0" },
  { label: "Give me some time", color: "#F5A06A" },
  { label: "Thank you", color: "#E87070" },
  { label: "Emergency Call", color: "#5AABAB" },
];

export default function GroupChatScreen({ group, onBack }) {
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("main"); // main | voiceRecord | voiceConfirm | quickMsg
  const [transcribed, setTranscribed] = useState(""); 
  const [recording, setRecording] = useState(false);
  const [undoId, setUndoId] = useState(null);
  const [pulse, setPulse] = useState(false);

  const name = group?.name || "Pet Lover";
  const avatar = group?.avatar || "🐱";
  const avatarColor = group?.color || "#C8A0E8";

  const sendMessage = (text) => {
    const newMsg = { id: Date.now(), text, mine: true };
    setMessages(prev => [...prev, newMsg]);
    setUndoId(newMsg.id);
    setTimeout(() => setUndoId(null), 10000); // 10 second window
    setMode("main");
    setInput("");
  };

  const undoLastMessage = () => {
    setMessages(prev => prev.filter(m => m.id !== undoId));
    setUndoId(null);
  };

  // 🎙️ REAL VOICE RECOGNITION (Taps into your device microphone)
  const startRealVoiceTracking = () => {
    setTranscribed("");
    setRecording(true);
    setPulse(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("❌ Voice recognition is not supported by this browser. Please use Google Chrome or Microsoft Edge!");
      setRecording(false);
      setPulse(false);
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = 'en-MY'; 
    recog.interimResults = true; 
    recog.continuous = false;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      let currentIdx = event.resultIndex;
      const realSpokenText = event.results[currentIdx][0].transcript;
      setTranscribed(realSpokenText); 
    };

    recog.onerror = (err) => {
      console.error('Speech recognition error:', err.error);
      if (err.error === 'not-allowed') {
        alert("⚠️ Microphone blocked! Please allow mic permissions in your browser bar.");
      }
      setRecording(false);
      setPulse(false);
      setMode("main"); 
    };

    recog.onend = () => {
      setRecording(false);
      setPulse(false);
      
      setTranscribed(prev => {
        if (!prev || prev.trim() === "") {
          alert("Could not catch that clearly. Please try speaking again.");
          setMode("main");
          return "";
        } else {
          setMode("voiceConfirm"); 
          return prev;
        }
      });
    };

    try {
      recog.start();
    } catch (e) {
      console.warn('Recognition system failed to initialize:', e);
      setRecording(false);
      setMode("main");
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button aria-label="Back" onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0", padding: "8px 12px" }}>←</button>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{avatar}</div>
        <span style={{ flex: 1, fontSize: 20, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{name}</span>
      </div>

      {/* Messages Feed Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: msg.mine ? "flex-end" : "flex-start" }}>
            {msg.mine && msg.id === undoId && (
              <button 
                onClick={undoLastMessage} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  fontSize: 16, 
                  fontWeight: "700", 
                  color: "#6B3FA0", 
                  padding: "12px 16px", 
                  fontFamily: "system-ui, sans-serif",
                  textDecoration: "underline"
                }}
              >
                ↩ UNDO
              </button>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: msg.mine ? "flex-end" : "flex-start", maxWidth: "75%" }}>
              {!msg.mine && msg.user && (
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6B3FA0", marginLeft: 4, marginBottom: 2, fontFamily: "system-ui, sans-serif" }}>{msg.user}</span>
              )}
              <div style={{
                background: msg.mine ? "#6B3FA0" : "white",
                color: msg.mine ? "white" : "#2D1B69",
                borderRadius: msg.mine ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                padding: "14px 18px", fontSize: 17, fontFamily: "system-ui, sans-serif", lineHeight: 1.4,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
              }}>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Accessible Action Dashboard */}
      <div style={{ background: "white", padding: "16px 16px 24px", borderTop: "1px solid #E8E0F8", flexShrink: 0 }}>

        {/* Main Interface State */}
        {mode === "main" && (
          <>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#888", textAlign: "center", margin: "0 0 12px", fontFamily: "system-ui, sans-serif", letterSpacing: 1 }}>ACCESSIBLE ACTIONS</p>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              {/* FIXED: Now reliably points to startRealVoiceTracking handler */}
              <button onClick={() => { setMode("voiceRecord"); startRealVoiceTracking(); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "#FFF0E5", border: "2px solid #F5A06A", borderRadius: 24, padding: "18px 12px", cursor: "pointer" }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: "linear-gradient(135deg, #F5A06A, #E87030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🎙️</div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Voice to Text</span>
              </button>
              <button onClick={() => setMode("quickMsg")} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "#FFFBEA", border: "2px solid #F5C030", borderRadius: 24, padding: "18px 12px", cursor: "pointer" }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: "linear-gradient(135deg, #F5C030, #E89010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>💡</div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Taps</span>
              </button>
            </div>
            
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message here..." rows={2}
                style={{ flex: 1, borderRadius: 16, border: "2px solid #D0B8F5", padding: "12px 16px", fontSize: 16, resize: "none", fontFamily: "system-ui, sans-serif", outline: "none", background: "#F9F8FF", color: "#2D1B69" }} 
              />
              <button aria-label="Send message" onClick={() => { if (input.trim()) { setTranscribed(input); setMode("voiceConfirm"); } }}
                style={{ width: 60, height: 60, borderRadius: 30, background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
            </div>
          </>
        )}

        {/* Voice Recording Display Context */}
        {mode === "voiceRecord" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "12px 0" }}>
            <span style={{ fontSize: 16, color: "#6B3FA0", fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>🎙️ Group Voice Processing</span>
            <div style={{
              width: 90, height: 90, borderRadius: 45,
              background: "linear-gradient(135deg, #F5A06A, #E87030)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38,
              boxShadow: pulse ? "0 0 0 16px rgba(245,160,106,0.25)" : "0 6px 20px rgba(245,160,106,0.3)",
              transition: "all 0.3s"
            }}>
              📡
            </div>
            <p style={{ fontSize: 17, color: "#E87030", fontWeight: 700, fontFamily: "system-ui, sans-serif", margin: 0 }}>
              Listening closely...
            </p>
            <div style={{ width: "100%", background: "#F5F0FF", borderRadius: 16, border: "2px dashed #D0B8F5", padding: "14px", fontSize: 16, color: "#2D1B69", fontFamily: "system-ui, sans-serif", minHeight: 50, textAlign: "center" }}>
              {transcribed || "Speak now..."}
            </div>
          </div>
        )}

        {/* Message Safety Confirmation Screen */}
        {mode === "voiceConfirm" && (
          <div style={{ background: "#F0EBFF", borderRadius: 24, padding: 20, border: "3px solid #6B3FA0" }}>
            <p style={{ fontSize: 14, color: "#6B3FA0", fontWeight: 800, margin: "0 0 4px", fontFamily: "system-ui, sans-serif", letterSpacing: 0.5 }}>⚠️ ANTI-ACCIDENTAL PREVIEW</p>
            <p style={{ fontSize: 15, color: "#2D1B69", fontWeight: 500, margin: "0 0 12px", fontFamily: "system-ui, sans-serif" }}>Review or edit your statement below before sending to group:</p>
            
            <textarea
              value={transcribed}
              onChange={(e) => setTranscribed(e.target.value)} 
              rows={3}
              style={{ 
                width: "100%", 
                boxSizing: "border-box",
                background: "white", 
                borderRadius: 16, 
                padding: "14px 18px", 
                fontSize: 18, 
                fontWeight: "bold", 
                color: "#2D1B69", 
                fontFamily: "system-ui, sans-serif", 
                marginBottom: 20, 
                border: "2px solid #D0B8F5", 
                lineHeight: 1.4,
                outline: "none",
                resize: "none" 
              }} 
            />

            <div style={{ display: "flex", gap: 20 }}>
              <button onClick={() => setMode("main")} style={{ flex: 1, height: 56, borderRadius: 16, background: "#E0E0E0", color: "#444", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => sendMessage(transcribed)} style={{ flex: 1, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>SEND TO GROUP</button>
            </div>
          </div>
        )}

        {/* Quick Message Taps Dashboard */}
        {mode === "quickMsg" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button onClick={() => setMode("main")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B3FA0" }}>↩ Back</button>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Dynamic Taps</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quickReplies.map(r => (
                <button key={r.label} onClick={() => sendMessage(r.label)}
                  style={{ width: "100%", height: 56, borderRadius: 28, background: r.color, color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}