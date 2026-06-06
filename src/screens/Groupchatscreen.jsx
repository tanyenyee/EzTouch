import { useState, useRef, useEffect } from "react";
import { FaUser, FaGlassCheers, FaSmile, FaHandshake, FaHands, FaLifeRing, FaClock, FaPray, FaThumbsUp, FaComment, FaCat, FaHeart, FaArrowLeft, FaCog, FaUndo, FaMicrophone, FaLightbulb, FaPaperPlane, FaBroadcastTower, FaMagic, FaExclamationTriangle, FaSignOutAlt } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";
import ReactiveKeyboard from "./ReactiveKeyboard";
import { useToast } from "../components/ToastProvider";

const MEMBERS = [
  { id: 1, name: "Anna", avatar: <FaUser />, color: "#E8A0A0" },
  { id: 2, name: "Ravi", avatar: <FaUser />, color: "#A0C8E8" },
  { id: 3, name: "Mei Lin", avatar: <FaUser />, color: "#F0C0B0" },
  { id: 4, name: "David", avatar: <FaUser />, color: "#A0D0A0" },
  { id: 5, name: "Sara", avatar: <FaUser />, color: "#C8A0E8" },
];

const DUMMY_NAMES = ["John", "Emily", "Michael", "Sarah", "Chris", "Jessica", "Daniel", "Lisa", "Matthew", "Ashley", "Andrew", "Amanda", "Joshua", "Nicole", "Kevin"];

function getInitMessages(group) {
  if (group?.isNew) return [];
  const groupName = group?.name || "Pet Lovers";
  return [
    { id: 1, text: <>Welcome to {groupName}! <FaGlassCheers /></>, mine: false, user: "Anna", avatar: <FaUser />, color: "#E8A0A0", time: "9:00 AM" },
    { id: 2, text: <>Hello everyone! So happy to be here <FaSmile /></>, mine: false, user: "Ravi", avatar: <FaUser />, color: "#A0C8E8", time: "9:02 AM" },
    { id: 3, text: <>Hi all! Looking forward to connecting with you all <FaHandshake /></>, mine: true, time: "9:05 AM" },
    { id: 4, text: "Has anyone tried the voice typing feature yet? It's amazing for those of us with hand difficulties!", mine: false, user: "Mei Lin", avatar: <FaUser />, color: "#F0C0B0", time: "9:08 AM" },
    { id: 5, text: <>Yes! Life changing! <FaHands /></>, mine: false, user: "David", avatar: <FaUser />, color: "#A0D0A0", time: "9:10 AM" },
  ];
}

