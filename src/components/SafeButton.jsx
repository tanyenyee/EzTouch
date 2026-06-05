import { useState, useRef } from "react";
import { useSizeContext } from "../context/SizeContext";
import ConfirmationModal from "./ConfirmationModal";

export default function SafeButton({
  children,
  onClick,
  style = {},
  confirmationFor = null,
}) {
  const {
    preventRapidTaps,
    longPressMode,
    doubleTapMode,
    touchDelay,
    confirmationMode,
    confirmSendMessage,
    confirmCalls,
    confirmLikes,
    confirmationType,
  } = useSizeContext();

  const [disabled, setDisabled] = useState(false);
  const clickLock = useRef(false);
  const [tapCount, setTapCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const pressTimer = useRef(null);
  const tapResetTimer = useRef(null);

  // =========================
  // EXECUTE FINAL ACTION
  // =========================
  const executeProtectedAction = () => {
    onClick();

    // RAPID TAP PROTECTION
    if (preventRapidTaps) {
      // Synchronously lock immediately before the asynchronous state update
      clickLock.current = true;
      setDisabled(true);

      setTimeout(() => {
        clickLock.current = false;
        setDisabled(false);
      }, 1000);
    }
  };

  // Helper to handle double-tap sequence processing safely with React State
  const handleDoubleTapCheck = () => {
    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);

    setTapCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === 2) {
        return 0; // Reset after successful double tap
      }
      return nextCount;
    });

    tapResetTimer.current = setTimeout(() => {
      setTapCount(0);
    }, 500);

    // Check if the tapCount was already at 1 right before this click executed
    return tapCount === 1;
  };

  // =========================
  // MAIN CLICK LOGIC
  // =========================
  const handleClick = () => {
    // RAPID TAP PREVENTION
    if (preventRapidTaps && clickLock.current) {
      return;
    }

    // DOUBLE PRESS MODE
    if (doubleTapMode) {
      const isDouble = handleDoubleTapCheck();
      if (!isDouble) return; 
    }

    // =========================
    // CONFIRMATION MODE
    // =========================
    if (confirmationMode) {
      // MESSAGE CONFIRMATION
      if (confirmationFor === "message" && confirmSendMessage) {
        if (confirmationType === "Popup Confirmation") {
          setPendingAction(() => executeProtectedAction);
          setShowModal(true);
          return;
        }

        if (confirmationType === "Double-tap-confirm") {
          const isDouble = handleDoubleTapCheck();
          if (!isDouble) return;
        }
      }

      // CALL CONFIRMATION
      if (confirmationFor === "call" && confirmCalls) {
        if (confirmationType === "Popup Confirmation") {
          setPendingAction(() => executeProtectedAction);
          setShowModal(true);
          return;
        }
      }

      // LIKE / COMMENT CONFIRMATION
      if (confirmationFor === "like" && confirmLikes) {
        if (confirmationType === "Popup Confirmation") {
          setPendingAction(() => executeProtectedAction);
          setShowModal(true);
          return;
        }

        if (confirmationType === "Double-tap-confirm") {
          const isDouble = handleDoubleTapCheck();
          if (!isDouble) return;
        }
      }
    }

    // =========================
    // TOUCH DELAY
    // =========================
    if (touchDelay) {
      setTimeout(() => {
        executeProtectedAction();
      }, 300);
    } else {
      executeProtectedAction();
    }
  };

  // =========================
  // LONG PRESS / HOLD CONFIRM
  // =========================
  const handleMouseDown = () => {
    if (!longPressMode && !(confirmationMode && confirmationType === "Hold-to-confirm")) {
      return;
    }

    pressTimer.current = setTimeout(() => {
      executeProtectedAction();
    }, 1500);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <button
        disabled={disabled}
        aria-disabled={disabled}
        onClick={
          !longPressMode && !(confirmationMode && confirmationType === "Hold-to-confirm")
            ? handleClick
            : undefined
        }
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.7 : 1,
          ...style,
        }}
      >
        {children}
      </button>

      <ConfirmationModal
        open={showModal}
        title="Confirm Action"
        message="Are you sure you want to continue?"
        type={confirmationType}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          if (pendingAction) {
            pendingAction();
          }
        }}
      />
    </>
  );
}