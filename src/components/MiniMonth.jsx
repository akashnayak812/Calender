import React from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function MiniMonth({ year, month, currentMonth, onClick, theme, dark }) {
  const isActive = month === currentMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  return (
    <button
      onClick={() => onClick(month)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "6px 4px", borderRadius: "10px", border: "none",
        cursor: "pointer", transition: "all 0.2s ease",
        background: isActive
          ? dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          : "transparent",
        boxShadow: isActive ? `0 0 0 1.5px ${theme.accent}` : "none",
        minWidth: "44px",
      }}
    >
      <span style={{
        fontSize: "9px", fontWeight: 700, letterSpacing: "0.5px",
        color: isActive ? theme.accent : dark ? "#94a3b8" : "#a8a29e",
        textTransform: "uppercase", marginBottom: "3px",
      }}>
        {MONTHS[month].slice(0, 3)}
      </span>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        gap: "0.5px", width: "100%",
      }}>
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`e-${i}`} style={{ width: "4px", height: "4px" }} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const now = new Date();
          const isToday = i + 1 === now.getDate() && month === now.getMonth() && year === now.getFullYear();
          return (
            <div key={i} style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: isToday ? theme.accent : dark ? "#475569" : "#d6d3d1",
            }} />
          );
        })}
      </div>
    </button>
  );
}
