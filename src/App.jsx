import { useState } from "react";
import { SizeProvider } from "./context/SizeContext";
import SplashScreen from "./screens/SplashScreen";
import { FaCat, FaGraduationCap, FaHandsHelping, FaBook, FaUser } from "react-icons/fa";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeDashboard from "./screens/HomeDashboard";
import ChatList from "./screens/Chatlist";
import ChatScreen from "./screens/Chatscreen";
import CallingScreen from "./screens/Callingscreen";
import AddContactScreen from "./screens/Addcontactscreen";
import CommunityScreen, { initPosts } from "./screens/Communityscreen";
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
import { ToastProvider } from "./components/ToastProvider";

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [currentUser, setCurrentUser] = useState(() => {
    const session = localStorage.getItem("eztouch_session");
    return session ? JSON.parse(session) : {
      username: "Username",
      email: "user@example.com",
      phone: "+123 456 7890",
      joined: "January 15, 2021",
      bio: ""
    };
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [communityTab, setCommunityTab] = useState("discover");
  const [posts, setPosts] = useState(initPosts);
  const [myGroups, setMyGroups] = useState([
    { id: 1, name: "Pet Lovers", avatar: <FaCat />, color: "#C8A0E8", unread: 67, members: 15 },
    { id: 2, name: "University Malaya", avatar: <FaGraduationCap />, color: "#E8C0A0", unread: 20, members: 12 },
    { id: 3, name: "Helping Each Other", avatar: <FaHandsHelping />, color: "#F5A0A0", unread: 0, members: 18 },
    { id: 4, name: "Class 2025", avatar: <FaBook />, color: "#A0D0E8", unread: 0, members: 14 },
  ]);
  const [customGroups, setCustomGroups] = useState([]);

  const leaveGroup = (groupId) => setMyGroups(prev => prev.filter(g => g.id !== groupId));
  const deleteGroup = (groupId) => {
    setCustomGroups(prev => prev.filter(g => g.id !== groupId));
    setMyGroups(prev => prev.filter(g => g.id !== groupId));
  };
  const editGroup = (updatedGroup) => {
    setCustomGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    setMyGroups(prev => prev.map(g => g.id === updatedGroup.id ? { ...g, ...updatedGroup, avatar: updatedGroup.icon } : g));
    if (selectedGroup?.id === updatedGroup.id) {
      setSelectedGroup(prev => ({ ...prev, ...updatedGroup, avatar: updatedGroup.icon }));
    }
  };
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

  const handlePost = () => {
    const newPost = {
      id: Date.now(),
      user: "You",
      avatar: <FaUser />,
      color: "#D0C0F0",
      text: postText,
      image: postImage,
      likes: 0,
      time: "Just now",
      commentsList: []
    };
    setPosts(prev => [newPost, ...prev]);
    setCommunityTab("discover");
    go("community");
  };

  return (
    //<SizeProvider>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#1a1a2e" }}>
      <div style={{ width: 390, height: 844, borderRadius: 44, overflow: "hidden", position: "relative", boxShadow: "0 0 0 10px #111, 0 0 0 12px #333", background: "#fff" }}>
        <ToastProvider>
          {screen === "splash" && <SplashScreen onNext={() => go("login")} />}
          {screen === "login" && <LoginScreen onLogin={(user) => { setCurrentUser(user); go("home"); }} onRegister={() => go("register")} />}
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
          {screen === "community" && <CommunityScreen onBack={() => go("home")} onCreatePost={() => go("createpost")} onJoinGroup={() => go("joingroup")} onOpenGroup={(g) => { setSelectedGroup(g); setCommunityTab("mygroup"); go("groupchat"); }} defaultTab={communityTab} myGroups={myGroups} posts={posts} setPosts={setPosts} />}
          {screen === "createpost" && <CreatePostScreen onBack={() => { setCommunityTab("discover"); go("community"); }} onNext={(text, image) => { setPostText(text); setPostImage(image); go("postpreview"); }} />}
          {screen === "postpreview" && <PostPreviewScreen postText={postText} postImage={postImage} onBack={() => go("createpost")} onPost={handlePost} />}
          {screen === "joingroup" && <JoinGroupScreen 
            myGroups={myGroups}
            customGroups={customGroups}
            onBack={() => { setCommunityTab("mygroup"); go("community"); }} 
            onJoinedGroup={(group) => { setMyGroups(prev => [...prev, { ...group, isNew: true }]); }} 
            onGoToGroup={(group) => { setSelectedGroup({...group, isNew: true}); setCommunityTab("mygroup"); go("groupchat"); }}
            onCreateGroup={(group) => { 
              setCustomGroups(prev => [...prev, group]); 
              setMyGroups(prev => [...prev, { ...group, unread: 0, avatar: group.icon, isNew: true, isCreator: true }]); 
              setCommunityTab("mygroup"); 
              go("community"); 
            }}
          />}
          {screen === "groupchat" && <GroupChatScreen group={selectedGroup} onBack={() => go("community")} onLeaveGroup={(id) => { leaveGroup(id); go("community"); }} onDeleteGroup={(id) => { deleteGroup(id); go("community"); }} onEditGroup={editGroup} />}

        {/* ── Settings Module ── */}
        {screen === "settings" && <SettingsScreen onBack={() => go("home")} onButtonSize={() => go("buttonsize")} onSafeInteraction={() => go("safeinteraction")} onConfirmation={() => go("confirmation")} onUndo={() => go("undosetting")} />}
        {screen === "buttonsize" && <ButtonSizeScreen onBack={() => go("settings")} />}
        {screen === "safeinteraction" && <SafeInteractionScreen onBack={() => go("settings")} />}
        {screen === "confirmation" && <ConfirmationModeScreen onBack={() => go("settings")} />}
        {screen === "undosetting" && <UndoSettingScreen onBack={() => go("settings")} />}
          {/* ── Profile Module ── */}
          {screen === "profile" && <ProfileScreen profile={currentUser} onBack={() => go("home")} onEdit={() => go("editprofile")} onLogout={() => { localStorage.removeItem("eztouch_session"); go("login"); }} />}
          {screen === "editprofile" && <EditProfileScreen profile={currentUser} onBack={() => go("profile")} onSaved={(updatedUser) => { setCurrentUser(updatedUser); go("profile"); }} />}

          {/* ── Settings Module ── */}
          {screen === "settings" && <SettingsScreen onBack={() => go("home")} onButtonSize={() => go("buttonsize")} onSafeInteraction={() => go("safeinteraction")} onConfirmation={() => go("confirmation")} onUndo={() => go("undosetting")} />}
          {screen === "buttonsize" && <ButtonSizeScreen onBack={() => go("settings")} onSave={() => {}} />}
          {screen === "safeinteraction" && <SafeInteractionScreen onBack={() => go("settings")} />}
          {screen === "confirmation" && <ConfirmationModeScreen onBack={() => go("settings")} />}
          {screen === "undosetting" && <UndoSettingScreen onBack={() => go("settings")} />}
        </ToastProvider>
      </div>
    </div>
   //</SizeProvider> 
  );
}