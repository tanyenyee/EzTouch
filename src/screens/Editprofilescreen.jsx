import { useState } from "react";

export default function EditProfileScreen({ onBack, onSaved }) {
  const [form, setForm] = useState({ username: "Username", email: "user@example.com", phone: "+123 456 7890", bio: "" });
  const [focused, setFocused] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const update = key => e => setForm({ ...form, [key]: e.target.value });

  const fieldStyle = (name) => ({
    width: "100%", height: 54, borderRadius: 14,
    border: `2px solid ${focused === name ? "#7B4CC8" : "#D0B8F5"}`,
    padding: "0 16px", fontSize: 16, background: "#F5F0FF",
    color: "#2D1B69", outline: "none", boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif", marginBottom: 20,
  });

  const labelStyle = {
    fontSize: 15, fontWeight: 700, color: "#6B3FA0",
    marginBottom: 6, fontFamily: "system-ui, sans-serif", display: "block",
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Edit Profile</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 36px" }}>
        <label style={labelStyle}>Username</label>
        <input value={form.username} onChange={update("username")} onFocus={() => setFocused("username")} onBlur={() => setFocused("")} style={fieldStyle("username")} />

        <label style={labelStyle}>Email</label>
        <input value={form.email} onChange={update("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused("")} style={fieldStyle("email")} type="email" />

        <label style={labelStyle}>Phone</label>
        <input value={form.phone} onChange={update("phone")} onFocus={() => setFocused("phone")} onBlur={() => setFocused("")} style={fieldStyle("phone")} type="tel" />

        <label style={labelStyle}>Bio</label>
        <textarea value={form.bio} onChange={update("bio")} placeholder="Write about yourself..." onFocus={() => setFocused("bio")} onBlur={() => setFocused("")}
          style={{ ...fieldStyle("bio"), height: 100, padding: "12px 16px", resize: "none", lineHeight: 1.4 }} />

        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <button onClick={() => setShowSuccess(true)}
            style={{ flex: 1, height: 58, borderRadius: 16, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>
            Save
          </button>
          <button onClick={onBack}
            style={{ flex: 1, height: 58, borderRadius: 16, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>
            Cancel
          </button>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "80%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#2D1B69", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>Profile updated successfully!</p>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 24, fontFamily: "system-ui, sans-serif" }}>Your changes have been saved.</p>
            <button onClick={() => { setShowSuccess(false); onSaved && onSaved(); }}
              style={{ width: "100%", height: 52, borderRadius: 14, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif", marginBottom: 10 }}>
              OK
            </button>
            <button onClick={() => setShowSuccess(false)}
              style={{ width: "100%", height: 52, borderRadius: 14, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>
              UNDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}