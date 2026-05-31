import { useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeDashboard from "./screens/HomeDashboard";
import ChatList from "./screens/ChatList";
import ChatScreen from "./screens/ChatScreen";
import CallingScreen from "./screens/CallingScreen";
import AddContactScreen from "./screens/AddContactScreen";
import CommunityScreen from "./screens/CommunityScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import PostPreviewScreen from "./screens/Postpreviewscreeen";
import JoinGroupScreen from "./screens/JoinGroupScreen";
import GroupChatScreen from "./screens/GroupChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ButtonSizeScreen from "./screens/ButtonSizeScreen";
import SafeInteractionScreen from "./screens/SafeInteractionScreen";
import ConfirmationModeScreen from "./screens/ConfirmationModeScreen";
import UndoSettingScreen from "./screens/UndoSettingScreen";

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [postText, setPostText] = useState("");
  const [contacts, setContacts] = useState({
    recent: [
      { id: 1, name: "Boyfriend", avatar: "🧍", unread: 5, color: "#C4A882" },
    ],
    others: [
      { id: 2, name: "Mummy", avatar: "👩", unread: 9, color: "#E8A0A0" },
      { id: 3, name: "Xiao Mei", avatar: "👧", unread: 0, color: "#F0C0B0" },
      { id: 4, name: "Alice", avatar: "👱‍♀️", unread: 0, color: "#A0C8A0" },
    ],
  });

  const go = (s) => setScreen(s);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#1a1a2e" }}>
      <div style={{ width: 390, height: 844, borderRadius: 44, overflow: "hidden", position: "relative", boxShadow: "0 0 0 10px #111, 0 0 0 12px #333", background: "#fff" }}>

        {screen === "splash" && <SplashScreen onNext={() => go("login")} />}
        {screen === "login" && <LoginScreen onLogin={() => go("home")} onRegister={() => go("register")} />}
        {screen === "register" && <RegisterScreen onSignUp={() => go("login")} onBack={() => go("login")} />}

        {screen === "home" && (
          <HomeDashboard onChat={() => go("chatlist")} onCommunity={() => go("community")} onProfile={() => go("profile")} onSettings={() => go("settings")} />
        )}

        {/* ── Chat Module ── */}
        {screen === "chatlist" && (
          <ChatList
            contacts={contacts}
            onBack={() => go("home")}
            onOpenChat={(c) => { setSelectedContact(c); go("chat"); }}
            onAddContact={() => go("addcontact")}
          />
        )}
        {screen === "chat" && <ChatScreen contact={selectedContact} onBack={() => go("chatlist")} onCall={(c) => { setSelectedContact(c); go("calling"); }} />}
        {screen === "calling" && <CallingScreen contact={selectedContact} onCancel={() => go("chat")} />}
        {screen === "addcontact" && (
          <AddContactScreen
            onBack={() => go("chatlist")}
            onAdded={(newContact) => {
              if (newContact) {
                setContacts(prev => ({ ...prev, recent: [newContact, ...(prev.recent || [])] }));
              }
              go("chatlist");
            }}
          />
        )}

        {/* ── Community Module ── */}
        {screen === "community" && <CommunityScreen onBack={() => go("home")} onCreatePost={() => go("createpost")} onJoinGroup={() => go("joingroup")} onOpenGroup={(g) => { setSelectedGroup(g); go("groupchat"); }} />}
        {screen === "createpost" && <CreatePostScreen onBack={() => go("community")} onNext={(text) => { setPostText(text); go("postpreview"); }} />}
        {screen === "postpreview" && <PostPreviewScreen postText={postText} onBack={() => go("createpost")} onPost={() => go("community")} />}
        {screen === "joingroup" && <JoinGroupScreen onBack={() => go("community")} />}
        {screen === "groupchat" && <GroupChatScreen group={selectedGroup} onBack={() => go("community")} />}

        {/* ── Profile Module ── */}
        {screen === "profile" && <ProfileScreen onBack={() => go("home")} onEdit={() => go("editprofile")} />}
        {screen === "editprofile" && <EditProfileScreen onBack={() => go("profile")} onSaved={() => go("profile")} />}

        {/* ── Settings Module ── */}
        {screen === "settings" && <SettingsScreen onBack={() => go("home")} onButtonSize={() => go("buttonsize")} onSafeInteraction={() => go("safeinteraction")} onConfirmation={() => go("confirmation")} onUndo={() => go("undosetting")} />}
        {screen === "buttonsize" && <ButtonSizeScreen onBack={() => go("settings")} onSave={() => {}} />}
        {screen === "safeinteraction" && <SafeInteractionScreen onBack={() => go("settings")} />}
        {screen === "confirmation" && <ConfirmationModeScreen onBack={() => go("settings")} />}
        {screen === "undosetting" && <UndoSettingScreen onBack={() => go("settings")} />}

      </div>
    </div>
  );
}