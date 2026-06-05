import { useState } from "react";
import { FaHands, FaPaw, FaSun, FaHeart, FaMobileAlt, FaPalette, FaArrowLeft, FaSearch, FaUsers, FaCheck, FaGlassCheers } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";
import { useState, useEffect } from "react";
import { FaHands, FaPaw, FaSun, FaHeart, FaMobileAlt, FaPalette, FaArrowLeft, FaSearch, FaUsers, FaCheck, FaGlassCheers, FaPlus, FaUndo } from "react-icons/fa";
import { useToast } from "../components/ToastProvider";

const CATEGORIES = ["All", "Health", "Pets", "Daily Life", "Support", "Hobbies", "Education"];
const FORM_CATEGORIES = ["Health", "Pets", "Daily Life", "Support", "Hobbies", "Education"];

const ICONS = [
  <FaUsers />, <FaHeart />, <FaSun />, <FaPaw />, 
  <FaPalette />, <FaMobileAlt />, <FaHands />, <FaGlassCheers />
];
const COLORS = ["#6B3FA0", "#F5A06A", "#F5C030", "#5AABAB", "#A0C8E8", "#E87070", "#A0C8A0", "#C8A0E8"];

const GROUPS = [
  {
    id: 1, name: "Hand Recovery Support",
    icon: <FaHands />, desc: "Connect with others in hand rehabilitation. Share tips, progress, and encouragement.",
    members: 14, color: "#6B3FA0", joined: false, category: "Health"
  },
  {
    id: 2, name: "Pet Lover Community",
    icon: <FaPaw />, desc: "Share stories and tips about your beloved pets.",
    members: 12, color: "#F5A06A", joined: false, category: "Pets"
  },
  {
    id: 3, name: "Daily Motivation",
    icon: <FaSun />, desc: "Encourage and inspire each other every single day.",
    members: 18, color: "#F5C030", joined: false, category: "Daily Life"
  },
  {
    id: 4, name: "Health & Wellness",
    icon: <FaHeart />, desc: "Talk about healthy living, therapy tips, and adaptive tools.",
    members: 15, color: "#5AABAB", joined: false, category: "Health"
  },
  {
    id: 5, name: "Adaptive Tech Tips",
    icon: <FaMobileAlt />, desc: "Discover apps, devices, and accessibility features that help.",
    members: 11, color: "#A0C8E8", joined: false, category: "Education"
  },
  {
    id: 6, name: "Creative Arts",
    icon: <FaPalette />, desc: "Art, crafts, and creative expression adapted for everyone.",
    members: 19, color: "#E87070", joined: false, category: "Hobbies"
  },
];

