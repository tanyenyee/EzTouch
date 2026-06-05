import { FaComments, FaHandsHelping, FaUser, FaCog, FaHandPaper } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";

export default function HomeDashboard({
  onChat,
  onCommunity,
  onProfile,
  onSettings,
}) {
  const { sz } = useSizeContext();
  const tiles = [
    {
      label: "Open Chat",
      icon: <FaComments />,
      color: "#B8B0E8",
      iconBg: "#9B91D4",
      onClick: onChat,
    },
    {
      label: "Community",
      icon: <FaHandsHelping />,
      color: "#F5C4A0",
      iconBg: "#F0A06A",
      onClick: onCommunity,
    },
    {
      label: "Profile",
      icon: <FaUser />,
      color: "#F5A8A8",
      iconBg: "#E87070",
      onClick: onProfile,
    },
    {
      label: "Setting",
      icon: <FaCog />,
      color: "#90C8C8",
      iconBg: "#5AABAB",
      onClick: onSettings,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F4F0FF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
          padding: "56px 28px 32px",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 18,
            margin: "0 0 8px",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Good morning
          <FaHandPaper size={18} />
        </p>

        <h1
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Welcome to EzTouch
        </h1>
      </div>

      {/* Title */}
      <div style={{ padding: "32px 28px 12px" }}>
        <h2
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#6B3FA0",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            margin: 0,
          }}
        >
          Home
        </h2>
      </div>

      {/* Tiles */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 28px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {tiles.map((tile) => (
          <button
            key={tile.label}
            aria-label={tile.label}
            onClick={tile.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: tile.color,
              border: "none",
              borderRadius: 28,
              padding: sz.tilePadding,
              minHeight: sz.tileMinHeight,
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              transition: "transform 0.12s, opacity 0.12s",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.opacity = "1";
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
              e.currentTarget.style.opacity = "0.9";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.opacity = "1";
            }}
          >
            <div
              style={{
                width: sz.tileIconSize,
                height: sz.tileIconSize,
                borderRadius: sz.tileIconSize / 2,
                background: tile.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: sz.tileIconFont,
                flexShrink: 0,
                color: "white",
              }}
            >
              {tile.icon}
            </div>

            <span
              style={{
                fontSize: sz.tileLabelSize,
                fontWeight: 700,
                color: "#2D1B69",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {tile.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}