import { useState, useRef } from "react";
import { FaArrowLeft, FaUser, FaSmile, FaDumbbell, FaPray, FaFrown, FaHeart, FaMicrophone, FaCircle, FaImage, FaClipboard } from "react-icons/fa";
import { useToast } from "../components/ToastProvider";

export default function CreatePostScreen({ onBack, onNext }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [recording, setRecording] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    }
  };

  const MOODS = [
    { emoji: <FaSmile />, label: "Happy", id: "happy" },
    { emoji: <FaDumbbell />, label: "Strong", id: "strong" },
    { emoji: <FaPray />, label: "Grateful", id: "grateful" },
    { emoji: <FaFrown />, label: "Down", id: "down" },
    { emoji: <FaHeart />, label: "Loving", id: "loving" },
  ];

  const startVoice = () => {
    setText("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Voice recognition is not supported. Please use Google Chrome or Microsoft Edge.", "error");
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = "en-MY";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    setRecording(true);
    setPulse(true);

    recog.onresult = (event) => {
      setText(event.results[0][0].transcript);
    };
    recog.onerror = () => {
      setRecording(false);
      setPulse(false);
      addToast("Could not capture speech. Please try again.", "error");
    };
    recog.onend = () => {
      setRecording(false);
      setPulse(false);
    };
    try { recog.start(); } catch (e) { setRecording(false); }
  };

  const handleNext = () => {
    if (!text.trim() && !image) {
      addToast("Please write something or add a photo before posting.", "warning");
      return;
    }
    setShowConfirm(true);
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
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Create Post</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Author row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "#D0C0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}><FaUser /></div>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>You</p>
            <p style={{ margin: 0, fontSize: 13, color: "#888", fontFamily: "system-ui, sans-serif" }}>Posting to Community</p>
          </div>
        </div>

        {/* Mood picker */}
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#6B3FA0", margin: "0 0 10px", fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>How are you feeling?</p>
          <div style={{ display: "flex", gap: 10 }}>
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  background: mood === m.id ? "#F0E8FF" : "white",
                  border: mood === m.id ? "2px solid #6B3FA0" : "2px solid #E8E0F8",
                  borderRadius: 16, padding: "10px 4px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 22 }}>{m.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#6B3FA0", fontFamily: "system-ui, sans-serif" }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#6B3FA0", margin: "0 0 10px", fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>
            What's on your mind?
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts, experiences, or ask for support..."
            rows={4}
            style={{
              width: "100%", borderRadius: 18, border: "2px solid #D0B8F5",
              padding: "16px 18px", fontSize: 17, resize: "none",
              fontFamily: "system-ui, sans-serif", outline: "none",
              background: "#F9F8FF", color: "#2D1B69", boxSizing: "border-box",
              lineHeight: 1.6,
            }}
          />
          <p style={{ textAlign: "right", fontSize: 12, color: "#BBB", margin: "4px 0 0", fontFamily: "system-ui, sans-serif" }}>
            {text.length} characters
          </p>
        </div>

        {/* Voice to text section */}
        <div style={{ background: "white", borderRadius: 22, padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxShadow: "0 2px 10px rgba(107,63,160,0.07)" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}><FaMicrophone /> Dictate Instead</p>
          <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
            Struggling to type? Tap the mic and speak your post!
          </p>
          <button
            onClick={startVoice}
            style={{
              width: 80, height: 80, borderRadius: 40,
              background: recording
                ? "linear-gradient(135deg, #E87030, #C05010)"
                : "linear-gradient(135deg, #F5A06A, #E87030)",
              border: "none", cursor: "pointer", fontSize: 34,
              boxShadow: recording
                ? "0 0 0 18px rgba(245,160,106,0.2), 0 4px 16px rgba(245,160,106,0.4)"
                : "0 4px 16px rgba(245,160,106,0.4)",
              transition: "all 0.3s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          ><FaMicrophone /></button>
          <p style={{ fontSize: 15, color: recording ? "#E87030" : "#888", fontWeight: 600, margin: 0, fontFamily: "system-ui, sans-serif" }}>
            {recording ? "🔴 Listening... Speak clearly" : "Tap to speak"}
          </p>
        </div>

        {/* Add image placeholder */}
        {image ? (
          <div style={{ position: "relative", width: "100%", borderRadius: 18, overflow: "hidden", border: "2px solid #D0B8F5", flexShrink: 0 }}>
            <img src={image} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
            <button onClick={() => setImage(null)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✕</button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "white", border: "2px dashed #D0B8F5", borderRadius: 18,
              padding: "16px 18px", cursor: "pointer", width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "#F0E8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}><FaImage /></div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#6B3FA0", fontFamily: "system-ui, sans-serif" }}>Add a Photo</span>
          </button>
        )}
        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />

        {/* NEXT button */}
        <button
          onClick={handleNext}
          style={{
            width: "100%", height: 64, borderRadius: 22,
            background: (text.trim() || image)
              ? "linear-gradient(135deg,#6B3FA0,#8B5CC8)"
              : "#D0C8E8",
            color: "white", border: "none", cursor: (text.trim() || image) ? "pointer" : "default",
            fontSize: 20, fontWeight: 700, fontFamily: "system-ui, sans-serif",
            boxShadow: (text.trim() || image) ? "0 6px 20px rgba(107,63,160,0.3)" : "none",
            transition: "all 0.3s",
          }}
        >
          Preview Post →
        </button>
      </div>

      {/* Anti-accidental post confirmation modal */}
      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}
        >
          <div style={{ background: "white", borderRadius: 32, padding: "32px 24px", width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}><FaClipboard /></div>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#2D1B69", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Ready to Preview?</p>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 12, fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
              You'll be able to review your post before it goes live.
            </p>
            <div style={{ background: "#F4F0FF", borderRadius: 16, padding: "12px 16px", marginBottom: 24, textAlign: "left" }}>
              <p style={{ fontSize: 15, color: "#2D1B69", fontFamily: "system-ui, sans-serif", margin: 0, lineHeight: 1.5 }}>{text}</p>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, height: 56, borderRadius: 18, background: "#F5F5F5", color: "#666", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >Edit More</button>
              <button
                onClick={() => { setShowConfirm(false); onNext && onNext(text, image); }}
                style={{ flex: 1, height: 56, borderRadius: 18, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}
              >Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}