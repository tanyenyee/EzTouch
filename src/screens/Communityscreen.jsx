import { useState } from "react";
import { FaArrowLeft, FaGlobeAmericas, FaUsers, FaHeart, FaRegHeart, FaComment, FaShare, FaUser, FaPaperPlane, FaChevronRight, FaPlus, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const initPosts = [
  {
    id: 1, user: "Anna", avatar: <FaUser />, color: "#E8A0A0",
    text: "Had a great day with my therapy session! Feeling so much stronger 💪",
    likes: 12, time: "2 hrs ago",
    commentsList: [
      { id: 1, user: "Ravi", avatar: <FaUser />, color: "#A0C8E8", text: "That's amazing, keep it up! 💪", time: "1 hr ago" },
      { id: 2, user: "Mei Lin", avatar: <FaUser />, color: "#F0C0B0", text: "So proud of you Anna! 🥰", time: "45 mins ago" },
      { id: 3, user: "David", avatar: <FaUser />, color: "#A0D0A0", text: "Therapy really does wonders!", time: "30 mins ago" },
    ],
  },
  {
    id: 2, user: "Ravi", avatar: <FaUser />, color: "#A0C8E8",
    text: "Anyone else use voice typing? It completely changed my life! EzTouch makes it so easy 🎙️",
    likes: 28, time: "4 hrs ago",
    commentsList: [
      { id: 1, user: "Anna", avatar: <FaUser />, color: "#E8A0A0", text: "YES! Voice typing is a lifesaver 🙌", time: "3 hrs ago" },
      { id: 2, user: "David", avatar: <FaUser />, color: "#A0D0A0", text: "I use it every day now, no more struggle!", time: "2 hrs ago" },
      { id: 3, user: "Sara", avatar: <FaUser />, color: "#C8A0E8", text: "The accuracy is surprisingly good too 😊", time: "2 hrs ago" },
      { id: 4, user: "Mei Lin", avatar: <FaUser />, color: "#F0C0B0", text: "Same here! My hand cramps a lot less now 💯", time: "1 hr ago" },
    ],
  },
  {
    id: 3, user: "Mei Lin", avatar: <FaUser />, color: "#F0C0B0",
    text: "Just joined the Hand Recovery Support group. So glad I found this community! 🤝",
    likes: 34, time: "Yesterday",
    commentsList: [
      { id: 1, user: "Anna", avatar: <FaUser />, color: "#E8A0A0", text: "Welcome! You're in the right place 💜", time: "Yesterday" },
      { id: 2, user: "Ravi", avatar: <FaUser />, color: "#A0C8E8", text: "This community is incredibly supportive!", time: "Yesterday" },
    ],
  },
  {
    id: 4, user: "David", avatar: <FaUser />, color: "#A0D0A0",
    text: "Tip for tremor users: use the large button mode in Settings! It helps so much with accidental taps 👍",
    likes: 51, time: "2 days ago",
    commentsList: [
      { id: 1, user: "Mei Lin", avatar: <FaUser />, color: "#F0C0B0", text: "Oh wow, I didn't know about this! Trying it now 😊", time: "2 days ago" },
      { id: 2, user: "Sara", avatar: <FaUser />, color: "#C8A0E8", text: "Game changer tip!! Thank you David 🙏", time: "2 days ago" },
      { id: 3, user: "Anna", avatar: <FaUser />, color: "#E8A0A0", text: "Also the confirmation mode in Settings helps a lot with accidental sends!", time: "1 day ago" },
    ],
  },
];



// Contacts from the chat module (mirrors App.jsx contacts)
const SHARE_CONTACTS = [
  { id: 1, name: "Boyfriend", avatar: <FaUser />, color: "#C4A882" },
  { id: 2, name: "Mummy", avatar: <FaUser />, color: "#E8A0A0" },
  { id: 3, name: "Xiao Mei", avatar: <FaUser />, color: "#F0C0B0" },
  { id: 4, name: "Alice", avatar: <FaUser />, color: "#A0C8A0" },
];

export default function CommunityScreen({ onBack, onCreatePost, onJoinGroup, onOpenGroup, defaultTab = "discover", myGroups = [] }) {
  const [tab, setTab] = useState(defaultTab);
  const [posts, setPosts] = useState(initPosts);
  const [liked, setLiked] = useState({});
  const [commenting, setCommenting] = useState(null); // post id showing comment section
  const [commentText, setCommentText] = useState("");
  const [sharingPost, setSharingPost] = useState(null); // post object being shared
  const [sharedTo, setSharedTo] = useState(null);  // contact name after sharing

  const toggleLike = (id) => {
    setLiked(l => ({ ...l, [id]: !l[id] }));
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) } : p
    ));
  };

  const submitComment = (postId) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "You",
      avatar: <FaUser />,
      color: "#D0C0F0",
      text: commentText.trim(),
      time: "Just now",
    };
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, commentsList: [...(p.commentsList || []), newComment] }
        : p
    ));
    setCommentText("");
  };

  const shareToContact = (contact) => {
    setSharedTo(contact.name);
    setSharingPost(null);
    setTimeout(() => setSharedTo(null), 2500);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button
          aria-label="Back"
          onClick={onBack}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6B3FA0", padding: "8px 12px", minWidth: 44, minHeight: 44 }}
        ><FaArrowLeft /></button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif", flex: 1 }}>Community</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, padding: "14px 20px", background: "white", borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        {["discover", "mygroup"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, height: 48, borderRadius: 24,
            background: tab === t ? "linear-gradient(135deg,#6B3FA0,#8B5CC8)" : "transparent",
            color: tab === t ? "white" : "#6B3FA0",
            border: tab === t ? "none" : "2px solid #6B3FA0",
            fontSize: 16, fontWeight: 700, cursor: "pointer",
            fontFamily: "system-ui, sans-serif", transition: "all 0.2s",
            boxShadow: tab === t ? "0 4px 12px rgba(107,63,160,0.25)" : "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}>
            {t === "discover" ? <><FaGlobeAmericas /> Discover</> : <><FaUsers /> My Groups</>}
          </button>
        ))}
      </div>

      {/* ── DISCOVER TAB ── */}
      {tab === "discover" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: "white", borderRadius: 24, padding: "18px 18px 14px", marginBottom: 16, boxShadow: "0 2px 12px rgba(107,63,160,0.09)" }}>

              {/* Post Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: post.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {post.avatar}
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}>{post.user}</p>
                  <p style={{ fontSize: 13, color: "#999", margin: 0, fontFamily: "system-ui, sans-serif" }}>{post.time}</p>
                </div>
              </div>

              {/* Post Text */}
              <p style={{ fontSize: 16, color: "#2D1B69", fontFamily: "system-ui, sans-serif", margin: "0 0 14px", lineHeight: 1.6 }}>
                {post.text}
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: "#F0EBF8", marginBottom: 12 }} />

              {/* Action buttons — Like | Comment | Share (3 only) */}
              <div style={{ display: "flex", gap: 8 }}>
                {/* Like */}
                <button
                  aria-label={liked[post.id] ? "Unlike post" : "Like post"}
                  onClick={() => toggleLike(post.id)}
                  style={{
                    flex: 1, height: 48, borderRadius: 16, border: "none", cursor: "pointer",
                    background: liked[post.id] ? "#F5E8FF" : "#F8F8F8",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 18, display: "flex" }}>{liked[post.id] ? <FaHeart color="#E83030" /> : <FaRegHeart color="#888" />}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: liked[post.id] ? "#6B3FA0" : "#888", fontFamily: "system-ui, sans-serif" }}>{post.likes}</span>
                </button>

                {/* Comment */}
                <button
                  aria-label="Comment on post"
                  onClick={() => { setCommenting(commenting === post.id ? null : post.id); setCommentText(""); }}
                  style={{
                    flex: 1, height: 48, borderRadius: 16, border: "none", cursor: "pointer",
                    background: commenting === post.id ? "#F5E8FF" : "#F8F8F8",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 18, color: commenting === post.id ? "#6B3FA0" : "#888", display: "flex" }}><FaComment /></span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: commenting === post.id ? "#6B3FA0" : "#888", fontFamily: "system-ui, sans-serif" }}>
                    {(post.commentsList || []).length}
                  </span>
                </button>

                {/* Share */}
                <button
                  aria-label="Share post to a contact"
                  onClick={() => setSharingPost(post)}
                  style={{
                    flex: 1, height: 48, borderRadius: 16, border: "none", cursor: "pointer",
                    background: "#F8F8F8",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 18, color: "#888", display: "flex" }}><FaShare /></span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#888", fontFamily: "system-ui, sans-serif" }}>Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {commenting === post.id && (
                <div style={{ marginTop: 12 }}>
                  {/* Existing comments list */}
                  {(post.commentsList || []).length > 0 && (
                    <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      {(post.commentsList || []).map(c => (
                        <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 34, height: 34, borderRadius: 17, background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                            {c.avatar}
                          </div>
                          <div style={{ flex: 1, background: "#F4F0FF", borderRadius: "4px 16px 16px 16px", padding: "8px 12px" }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B3FA0", margin: "0 0 2px", fontFamily: "system-ui, sans-serif" }}>{c.user}</p>
                            <p style={{ fontSize: 14, color: "#2D1B69", margin: "0 0 2px", fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>{c.text}</p>
                            <p style={{ fontSize: 11, color: "#BBB", margin: 0, fontFamily: "system-ui, sans-serif" }}>{c.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* New comment input */}
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 17, background: "#D0C0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, color: "white" }}><FaUser /></div>
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                      style={{ flex: 1, borderRadius: 14, border: "2px solid #D0B8F5", padding: "10px 14px", fontSize: 15, resize: "none", fontFamily: "system-ui, sans-serif", outline: "none", background: "#F9F8FF", color: "#2D1B69" }}
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      style={{ width: 48, height: 48, borderRadius: 24, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    ><FaPaperPlane style={{ marginLeft: "-2px" }} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── MY GROUPS TAB ── */}
      {tab === "mygroup" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#888", margin: "0 0 14px", fontFamily: "system-ui, sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>
            YOUR GROUPS
          </p>
          {myGroups.map(group => (
            <button
              key={group.id}
              onClick={() => onOpenGroup && onOpenGroup(group)}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "white", border: "none", borderRadius: 24,
                padding: "16px 18px", width: "100%", cursor: "pointer",
                marginBottom: 12, position: "relative", textAlign: "left",
                boxShadow: "0 2px 10px rgba(107,63,160,0.08)",
                transition: "transform 0.12s",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onTouchStart={e => e.currentTarget.style.transform = "scale(0.98)"}
              onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ width: 58, height: 58, borderRadius: 29, background: group.color + "33", border: `2px solid ${group.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, position: "relative", color: group.color }}>
                {group.avatar}
                {group.unread > 0 && (
                  <div style={{ position: "absolute", top: -5, right: -5, minWidth: 24, height: 24, borderRadius: 12, background: "#E83030", color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", fontFamily: "system-ui, sans-serif", padding: "0 4px" }}>
                    {group.unread > 99 ? "99+" : group.unread}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#2D1B69", margin: "0 0 3px", fontFamily: "system-ui, sans-serif" }}>{group.name}</p>
                <p style={{ fontSize: 13, color: "#999", margin: 0, fontFamily: "system-ui, sans-serif" }}>{group.members.toLocaleString()} members</p>
              </div>
              <span style={{ fontSize: 16, color: "#C0B0D8" }}><FaChevronRight /></span>
            </button>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        aria-label={tab === "discover" ? "Create post" : "Join a group"}
        onClick={tab === "discover" ? onCreatePost : onJoinGroup}
        style={{
          position: "absolute", bottom: 36, right: 24,
          width: 60, height: 60, borderRadius: 30,
          background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)",
          color: "white", fontSize: 30, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(107,63,160,0.4)",
        }}
      ><FaPlus /></button>

      {/* ── SHARE TO CONTACT MODAL ── */}
      {sharingPost && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200 }}
          onClick={() => setSharingPost(null)}
        >
          <div
            style={{ background: "white", borderRadius: "32px 32px 0 0", padding: "24px 20px 40px", width: "100%" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#D0B8F5", margin: "0 auto 20px" }} />

            <p style={{ fontSize: 19, fontWeight: 800, color: "#2D1B69", margin: "0 0 4px", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaShare /> Share Post
            </p>
            <p style={{ fontSize: 14, color: "#888", margin: "0 0 18px", fontFamily: "system-ui, sans-serif" }}>
              Send this post directly to a contact
            </p>

            {/* Post snippet preview */}
            <div style={{ background: "#F4F0FF", borderRadius: 16, padding: "12px 14px", marginBottom: 18 }}>
              <p style={{ fontSize: 13, color: "#6B3FA0", fontWeight: 700, margin: "0 0 4px", fontFamily: "system-ui, sans-serif" }}>{sharingPost.user}</p>
              <p style={{ fontSize: 14, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }} >
                {sharingPost.text.length > 80 ? sharingPost.text.slice(0, 80) + "…" : sharingPost.text}
              </p>
            </div>

            {/* Contact list */}
            <p style={{ fontSize: 13, fontWeight: 700, color: "#AAA", margin: "0 0 12px", fontFamily: "system-ui, sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>YOUR CONTACTS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SHARE_CONTACTS.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => shareToContact(contact)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "#F8F7FF", border: "2px solid #E8E0F8", borderRadius: 20,
                    padding: "12px 16px", cursor: "pointer", width: "100%", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseDown={e => e.currentTarget.style.background = "#F0E8FF"}
                  onMouseUp={e => e.currentTarget.style.background = "#F8F7FF"}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 23, background: contact.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, color: "white" }}>
                    {contact.avatar}
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif", flex: 1 }}>{contact.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#6B3FA0", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>Send <FaArrowRight /></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SHARE SUCCESS TOAST ── */}
      {sharedTo && (
        <div style={{
          position: "absolute", bottom: 110, left: "50%", transform: "translateX(-50%)",
          background: "#2D1B69", color: "white", borderRadius: 24, padding: "12px 22px",
          fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif",
          boxShadow: "0 6px 20px rgba(45,27,105,0.35)", whiteSpace: "nowrap", zIndex: 300,
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <FaCheckCircle color="#4CAF50" fontSize={18} /> Shared to {sharedTo}!
        </div>
      )}
    </div>
  );
}