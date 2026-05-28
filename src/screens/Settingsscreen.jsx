export default function SettingsScreen({ onBack, onButtonSize, onSafeInteraction, onConfirmation, onUndo }) {
  const items = [
    { label: "Button Size", color: "#E8E0F8", textColor: "#2D1B69", onClick: onButtonSize },
    { label: "Safe Interaction Mode", color: "#F5C8A0", textColor: "#2D1B69", onClick: onSafeInteraction },
    { label: "Confirmation Mode", color: "#F5A8B8", textColor: "#2D1B69", onClick: onConfirmation },
    { label: "Undo Setting", color: "#A8D8E8", textColor: "#2D1B69", onClick: onUndo },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Setting</h1>
      </div>

      <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Helper banner */}
        <div style={{ background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)", borderRadius: 18, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 26 }}>♿</span>
          <p style={{ color: "white", fontSize: 13, margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.4 }}>
            Customise accessibility features to make EzTouch easier and safer for you.
          </p>
        </div>

        {items.map(item => (
          <button key={item.label} onClick={item.onClick}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: item.color, border: "none", borderRadius: 22, padding: "20px 22px", cursor: "pointer", width: "100%", transition: "transform 0.12s" }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
            <span style={{ fontSize: 19, fontWeight: 700, color: item.textColor, fontFamily: "system-ui, sans-serif", textAlign: "left" }}>{item.label}</span>
            <span style={{ fontSize: 22, color: "#6B3FA0", fontWeight: 700 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}