export default function JoinGroupScreen({ onBack, onJoinedGroup }) {
  const { sz } = useSizeContext();
export default function JoinGroupScreen({ onBack, onJoinedGroup, customGroups = [], onCreateGroup }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [confirmGroup, setConfirmGroup] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(null);
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const { addToast } = useToast();

  useEffect(() => {
    let timer;
    if (joinedGroup && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (joinedGroup && timeLeft === 0) {
      confirmJoin(joinedGroup, true);
    }
    return () => clearTimeout(timer);
  }, [joinedGroup, timeLeft]);

  // Creation State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Health");
  const [newDesc, setNewDesc] = useState("");
  const [newIconIdx, setNewIconIdx] = useState(0);

  const allGroups = [...GROUPS, ...customGroups];

  const filtered = allGroups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoin = () => {
    setJoinedGroup(confirmGroup);
    setTimeLeft(30);
    setConfirmGroup(null);
  };

  const confirmJoin = (group, navigate = true) => {
    setJoinedIds(prev => new Set([...prev, group.id]));
    setJoinedGroup(null);
    if (onJoinedGroup) {
      onJoinedGroup({ ...group, unread: 0, avatar: group.icon }, navigate);
    }
  };

  const undoJoin = () => {
    setJoinedGroup(null);
  };

  const handleCreate = () => {
    if (!newName.trim()) return addToast("Please enter a group name.", "warning");
    
    // Check duplicates in the same category
    const isDuplicate = allGroups.some(g => g.category === newCategory && g.name.toLowerCase() === newName.trim().toLowerCase());
    if (isDuplicate) return addToast(`A group named "${newName.trim()}" already exists in the ${newCategory} category.`, "warning");

    const newGroup = {
      id: Date.now(),
      name: newName.trim(),
      category: newCategory,
      desc: newDesc.trim() || "A new community group.",
      icon: ICONS[newIconIdx],
      color: COLORS[newIconIdx],
      members: 1, // You are the sole member
    };

    setShowCreateModal(false);
    addToast("Group created successfully!", "success");
    if (onCreateGroup) {
      onCreateGroup(newGroup);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button
          aria-label="Back"
          onClick={onBack}
          style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0", padding: "8px 12px", minWidth: 44, minHeight: 44 }}
        ><FaArrowLeft /></button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Find Groups</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 36px" }}>

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: 18 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search groups by name or topic..."
            style={{
              width: "100%", height: 54, borderRadius: 27,
              border: "2px solid #D0B8F5", padding: "0 52px 0 20px",
              fontSize: 16, background: "white", outline: "none",
              fontFamily: "system-ui, sans-serif", boxSizing: "border-box",
              color: "#2D1B69",
            }}
          />
          <span style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", fontSize: 22 }}><FaSearch /></span>
        </div>

        {/* Category chips */}
        <p style={{ fontSize: 14, fontWeight: 700, color: "#6B3FA0", margin: "0 0 10px", fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>Categories</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                height: 40, padding: "0 18px", borderRadius: 20, border: "none",
                cursor: "pointer", fontSize: 14, fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
                background: activeCategory === c
                  ? "linear-gradient(135deg,#6B3FA0,#8B5CC8)"
                  : "#E8E0F8",
                color: activeCategory === c ? "white" : "#2D1B69",
                transition: "all 0.2s",
                boxShadow: activeCategory === c ? "0 3px 10px rgba(107,63,160,0.25)" : "none",
              }}
            >{c}</button>
          ))}
        </div>

        {/* Result count */}
        <p style={{ fontSize: 14, color: "#888", fontFamily: "system-ui, sans-serif", margin: "0 0 14px" }}>
          {filtered.length} group{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Group cards */}
        {filtered.map(group => (
          <div
            key={group.id}
            style={{
              background: "white", borderRadius: 22, padding: "18px 18px",
              marginBottom: 14, boxShadow: "0 2px 10px rgba(107,63,160,0.08)",
              border: joinedIds.has(group.id) ? "2px solid #6B3FA0" : "2px solid transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {/* Icon */}
              <div style={{
                width: 58, height: 58, borderRadius: 29, flexShrink: 0,
                background: group.color + "22", border: `2px solid ${group.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>
                {group.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", margin: "0 0 4px", fontFamily: "system-ui, sans-serif" }}>{group.name}</p>
                <p style={{ fontSize: 13, color: "#888", margin: "0 0 6px", fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>{group.desc}</p>
                <p style={{ fontSize: 13, color: group.color, fontWeight: 600, margin: 0, fontFamily: "system-ui, sans-serif" }}><FaUsers /> {group.members} members</p>
              </div>
            </div>

            {/* Join button */}
            <button
              onClick={() => !joinedIds.has(group.id) && setConfirmGroup(group)}
              style={{
                width: "100%", height: sz.height, borderRadius: sz.borderRadius, border: "none",
                cursor: joinedIds.has(group.id) ? "default" : "pointer",
                marginTop: 14, fontSize: sz.fontSize, fontWeight: 700,
                fontFamily: "system-ui, sans-serif",
                background: joinedIds.has(group.id)
                  ? "#D4F5D4"
                  : "linear-gradient(135deg,#6B3FA0,#8B5CC8)",
                color: joinedIds.has(group.id) ? "#2E7D32" : "white",
                boxShadow: joinedIds.has(group.id) ? "none" : "0 4px 14px rgba(107,63,160,0.25)",
                transition: "all 0.2s",
              }}
            >
              {joinedIds.has(group.id) ? "<><FaCheck /> Joined</>" : "Join Group"}
            </button>
          </div>
        ))}
      </div>

      {/* Fixed Create New Group Footer */}
      <div style={{ background: "white", padding: "16px 20px 24px", borderTop: "1px solid #E8E0F8", flexShrink: 0, zIndex: 10 }}>
        <button
          onClick={() => {
            setNewName("");
            setNewDesc("");
            setNewCategory("Health");
            setNewIconIdx(0);
            setShowCreateModal(true);
          }}
          style={{
            width: "100%", height: 56, borderRadius: 28, background: "#FFF0E5", border: "2px dashed #F5A06A",
            color: "#E87030", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: "0 2px 8px rgba(245,160,106,0.15)"
          }}
        >
          <FaPlus /> Create New Group
        </button>
      </div>

      {/* Join confirmation modal */}
      {confirmGroup && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}
        >
          <div style={{ background: "white", borderRadius: 32, padding: "36px 28px", width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 40,
              background: confirmGroup.color + "22", border: `2px solid ${confirmGroup.color}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 38, margin: "0 auto 20px",
            }}>
              {confirmGroup.icon}
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#2D1B69", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>
              Join {confirmGroup.name}?
            </p>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 8, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
              {confirmGroup.desc}
            </p>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 28, fontFamily: "system-ui, sans-serif" }}>
              <FaUsers /> {confirmGroup.members} members already inside
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={handleJoin}
                style={{ width: "100%", height: sz.height, borderRadius: sz.borderRadius, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 16px rgba(107,63,160,0.3)" }}
              >
                <><FaCheck /> Yes, Join Group</>
              </button>
              <button
                onClick={() => setConfirmGroup(null)}
                style={{ width: "100%", height: sz.height, borderRadius: sz.borderRadius, background: "white", color: "#666", border: "2px solid #E8E0F8", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Joined success popup */}
      {joinedGroup && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}
        >
          <div style={{ background: "white", borderRadius: 32, padding: "36px 28px", width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}><FaGlassCheers /></div>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#6B3FA0", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>Welcome!</p>
            <p style={{ fontSize: 17, fontWeight: 600, color: "#2D1B69", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>
              You've joined {joinedGroup.name}
            </p>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 28, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
              You can now read messages and chat with {joinedGroup.members} members!
            </p>
            <p style={{ fontSize: 13, color: "#E87030", textAlign: "center", fontFamily: "system-ui, sans-serif", margin: "0 0 16px" }}>
              <FaUndo style={{ color: "currentColor", marginRight: 6 }} />Undo available for {timeLeft}s
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setJoinedGroup(null)}
                style={{ flex: 1, height: sz.height, borderRadius: sz.borderRadius, background: "#F0EBF8", color: "#6B3FA0", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
                onClick={undoJoin}
                style={{ flex: 1, height: 56, borderRadius: 18, background: "#FFF5F5", color: "#E83030", border: "2px solid #E83030", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <FaUndo /> Undo
              </button>
              <button
                onClick={() => confirmJoin(joinedGroup, false)}
                style={{ flex: 1, height: 56, borderRadius: 18, background: "#F0EBF8", color: "#6B3FA0", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Browse More
              </button>
              <button
                onClick={() => { setJoinedGroup(null); onBack(); }}
                style={{ flex: 1, height: sz.height, borderRadius: sz.borderRadius, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}
                onClick={() => confirmJoin(joinedGroup, true)}
                style={{ flex: 1, height: 56, borderRadius: 18, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}
              >
                Go to Groups
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}
        >
          <div style={{ background: "white", borderRadius: 32, padding: "28px 24px", width: "100%", maxHeight: "90%", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#6B3FA0", margin: "0 0 20px", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
              <FaPlus /> Create Group
            </p>
            
            <p style={{ fontSize: 14, fontWeight: 700, color: "#888", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>GROUP NAME</p>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Morning Walkers"
              style={{ width: "100%", height: 50, borderRadius: 16, border: "2px solid #E8E0F8", padding: "0 16px", fontSize: 16, fontFamily: "system-ui, sans-serif", boxSizing: "border-box", marginBottom: 16 }}
            />

            <p style={{ fontSize: 14, fontWeight: 700, color: "#888", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>CATEGORY</p>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{ width: "100%", height: 50, borderRadius: 16, border: "2px solid #E8E0F8", padding: "0 16px", fontSize: 16, fontFamily: "system-ui, sans-serif", boxSizing: "border-box", marginBottom: 16, background: "white", color: "#2D1B69" }}
            >
              {FORM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <p style={{ fontSize: 14, fontWeight: 700, color: "#888", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>DESCRIPTION (Optional)</p>
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="What is this group about?"
              rows={2}
              style={{ width: "100%", borderRadius: 16, border: "2px solid #E8E0F8", padding: "12px 16px", fontSize: 16, fontFamily: "system-ui, sans-serif", boxSizing: "border-box", marginBottom: 16, resize: "none" }}
            />

            <p style={{ fontSize: 14, fontWeight: 700, color: "#888", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>CHOOSE ICON</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
              {ICONS.map((icon, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewIconIdx(idx)}
                  style={{
                    height: 54, borderRadius: 16, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
                    border: newIconIdx === idx ? `3px solid ${COLORS[idx]}` : "2px solid transparent",
                    background: COLORS[idx] + "22", color: COLORS[idx], cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handleCreate}
                style={{ width: "100%", height: 56, borderRadius: 20, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Create Group
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ width: "100%", height: 56, borderRadius: 20, background: "white", color: "#666", border: "2px solid #E8E0F8", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}