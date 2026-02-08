import React from "react";
import toast from "react-hot-toast";

const SNACKBAR_DURATION = 3000;
const SNACKBAR_UNDO_DURATION = 5000;

const defaultToastOptions = {
  className: "app-snackbar",
  style: {
    background: "#fff",
    color: "#333",
    border: "1px solid rgba(173, 216, 230, 0.8)",
    borderRadius: "8px",
    boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.12)",
    padding: "12px 16px",
    fontSize: "0.9375rem",
  },
};

export function showSnackbar(message, duration = SNACKBAR_DURATION) {
  toast(message, { ...defaultToastOptions, duration });
}

export function showSnackbarWithUndo(
  message,
  onUndo,
  duration = SNACKBAR_UNDO_DURATION,
) {
  toast.custom(
    (t) => (
      <div
        className={`app-snackbar app-snackbar-with-undo app-snackbar-box ${!t.visible ? "app-snackbar-exit" : ""}`}
        role="status"
      >
        <span className="app-snackbar-message">{message}</span>
        <button
          type="button"
          className="app-snackbar-undo-btn"
          onClick={() => {
            onUndo();
            toast.dismiss(t.id);
          }}
        >
          Undo
        </button>
      </div>
    ),
    {
      duration,
      className: "app-snackbar-wrapper",
    },
  );
}
