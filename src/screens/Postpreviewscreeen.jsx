import { useState } from "react";
import { FaGlassCheers, FaArrowLeft, FaExclamationTriangle, FaUser, FaHeart, FaComment, FaSmile, FaShare, FaRocket } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";

export default function PostPreviewScreen({ postText, postImage, onBack, onPost }) {
  const { sz } = useSizeContext();
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    setPosted(true);
  };

  if (posted) {
    return (
      <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}><FaGlassCheers /></div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#6B3FA0", fontFamily: "system-ui, sans-serif", margin: "0 0 12px", textAlign: "center" }}>Post Shared!</h2>
        <p style={{ fontSize: 16, color: "#888", fontFamily: "system-ui, sans-serif", textAlign: "center", marginBottom: 36, lineHeight: 1.6 }}>
          Your post is now live in the community feed. Others can like, react, and comment on it!
        </p>
        <button
          onClick={() => onPost && onPost()}
          style={{ width: "100%", height: sz.height, borderRadius: sz.borderRadius, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 6px 20px rgba(107,63,160,0.3)" }}
        >
          Back to Community
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#F4F0FF", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "48px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #E8E0F8", flexShrink: 0 }}>
        <button
          aria-label="Back"
          onClick={onBack}
          style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#6B3FA0", padding: "8px 12px", minWidth: 44, minHeight: 44 }}
        ><FaArrowLeft /></button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#6B3FA0", margin: 0, fontFamily: "system-ui, sans-serif" }}>Post Preview</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Info banner */}
        <div style={{ background: "#FFF8E8", border: "2px solid #F5C030", borderRadius: 18, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}><FaExclamationTriangle /></span>
          <p style={{ margin: 0, fontSize: 14, color: "#8A6010", fontFamily: "system-ui, sans-serif", fontWeight: 600, lineHeight: 1.5 }}>
            Review your post below before sharing with the community. Once posted, others will be able to see it.
          </p>
        </div>

        {/* Preview card */}
        <div style={{ background: "white", borderRadius: 24, padding: 20, boxShadow: "0 2px 16px rgba(107,63,160,0.1)" }}>
          {/* Post author */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "#D0C0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}><FaUser /></div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#2D1B69", margin: 0, fontFamily: "system-ui, sans-serif" }}>You</p>
              <p style={{ fontSize: 13, color: "#999", margin: 0, fontFamily: "system-ui, sans-serif" }}>Just now · Community Feed</p>
            </div>
          </div>

          {/* Post content */}
          <div style={{ background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
            {postText && (
              <p style={{ color: "white", fontSize: 17, fontFamily: "system-ui, sans-serif", margin: 0, lineHeight: 1.7, textAlign: "left", marginBottom: postImage ? 12 : 0 }}>
                {postText}
              </p>
            )}
            {!postText && !postImage && (
              <p style={{ color: "white", fontSize: 17, fontFamily: "system-ui, sans-serif", margin: 0, lineHeight: 1.7, textAlign: "left" }}>
                No content entered.
              </p>
            )}
            {postImage && (
              <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,255,255,0.3)" }}>
                <img src={postImage} alt="Post preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
              </div>
            )}
          </div>

          {/* Preview interactions (disabled) */}
          <div style={{ display: "flex", gap: 8, opacity: 0.4 }}>
            {[<><FaHeart /> Like</>, <><FaComment /> Comment</>, <><FaSmile /> React</>, <><FaShare /> Share</>].map(label => (
              <div key={label} style={{ flex: 1, height: 44, borderRadius: 14, background: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#888", fontFamily: "system-ui, sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Character count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", borderRadius: 16, padding: "12px 18px" }}>
          <span style={{ fontSize: 14, color: "#888", fontFamily: "system-ui, sans-serif" }}>Characters</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#6B3FA0", fontFamily: "system-ui, sans-serif" }}>{(postText || "").length}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ background: "white", padding: "16px 20px 32px", borderTop: "1px solid #E8E0F8", display: "flex", gap: 14, flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ flex: 1, height: sz.height, borderRadius: sz.borderRadius, background: "#F0EBF8", color: "#6B3FA0", border: "2px solid #D0B8F5", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}
        >
          <FaArrowLeft style={{ color: "currentColor", marginRight: 8 }} /> Edit Post
        </button>
        <button
          onClick={handlePost}
          style={{ flex: 2, height: sz.height, borderRadius: sz.borderRadius, background: "linear-gradient(135deg,#6B3FA0,#8B5CC8)", color: "white", border: "none", cursor: "pointer", fontSize: sz.fontSize, fontWeight: 700, fontFamily: "system-ui, sans-serif", boxShadow: "0 6px 20px rgba(107,63,160,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <FaRocket /> POST NOW
        </button>
      </div>
    </div>
  );
}