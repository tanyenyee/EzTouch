import { useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeDashboard from "./screens/HomeDashboard";
import ChatList from "./screens/ChatList";
import ChatScreen from "./screens/ChatScreen";
import VoiceMessageScreen from "./screens/VoiceMessageScreen";

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedContact, setSelectedContact] = useState(null);

  const go = (s) => setScreen(s);

  const openChat = (contact) => {
    setSelectedContact(contact);
    go("chat");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#1a1a2e",
    }}>
      <div style={{
        width: 390,
        height: 844,
        borderRadius: 44,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 0 0 10px #111, 0 0 0 12px #333",
        background: "#fff",
      }}>
        {screen === "splash" && (
          <SplashScreen onNext={() => go("login")} />
        )}
        {screen === "login" && (
          <LoginScreen
            onLogin={() => go("home")}
            onRegister={() => go("register")}
          />
        )}
        {screen === "register" && (
          <RegisterScreen
            onSignUp={() => go("login")}
            onBack={() => go("login")}
          />
        )}
        {screen === "home" && (
          <HomeDashboard
            onChat={() => go("chatlist")}
            onCommunity={() => alert("🚧 Community — coming soon!")}
            onProfile={() => alert("🚧 Profile — coming soon!")}
            onSettings={() => alert("🚧 Settings — coming soon!")}
          />
        )}
        {screen === "chatlist" && (
          <ChatList
            onBack={() => go("home")}
            onOpenChat={openChat}
          />
        )}
        {screen === "chat" && (
          <ChatScreen
            contact={selectedContact}
            onBack={() => go("chatlist")}
            onVoiceMessage={() => go("voice")}
            onCall={() => alert("📞 Calling... (Confirmation mode active)")}
          />
        )}
        {screen === "voice" && (
          <VoiceMessageScreen
            contact={selectedContact}
            onBack={() => go("chat")}
            onSend={(msg) => {
              alert(`✅ Message sent: "${msg}"`);
              go("chat");
            }}
          />
        )}
      </div>
    </div>
  );
}