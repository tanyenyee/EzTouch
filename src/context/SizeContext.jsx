import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

export const sizeConfig = {
  Small: {
    fontSize: 13,
    height: 42,
    borderRadius: 10,
    tileLabelSize: 16,
    tileMinHeight: 68,
    tileIconSize: 42,
    tileIconFont: 20,
    tilePadding: "10px 16px",
    settingPadding: "10px 18px",
    avatarSize: 36,
    avatarFont: 18,
  },

  Medium: {
    fontSize: 17,
    height: 56,
    borderRadius: 16,
    tileLabelSize: 22,
    tileMinHeight: 95,
    tileIconSize: 60,
    tileIconFont: 28,
    tilePadding: "20px 24px",
    settingPadding: "16px 22px",
    avatarSize: 50,
    avatarFont: 24,
  },

  Large: {
    fontSize: 22,
    height: 72,
    borderRadius: 22,
    tileLabelSize: 30,
    tileMinHeight: 120,
    tileIconSize: 78,
    tileIconFont: 36,
    tilePadding: "28px 28px",
    settingPadding: "22px 22px",
    avatarSize: 62,
    avatarFont: 30,
  },
};

const SizeContext = createContext();

export function SizeProvider({ children }) {

  // =========================
  // SIZE SETTINGS
  // =========================

  const [size, setSize] = useState("Medium");

  // =========================
  // SAFE INTERACTION SETTINGS
  // =========================

  const [safeMode, setSafeMode] = useState(true);

  const [preventRapidTaps, setPreventRapidTaps] =
    useState(true);

  const [disableOneTap, setDisableOneTap] =
    useState(true);

  const [longPressMode, setLongPressMode] =
    useState(false);

  const [doubleTapMode, setDoubleTapMode] =
    useState(false);

  const [touchDelay, setTouchDelay] =
  useState(true);

  const [confirmationMode, setConfirmationMode] =
  useState(true);

  const [confirmSendMessage, setConfirmSendMessage] =
    useState(true);

  const [confirmCalls, setConfirmCalls] =
    useState(true);

  const [confirmationType, setConfirmationType] =
    useState("Popup Confirmation");

  const [confirmLikes, setConfirmLikes] =
  useState(false);
  const [undoOn, setUndoOn] =
useState(true);

const [undoSendMessage, setUndoSendMessage] =
useState(true);

const [undoDeleteMessage, setUndoDeleteMessage] =
useState(false);

const [undoLikeComment, setUndoLikeComment] =
useState(true);

const [undoGroupJoin, setUndoGroupJoin] =
useState(true);

const [undoDuration, setUndoDuration] =
useState("10 Seconds");

  // =========================
  // LOAD SAVED SETTINGS
  // =========================

  useEffect(() => {

    const savedSettings =
      JSON.parse(localStorage.getItem("easytouch-settings"));

    if (savedSettings) {

      setSize(savedSettings.size || "Medium");

      setSafeMode(savedSettings.safeMode ?? true);

      setPreventRapidTaps(
        savedSettings.preventRapidTaps ?? true
      );

      setDisableOneTap(
        savedSettings.disableOneTap ?? true
      );

      setLongPressMode(
        savedSettings.longPressMode ?? false
      );

      setDoubleTapMode(
        savedSettings.doubleTapMode ?? false
      );
      setTouchDelay(
        savedSettings.touchDelay ?? true
      );
      setConfirmationMode(
        savedSettings.confirmationMode ?? true
      );

      setConfirmSendMessage(
        savedSettings.confirmSendMessage ?? true
      );

      setConfirmCalls(
        savedSettings.confirmCalls ?? true
      );

      setConfirmationType(
        savedSettings.confirmationType ??
        "Popup Confirmation"
);
      setConfirmLikes(
  savedSettings.confirmLikes ?? false
);
    setUndoOn(
savedSettings.undoOn ?? true
);

setUndoSendMessage(
savedSettings.undoSendMessage ?? true
);

setUndoDeleteMessage(
savedSettings.undoDeleteMessage ?? false
);

setUndoLikeComment(
savedSettings.undoLikeComment ?? true
);

setUndoGroupJoin(
savedSettings.undoGroupJoin ?? true
);

setUndoDuration(
savedSettings.undoDuration ??
"10 Seconds"
);

    }

  }, []);

  // =========================
  // SAVE SETTINGS
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "easytouch-settings",

      JSON.stringify({
        size,
        safeMode,
        preventRapidTaps,
        disableOneTap,
        longPressMode,
        doubleTapMode,
        touchDelay,
        confirmationMode,
        confirmSendMessage,
        confirmCalls,
        confirmationType,
        confirmLikes,
        undoOn,
        undoSendMessage,
        undoDeleteMessage,
        undoLikeComment,
        undoGroupJoin,
        undoDuration,

      })
    );

  }, [
    size,
    safeMode,
    preventRapidTaps,
    disableOneTap,
    longPressMode,
    doubleTapMode,
    touchDelay,
    confirmationMode,
    confirmSendMessage,
    confirmCalls,
    confirmationType,
    confirmLikes,
    undoOn,
    undoSendMessage,
    undoDeleteMessage,
    undoLikeComment,
    undoGroupJoin,
    undoDuration,
  ]);

  return (
    <SizeContext.Provider
      value={{
        // size system
        size,
        sz: sizeConfig[size],
        setSize,

        // safe interaction system
        safeMode,
        setSafeMode,

        preventRapidTaps,
        setPreventRapidTaps,

        disableOneTap,
        setDisableOneTap,

        longPressMode,
        setLongPressMode,

        doubleTapMode,
        setDoubleTapMode,

        touchDelay,
        setTouchDelay,

        confirmationMode,
        setConfirmationMode,

        confirmSendMessage,
        setConfirmSendMessage,

        confirmCalls,
        setConfirmCalls,

        confirmationType,
        setConfirmationType,

        confirmLikes,
        setConfirmLikes,

        undoOn,
        setUndoOn,

        undoSendMessage,
        setUndoSendMessage,

        undoDeleteMessage,
        setUndoDeleteMessage,

        undoLikeComment,
        setUndoLikeComment,

        undoGroupJoin,
        setUndoGroupJoin,

        undoDuration,
        setUndoDuration,

      }}
    >
      {children}
    </SizeContext.Provider>
  );
}

export function useSizeContext() {
  return useContext(SizeContext);
}
