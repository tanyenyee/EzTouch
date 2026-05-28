import { useState } from "react";

const categories = ["All", "Pets", "Health", "Daily Life", "More"];

const groups = [
  { id: 1, name: "Pet Lover Community", icon: "🐾", desc: "Share stories and tips about pets.", members: "1.2k", color: "#F5A06A" },
  { id: 2, name: "Daily Motivation", icon: "☀️", desc: "Encourage and inspire each other.", members: "980", color: "#F5C030" },
  { id: 3, name: "Health & Wellness", icon: "💚", desc: "Talk about healthy living together.", members: "1.5k", color: "#5AABAB" },
];

export default function JoinGroupScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [confirmGroup, setConfirmGroup] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(null);

  const filtered = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  const handleJoin = () => {
    setJoinedGroup(confirmGroup);
    setConfirmGroup(null);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Join Group</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 36px" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 18 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search groups..."
            style={{ width: "100%", height: 50, borderRadius: 25, border: "2px solid #D0B8F5", padding: "0 48px 0 20px", fontSize: 16, background: "white", outline: "none", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }} />
          <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20 }}>🔍</span>
        </div>

        {/* Categories */}
        <p style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Categories</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{ height: 36, padding: "0 16px", borderRadius: 18, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif", background: activeCategory === c ? "#6B3FA0" : "#E8E0F8", color: activeCategory === c ? "white" : "#2D1B69", transition: "all 0.2s" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Group list */}
        {filtered.map(group => (
          <button key={group.id} onClick={() => setConfirmGroup(group)}
            style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", background: "white", border: "none", borderRadius: 16, padding: "14px 16px", marginBottom: 12, cursor: "pointer", textAlign: "left", boxShadow: "0 2px 8px rgba(107,63,160,0.08)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: group.color + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{group.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", margin: "0 0 3px", fontFamily: "system-ui, sans-serif" }}>{group.name}</p>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 3px", fontFamily: "system-ui, sans-serif" }}>{group.desc}</p>
              <p style={{ fontSize: 13, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>{group.members} members</p>
            </div>
          </button>
        ))}
      </div>

      {/* Join confirmation modal */}
      {confirmGroup && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 28, padding: "36px 28px", width: "85%", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: confirmGroup.color + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>{confirmGroup.icon}</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#2D1B69", marginBottom: 10, fontFamily: "system-ui, sans-serif" }}>Join {confirmGroup.name}?</p>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 28, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>You will be able to read messages and participate in discussions.</p>
            <button onClick={handleJoin} style={{ width: "100%", height: 58, borderRadius: 18, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif", marginBottom: 12, boxShadow: "0 4px 16px rgba(107,63,160,0.3)" }}>Yes, Join</button>
            <button onClick={() => setConfirmGroup(null)} style={{ width: "100%", height: 58, borderRadius: 18, background: "white", color: "#2D1B69", border: "2px solid #D0B8F5", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* You've joined popup */}
      {joinedGroup && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "78%", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: "#E8E0F8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>↩</div>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: "#D4F5D4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✅</div>
            </div>
            <p style={{ fontSize: 19, fontWeight: 700, color: "#2D1B69", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>You've joined!</p>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 20, fontFamily: "system-ui, sans-serif" }}>Welcome to {joinedGroup.name}</p>
            <button onClick={() => setJoinedGroup(null)} style={{ width: "100%", height: 52, borderRadius: 14, background: "#6B3FA0", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}