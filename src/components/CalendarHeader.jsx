import React from "react";
import { MONTHS } from "../utils/calendarUtils";

export default function CalendarHeader({ 
  month, year, dark, navigate, goToday, theme, picking, bodyText, subtleText, isToday 
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 28px 12px",
    }}>
      <button
        className={`nav-btn ${dark ? 'dark' : ''}`}
        onClick={() => navigate(-1)}
        style={{ color: dark ? "#94a3b8" : "#78716c" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{
          margin: 0, fontSize: "20px", fontWeight: 700,
          color: bodyText, letterSpacing: "-0.3px",
          cursor: "pointer",
        }} onClick={goToday}>
          {MONTHS[month]}
          <span style={{
            marginLeft: "8px", fontWeight: 300, color: subtleText,
          }}>
            {year}
          </span>
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {picking && (
              <div style={{
                fontSize: "11px", color: theme.accent,
                fontWeight: 500, marginTop: "2px",
                animation: "fadeSlideIn 0.3s ease",
              }}>
                Select end date…
              </div>
            )}
            {!isToday && (
              <button onClick={goToday} style={{
                fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '1px', background: theme.accent, color: '#fff',
                border: 'none', padding: '2px 8px', borderRadius: '4px',
                marginTop: '4px', cursor: 'pointer', opacity: 0.8,
              }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.8}>
                Today
              </button>
            )}
        </div>
      </div>

      <button
        className={`nav-btn ${dark ? 'dark' : ''}`}
        onClick={() => navigate(1)}
        style={{ color: dark ? "#94a3b8" : "#78716c" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>
    </div>
  );
}
