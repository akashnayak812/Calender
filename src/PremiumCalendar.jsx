import React, { useEffect } from "react";
import Notepad from "./components/Notepad";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import CalendarLeftPanel from "./components/CalendarLeftPanel";
import { useCalendarLogic } from "./hooks/useCalendarLogic";
import { sameD } from "./utils/calendarUtils";
import "./styles/PremiumCalendar.css";

export default function PremiumCalendar() {
  const {
    month, year, rangeStart, rangeEnd, hovDate, picking, dark, flipDir, flipKey, popKey,
    tooltipData, realEvents, fetchedHolidays, loading, theme, season, days, notesKey, notesLabel,
    setDark, navigate, goToMonth, goToday, handleDateClick, setHovDate, setRangeStart, setRangeEnd,
    setPicking, setPopKey, setTooltipData, isInRange, isToday, upcomingItems, effectiveEnd,
  } = useCalendarLogic();

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (document.activeElement.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "t" || e.key === "T") goToday();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, goToday]);

  const handleHolidayClick = (d) => {
    setRangeStart({ year: d.year, month: d.month, day: d.day });
    setRangeEnd(null);
    setPicking(false);
    setPopKey(`${d.year}-${d.month}-${d.day}`);
  };

  /* ─── Colors ───────────────────────────────────────────────────── */
  const bg = dark ? "#0a0e1a" : "#f5f0e8";
  const cardBg = dark ? "#111827" : "#ffffff";
  const cardBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const subtleText = dark ? "#64748b" : "#a8a29e";
  const bodyText = dark ? "#e2e8f0" : "#292524";
  const mutedText = dark ? "#475569" : "#d6d3d1";

  const spiralCount = 14;

  return (
    <div className="premium-cal" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", background: bg, transition: "background 0.5s ease",
    }}>
      
      {/* ── Theme Toggle ───────────────────────────────────────────── */}
      <button
        className="theme-toggle"
        onClick={() => setDark(!dark)}
        style={{
          background: dark ? "rgba(30,41,59,0.8)" : "rgba(255,255,255,0.8)",
          color: dark ? "#fbbf24" : "#475569",
          boxShadow: dark
            ? "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* ── Main Card ──────────────────────────────────────────────── */}
      <div className="cal-curl" style={{
        width: "100%", maxWidth: "1100px",
        borderRadius: "24px", overflow: "hidden",
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: dark
          ? "0 25px 80px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 25px 80px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04)",
        "--curl-bg": dark ? "#1e293b" : "#faf7f2",
        transition: "background 0.5s ease, box-shadow 0.5s ease",
      }}>

        {/* ── Spiral Binding ─────────────────────────────────────── */}
        <svg style={{ width: "100%", height: "40px", display: "block" }} viewBox="0 0 1100 40" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="22" width="1100" height="18" fill={cardBg} />
          {Array.from({ length: spiralCount }, (_, i) => {
            const cx = 40 + i * ((1100 - 80) / (spiralCount - 1));
            return (
              <React.Fragment key={i}>
                <ellipse cx={cx} cy="22" rx="9" ry="14" fill="none"
                  stroke={dark ? "#334155" : "#c4c0b8"} strokeWidth="2.5" />
                <ellipse cx={cx} cy="22" rx="9" ry="14" fill="none"
                  stroke={dark ? "#475569" : "#e7e5e4"} strokeWidth="1"
                  strokeDasharray="0 44 44 0" />
              </React.Fragment>
            );
          })}
          <rect x="0" y="22" width="1100" height="18" fill={cardBg} />
          <rect x="0" y="21" width="1100" height="1.5" fill={dark ? "#1e293b" : "#e7e5e4"} />
        </svg>

        <div style={{ display: "flex", flexDirection: "row", minHeight: "560px" }}>

          <CalendarLeftPanel 
            month={month}
            year={year}
            season={season}
            theme={theme}
            dark={dark}
            upcomingItems={upcomingItems}
            loading={loading}
            handleHolidayClick={handleHolidayClick}
            goToMonth={goToMonth}
            cardBorder={cardBorder}
            subtleText={subtleText}
            bodyText={bodyText}
          />

          <div style={{ width: "62%", display: "flex", flexDirection: "column" }}>
            
            <CalendarHeader 
              month={month}
              year={year}
              dark={dark}
              navigate={navigate}
              goToday={goToday}
              theme={theme}
              picking={picking}
              bodyText={bodyText}
              subtleText={subtleText}
              isToday={isToday({day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear()}) && month === new Date().getMonth() && year === new Date().getFullYear()}
            />

            <CalendarGrid 
              days={days}
              theme={theme}
              dark={dark}
              rangeStart={rangeStart}
              effectiveEnd={effectiveEnd}
              isInRange={isInRange}
              isToday={isToday}
              handleDateClick={handleDateClick}
              picking={picking}
              setHovDate={setHovDate}
              fetchedHolidays={fetchedHolidays}
              realEvents={realEvents}
              popKey={popKey}
              setTooltipData={setTooltipData}
              mutedText={mutedText}
              bodyText={bodyText}
              flipDir={flipDir}
              flipKey={flipKey}
              subtleText={subtleText}
            />

            {/* Range info bar */}
            {rangeStart && effectiveEnd && !sameD(rangeStart, effectiveEnd) && (
              <div style={{
                margin: "12px 24px 0",
                padding: "8px 16px",
                borderRadius: "12px",
                background: dark ? `${theme.accent}15` : `${theme.accent}10`,
                border: `1px solid ${dark ? `${theme.accent}30` : `${theme.accent}20`}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                animation: "fadeSlideIn 0.3s ease",
              }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: theme.accent }}>
                    Selected Range: {MONTHS[rangeStart.month]} {rangeStart.day} - {MONTHS[effectiveEnd.month]} {effectiveEnd.day}
                </span>
                <button
                  onClick={() => { setRangeStart(null); setRangeEnd(null); setPicking(false); }}
                  style={{
                    fontSize: "11px", fontWeight: 500,
                    color: subtleText, background: "none",
                    border: "none", cursor: "pointer",
                    padding: "4px 8px", borderRadius: "6px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.color = theme.accent}
                  onMouseLeave={e => e.target.style.color = subtleText}
                >
                  Clear
                </button>
              </div>
            )}

            <Notepad
                notesKey={notesKey}
                notesLabel={notesLabel}
                dark={dark}
                bodyText={bodyText}
                subtleText={subtleText}
                cardBorder={cardBorder}
            />
          </div>
        </div>
      </div>

      {/* ── Tooltip ────────────────────────────────────────────────── */}
      {tooltipData && (
        <div style={{
          position: "fixed", zIndex: 200,
          left: tooltipData.x, top: tooltipData.y,
          transform: "translate(-50%, -100%)",
          padding: "6px 14px", borderRadius: "10px",
          fontSize: "12px", fontWeight: 600,
          color: dark ? "#f1f5f9" : "#ffffff",
          background: dark ? "#334155" : "#1c1917",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          pointerEvents: "none",
          animation: "fadeSlideIn 0.15s ease",
          fontFamily: "'Inter', sans-serif",
          whiteSpace: "nowrap",
        }}>
          {tooltipData.name}
          <div style={{
            position: "absolute", bottom: "-4px",
            left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: "8px", height: "8px",
            background: dark ? "#334155" : "#1c1917",
          }} />
        </div>
      )}
    </div>
  );
}
