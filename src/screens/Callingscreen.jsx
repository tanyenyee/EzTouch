import { useSizeContext } from "../context/SizeContext";

export default function CallingScreen({ contact, onCancel }) {
  const { sz } = useSizeContext();
  const name = contact?.name || "Boyfriend";
  const avatar = contact?.avatar || "🧍";
  const avatarColor = contact?.color || "#C4A882";

  return (
    <div style={{ width: "100%", height: "100%", background: "#F9F9F9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <p style={{ fontSize: 22, fontWeight: 600, color: "#555", fontFamily: "system-ui, sans-serif", margin: 0 }}>Waiting for answer...</p>

      {/* Avatar */}
      <div style={{ width: 160, height: 160, borderRadius: 80, background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, boxShadow: "0 0 0 12px rgba(107,63,160,0.1)" }}>
        {avatar}
      </div>

      <p style={{ fontSize: 28, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif", margin: 0 }}>{name}</p>

      {/* Cancel button */}
      <button onClick={onCancel} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ border: "3px solid #E83030", borderRadius: sz.borderRadius, padding: "14px 32px" }}>
          <span style={{ fontSize: sz.fontSize, fontWeight: 700, color: "#E83030", fontFamily: "system-ui, sans-serif", letterSpacing: 2 }}>CANCEL</span>
        </div>
        <div style={{ width: 64, height: 64, borderRadius: 32, border: "3px solid #E83030", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✕</div>
      </button>
    </div>
  );
}