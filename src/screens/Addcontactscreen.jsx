import { useState } from "react";

export default function AddContactScreen({ onBack, onAdded }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState("");

  const inputStyle = (field) => ({
    width: "100%", height: 58, borderRadius: 14,
    border: `2px solid ${focused === field ? "#7B4CC8" : "#D0B8F5"}`,
    padding: "0 18px", fontSize: 17, background: "#F5F0FF",
    color: "#2D1B69", outline: "none", boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif",
  });

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Add Contact</h1>
      </div>

      <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Avatar placeholder */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 90, height: 90, borderRadius: 45, background: "#D0C0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👤</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, background: "#6B3FA0", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700 }}>+</div>
          </div>
        </div>

        {/* Name field */}
        <label style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Name</label>
        <input type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)}
          onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
          style={{ ...inputStyle("name"), marginBottom: 24 }} />

        {/* Phone field */}
        <label style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Phone Number</label>
        <input type="tel" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)}
          onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
          style={{ ...inputStyle("phone"), marginBottom: 36 }} />

        {/* Add Contact button */}
        <button onClick={() => { if (name && phone) setShowConfirm(true); else alert("Please fill in all fields."); }}
          style={{ width: "100%", height: 62, borderRadius: 18, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14, boxShadow: "0 6px 20px rgba(107,63,160,0.3)" }}>
          <span style={{ fontSize: 22 }}>🧑‍🤝‍🧑</span> Add Contact
        </button>

        {/* Cancel button */}
        <button onClick={onBack}
          style={{ width: "100%", height: 62, borderRadius: 18, background: "white", color: "#6B3FA0", border: "2px solid #D0B8F5", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>
          Cancel
        </button>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "80%", textAlign: "center" }}>
            <p style={{ fontSize: 19, fontWeight: 700, color: "#2D1B69", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Add new contact</p>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24, fontFamily: "system-ui, sans-serif" }}>Add <strong>{name}</strong> to your contacts?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, height: 52, borderRadius: 14, background: "#888", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => { setShowConfirm(false); onAdded && onAdded(); }} style={{ flex: 1, height: 52, borderRadius: 14, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>YES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}