import { useState, useRef, useEffect } from "react";

const mockMessages = [
  { id: 1, text: "Hey! Are you free today?", mine: false },
  { id: 2, text: "Yes, what's up?", mine: true },
  { id: 3, text: "Want to grab lunch?", mine: false },
];

const quickReplies = [
  { label: "I need help", color: "#B0A8D0" },
  { label: "Give me some time", color: "#F5A06A" },
  { label: "Thank you", color: "#E87070" },
  { label: "Emergency Call", color: "#5AABAB" },
];

export default function ChatScreen({ contact, onBack, onCall, onAddContact }) {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("main"); // main | voiceRecord | voiceConfirm | quickMsg | callConfirm
  const [transcribed, setTranscribed] = useState("Okay, I'll be there in 10 minutes");
  const [recording, setRecording] = useState(false);
  const [undoMsg, setUndoMsg] = useState(null);
  const [pulse, setPulse] = useState(false);

  const name = contact?.name || "Boyfriend";
  const avatar = contact?.avatar || "🧍";
  const avatarColor = contact?.color || "#C4A882";

  const sendMessage = (text) => {
    const newMsg = { id: Date.now(), text, mine: true, undo: true };
    setMessages(prev => [...prev, newMsg]);
    setUndoMsg(newMsg.id);
    setTimeout(() => setUndoMsg(null), 30000);
    setMode("main");
    setInput("");
  };

  const undoLastMessage = () => {
    setMessages(prev => prev.filter(m => m.id !== undoMsg));
    setUndoMsg(null);
  };

  // Speech recognition (Web Speech API) integration with graceful fallback
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // fallback to simulated short recording
      setRecording(true);
      const iv = setInterval(() => setPulse(p => !p), 500);
      setTimeout(() => {
        clearInterval(iv);
        setRecording(false);
        setMode("voiceConfirm");
      }, 2000);
      return;
    }

    // create recognition instance
    const recog = new SpeechRecognition();
    recognitionRef.current = recog;
    recog.lang = navigator.language || 'en-US';
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    let interim = '';
    setTranscribed('');
    setRecording(true);
    setPulse(true);

    recog.onresult = (event) => {
      let finalTranscript = '';
      interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) finalTranscript += res[0].transcript;
        else interim += res[0].transcript;
      }
      setTranscribed((prev) => (finalTranscript || interim) || prev);
    };

    recog.onerror = (err) => {
      console.warn('Speech recognition error', err);
      setRecording(false);
      setPulse(false);
      // fallback to confirm view
      setMode('voiceConfirm');
    };

    recog.onend = () => {
      setRecording(false);
      setPulse(false);
      // move to confirm when recognition ends
      setMode('voiceConfirm');
    };

    try {
      recog.start();
    } catch (e) {
      console.warn('Recognition start failed', e);
      setRecording(false);
      setMode('voiceConfirm');
    }
  };

  const stopRecording = () => {
    const recog = recognitionRef.current;
    if (recog && recog.stop) {
      try { recog.stop(); } catch (e) { /* ignore */ }
    }
    setRecording(false);
    setPulse(false);
    setMode('voiceConfirm');
  };

  const yesCallRef = useRef(null);

  useEffect(() => {
    if (mode === "callConfirm" && yesCallRef.current) {
      yesCallRef.current.focus();
    }
  }, [mode]);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button aria-label="Back" onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0", padding: 4 }}>←</button>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{avatar}</div>
        <span style={{ flex: 1, fontSize: 20, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{name}</span>
        <button aria-label="Call contact" onClick={() => setMode("callConfirm")} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>📞</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: msg.mine ? "flex-end" : "flex-start" }}>
            {msg.mine && msg.id === undoMsg && (
              <button onClick={undoLastMessage} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#6B3FA0" }}>↩</button>
            )}
            <div style={{
              maxWidth: "72%", background: msg.mine ? "#6B3FA0" : "#E0D8F8",
              color: msg.mine ? "white" : "#2D1B69",
              borderRadius: msg.mine ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              padding: "12px 16px", fontSize: 16, fontFamily: "system-ui, sans-serif", lineHeight: 1.4,
            }}>{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Bottom action area */}
      <div style={{ background: "white", padding: "12px 16px 16px", borderTop: "1px solid #E8E0F8", flexShrink: 0 }}>

        {/* Main action buttons */}
        {mode === "main" && (
          <>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#888", textAlign: "center", margin: "0 0 10px", fontFamily: "system-ui, sans-serif", letterSpacing: 1 }}>Action</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <button onClick={() => { setMode("voiceRecord"); startRecording(); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#FDE8D8", border: "none", borderRadius: 18, padding: "14px 8px", cursor: "pointer" }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg, #F5A06A, #E87030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎙️</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Voice Message</span>
              </button>
              <button onClick={() => setMode("quickMsg")} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#FDE8D8", border: "none", borderRadius: 18, padding: "14px 8px", cursor: "pointer" }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg, #F5C030, #E89010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💡</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Message</span>
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) { setTranscribed(input); setMode("voiceConfirm"); }
                  }
                  if (e.key === "Escape") {
                    setInput("");
                    setMode("main");
                  }
                }}
                aria-label="Message input"
                placeholder="Type a message..." rows={2}
                style={{ flex: 1, borderRadius: 14, border: "2px solid #D0B8F5", padding: "10px 14px", fontSize: 15, resize: "none", fontFamily: "system-ui, sans-serif", outline: "none", background: "#F5F0FF", color: "#2D1B69" }} />
              <button aria-label="Send message" onClick={() => { if (input.trim()) { setTranscribed(input); setMode("voiceConfirm"); } }}
                style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
            </div>
          </>
        )}

        {/* Voice recording */}
        {mode === "voiceRecord" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <span style={{ fontSize: 14, color: "#6B3FA0", fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>↩ Voice Message</span>
            <button onClick={() => { if (recording) stopRecording(); else startRecording(); }} style={{ width: 80, height: 80, borderRadius: 40, background: "linear-gradient(135deg, #F5A06A, #E87030)", border: "none", cursor: "pointer", fontSize: 36, boxShadow: recording ? "0 0 0 12px rgba(245,160,106,0.2)" : "0 6px 20px rgba(245,160,106,0.4)" }}>{recording ? '🔴' : '🎙️'}</button>
            <p style={{ fontSize: 15, color: "#E87030", fontWeight: 600, fontFamily: "system-ui, sans-serif", margin: 0 }}>{recording ? 'listening...' : 'Tap to start recording'}</p>
            <div style={{ width: "100%", background: "#F5F0FF", borderRadius: 12, border: "1px solid #D0B8F5", padding: "10px 14px", fontSize: 15, color: "#2D1B69", fontFamily: "system-ui, sans-serif", minHeight: 44 }}>{transcribed}</div>
          </div>
        )}

        {/* Voice confirm overlay */}
        {mode === "voiceConfirm" && (
          <div style={{ background: "#F0EBFF", borderRadius: 18, padding: 16, border: "2px solid #C4A8F0" }}>
            <p style={{ fontSize: 13, color: "#6B3FA0", fontWeight: 700, margin: "0 0 4px", fontFamily: "system-ui, sans-serif" }}>text successfully transcribed</p>
            <p style={{ fontSize: 13, color: "#2D1B69", fontWeight: 700, margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Message Preview:</p>
            <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", fontSize: 15, color: "#2D1B69", fontFamily: "system-ui, sans-serif", marginBottom: 14, minHeight: 56, border: "1px solid #D0B8F5" }}>{transcribed}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setMode("main")} style={{ flex: 1, height: 48, borderRadius: 12, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => sendMessage(transcribed)} style={{ flex: 1, height: 48, borderRadius: 12, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>SEND</button>
            </div>
          </div>
        )}

        {/* Quick message panel */}
        {mode === "quickMsg" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22, color: "#6B3FA0" }}>↩</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Message</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quickReplies.map(r => (
                <button key={r.label} onClick={() => sendMessage(r.label)}
                  style={{ width: "100%", height: 52, borderRadius: 26, background: r.color, color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call confirmation modal */}
      {mode === "callConfirm" && (
        <div role="dialog" aria-modal="true" aria-label={`Call ${name} confirmation`} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "80%", textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#2D1B69", marginBottom: 20, fontFamily: "system-ui, sans-serif" }}>Call {name}?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button aria-label="Cancel call" onClick={() => setMode("main")} style={{ flex: 1, height: 52, borderRadius: 14, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button aria-label="Confirm call" ref={yesCallRef} onClick={() => onCall(contact)} style={{ flex: 1, height: 52, borderRadius: 14, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>YES</button>
            </div>
          </div>
        </div>
      )}

      {/* toast removed per user request */}
    </div>
  );
}