const quickReplies = [
  { label: <>I need help <FaLifeRing /></>, rawText: "I need help", color: "#B0A8D0" },
  { label: <>Give me some time <FaClock /></>, rawText: "Give me some time", color: "#F5A06A" },
  { label: <>Thanks <FaPray /></>, rawText: "Thanks", color: "#E87070" },
  { label: <>That's great! <FaGlassCheers /></>, rawText: "That's great!", color: "#5AABAB" },
  { label: <>Okay <FaThumbsUp /></>, rawText: "Okay", color: "#A0C8A0" },
  { label: <>Can we talk? <FaComment /></>, rawText: "Can we talk?", color: "#C8A0E8" },
];

export default function GroupChatScreen({ group, onBack, onLeaveGroup, onDeleteGroup, onEditGroup }) {
  const { sz } = useSizeContext();
  const [messages, setMessages] = useState(() => getInitMessages(group));
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("main");
  const [transcribed, setTranscribed] = useState("");
  const [recording, setRecording] = useState(false);
  const [undoId, setUndoId] = useState(null);
  const [pulse, setPulse] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [hasLeft, setHasLeft] = useState(false);
  const bottomRef = useRef(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const { addToast } = useToast();

  const [editGroupModal, setEditGroupModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editName, setEditName] = useState(group?.name || "");
  const [editDesc, setEditDesc] = useState(group?.desc || "");
  
  const name = group?.name || "Pet Lovers";
  const avatar = group?.avatar || <FaCat />;
  const avatarColor = group?.color || "#C8A0E8";
  const totalMembersCount = group?.members || (MEMBERS.length + 1);

  const [dummyMembers, setDummyMembers] = useState([]);

  useEffect(() => {
    if (group?.members === 1) {
      setDummyMembers([]);
      return;
    }
    const needed = totalMembersCount - 1 - MEMBERS.length;
    if (needed > 0) {
      const generated = Array.from({ length: needed }, (_, i) => ({
        id: 100 + i,
        name: DUMMY_NAMES[i % DUMMY_NAMES.length],
        avatar: <FaUser />,
        color: ["#E8A0A0", "#A0C8E8", "#F0C0B0", "#A0D0A0", "#C8A0E8", "#F5A06A"][i % 6]
      }));
      setDummyMembers(generated);
    } else {
      setDummyMembers([]);
    }
  }, [totalMembersCount]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text, rawText = null) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgId = Date.now();
    const newMsg = { id: msgId, text, mine: true, time };
    
    setMessages(prev => [...prev, newMsg]);
    setUndoId(msgId);
    
    setTimeout(() => {
      setUndoId(prev => (prev === msgId ? null : prev));
    }, 10000);
    
    setMode("main");
    setInput("");
    setShowKeyboard(false);
    
    if (group?.members === 1) return; // Nobody to reply to the creator yet!

    let replies = [
      <>Thanks for sharing! <FaSmile /></>,
      "That's really helpful!",
      <>I feel the same way <FaHandshake /></>,
      <>Great point! <FaThumbsUp /></>,
      <>So true! This community is amazing <FaHeart /></>,
    ];
    
    let numReplies = 1;
    
    if (rawText === "I need help") {
      replies = ["Are you okay?", "Do you need assistance?", "I'm here for you."];
      numReplies = 2; // Simulate more engagement for help
    } else if (rawText === "Thanks") {
      replies = ["You're welcome!", "Glad I could help."];
    } else if (rawText === "Okay") {
      replies = ["Alright.", "Got it.", null]; // sometimes no response
    } else if (rawText === "Give me some time") {
      replies = ["Take your time.", "No rush!", "We'll be here when you're ready.", null];
    } else if (rawText === "That's great!") {
      replies = ["Awesome!", "So happy to hear that!", <>Right? <FaSmile /></>, "Yay!"];
    } else if (rawText === "Can we talk?") {
      replies = ["Sure, I'm here.", "What's on your mind?", "Of course, go ahead.", "We're listening."];
      numReplies = 2; // Simulate more engagement for someone wanting to talk
    }

    const shuffledMembers = [...MEMBERS].sort(() => 0.5 - Math.random());
    const pickedMembers = shuffledMembers.slice(0, numReplies);
    
    const shuffledReplies = [...replies].sort(() => 0.5 - Math.random());
    const pickedReplies = shuffledReplies.slice(0, numReplies);

    pickedMembers.forEach((member, index) => {
      const reply = pickedReplies[index];
      if (reply !== null && reply !== undefined) {
        // Slight delays (1-3 seconds), stacked for multiple replies
        const delay = 1000 + Math.random() * 2000 + (index * 1500); 
        
        setTimeout(() => {
          setMessages(currentMessages => {
            // Undo Condition: If user undoes the message, do not generate reply
            const msgStillExists = currentMessages.some(m => m.id === msgId);
            if (!msgStillExists) return currentMessages;

            const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return [...currentMessages, {
              id: Date.now() + Math.random(), text: reply, mine: false,
              user: member.name, avatar: member.avatar, color: member.color, time: replyTime,
            }];
          });
        }, delay);
      }
    });
  };

  const undoLastMessage = () => {
    setMessages(prev => prev.filter(m => m.id !== undoId));
    setUndoId(null);
  };

  const startVoice = () => {
    setTranscribed("");
    setRecording(true);
    setPulse(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Voice recognition is not supported. Please use Google Chrome or Microsoft Edge.", "error");
      setRecording(false);
      setPulse(false);
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-MY";
    recog.interimResults = true;
    recog.continuous = false;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      const text = event.results[event.resultIndex][0].transcript;
      setTranscribed(text);
    };

    recog.onerror = (err) => {
      if (err.error === "not-allowed") {
        addToast("Microphone blocked! Please allow mic access in your browser.", "error");
      }
      setRecording(false);
      setPulse(false);
      setMode("main");
    };

    recog.onend = () => {
      setRecording(false);
      setPulse(false);
      setTranscribed(prev => {
        if (!prev?.trim()) {
          addToast("Could not catch that. Please try speaking again.", "warning");
          setMode("main");
          return "";
        }
        setMode("voiceConfirm");
        return prev;
      });
    };

    try { recog.start(); } catch (e) {
      setRecording(false);
      setMode("main");
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 16px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button
          aria-label="Back"
          onClick={onBack}
          style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0", padding: "8px 10px", minWidth: 44, minHeight: 44 }}
        ><FaArrowLeft /></button>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: avatarColor + "44", border: `2px solid ${avatarColor}88`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
          {avatar}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}>{name}</p>
          <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "system-ui, sans-serif" }}>{totalMembersCount} members</p>
        </div>
        <button
          aria-label="Group settings"
          onClick={() => setShowMembersModal(true)}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6B3FA0", padding: "8px 10px", minWidth: 44, minHeight: 44 }}
        ><FaCog /></button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, opacity: 0.7 }}>
            <FaComment style={{ fontSize: 64, color: "#D0B8F5" }} />
            <p style={{ fontSize: 18, color: "#6B3FA0", fontWeight: 700, fontFamily: "system-ui, sans-serif", textAlign: "center", margin: 0, padding: "0 24px" }}>
              No messages yet — start the conversation!
            </p>
          </div>
        ) : (
          <>
            {/* Date chip */}
            <div style={{ textAlign: "center" }}>
              <span style={{ background: "#E8E0F8", borderRadius: 12, padding: "4px 14px", fontSize: 12, color: "#6B3FA0", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>Today</span>
            </div>

            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.mine ? "flex-end" : "flex-start", width: "100%" }}>
                {!msg.mine && msg.user && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: msg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{msg.avatar}</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#6B3FA0", fontFamily: "system-ui, sans-serif" }}>{msg.user}</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: msg.mine ? "flex-end" : "flex-start" }}>
                  {msg.mine && msg.id === undoId && (
                    <button
                      onClick={undoLastMessage}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#6B3FA0", padding: "8px", fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap" }}
                    ><FaUndo /> UNDO</button>
                  )}
                  <div style={{
                    maxWidth: "75%",
                    background: msg.mine ? "linear-gradient(135deg,#6B3FA0,#8B5CC8)" : "white",
                    color: msg.mine ? "white" : "#2D1B69",
                    borderRadius: msg.mine ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                    padding: "14px 18px", fontSize: 16, fontFamily: "system-ui, sans-serif",
                    lineHeight: 1.5, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}>
                    {msg.text}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "#BBB", margin: "3px 4px 0", fontFamily: "system-ui, sans-serif", alignSelf: msg.mine ? "flex-end" : "flex-start" }}>{msg.time}</span>
              </div>
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Bottom Action Panel */}
      <div style={{ background: "white", padding: "14px 16px 24px", borderTop: "1px solid #E8E0F8", flexShrink: 0 }}>

        {/* MAIN mode */}
        {mode === "main" && (
          <>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#AAA", textAlign: "center", margin: "0 0 12px", fontFamily: "system-ui, sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>ACCESSIBLE ACTIONS</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <button
                onClick={() => { setMode("voiceRecord"); startVoice(); }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "#FFF0E5", border: "2px solid #F5A06A", borderRadius: 22, padding: "16px 10px", cursor: "pointer" }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg,#F5A06A,#E87030)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}><FaMicrophone /></div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Speech to Text</span>
              </button>
              <button
                onClick={() => setMode("quickMsg")}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "#FFFBEA", border: "2px solid #F5C030", borderRadius: 22, padding: "16px 10px", cursor: "pointer" }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg,#F5C030,#E89010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}><FaLightbulb /></div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Taps</span>
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message here..."
                rows={2}

                readOnly

                onFocus={() => setShowKeyboard(true)}
                
                style={{ flex: 1, borderRadius: 16, border: "2px solid #D0B8F5", padding: "12px 14px", fontSize: 16, resize: "none", fontFamily: "system-ui, sans-serif", outline: "none", background: "#F9F8FF", color: "#2D1B69", cursor:"pointer"}} 
              />
              <button
                aria-label="Send message"
                onClick={() => { if (input.trim()) { setTranscribed(input); setMode("voiceConfirm"); } }}
                style={{ width: 58, height: 58, borderRadius: 29, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              ><FaPaperPlane /></button>
            </div>
          </>
        )}

        {/* VOICE RECORDING mode */}
        {mode === "voiceRecord" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "8px 0" }}>
            <span style={{ fontSize: 15, color: "#6B3FA0", fontWeight: 700, fontFamily: "system-ui, sans-serif" }}><FaMicrophone /> Speech To Text</span>
            <div style={{
              width: 88, height: 88, borderRadius: 44,
              background: "linear-gradient(135deg,#F5A06A,#E87030)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
              boxShadow: pulse ? "0 0 0 18px rgba(245,160,106,0.2)" : "0 6px 20px rgba(245,160,106,0.3)",
              transition: "box-shadow 0.4s",
            }}>
              {recording ? <FaBroadcastTower /> : <FaMagic />}
            </div>
            <p style={{ fontSize: 16, color: "#E87030", fontWeight: 700, fontFamily: "system-ui, sans-serif", margin: 0 }}>
              {recording ? "Listening..." : "Processing..."}
            </p>
            <div style={{ width: "100%", background: "#F5F0FF", borderRadius: 14, border: "2px dashed #D0B8F5", padding: "12px", fontSize: 15, color: "#2D1B69", fontFamily: "system-ui, sans-serif", minHeight: 44, textAlign: "center" }}>
              {transcribed || "Transcribing..."}
            </div>
          </div>
        )}

        {/* VOICE CONFIRM mode */}
        {mode === "voiceConfirm" && (
          <div style={{ background: "#F0EBFF", borderRadius: 22, padding: 18, border: "3px solid #6B3FA0" }}>
            <p style={{ fontSize: 13, color: "#6B3FA0", fontWeight: 800, margin: "0 0 4px", fontFamily: "system-ui, sans-serif", letterSpacing: 0.5 }}><FaExclamationTriangle /> ANTI-ACCIDENTAL PREVIEW</p>
            <p style={{ fontSize: 14, color: "#2D1B69", fontWeight: 500, margin: "0 0 10px", fontFamily: "system-ui, sans-serif" }}>Review your message before sending to the group:</p>
            <textarea
              value={transcribed}
              onChange={e => setTranscribed(e.target.value)}
              rows={3}
              style={{ width: "100%", boxSizing: "border-box", background: "white", borderRadius: 14, padding: "12px 16px", fontSize: 17, fontWeight: "bold", color: "#2D1B69", fontFamily: "system-ui, sans-serif", marginBottom: 16, border: "2px solid #D0B8F5", lineHeight: 1.4, outline: "none", resize: "none" }}
            />
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => setMode("main")} style={{ flex: 1, height: sz.height, borderRadius: sz.borderRadius, background: "#E0E0E0", color: "#444", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => sendMessage(transcribed)} style={{ flex: 1, height: sz.height, borderRadius: sz.borderRadius, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>SEND TO GROUP</button>
              <button onClick={() => setMode("main")} style={{ flex: 1, height: 54, borderRadius: 16, background: "#E0E0E0", color: "#444", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>CANCEL</button>
              <button onClick={() => sendMessage(transcribed)} style={{ flex: 1, height: 54, borderRadius: 16, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(107,63,160,0.3)" }}>SEND</button>
            </div>
          </div>
        )}

        {/* QUICK MSG mode */}
        {mode === "quickMsg" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <button onClick={() => setMode("main")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B3FA0", padding: "8px", minWidth: 44, minHeight: 44 }}><FaArrowLeft /> Back</button>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#2D1B69", fontFamily: "system-ui, sans-serif" }}>Quick Group Taps</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {quickReplies.map(r => (
                <button
                  key={r.label}
                  onClick={() => sendMessage(r.label)}
                  style={{ height: sz.height, borderRadius: sz.borderRadius, background: r.color, color: "white", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 3px 10px rgba(0,0,0,0.1)", padding: "0 12px" }}
                  onClick={() => sendMessage(r.label, r.rawText)}
                  style={{ height: 54, borderRadius: 24, background: r.color, color: "white", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 3px 10px rgba(0,0,0,0.1)", padding: "0 12px" }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings / Members modal */}
      {showMembersModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowMembersModal(false)}
        >
          <div
            style={{ background: "white", borderRadius: "32px 32px 0 0", padding: "24px 20px 32px", width: "100%", maxHeight: "75%", display: "flex", flexDirection: "column" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#D0B8F5", margin: "0 auto 18px", flexShrink: 0 }} />
            <p style={{ fontSize: 19, fontWeight: 800, color: "#2D1B69", margin: "0 0 16px", fontFamily: "system-ui, sans-serif", flexShrink: 0 }}> <FaCog /> Group Settings </p>

            {/* Members label */}
            <p style={{ fontSize: 12, fontWeight: 700, color: "#AAA", margin: "0 0 10px", fontFamily: "system-ui, sans-serif", letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>
              MEMBERS ({totalMembersCount})
            </p>

            {/* Scrollable members list — fixed height so Leave button always shows */}
            <div style={{ overflowY: "auto", maxHeight: 220, display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {/* Me */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#F0E8FF", borderRadius: 16, padding: "10px 14px", flexShrink: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: 21, background: "#D0C0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}><FaUser /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}>You</p>
                  <p style={{ fontSize: 12, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Member</p>
                </div>
              </div>

              {/* Other members */}
              {group?.members !== 1 && [...MEMBERS, ...dummyMembers].map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#F8F8FF", borderRadius: 16, padding: "10px 14px", flexShrink: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 21, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}>{m.name}</p>
                    <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "system-ui, sans-serif" }}>Member</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#F0EBF8", marginBottom: 14, flexShrink: 0 }} />

            {/* Creator Actions */}
            {group?.isCreator && (
              <div style={{ display: "flex", gap: 10, marginBottom: 14, flexShrink: 0 }}>
                <button
                  onClick={() => { setShowMembersModal(false); setEditGroupModal(true); setEditName(group.name); setEditDesc(group.desc); }}
                  style={{ flex: 1, height: 48, borderRadius: 16, background: "#E8E0F8", color: "#6B3FA0", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
                >
                  Edit Group
                </button>
                <button
                  onClick={() => { setShowMembersModal(false); setDeleteConfirm(true); }}
                  style={{ flex: 1, height: 48, borderRadius: 16, background: "#FFF5F5", color: "#E83030", border: "2px solid #E83030", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
                >
                  Delete Group
                </button>
              </div>
            )}

            {/* Leave Group — always visible at bottom */}
            <button
              onClick={() => setLeaveConfirm(true)}
              style={{
                width: "100%", height: sz.height, borderRadius: sz.borderRadius,
                border: "2px solid #E83030", background: "#FFF5F5",
                color: "#E83030", cursor: "pointer",
                fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                flexShrink: 0,
              }}
            > <FaSignOutAlt /> Leave Group </button>
          </div>
        </div>
      )}

      {/* Leave Group confirmation */}
      {leaveConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}
        >
          <div style={{ background: "white", borderRadius: 32, padding: "32px 24px", width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}><FaSignOutAlt /></div>
            <p style={{ fontSize: 21, fontWeight: 800, color: "#2D1B69", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>Leave {name}?</p>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 28, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
              You will no longer receive messages from this group. You can rejoin anytime.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => {
                  setLeaveConfirm(false);
                  setShowMembersModal(false);
                  if (onLeaveGroup) onLeaveGroup(group?.id);
                }}
                style={{ width: "100%", height: sz.height, borderRadius: sz.borderRadius, background: "#E83030", color: "white", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(232,48,48,0.3)" }}
              >
                Yes, Leave Group
              </button>
              <button
                onClick={() => setLeaveConfirm(false)}
                style={{ width: "100%", height: sz.height, borderRadius: sz.borderRadius, background: "white", color: "#666", border: "2px solid #E8E0F8", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {editGroupModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}
        >
          <div style={{ background: "white", borderRadius: 32, padding: "28px 24px", width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#6B3FA0", margin: "0 0 20px", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
              <FaCog /> Edit Group
            </p>
            
            <p style={{ fontSize: 14, fontWeight: 700, color: "#888", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>GROUP NAME</p>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              style={{ width: "100%", height: 50, borderRadius: 16, border: "2px solid #E8E0F8", padding: "0 16px", fontSize: 16, fontFamily: "system-ui, sans-serif", boxSizing: "border-box", marginBottom: 16 }}
            />

            <p style={{ fontSize: 14, fontWeight: 700, color: "#888", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>DESCRIPTION</p>
            <textarea
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              rows={3}
              style={{ width: "100%", borderRadius: 16, border: "2px solid #E8E0F8", padding: "12px 16px", fontSize: 16, fontFamily: "system-ui, sans-serif", boxSizing: "border-box", marginBottom: 24, resize: "none" }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => {
                  if (editName.trim()) {
                    onEditGroup({ ...group, name: editName.trim(), desc: editDesc.trim() });
                    setEditGroupModal(false);
                  }
                }}
                style={{ width: "100%", height: 56, borderRadius: 20, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditGroupModal(false)}
                style={{ width: "100%", height: 56, borderRadius: 20, background: "white", color: "#666", border: "2px solid #E8E0F8", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group confirmation */}
      {deleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: "absolute", inset: 0, background: "rgba(45,27,105,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}
        >
          <div style={{ background: "white", borderRadius: 32, padding: "32px 24px", width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 12, color: "#E83030" }}><FaExclamationTriangle /></div>
            <p style={{ fontSize: 21, fontWeight: 800, color: "#2D1B69", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>Delete {name}?</p>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 28, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
              This will permanently delete the group and all its messages. This action cannot be undone.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => {
                  setDeleteConfirm(false);
                  setShowMembersModal(false);
                  if (onDeleteGroup) onDeleteGroup(group?.id);
                }}
                style={{ width: "100%", height: 58, borderRadius: 20, background: "#E83030", color: "white", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 4px 14px rgba(232,48,48,0.3)" }}
              >
                Yes, Delete Group
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                style={{ width: "100%", height: 58, borderRadius: 20, background: "white", color: "#666", border: "2px solid #E8E0F8", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {mode === "main" && showKeyboard &&(
        <ReactiveKeyboard 
          value={input} 
          onChange={setInput} 
          onSubmit={() => sendMessage(input)} 
        />
      )}
    </div>
  );
}