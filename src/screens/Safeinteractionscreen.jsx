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

function SettingRow({ label, value, onChange, color = "#F0EBFF", desc }) {
  return (
    <div style={{ background: color, borderRadius: 14, padding: "12px 16px", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#2D1B69", fontFamily: "system-ui, sans-serif", flex: 1 }}>{label}</span>
        <Toggle value={value} onChange={onChange} />
      </div>
      {desc && value && <p style={{ fontSize: 12, color: "#5A3A8A", margin: "6px 0 0", fontFamily: "system-ui, sans-serif", lineHeight: 1.4 }}>{desc}</p>}
    </div>
  );
}

function RadioRow({ label, selected, onSelect, color }) {
  return (
    <button onClick={onSelect}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: color, border: "none", borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{label}</span>
      {selected && <span style={{ fontSize: 20, color: "#6B3FA0" }}>☑</span>}
    </button>
  );
}

export default function SafeInteractionScreen({ onBack }) {
  const [master, setMaster] = useState(true);
  const [features, setFeatures] = useState({ disableOneTap: true, longPress: false, preventRapid: true, touchDelay: true });
  const [style, setStyle] = useState("Normal Touch");

  const toggle = key => val => setFeatures(f => ({ ...f, [key]: val }));

  const styles = [
    { label: "Normal Touch", color: "#F0EBFF" },
    { label: "Long Press", color: "#FFE8D8" },
    { label: "Double Press", color: "#D8F5E8" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Safe Interaction Mode</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 36px" }}>

        {/* OKU benefit */}
        <div style={{ background: "#FFF3CD", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🤚</span>
          <p style={{ fontSize: 13, color: "#856404", margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
            Safe Interaction Mode prevents accidental taps caused by hand tremors or involuntary movements. Enable long press or double press to avoid unwanted actions.
          </p>
        </div>

        {/* Master toggle */}
        <div style={{ background: "white", borderRadius: 18, padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(107,63,160,0.1)" }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", margin: "0 0 3px", fontFamily: "system-ui, sans-serif" }}>Safe Interaction mode</p>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "system-ui, sans-serif" }}>Master switch for all protection features</p>
          </div>
          <Toggle value={master} onChange={setMaster} />
        </div>

        {master && (
          <>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Protection Features:</p>
            <SettingRow label="Disabled One-Tap Reaction" value={features.disableOneTap} onChange={toggle("disableOneTap")} color="#E8E0F8"
              desc="Prevents reacting to posts with a single tap — requires hold or double tap instead." />
            <SettingRow label="Require Long Press for Reactions" value={features.longPress} onChange={toggle("longPress")} color="#FFE8D8"
              desc="You must hold down for 1 second before a reaction is registered." />
            <SettingRow label="Prevent Rapid Multiple Taps" value={features.preventRapid} onChange={toggle("preventRapid")} color="#E8E0F8"
              desc="Ignores repeated taps within 0.5 seconds — stops double-send accidents." />
            <SettingRow label="Touch Delay Protection" value={features.touchDelay} onChange={toggle("touchDelay")} color="#D8F5E8"
              desc="Adds a short delay before any action registers, giving you time to lift your finger." />

            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1B69", margin: "16px 0 10px", fontFamily: "system-ui, sans-serif" }}>Interaction Style:</p>
            {styles.map(s => (
              <RadioRow key={s.label} label={s.label} selected={style === s.label} onSelect={() => setStyle(s.label)} color={s.color} />
            ))}

            {/* Demo box */}
            <div style={{ background: "white", borderRadius: 18, padding: 18, marginTop: 8, boxShadow: "0 2px 10px rgba(107,63,160,0.08)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#6B3FA0", margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>🧪 Currently active: {style}</p>
              <p style={{ fontSize: 12, color: "#555", margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
                {style === "Normal Touch" && "Standard tap interaction. Accidental taps may still occur."}
                {style === "Long Press" && "Hold for 1 second to confirm any action. Best for severe tremors."}
                {style === "Double Press" && "Tap twice to confirm. Prevents single accidental touches."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}