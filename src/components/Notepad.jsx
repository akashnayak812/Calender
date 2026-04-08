import React, { useEffect, useState } from "react";

export default function Notepad({ notesKey, notesLabel, dark, bodyText, subtleText, cardBorder }) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(notesKey);
    setNotes(saved || "");
  }, [notesKey]);

  const saveNotes = (val) => {
    setNotes(val);
    if (val) localStorage.setItem(notesKey, val);
    else localStorage.removeItem(notesKey);
  };

  return (
    <div style={{
      margin: "16px 24px 24px",
      padding: "16px 20px",
      borderRadius: "16px",
      background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,241,213,0.4)",
      border: `1px solid ${cardBorder}`,
      flex: 1, display: "flex", flexDirection: "column",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "8px",
      }}>
        <div style={{
          fontSize: "10px", fontWeight: 700,
          letterSpacing: "1.5px", textTransform: "uppercase",
          color: subtleText,
        }}>
          📝 Notes — {notesLabel}
        </div>
        <div style={{
          fontSize: "10px", color: subtleText,
          fontVariantNumeric: "tabular-nums",
        }}>
          {notes.length} chars
        </div>
      </div>
      <textarea
        className={`notes-area ${dark ? "cal-notepad-dark" : "cal-notepad"}`}
        rows={4}
        placeholder="Write your notes here…"
        value={notes}
        onChange={(e) => saveNotes(e.target.value)}
        style={{ color: bodyText, flex: 1 }}
      />
    </div>
  );
}
