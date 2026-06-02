import { useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import { FaCat, FaGraduationCap, FaHandsHelping, FaBook, FaUser } from "react-icons/fa";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeDashboard from "./screens/HomeDashboard";
import ChatList from "./screens/Chatlist";
import ChatScreen from "./screens/Chatscreen";
import CallingScreen from "./screens/Callingscreen";
import AddContactScreen from "./screens/Addcontactscreen";
import CommunityScreen from "./screens/Communityscreen";
import CreatePostScreen from "./screens/Createpostscreen";
import PostPreviewScreen from "./screens/Postpreviewscreeen";
import JoinGroupScreen from "./screens/Joingroupscreen";
import GroupChatScreen from "./screens/Groupchatscreen";
import ProfileScreen from "./screens/Profilescreen";
import EditProfileScreen from "./screens/Editprofilescreen";
import SettingsScreen from "./screens/Settingsscreen";
import ButtonSizeScreen from "./screens/Buttonsizescreen";
import SafeInteractionScreen from "./screens/Safeinteractionscreen";
import ConfirmationModeScreen from "./screens/Confirmationmodescreen";
import UndoSettingScreen from "./screens/Undosettingscreen";

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [postText, setPostText] = useState("");
  const [communityTab, setCommunityTab] = useState("discover");
  const [myGroups, setMyGroups] = useState([
    { id: 1, name: "Pet Lovers", avatar: <FaCat />, color: "#C8A0E8", unread: 67, members: 312 },
    { id: 2, name: "University Malaya", avatar: <FaGraduationCap />, color: "#E8C0A0", unread: 20, members: 850 },
    { id: 3, name: "Helping Each Other", avatar: <FaHandsHelping />, color: "#F5A0A0", unread: 0, members: 428 },
    { id: 4, name: "Class 2025", avatar: <FaBook />, color: "#A0D0E8", unread: 0, members: 65 },
  ]);

  const leaveGroup = (groupId) => setMyGroups(prev => prev.filter(g => g.id !== groupId));
  const [contacts, setContacts] = useState({
    recent: [
      { id: 1, name: "Boyfriend", avatar: <FaUser />, unread: 5, color: "#C4A882" },
    ],
    others: [
      { id: 2, name: "Mummy", avatar: <FaUser />, unread: 9, color: "#E8A0A0" },
      { id: 3, name: "Xiao Mei", avatar: <FaUser />, unread: 0, color: "#F0C0B0" },
      { id: 4, name: "Alice", avatar: <FaUser />, unread: 0, color: "#A0C8A0" },
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
        {screen === "community" && <CommunityScreen onBack={() => go("home")} onCreatePost={() => go("createpost")} onJoinGroup={() => go("joingroup")} onOpenGroup={(g) => { setSelectedGroup(g); setCommunityTab("mygroup"); go("groupchat"); }} defaultTab={communityTab} myGroups={myGroups} />}
        {screen === "createpost" && <CreatePostScreen onBack={() => { setCommunityTab("discover"); go("community"); }} onNext={(text) => { setPostText(text); go("postpreview"); }} />}
        {screen === "postpreview" && <PostPreviewScreen postText={postText} onBack={() => go("createpost")} onPost={() => { setCommunityTab("discover"); go("community"); }} />}
        {screen === "joingroup" && <JoinGroupScreen onBack={() => { setCommunityTab("mygroup"); go("community"); }} />}
        {screen === "groupchat" && <GroupChatScreen group={selectedGroup} onBack={() => go("community")} onLeaveGroup={(id) => { leaveGroup(id); go("community"); }} />}

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