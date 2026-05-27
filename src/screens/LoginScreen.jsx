import { useState } from "react";

const inputStyle = {
  width: "100%",
  height: 64,
  borderRadius: 16,
  border: "2px solid #E0D6F5",
  fontSize: 18,
  padding: "0 20px 0 56px",
  background: "#F5F0FF",
  color: "#2D1B69",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "system-ui, sans-serif",
  transition: "border 0.2s",
};

const iconWrap = {
  position: "absolute",
  left: 18,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 22,
  pointerEvents: "none",
};

export default function LoginScreen({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#FAFAFA",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>
      {/* Purple header curve */}
      <div style={{
        background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        padding: "52px 32px 36px",
        textAlign: "center",
        flexShrink: 0,
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          background: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: 30,
        }}>🤚</div>
        <h1 style={{
          color: "white",
          fontSize: 32,
          fontWeight: 700,
          margin: 0,
          fontFamily: "system-ui, sans-serif",
        }}>Login</h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 15,
          margin: "6px 0 0",
          fontFamily: "system-ui, sans-serif",
        }}>Welcome back to EzTouch</p>
      </div>

      {/* Form */}
      <div style={{ padding: "36px 28px", flex: 1 }}>

        {/* Username */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: "block",
            fontSize: 16,
            fontWeight: 600,
            color: "#4A2E8A",
            marginBottom: 8,
            fontFamily: "system-ui, sans-serif",
          }}>Username</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>👤</span>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused("")}
              style={{
                ...inputStyle,
                border: focused === "username" ? "2px solid #7B4CC8" : "2px solid #E0D6F5",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 12 }}>
          <label style={{
            display: "block",
            fontSize: 16,
            fontWeight: 600,
            color: "#4A2E8A",
            marginBottom: 8,
            fontFamily: "system-ui, sans-serif",
          }}>Password</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>🔒</span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              style={{
                ...inputStyle,
                paddingRight: 56,
                border: focused === "password" ? "2px solid #7B4CC8" : "2px solid #E0D6F5",
              }}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 20,
                padding: 4,
              }}
            >{showPass ? "🙈" : "👁️"}</button>
          </div>
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginBottom: 32 }}>
          <button style={{
            background: "none",
            border: "none",
            color: "#7B4CC8",
            fontSize: 15,
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
          }}>Forgot Password?</button>
        </div>

        {/* Login button */}
        <button
          onClick={onLogin}
          style={{
            width: "100%",
            height: 64,
            borderRadius: 18,
            background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
            color: "white",
            fontSize: 20,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            marginBottom: 16,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 0.5,
            boxShadow: "0 6px 20px rgba(107, 63, 160, 0.4)",
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Login
        </button>

        {/* Register button */}
        <button
          onClick={onRegister}
          style={{
            width: "100%",
            height: 64,
            borderRadius: 18,
            background: "white",
            color: "#6B3FA0",
            fontSize: 20,
            fontWeight: 700,
            border: "2px solid #D0B8F5",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 0.5,
            transition: "transform 0.1s",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Register
        </button>

        {/* Accessibility note */}
        <div style={{
          marginTop: 28,
          padding: "14px 18px",
          background: "#F0E8FF",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>♿</span>
          <p style={{
            margin: 0,
            fontSize: 13,
            color: "#5A3A8A",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.4,
          }}>Accessibility features are enabled for easier navigation</p>
        </div>
      </div>
    </div>
  );
}