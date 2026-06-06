import { useState, useRef } from "react";
import { FaArrowLeft, FaShieldAlt, FaComments, FaHeart, FaPhoneAlt, FaCheck, FaFlask } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";
import { useToast } from "../components/ToastProvider";

function Toggle({ value, onChange }) {
  return (
    <button 
      onClick={() => onChange(!value)}
      style={{ width: 52, height: 28, borderRadius: 14, background: value ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.25s" }}
    >
      <div style={{ position: "absolute", top: 3, left: value ? 26 : 3, width: 22, height: 22, borderRadius: 11, background: "white", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: value ? 6 : "auto", right: value ? "auto" : 6, fontSize: 9, fontWeight: 700, color: "white", fontFamily: "system-ui, sans-serif" }}>{value ? "ON" : "OFF"}</span>
    </button>
  );
}

export default function ConfirmationModeScreen({ onBack }) {
  // Unified context extraction into a single statement
  const {
    sz,
    confirmationMode,
    setConfirmationMode,
    confirmSendMessage,
    setConfirmSendMessage,
    confirmCalls,
    setConfirmCalls,
    confirmationType,
    setConfirmationType,
    confirmLikes,
    setConfirmLikes,  
  } = useSizeContext();
  const [master, setMaster] = useState(true);
  const [actions, setActions] = useState({ sendMsg: true, likeComment: false, makeCalls: true });
  const [confirmType, setConfirmType] = useState("Popup Confirmation");
  const [showDemo, setShowDemo] = useState(false);
  const { addToast } = useToast();

  const demoHoldTimer = useRef(null);
  const tapResetTimer = useRef(null);
  const demoTapRef = useRef(0);

  const types = [
    { label: "Popup Confirmation", color:"#F4B183", desc: "A popup asks you to confirm before any action executes." },
    { label: "Hold-to-confirm", color: "#F6C6D3", desc: "Hold the button down for 1.5 seconds to confirm." },
    { label: "Double-tap-confirm", color: "#A9D4E4", desc: "Tap the button twice to confirm the action." },
  ];

  const handleDemoConfirm = () => {
    // POPUP CONFIRMATION
    if (confirmationType === "Popup Confirmation") {
      alert("✅ Action confirmed!");
      setShowDemo(false);
      return;
    }

    // DOUBLE TAP CONFIRM (Fix: Cleaned up code blocks)
    if (confirmationType === "Double-tap-confirm") {
      demoTapRef.current += 1;

      if (demoTapRef.current === 2) {
        alert("✅ Double tap confirmed!");
        setShowDemo(false);
        demoTapRef.current = 0;
        if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
        return;
      }

      if (tapResetTimer.current) {
        clearTimeout(tapResetTimer.current);
      }

      tapResetTimer.current = setTimeout(() => {
        demoTapRef.current = 0;
      }, 500);
    }
  };

  const handleDemoHoldStart = (e) => {
    if (confirmationType !== "Hold-to-confirm") return;
    
    // Clear any residual timer before starting a new one
    if (demoHoldTimer.current) clearTimeout(demoHoldTimer.current);

    demoHoldTimer.current = setTimeout(() => {
      alert("✅ Hold confirmed!");
      setShowDemo(false);
    }, 1500);
  };

  const handleDemoHoldEnd = () => {
    if (demoHoldTimer.current) {
      clearTimeout(demoHoldTimer.current);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}><FaArrowLeft style={{ color: "currentColor" }} /></button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Confirmation Mode</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 36px" }}>
        {/* OKU benefit */}
        <div style={{ background: "#FFF3CD", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#6B3FA0" }}><FaShieldAlt style={{ color: "currentColor" }} /></span>
          <p style={{ fontSize: 13, color: "#856404", margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
            Confirmation Mode prevents social embarrassment by asking you to verify before sending messages, making calls, or liking posts — protecting against accidental actions.
          </p>
        </div>

        {/* Master */}
        <div style={{ background: "white", borderRadius: 18, padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(107,63,160,0.1)" }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", margin: "0 0 3px", fontFamily: "system-ui, sans-serif" }}>Confirmation mode</p>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "system-ui, sans-serif" }}>Ask before executing sensitive actions</p>
          </div>
          <Toggle value={confirmationMode} onChange={setConfirmationMode} />
        </div>

        {confirmationMode && (
          <>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>List of actions covered by confirmation:</p>

            {[
              { key: "sendMsg", label: "Sending Message", color: "#F4B183", icon: <FaComments style={{ color: "currentColor" }} /> },
              { key: "likeComment", label: "Liking/Commenting Posts", color: "#F6C6D3", icon: <FaHeart style={{ color: "currentColor" }} /> },
              { key: "makeCalls", label: "Making Calls", color: "#A9D4E4", icon: <FaPhoneAlt style={{ color: "currentColor" }} /> },
            ].map(item => (
              <div key={item.key} style={{ background: item.color, borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20, color: "#6B3FA0" }}>{item.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{item.label}</span>
                </div>
                <Toggle
                  value={
                    item.key === "sendMsg"
                      ? confirmSendMessage
                      : item.key === "makeCalls"
                      ? confirmCalls
                      : item.key === "likeComment"
                      ? confirmLikes
                      : false
                  }
                  onChange={
                    item.key === "sendMsg"
                      ? setConfirmSendMessage
                      : item.key === "makeCalls"
                      ? setConfirmCalls
                      : item.key === "likeComment"
                      ? setConfirmLikes
                      : () => {}
                  }
                />
              </div>
            ))}

            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "16px 0 10px", fontFamily: "system-ui, sans-serif" }}>Confirmation Type:</p>
            {types.map(t => (
              <button key={t.label} onClick={() => setConfirmationType(t.label)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: t.color, border: "none", borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#2D1B69", margin: "0 0 3px", fontFamily: "system-ui, sans-serif" }}>{t.label}</p>
                  {confirmationType === t.label && <p style={{ fontSize: 12, color: "#5A3A8A", margin: 0, fontFamily: "system-ui, sans-serif" }}>{t.desc}</p>}
                </div>
                {confirmationType === t.label && <span style={{ fontSize: 22, color: "#6B3FA0" }}><FaCheck style={{ color: "currentColor" }} /></span>}
              </button>
            ))}

            {/* Try it demo */}
            <button onClick={() => { demoTapRef.current = 0; setShowDemo(true); }}
              style={{ width: "100%", height: sz?.height || 48, borderRadius: sz?.borderRadius || 8, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif", marginTop: 8, boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>
              <FaFlask style={{ color: "currentColor", marginRight: 8 }} /> Try Confirmation Demo
            </button>
          </>
        )}
      </div>

      {/* Demo modal */}
      {showDemo && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "82%", textAlign: "center" }}>
            <span style={{ fontSize: 36, color: "#6B3FA0" }}><FaPhoneAlt style={{ color: "currentColor" }} /></span>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#2D1B69", margin: "12px 0 8px", fontFamily: "system-ui, sans-serif" }}>Call Mummy?</p>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 24, fontFamily: "system-ui, sans-serif" }}>
              {confirmationType === "Popup Confirmation" && "Confirm before placing this call."}
              {confirmationType === "Hold-to-confirm" && "Hold YES for 1.5 seconds to confirm."}
              {confirmationType === "Double-tap-confirm" && "Tap YES twice to confirm the call."}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowDemo(false)} style={{ flex: 1, height: sz?.height || 48, borderRadius: sz?.borderRadius || 8, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button
                onClick={confirmationType !== "Hold-to-confirm" ? handleDemoConfirm : undefined}
                onMouseDown={handleDemoHoldStart}
                onMouseUp={handleDemoHoldEnd}
                onMouseLeave={handleDemoHoldEnd}
                onTouchStart={handleDemoHoldStart}
                onTouchEnd={handleDemoHoldEnd} 
                style={{ flex: 1, height: sz?.height || 48, borderRadius: sz?.borderRadius || 8, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: sz?.fontSize || 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                <FaCheck style={{ color: "currentColor", marginRight: 8 }} />YES
              </button>
              <button onClick={() => setShowDemo(false)} style={{ flex: 1, height: 52, borderRadius: 14, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => { addToast("Action confirmed!", "success"); setShowDemo(false); }} style={{ flex: 1, height: 52, borderRadius: 14, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}><FaCheck style={{ color: "currentColor", marginRight: 8 }} />YES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}