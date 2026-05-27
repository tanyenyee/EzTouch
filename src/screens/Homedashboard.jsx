export default function HomeDashboard({ onChat, onCommunity, onProfile, onSettings }) {
  const tiles = [
    {
      label: "Open Chat",
      icon: "💬",
      color: "#B8B0E8",
      iconBg: "#9B91D4",
      onClick: onChat,
    },
    {
      label: "Community",
      icon: "🤝",
      color: "#F5C4A0",
      iconBg: "#F0A06A",
      onClick: onCommunity,
    },
    {
      label: "Profile",
      icon: "👤",
      color: "#F5A8A8",
      iconBg: "#E87070",
      onClick: onProfile,
    },
    {
      label: "Setting",
      icon: "⚙️",
      color: "#90C8C8",
      iconBg: "#5AABAB",
      onClick: onSettings,
    },
  ];

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
        background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
        padding: "52px 28px 28px",
        flexShrink: 0,
      }}>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 14,
          margin: "0 0 4px",
          fontFamily: "system-ui, sans-serif",
        }}>Good morning 👋</p>
        <h1 style={{
          color: "white",
          fontSize: 26,
          fontWeight: 700,
          margin: 0,
          fontFamily: "system-ui, sans-serif",
        }}>Welcome to EzTouch</h1>
      </div>

      {/* Title */}
      <div style={{ padding: "28px 28px 8px" }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#6B3FA0",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}>Home</h2>
      </div>

      {/* Tiles */}
      <div style={{
        flex: 1,
        padding: "16px 28px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        justifyContent: "center",
      }}>
        {tiles.map((tile) => (
          <button
            key={tile.label}
            onClick={tile.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: tile.color,
              border: "none",
              borderRadius: 24,
              padding: "18px 24px",
              cursor: "pointer",
              width: "100%",
              transition: "transform 0.12s, opacity 0.12s",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => e.currentTarget.style.transform = "scale(0.97)"}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              background: tile.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}>
              {tile.icon}
            </div>
            <span style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#2D1B69",
              fontFamily: "system-ui, sans-serif",
            }}>
              {tile.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}