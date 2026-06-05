import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
import { useSizeContext } from "../context/SizeContext";
import { useToast } from "../components/ToastProvider";

const inputStyle = {
  width: "100%",
  height: 62,
  borderRadius: 16,
  border: "2px solid #E0D6F5",
  fontSize: 17,
  padding: "0 20px 0 54px",
  background: "#F5F0FF",
  color: "#2D1B69",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "system-ui, sans-serif",
  transition: "border 0.2s",
};

const Field = ({ label, icon, type = "text", placeholder, value, onChange, focused, onFocus, onBlur, name }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: "block",
      fontSize: 15,
      fontWeight: 600,
      color: "#4A2E8A",
      marginBottom: 7,
      fontFamily: "system-ui, sans-serif",
    }}>{label}</label>
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute",
        left: 16,
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: 20,
        pointerEvents: "none",
        color: "#6B3FA0",
      }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          ...inputStyle,
          border: focused === name ? "2px solid #7B4CC8" : "2px solid #E0D6F5",
        }}
      />
    </div>
  </div>
);

export default function RegisterScreen({ onSignUp, onBack }) {
  const { sz } = useSizeContext();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [focused, setFocused] = useState("");
  const [agreed, setAgreed] = useState(false);
  const { addToast } = useToast();

  const update = key => e => setForm({ ...form, [key]: e.target.value });

  const handleSignUp = () => {
    if (!form.username || !form.email || !form.password || !form.confirm) {
      addToast("Please fill in all fields.", "warning");
      return;
    }
    if (form.password !== form.confirm) {
      addToast("Passwords do not match.", "error");
      return;
    }
    if (!agreed) {
      addToast("You must agree to the Terms of Service and Privacy Policy.", "warning");
      return;
    }

    const users = JSON.parse(localStorage.getItem("eztouch_users") || "[]");
    if (users.some(u => u.username.toLowerCase() === form.username.toLowerCase())) {
      addToast("Username is already taken.", "error");
      return;
    }
    if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      addToast("Email is already registered.", "error");
      return;
    }

    const newUser = {
      username: form.username,
      email: form.email,
      password: form.password,
      phone: "+123 456 7890",
      joined: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      bio: ""
    };

    users.push(newUser);
    localStorage.setItem("eztouch_users", JSON.stringify(users));
    addToast("Registration successful! Please log in.", "success");
    onSignUp();
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#FAFAFA",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        padding: "48px 32px 30px",
        textAlign: "center",
        flexShrink: 0,
      }}>
        <h1 style={{
          color: "white",
          fontSize: 30,
          fontWeight: 700,
          margin: 0,
          fontFamily: "system-ui, sans-serif",
        }}>Register</h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 14,
          margin: "6px 0 0",
          fontFamily: "system-ui, sans-serif",
        }}>Create your EzTouch account</p>
      </div>

      {/* Form */}
      <div style={{ padding: "28px 28px 36px", flex: 1 }}>

        <Field
          label="Username"
          icon={<FaUser style={{ color: "currentColor" }} />}
          placeholder="Choose a username"
          value={form.username}
          onChange={update("username")}
          focused={focused}
          onFocus={() => setFocused("username")}
          onBlur={() => setFocused("")}
          name="username"
        />

        <Field
          label="Email"
          icon={<FaEnvelope style={{ color: "currentColor" }} />}
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={update("email")}
          focused={focused}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused("")}
          name="email"
        />

        <Field
          label="Password"
          icon={<FaLock style={{ color: "currentColor" }} />}
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={update("password")}
          focused={focused}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused("")}
          name="password"
        />

        <Field
          label="Confirm Password"
          icon={<FaLock style={{ color: "currentColor" }} />}
          type="password"
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={update("confirm")}
          focused={focused}
          onFocus={() => setFocused("confirm")}
          onBlur={() => setFocused("")}
          name="confirm"
        />

        {/* Terms */}
        <div
          onClick={() => setAgreed(!agreed)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            cursor: "pointer",
            padding: "12px 0",
          }}
        >
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: `2px solid ${agreed ? "#7B4CC8" : "#C0A8E8"}`,
            background: agreed ? "#7B4CC8" : "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 16,
            color: "white",
            transition: "all 0.2s",
          }}>
            {agreed ? <FaCheck style={{ color: "currentColor" }} /> : ""}
          </div>
          <span style={{
            fontSize: 14,
            color: "#5A3A8A",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.4,
          }}>
            I agree to the <span style={{ color: "#7B4CC8", fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: "#7B4CC8", fontWeight: 600 }}>Privacy Policy</span>
          </span>
        </div>

        {/* Sign Up button */}
        <button
          onClick={handleSignUp}
          style={{
            width: "100%",
            height: sz.height,
            borderRadius: sz.borderRadius,
            background: "linear-gradient(135deg, #6B3FA0, #8B5CC8)",
            color: "white",
            fontSize: sz.fontSize,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            marginBottom: 14,
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 6px 20px rgba(107, 63, 160, 0.4)",
            transition: "transform 0.1s",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Sign Up
        </button>

        {/* Back to Login */}
        <button
          onClick={onBack}
          style={{
            width: "100%",
            height: sz.height,
            borderRadius: sz.borderRadius,
            background: "white",
            color: "#6B3FA0",
            fontSize: sz.fontSize,
            fontWeight: 700,
            border: "2px solid #D0B8F5",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
            transition: "transform 0.1s",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}