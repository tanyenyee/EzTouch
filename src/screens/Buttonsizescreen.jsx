import { useState } from "react";

const sizes = [
  { label: "Small", desc: "Standard size for users with good finger control", fontSize: 15, inputH: 48, btnH: 48 },
  { label: "Medium", desc: "Slightly larger — reduces accidental taps", fontSize: 17, inputH: 56, btnH: 56 },
  { label: "Large", desc: "Maximum size — best for tremors & limited movement", fontSize: 20, inputH: 66, btnH: 66 },
];

export default function ButtonSizeScreen({ onBack, currentSize = "Large", onSave }) {
  const [selected, setSelected] = useState(currentSize);

  const demo = sizes.find(s => s.label === selected);

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Button Size</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 36px" }}>
        {/* OKU benefit note */}
        <div style={{ background: "#FFF3CD", borderRadius: 14, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <p style={{ fontSize: 13, color: "#856404", margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
            Larger buttons reduce misclicks caused by hand tremors or limited finger reach. We recommend <strong>Large</strong> for users with physical impairments.
          </p>
        </div>

        {/* Size options */}
        {sizes.map(size => (
          <button key={size.label} onClick={() => setSelected(size.label)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", marginBottom: 14, padding: "18px 20px",
              borderRadius: 18, border: "none", cursor: "pointer",
              background: selected === size.label ? "#6B3FA0" : "white",
              boxShadow: selected === size.label ? "0 4px 16px rgba(107,63,160,0.35)" : "0 2px 8px rgba(0,0,0,0.07)",
              transition: "all 0.2s",
            }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: size.fontSize, fontWeight: 700, color: selected === size.label ? "white" : "#2D1B69", margin: "0 0 4px", fontFamily: "system-ui, sans-serif" }}>{size.label}</p>
              <p style={{ fontSize: 12, color: selected === size.label ? "rgba(255,255,255,0.8)" : "#888", margin: 0, fontFamily: "system-ui, sans-serif" }}>{size.desc}</p>
            </div>
            {selected === size.label && (
              <div style={{ width: 28, height: 28, borderRadius: 14, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#6B3FA0", fontWeight: 700 }}>✓</div>
            )}
          </button>
        ))}

        {/* Live preview */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px", marginTop: 8, marginBottom: 24, boxShadow: "0 2px 10px rgba(107,63,160,0.08)" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#888", margin: "0 0 14px", fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Live Preview — {selected}</p>
          <input placeholder="Message input field" style={{ width: "100%", height: demo.inputH, borderRadius: 14, border: "2px solid #D0B8F5", padding: "0 16px", fontSize: demo.fontSize, fontFamily: "system-ui, sans-serif", background: "#F5F0FF", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
          <button style={{ width: "100%", height: demo.btnH, borderRadius: 16, background: "#6B3FA0", color: "white", border: "none", fontSize: demo.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", cursor: "pointer" }}>
            Send Message
          </button>
        </div>

        {/* Cancel / Save */}
        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={onBack} style={{ flex: 1, height: 58, borderRadius: 16, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
          <button onClick={() => { onSave && onSave(selected); onBack(); }}
            style={{ flex: 1, height: 58, borderRadius: 16, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>SAVE</button>
        </div>
      </div>
    </div>
  );
}