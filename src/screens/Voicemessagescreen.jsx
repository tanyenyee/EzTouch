import { useState, useEffect } from "react";

export default function VoiceMessageScreen({ contact, onBack, onSend }) {
  const [recording, setRecording] = useState(false);
  const [converted, setConverted] = useState("Okay, I'll be there in 10 minutes");
  const [pulse, setPulse] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (recording) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    let pulseTimer;
    if (recording) {
      pulseTimer = setInterval(() => setPulse(p => !p), 500);
    }
    return () => clearInterval(pulseTimer);
  }, [recording]);

  const name = contact?.name || "Boyfriend";
  const avatar = contact?.avatar || "🧍";
  const avatarColor = contact?.color || "#C4A882";

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#F4F0FF",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "white",
        padding: "48px 20px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid #E8E0F8",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", fontSize: 26,
          cursor: "pointer", color: "#6B3FA0", padding: 4,
        }}>←</button>
        <div style={{
          width: 46, height: 46, borderRadius: 23,
          background: avatarColor,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>{avatar}</div>
        <span style={{
          flex: 1, fontSize: 20, fontWeight: 700,
          color: "#2D1B69", fontFamily: "system-ui, sans-serif",
        }}>{name}</span>
      </div>

      {/* Voice Message label */}
      <div style={{
        padding: "20px 20px 0",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontSize: 22, color: "#6B3FA0" }}>↩</span>
        <span style={{
          fontSize: 18, fontWeight: 700, color: "#2D1B69",
          fontFamily: "system-ui, sans-serif",
        }}>Voice Message</span>
      </div>

      {/* Recording area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "0 28px",
      }}>
        {/* Big mic button */}
        <div style={{ position: "relative" }}>
          {recording && (
            <div style={{
              position: "absolute",
              inset: -20,
              borderRadius: "50%",
              background: "rgba(245,160,106,0.2)",
              animation: "ripple 1s ease-out infinite",
            }} />
          )}
          <button
            onClick={() => setRecording(r => !r)}
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              background: recording
                ? `radial-gradient(circle, #F5A06A, #E87030)`
                : `radial-gradient(circle, #F5C09A, #F5A06A)`,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              boxShadow: recording
                ? "0 0 0 8px rgba(245,160,106,0.3)"
                : "0 6px 20px rgba(245,160,106,0.4)",
              transition: "all 0.2s",
              position: "relative",
              zIndex: 1,
            }}
          >
            🎙️
          </button>
        </div>

        {/* Status */}
        <p style={{
          fontSize: 18,
          fontWeight: 600,
          color: recording ? "#E87030" : "#888",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}>
          {recording ? `listening... ${formatTime(seconds)}` : "Tap to start recording"}
        </p>

        {/* Waveform animation */}
        {recording && (
          <div style={{ display: "flex", gap: 5, alignItems: "center", height: 40 }}>
            {[14, 28, 20, 36, 18, 30, 22, 34, 16, 26].map((h, i) => (
              <div key={i} style={{
                width: 5,
                height: pulse ? h : h * 0.5,
                background: "#F5A06A",
                borderRadius: 3,
                transition: `height ${0.2 + i * 0.05}s ease`,
              }} />
            ))}
          </div>
        )}

        {/* Converted text box */}
        <div style={{
          width: "100%",
          background: "white",
          borderRadius: 16,
          border: "2px solid #D0B8F5",
          padding: "14px 16px",
          minHeight: 80,
        }}>
          <p style={{
            fontSize: 13, color: "#888", margin: "0 0 6px",
            fontFamily: "system-ui, sans-serif",
          }}>Converted text:</p>
          <p style={{
            fontSize: 16, color: "#2D1B69", margin: 0,
            fontFamily: "system-ui, sans-serif", lineHeight: 1.5,
          }}>
            {converted}
            {recording && <span style={{
              display: "inline-block",
              width: 2, height: 18,
              background: "#6B3FA0",
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "blink 1s step-end infinite",
            }} />}
          </p>
        </div>

        {/* Send button */}
        <button
          onClick={() => onSend(converted)}
          style={{
            width: "100%",
            height: 60,
            borderRadius: 18,
            background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
            color: "white",
            fontSize: 19,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 6px 20px rgba(107,63,160,0.35)",
          }}
        >
          Send Message
        </button>
      </div>

      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}