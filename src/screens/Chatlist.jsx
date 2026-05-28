const contacts = {
  recent: [
    { id: 1, name: "Boyfriend", avatar: "🧍", unread: 5, color: "#C4A882" },
  ],
  others: [
    { id: 2, name: "Mummy", avatar: "👩", unread: 9, color: "#E8A0A0" },
    { id: 3, name: "Xiao Mei", avatar: "👧", unread: 0, color: "#F0C0B0" },
    { id: 4, name: "Alice", avatar: "👱‍♀️", unread: 0, color: "#A0C8A0" },
  ],
};

function ContactRow({ contact, onClick }) {
  return (
    <button
      onClick={() => onClick(contact)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "#E8E0F8",
        border: "none",
        borderRadius: 20,
        padding: "14px 18px",
        width: "100%",
        cursor: "pointer",
        marginBottom: 12,
        position: "relative",
        transition: "transform 0.12s",
      }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
    >
      {/* Avatar */}
      <div style={{
        width: 54,
        height: 54,
        borderRadius: 27,
        background: contact.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        flexShrink: 0,
        position: "relative",
      }}>
        {contact.avatar}
        {contact.unread > 0 && (
          <div style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 24,
            height: 24,
            borderRadius: 12,
            background: "#E83030",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            border: "2px solid white",
          }}>
            {contact.unread}
          </div>
        )}
      </div>

      <span style={{
        fontSize: 20,
        fontWeight: 600,
        color: "#2D1B69",
        fontFamily: "system-ui, sans-serif",
      }}>
        {contact.name}
      </span>
    </button>
  );
}

export default function ChatList({ onBack, onOpenChat }) {
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
        background: "white",
        padding: "52px 24px 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: "1px solid #E8E0F8",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: "none",
          border: "none",
          fontSize: 28,
          cursor: "pointer",
          color: "#6B3FA0",
          padding: 4,
        }}>←</button>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#6B3FA0",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
        }}>Chat</h1>
      </div>

      {/* Contact list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 100px" }}>

        {/* Recent */}
        <h2 style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#2D1B69",
          marginBottom: 12,
          fontFamily: "system-ui, sans-serif",
        }}>Recent</h2>
        {contacts.recent.map(c => (
          <ContactRow key={c.id} contact={c} onClick={onOpenChat} />
        ))}

        {/* Others */}
        <h2 style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#2D1B69",
          margin: "20px 0 12px",
          fontFamily: "system-ui, sans-serif",
        }}>Others</h2>
        {contacts.others.map(c => (
          <ContactRow key={c.id} contact={c} onClick={onOpenChat} />
        ))}
      </div>

      {/* Add contact FAB */}
      <button style={{
        position: "absolute",
        bottom: 36,
        right: 32,
        width: 60,
        height: 60,
        borderRadius: 30,
        background: "#6B3FA0",
        color: "white",
        fontSize: 32,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(107,63,160,0.4)",
      }}>+</button>
    </div>
  );
}