import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaUndo } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";
import SafeButton from "../components/SafeButton";
import { FaArrowLeft } from "react-icons/fa";
import ReactiveKeyboard from "./ReactiveKeyboard";
import { useToast } from "../components/ToastProvider";

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
  const { sz, confirmationType } = useSizeContext();
  
  // ==========================================
  // EXTRACT GLOBAL UNDO PREFERENCES FROM CONTEXT
  // ==========================================
  const { 
    undoOn = true, 
    undoDuration = "10 Seconds", 
    undoSendMessage = true
  } = useSizeContext();

  console.log("Current confirmation:", confirmationType);

  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("main"); // main | voiceRecord | voiceConfirm | quickMsg | callConfirm
  const [transcribed, setTranscribed] = useState(""); 
  const [recording, setRecording] = useState(false);
  const [pulse, setPulse] = useState(false);
  
  // Tracking states for live counting down visible to the user
  const [undoMsgId, setUndoMsgId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const { addToast } = useToast();

  // References to anchor timers firmly without re-render memory leaks
  const undoTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Helper converting user context setting strings to pure numerical seconds
  const getUndoDelaySeconds = () => {
    if (undoDuration === "30 Seconds") return 30;
    if (undoDuration === "60 Seconds") return 60;
    return 10; // Default fallback
  };

  // FIX 3: Clear timers and strip out references completely to avoid stale memory footprints
  const clearActiveTimers = () => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // Component unmount fallback protection
  useEffect(() => {
    return () => clearActiveTimers();
  }, []);

  const sendMessage = (text) => {
    if (!text || text.trim() === "") return;

    const newMsgId = Date.now();
    const newMsg = { id: newMsgId, text, mine: true };
    const isUndoProtected = undoOn && undoSendMessage;

    setMessages((prev) => [...prev, newMsg]);
    setMode("main");
    setInput("");

    if (isUndoProtected) {
      clearActiveTimers();

      const initialSeconds = getUndoDelaySeconds();
      setUndoMsgId(newMsgId);
      setSecondsLeft(initialSeconds);

      // 1. Live Countdown Loop Updating UI Every Second
      countdownIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Final Transmission Expiration Timer
      // FIX 1: Securely reset the seconds state alongside the message tracker when time expires
      undoTimeoutRef.current = setTimeout(() => {
        setUndoMsgId(null);
        setSecondsLeft(0);
      }, initialSeconds * 1000);
    }
    setShowKeyboard(false);
  };

  // FIX 4: Explicitly reset visual countdown numbers upon cancellation execution
  const undoLastMessage = () => {
    clearActiveTimers();
    setMessages((prev) => prev.filter((m) => m.id !== undoMsgId));
    setUndoMsgId(null);
    setSecondsLeft(0);
  };

  // 🎙️ REAL VOICE RECOGNITION
  const startRecordingSimulation = () => {
    setTranscribed("");
    setRecording(true);
    setPulse(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      addToast("Voice recognition is not supported by this browser. Please use Google Chrome or Microsoft Edge!", "error");
      setRecording(false);
      setPulse(false);
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-MY"; 
    recog.interimResults = false; 
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      const realSpokenText = event.results[0][0].transcript;
      setTranscribed(realSpokenText);
    };

    recog.onerror = (err) => {
      console.error("Speech recognition error:", err.error);
      console.error('Speech recognition error:', err.error);
      
      if (err.error === 'not-allowed') {
        addToast("Microphone blocked! Please click the camera/mic icon in your browser address bar and choose 'Allow'.", "error");
      } else if (err.error === 'no-speech') {
        addToast("No speech detected. Please try holding the device closer and speaking clearly.", "warning");
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
          addToast("Could not catch that clearly. Please try speaking again.", "warning");
          setMode("main");
          return "";
        } else {
          setMode("voiceConfirm"); 
          return prev;
        }
      });
    };

    try { recog.start(); } catch (e) { setRecording(false); setMode("main"); }
  };

  const name = contact?.name || "Boyfriend";
  const avatar = contact?.avatar || "🧍";
  const avatarColor = contact?.color || "#C4A882";

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} aria-label="Back" style={{ background: "none", border: "none", cursor: "pointer", color: "#6B3FA0", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FaArrowLeft size={28} />
        </button>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{avatar}</div>
        <span style={{ flex: 1, fontSize: 20, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{name}</span>
        <button aria-label="Call contact" onClick={() => setMode("callConfirm")} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0", padding: "8px 12px" }}>📞</button>
      </div>

      {/* Messages Feed Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.mine ? "flex-end" : "flex-start", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: msg.mine ? "flex-end" : "flex-start", width: "100%" }}>
              <div style={{
                maxWidth: "75%", background: msg.mine ? "#6B3FA0" : "white",
                color: msg.mine ? "white" : "#2D1B69",
                borderRadius: msg.mine ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                padding: "14px 18px", fontSize: 17, fontFamily: "system-ui, sans-serif", lineHeight: 1.4,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
              }}>
                {msg.text}
              </div>
            </div>

            {/* Live Interactive Countdown Undo Banner */}
            {msg.mine && msg.id === undoMsgId && (
              /* FIX 2: Enhanced interaction accessibility mapping for assistive technology layers */
              <button 
                aria-label="Undo sent message"
                onClick={undoLastMessage} 
                style={{ 
                  background: "#FFF0F5", 
                  border: "1px dashed #E87070", 
                  borderRadius: 12,
                  cursor: "pointer", 
                  fontSize: 13, 
                  fontWeight: "700", 
                  color: "#E87070", 
                  padding: "6px 14px", 
                  marginTop: 2,
                  fontFamily: "system-ui, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 5px rgba(232,112,112,0.1)"
                }}
              >
                <FaUndo size={11} style={{ transform: "scaleX(-1)" }} /> 
                UNDO SEND ({secondsLeft}s left)
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Dashboard */}
      <div style={{ background: "white", padding: "16px 16px 24px", borderTop: "1px solid #E8E0F8", flexShrink: 0 }}>

        {/* Main Interface State */}
        {mode === "main" && (
          <>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#888", textAlign: "center", margin: "0 0 12px", fontFamily: "system-ui, sans-serif", letterSpacing: 1 }}>ACCESSIBLE ACTIONS</p>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <button onClick={() => { setMode("voiceRecord"); startRecordingSimulation(); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "#FFF0E5", border: "2px solid #F5A06A", borderRadius: sz?.borderRadius || 16, padding: sz?.settingPadding || "12px", cursor: "pointer" }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: "linear-gradient(135deg, #F5A06A, #E87030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🎙️</div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Speech to Text</span>
              </button>
              <button onClick={() => setMode("quickMsg")} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "#FFFBEA", border: "2px solid #F5C030", borderRadius: sz?.borderRadius || 16, padding: sz?.settingPadding || "12px", cursor: "pointer" }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: "linear-gradient(135deg, #F5C030, #E89010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>💡</div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Taps</span>
              </button>
            </div>
            
            
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message here..." rows={2}

                readOnly

                onFocus={() => setShowKeyboard(true)}
                style={{ flex: 1, borderRadius: 16, border: "2px solid #D0B8F5", padding: "12px 16px", fontSize: 16, resize: "none", fontFamily: "system-ui, sans-serif", outline: "none", background: "#F9F8FF", color: "#2D1B69", cursor:"pointer"}} 
              />
              <SafeButton
                confirmationFor="message"
                aria-label="Send message"
                onClick={() => {
                  if (input.trim()) {
                    setTranscribed(input);
                    setMode("voiceConfirm");
                  }
                }}
                style={{
                  width: 60, height: 60, borderRadius: 30,
                  background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
                  color: "white", border: "none", cursor: "pointer", fontSize: 22,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                ➤
              </SafeButton>
            </div>
          </>
        )}

        {/* Voice Recording View */}
        {mode === "voiceRecord" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "12px 0" }}>
            <span style={{ fontSize: 16, color: "#6B3FA0", fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>🎙️ Speech To Text</span>
            <div style={{
              width: 90, height: 90, borderRadius: 45,
              background: "linear-gradient(135deg, #F5A06A, #E87030)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38,
              boxShadow: pulse ? "0 0 0 16px rgba(245,160,106,0.25)" : "0 6px 20px rgba(245,160,106,0.3)",
              transition: "all 0.3s"
            }}>
              {recording ? "📡" : "✨"}
            </div>
            <p style={{ fontSize: 17, color: "#E87030", fontWeight: 700, fontFamily: "system-ui, sans-serif", margin: 0 }}>
              {recording ? 'Listening ..' : isTyping ? 'Converting Speech to Text...' : 'Ready'}
            </p>
            <div style={{ width: "100%", background: "#F5F0FF", borderRadius: 16, border: "2px dashed #D0B8F5", padding: "14px", fontSize: 16, color: "#2D1B69", fontFamily: "system-ui, sans-serif", minHeight: 50, textAlign: "center" }}>
              {transcribed || "Transcribing..."}
            </div>
          </div>
        )}

        {/* Anti-Accidental Preview Screen */}
        {mode === "voiceConfirm" && (
          <div style={{ background: "#F0EBFF", borderRadius: 24, padding: 20, border: "3px solid #6B3FA0" }}>
            <p style={{ fontSize: 14, color: "#6B3FA0", fontWeight: 800, margin: "0 0 4px", fontFamily: "system-ui, sans-serif", letterSpacing: 0.5 }}>⚠️ ANTI-ACCIDENTAL PREVIEW</p>
            <p style={{ fontSize: 15, color: "#2D1B69", fontWeight: 500, margin: "0 0 12px", fontFamily: "system-ui, sans-serif" }}>Review or edit your statement below before sending:</p>
            <textarea
              value={transcribed}
              onChange={(e) => setTranscribed(e.target.value)} 
              rows={3}
              style={{ 
                width: "100%", boxSizing: "border-box", background: "white", borderRadius: 16, padding: "14px 18px", 
                fontSize: 18, fontWeight: "bold", color: "#2D1B69", fontFamily: "system-ui, sans-serif", 
                marginBottom: 20, border: "2px solid #D0B8F5", lineHeight: 1.4, outline: "none", resize: "none" 
              }} 
            />
            <div style={{ display: "flex", gap: 20 }}>
              <button onClick={() => setMode("main")} style={{ flex: 1, height: sz?.height || 48, borderRadius: sz?.borderRadius || 16, background: "#E0E0E0", color: "#444", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <SafeButton confirmationFor="message" onClick={() => sendMessage(transcribed)} style={{ flex: 1, height: sz?.height || 48, borderRadius: sz?.borderRadius || 16, background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>SEND MESSAGE</SafeButton>
              <button onClick={() => setMode("main")} style={{ flex: 1, height: 56, borderRadius: 16, background: "#E0E0E0", color: "#444", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => sendMessage(transcribed)} style={{ flex: 1, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>SEND</button>
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
                <SafeButton key={r.label} confirmationFor="message" onClick={() => sendMessage(r.label)}
                  style={{ width: "100%", height: sz?.height || 48, borderRadius: 28, background: r.color, color: "white", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
                  {r.label}
                </SafeButton>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call Confirmation Overlay Modal */}
      {mode === "callConfirm" && (
        <div role="dialog" aria-modal="true" style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 32, padding: "32px 24px", width: "100%", maxWidth: 340, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📞</div>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#2D1B69", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Confirm Call?</p>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24, fontFamily: "system-ui, sans-serif" }}>Call '{name}'?</p>
            <div style={{ display: "flex", gap: 16 }}>
              <SafeButton onClick={() => setMode("main")} style={{ flex: 1, height: sz?.height || 48, borderRadius: sz?.borderRadius || 16, background: "#F5F5F5", color: "#666", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>NO</SafeButton>
              <SafeButton confirmationFor="call" onClick={() => { setMode("main"); onCall(contact); }} style={{ flex: 1, height: sz?.height || 48, borderRadius: sz?.borderRadius || 16, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 6px 20px rgba(107,63,160,0.3)" }}>YES</SafeButton>
            </div>
          </div>
        </div>
      )}

      {mode === "main" && showKeyboard &&(
        <ReactiveKeyboard 
          value={input} 
          onChange={setInput} 
          onSubmit={() => sendMessage(input)} 
        />
      )}
    </div>
  );
}