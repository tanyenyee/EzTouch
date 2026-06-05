import { useState, useRef } from "react";

export default function ConfirmationModal({

  open,
  title = "Confirm Action",
  message = "Are you sure?",
  type = "Popup Confirmation",

  onConfirm,
  onCancel,

}) {

  const [tapCount, setTapCount] =
    useState(0);

  const holdTimer = useRef(null);

  if (!open) return null;

  // =========================
  // HANDLE CONFIRM
  // =========================

  const handleConfirm = () => {

    // POPUP
    if (
      type === "Popup Confirmation"
    ) {

      onConfirm();
      return;
    }

    // DOUBLE TAP
    if (
      type === "Double-tap-confirm"
    ) {

      setTapCount(prev => prev + 1);

      setTimeout(() => {
        setTapCount(0);
      }, 500);

      if (tapCount !== 1) {
        return;
      }

      onConfirm();
    }
  };

  // =========================
  // HOLD CONFIRM
  // =========================

  const handleHoldStart = () => {

    if (
      type !== "Hold-to-confirm"
    ) {
      return;
    }

    holdTimer.current =
      setTimeout(() => {

        onConfirm();

      }, 1500);
  };

  const handleHoldEnd = () => {

    if (holdTimer.current) {

      clearTimeout(
        holdTimer.current
      );
    }
  };

  // =========================
  // RENDER
  // =========================

  return (

    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >

      <div
        style={{
          width: "82%",
          background: "white",
          borderRadius: 28,
          padding: "28px 24px",
          textAlign: "center",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >

        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#2D1B69",
            marginBottom: 10,
            fontFamily:
              "system-ui, sans-serif",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 24,
            lineHeight: 1.5,
            fontFamily:
              "system-ui, sans-serif",
          }}
        >
          {message}
        </p>

        {type === "Hold-to-confirm" && (
          <p
            style={{
              fontSize: 13,
              color: "#A05A2C",
              marginBottom: 20,
              fontWeight: 700,
            }}
          >
            Hold YES for 1.5 seconds
          </p>
        )}

        {type === "Double-tap-confirm" && (
          <p
            style={{
              fontSize: 13,
              color: "#2D5A88",
              marginBottom: 20,
              fontWeight: 700,
            }}
          >
            Tap YES twice to confirm
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 14,
          }}
        >

          <button
            onClick={onCancel}

            style={{
              flex: 1,
              height: 56,
              borderRadius: 18,
              background: "#EAEAEA",
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            CANCEL
          </button>

          <button

            onClick={
              type !== "Hold-to-confirm"
                ? handleConfirm
                : undefined
            }

            onMouseDown={handleHoldStart}

            onMouseUp={handleHoldEnd}

            onMouseLeave={handleHoldEnd}

            style={{
              flex: 1,
              height: 56,
              borderRadius: 18,
              background: "#6B3FA0",
              color: "white",
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            YES
          </button>

        </div>

      </div>

    </div>
  );
}