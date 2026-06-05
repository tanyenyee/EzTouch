import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaUndo, FaComments, FaTrash, FaHeart, FaUsers, FaCheck, FaFlask } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";

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
  { label: "10 Seconds", value: 10, color: "#F4B183", desc: "Quick undo — best for fast typists" },
  { label: "30 Seconds", value: 30, color: "#F6C6D3", desc: "Standard window — recommended" },
  { label: "60 Seconds", value: 60, color: "#A9D4E4", desc: "Extended window — best for hand impairments" },
];

export default function UndoSettingScreen({ onBack }) {
  // Use defensive fallback sizes if sz context is missing attributes
  const { sz } = useSizeContext();
  const btnHeight = sz?.height || 48;
  const btnRadius = sz?.borderRadius || 8;
  const btnFontSize = sz?.fontSize || 16;

  const {

undoOn,
setUndoOn,

undoSendMessage,
setUndoSendMessage,

undoDeleteMessage,
setUndoDeleteMessage,

undoLikeComment,
setUndoLikeComment,

undoGroupJoin,
setUndoGroupJoin,

undoDuration,
setUndoDuration,

} = useSizeContext();

  
  // Demo interactive states
  const [demoMsg, setDemoMsg] = useState(null);
  const [undid, setUndid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCommitted, setIsCommitted] = useState(false);

  // References to handle timers cleanly without memory leaks
  const countdownInterval = useRef(null);
  const expirationTimeout = useRef(null);

  

  // Helper to parse string durations into raw numeric seconds
  const getSecondsValue = () => {
   const found =
durations.find(
d => d.label === undoDuration
);

    return found ? found.value : 10;
  };

  // Clean up any running animations/timers when moving away or resetting
  const clearAllTimers = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (expirationTimeout.current) clearTimeout(expirationTimeout.current);
  };

  useEffect(() => {
    return () => clearAllTimers(); // Lifecycle cleanup
  }, []);

  const tryDemo = () => {
    clearAllTimers();
    
    const maxSeconds = getSecondsValue();
    setDemoMsg("Hey! See you at 3pm 👋");
    setUndid(false);
    setIsCommitted(false);
    setTimeLeft(maxSeconds);

    // 1. Core Expiration Timeout: When time runs out, finalize the send
    expirationTimeout.current = setTimeout(() => {
      setIsCommitted(true);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    }, maxSeconds * 1000);

    // 2. UI Countdown Interval: Updates the ticker text every single second
    countdownInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUndoAction = () => {
    clearAllTimers();
    setUndid(true);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}><FaArrowLeft style={{ color: "currentColor" }} /></button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Undo Setting</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 36px" }}>

        {/* OKU benefit */}
        <div style={{ background: "#FFF3CD", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#6B3FA0" }}><FaUndo style={{ color: "currentColor" }} /></span>
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
          <Toggle value={undoOn} onChange={(val) => { setUndoOn(val); clearAllTimers(); setDemoMsg(null); }} />
        </div>

        {undoOn && (
          <>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Enable Undo For:</p>

            {[
              { key: "sendMsg", label: "Sending Message", color: "#F4B183", icon: <FaComments style={{ color: "currentColor" }} /> },
              { key: "deletedMsg", label: "Deleted Messages", color: "#F6C6D3", icon: <FaTrash style={{ color: "currentColor" }} /> },
              { key: "likeComment", label: "Liking/Commenting Posts", color: "#A9D4E4", icon: <FaHeart style={{ color: "currentColor" }} /> },
              { key: "groupJoin", label: "Group Join Request", color: "#F4B183", icon: <FaUsers style={{ color: "currentColor" }} /> },
            ].map(item => (
              <div key={item.key} style={{ background: item.color, borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20, color: "#6B3FA0" }}>{item.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{item.label}</span>
                </div>
               <Toggle

value={
item.key === "sendMsg"
? undoSendMessage
: item.key === "deletedMsg"
? undoDeleteMessage
: item.key === "likeComment"
? undoLikeComment
: undoGroupJoin
}

onChange={
item.key === "sendMsg"
? setUndoSendMessage
: item.key === "deletedMsg"
? setUndoDeleteMessage
: item.key === "likeComment"
? setUndoLikeComment
: setUndoGroupJoin
}
/>

              </div>
            ))}

            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "16px 0 10px", fontFamily: "system-ui, sans-serif" }}>Undo Duration:</p>
            {durations.map(d => (
              <button key={d.label} onClick={() => { setUndoDuration(d.label); clearAllTimers(); setDemoMsg(null); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: d.color, border: "none", borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", margin: "0 0 2px", fontFamily: "system-ui, sans-serif" }}>{d.label}</p>
                  {undoDuration === d.label && <p style={{ fontSize: 12, color: "#5A3A8A", margin: 0, fontFamily: "system-ui, sans-serif" }}>{d.desc}</p>}
                </div>
                {undoDuration === d.label && <span style={{ fontSize: 22, color: "#6B3FA0" }}><FaCheck style={{ color: "currentColor" }} /></span>}
              </button>
            ))}

            {/* Live demo panel */}
            <div style={{ background: "white", borderRadius: 18, padding: "18px", marginTop: 8, boxShadow: "0 2px 10px rgba(107,63,160,0.08)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#6B3FA0", margin: "0 0 12px", fontFamily: "system-ui, sans-serif" }}>
                <FaFlask style={{ color: "currentColor", marginRight: 8 }} />Try Undo Demo ({undoDuration})
              </p>

              {/* State 1: Ready to test */}
              {!demoMsg && (
                <button onClick={tryDemo}
                  style={{ width: "100%", height: btnHeight, borderRadius: btnRadius, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: btnFontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>
                  Simulate Accidental Send
                </button>
              )}

              {/* State 2: Message Sent & Countdown Ticking */}
              {demoMsg && !undid && !isCommitted && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end", marginBottom: 10 }}>
                    <button 
                      onClick={handleUndoAction} 
                      style={{ background: "#F0EBFF", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#6B3FA0", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
                      title="Undo Action"
                    >
                      <FaUndo />
                    </button>
                    <div style={{ background: "#6B3FA0", color: "white", borderRadius: "20px 20px 4px 20px", padding: "12px 16px", fontSize: 15, fontFamily: "system-ui, sans-serif" }}>{demoMsg}</div>
                  </div>
                  <p style={{ fontSize: 13, color: "#E87030", textAlign: "center", fontFamily: "system-ui, sans-serif", margin: 0, fontWeight: 600 }}>
                    <FaUndo style={{ marginRight: 6 }} /> Tap undo button! Window closes in: {timeLeft}s
                  </p>
                </div>
              )}

              {/* State 3: User successfully clicked Undo */}
              {demoMsg && undid && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <span style={{ fontSize: 32, color: "#4CAF50" }}><FaCheck style={{ color: "currentColor" }} /></span>
                  <p style={{ fontSize: 15, color: "#4CAF50", fontWeight: 700, margin: "8px 0 0", fontFamily: "system-ui, sans-serif" }}>Message undone successfully!</p>
                  <button onClick={() => setDemoMsg(null)} style={{ marginTop: 12, height: btnHeight, padding: "0 24px", borderRadius: btnRadius, background: "#F0EBFF", color: "#6B3FA0", border: "none", cursor: "pointer", fontSize: btnFontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>Try Again</button>
                </div>
              )}

              {/* State 4: Time expired without undoing (Message Committed) */}
              {demoMsg && isCommitted && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                    <div style={{ background: "#888", color: "white", borderRadius: "20px 20px 4px 20px", padding: "12px 16px", fontSize: 15, fontFamily: "system-ui, sans-serif", opacity: 0.6 }}>{demoMsg}</div>
                  </div>
                  <p style={{ fontSize: 14, color: "#D9534F", fontWeight: 700, margin: "0 0 4px", fontFamily: "system-ui, sans-serif" }}>❌ Undo window expired.</p>
                  <p style={{ fontSize: 12, color: "#777", margin: "0 0 12px", fontFamily: "system-ui, sans-serif" }}>The message has been permanently transmitted.</p>
                  <button onClick={() => setDemoMsg(null)} style={{ height: btnHeight, padding: "0 24px", borderRadius: btnRadius, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: btnFontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>Reset Demo</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}