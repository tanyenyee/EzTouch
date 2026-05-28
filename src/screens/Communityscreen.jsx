import { useState } from "react";

const posts = [
  { id: 1, user: "Anna", avatar: "👩", color: "#E8A0A0", text: "Had a great day with my therapy session!", likes: 12, comments: 3 },
  { id: 2, user: "Ravi", avatar: "👨", color: "#A0C8E8", text: "Anyone else use voice typing? It changed my life!", likes: 28, comments: 7, hasBg: true },
];

const myGroups = [
  { id: 1, name: "Pet Lovers", avatar: "🐱", color: "#C8A0E8", unread: 67 },
  { id: 2, name: "University Malaya", avatar: "🎓", color: "#E8C0A0", unread: 20 },
  { id: 3, name: "Helping each other", avatar: "🤝", color: "#F5A0A0", unread: 0 },
  { id: 4, name: "Class 2025", avatar: "📚", color: "#A0D0E8", unread: 0 },
];

export default function CommunityScreen({ onBack, onCreatePost, onJoinGroup, onOpenGroup }) {
  const [tab, setTab] = useState("discover");
  const [liked, setLiked] = useState({});

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0" }}>←</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Community</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, padding: "14px 20px", background: "white", borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        {["discover", "mygroup"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, height: 44, borderRadius: 22,
            background: tab === t ? "#6B3FA0" : "transparent",
            color: tab === t ? "white" : "#6B3FA0",
            border: tab === t ? "none" : "2px solid #6B3FA0",
            fontSize: 16, fontWeight: 700, cursor: "pointer",
            fontFamily: "system-ui, sans-serif", transition: "all 0.2s",
          }}>
            {t === "discover" ? "Discover" : "My Group"}
          </button>
        ))}
      </div>

      {/* Discover tab */}
      {tab === "discover" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px" }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: "white", borderRadius: 20, padding: 16, marginBottom: 16, boxShadow: "0 2px 10px rgba(107,63,160,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: post.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{post.avatar}</div>
                <div style={{ flex: 1, height: 16, background: "#E8E0F8", borderRadius: 8 }} />
              </div>
              <div style={{ background: "#D0B8F5", borderRadius: 14, height: 100, marginBottom: 12 }} />
              <div style={{ display: "flex", gap: 20, paddingTop: 4 }}>
                <button onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24 }}>
                  {liked[post.id] ? "❤️" : "🤍"}
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24 }}>💬</button>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24 }}>↗️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Group tab */}
      {tab === "mygroup" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px" }}>
          {myGroups.map(group => (
            <button key={group.id} onClick={() => onOpenGroup && onOpenGroup(group)}
              style={{ display: "flex", alignItems: "center", gap: 16, background: "#E8E0F8", border: "none", borderRadius: 20, padding: "14px 18px", width: "100%", cursor: "pointer", marginBottom: 12, position: "relative" }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: group.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, position: "relative" }}>
                {group.avatar}
                {group.unread > 0 && (
                  <div style={{ position: "absolute", top: -4, right: -4, width: 26, height: 26, borderRadius: 13, background: "#E83030", color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", fontFamily: "system-ui, sans-serif" }}>
                    {group.unread > 99 ? "99+" : group.unread}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>{group.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={tab === "discover" ? onCreatePost : onJoinGroup}
        style={{ position: "absolute", bottom: 36, right: 28, width: 60, height: 60, borderRadius: 30, background: "#6B3FA0", color: "white", fontSize: 32, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(107,63,160,0.4)" }}>
        +
      </button>
    </div>
  );
}