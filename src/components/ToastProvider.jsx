import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const icons = {
  success: <FaCheckCircle style={{ color: "#4CAF50", fontSize: 22 }} />,
  error: <FaTimesCircle style={{ color: "#E83030", fontSize: 22 }} />,
  warning: <FaExclamationTriangle style={{ color: "#F5A06A", fontSize: 22 }} />,
  info: <FaInfoCircle style={{ color: "#6B3FA0", fontSize: 22 }} />,
};

function ToastItem({ toast, onDismiss }) {
  const [offsetY, setOffsetY] = useState(0);
  const [startY, setStartY] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay to trigger slide-in animation
    requestAnimationFrame(() => setVisible(true));

    // Calculate duration dynamically based on message length
    // Minimum 3s, extra 50ms per character
    const duration = Math.max(3000, toast.message.length * 60);

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(), 300); // Wait for fade-out animation
  };

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (startY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff < 0) {
      setOffsetY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (offsetY < -30) {
      handleDismiss();
    } else {
      setOffsetY(0);
    }
    setStartY(null);
  };

  return (
    <div
      role="alert"
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "white",
        borderRadius: 16,
        padding: "14px 18px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        borderLeft: `4px solid ${
          toast.type === "success"
            ? "#4CAF50"
            : toast.type === "error"
            ? "#E83030"
            : toast.type === "warning"
            ? "#F5A06A"
            : "#6B3FA0"
        }`,
        transform: `translateY(${visible ? offsetY : -100}px)`,
        opacity: visible ? 1 : 0,
        transition: startY !== null ? "none" : "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s",
        pointerEvents: "auto",
        width: "90%",
        maxWidth: 360,
        margin: "0 auto",
      }}
    >
      <div style={{ flexShrink: 0, display: "flex" }}>{icons[toast.type] || icons.info}</div>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#2D1B69", fontFamily: "system-ui, sans-serif", lineHeight: 1.4, flex: 1 }}>
        {toast.message}
      </p>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
