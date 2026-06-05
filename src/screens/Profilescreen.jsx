import {
  FaArrowLeft,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";

export default function ProfileScreen({ profile: profileProp, onBack, onEdit, onLogout }) {
  const profile = profileProp || {
    username: "Username",
    email: "user@example.com",
    phone: "+123 456 7890",
    joined: "January 15, 2021",
  };

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
          background: "white",
          padding: "48px 20px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #E8E0F8",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            fontSize: 26,
            cursor: "pointer",
            color: "#6B3FA0",
          }}
        >
          <FaArrowLeft />
        </button>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#6B3FA0",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Profile
        </h1>
      </div>

      <div
        style={{
          flex: 1,
          padding: "36px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            color: "white",
            width: 110,
            height: 110,
            borderRadius: 55,
            background: "#6B3FA0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
            marginBottom: 18,
            boxShadow: "0 4px 16px rgba(107,63,160,0.2)",
          }}
        >
          <FaUserCircle />
        </div>

        {/* Username */}
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#2D1B69",
            margin: "0 0 10px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {profile.username}
        </h2>

        {/* Bio */}
        <p
          style={{
            fontSize: 15,
            color: profile.bio ? "#5A3A8A" : "#A090C8",
            textAlign: "center",
            margin: "0 0 26px",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.5,
            maxWidth: "85%",
            whiteSpace: "pre-wrap",
            fontStyle: profile.bio ? "normal" : "italic",
          }}
        >
          {profile.bio || "No bio added yet."}
        </p>

        {/* Info cards */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {[
            { icon: <FaEnvelope />, label: `Email: ${profile.email}` },
            { icon: <FaPhone />, label: `Phone: ${profile.phone}` },
            { icon: <FaCalendarAlt />, label: `Joined: ${profile.joined}` },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "white",
                borderRadius: 16,
                padding: "14px 18px",
                boxShadow: "0 2px 8px rgba(107,63,160,0.08)",
              }}
            >
              <span style={{ fontSize: 22, color: "#6B3FA0" }}>
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: "#2D1B69",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Edit Profile button */}
        <button
          onClick={onEdit}
          style={{
            width: "100%",
            height: 62,
            borderRadius: 18,
            background: "#6B3FA0",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 19,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 6px 20px rgba(107,63,160,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <FaEdit />
          Edit Profile
        </button>

        {/* Log Out button */}
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            height: 62,
            borderRadius: 18,
            background: "#FFF5F5",
            color: "#E83030",
            border: "2px solid #E83030",
            cursor: "pointer",
            fontSize: 19,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <FaSignOutAlt />
          Log Out
        </button>
      </div>
    </div>
  );
}