export default function PostPreviewScreen({ postText, onBack, onPost }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Create Post</h1>
      </div>

      <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}>Post Preview</h2>

        {/* Preview card */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(107,63,160,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: "#D0C0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👤</div>
            <div style={{ flex: 1, height: 14, background: "#D0B8F5", borderRadius: 7 }} />
          </div>
          <div style={{ background: "#6B3FA0", borderRadius: 14, minHeight: 100, padding: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "white", fontSize: 16, fontFamily: "system-ui, sans-serif", margin: 0, textAlign: "center" }}>{postText || "I love Interactive Design !"}</p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={onBack} style={{ flex: 1, height: 60, borderRadius: 18, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
          <button onClick={() => onPost && onPost()} style={{ flex: 1, height: 60, borderRadius: 18, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 6px 20px rgba(107,63,160,0.3)" }}>POST</button>
        </div>
      </div>
    </div>
  );
}