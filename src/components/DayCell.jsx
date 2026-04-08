import React from "react";
import { sameD } from "../utils/calendarUtils";

export default function DayCell({ 
  d, idx, theme, dark, isToday, isInRange, isStart, isEnd, 
  handleDateClick, picking, setHovDate, hols, evs, isPop, 
  setTooltipData, mutedText, bodyText 
}) {
  const dObj = { year: d.year, month: d.month, day: d.day };
  const col = idx % 7;
  const hKey = `${d.year}-${d.month}-${d.day}`;

  let rangeBg = "transparent";
  let rL = false, rR = false;
  if (isInRange && d.current) {
    rangeBg = dark ? `${theme.accent}18` : `${theme.accent}15`;
    if (isStart || col === 0) rL = true;
    if (isEnd || col === 6) rR = true;
  }

  const today = isToday;

  return (
    <div
      draggable={false}
      className={`cal-cell ${isPop ? "cal-pop" : ""} ${!d.current ? "disabled" : ""}`}
      style={{
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "52px",
      }}
      onClick={() => handleDateClick(d)}
      onMouseEnter={() => d.current && picking && setHovDate(dObj)}
      onMouseLeave={() => setHovDate(null)}
      onMouseOver={(e) => {
        if ((hols.length > 0 || evs.length > 0) && d.current) {
          const r = e.currentTarget.getBoundingClientRect();
          const holsStr = hols.map(hx => `${hx.emoji} ${hx.name}`).join("\n");
          const evsStr = evs.map(ex => `📍 ${ex.name}`).join("\n");
          setTooltipData({
            name: [holsStr, evsStr].filter(Boolean).join("\n"),
            x: r.left + r.width / 2,
            y: r.top - 8,
          });
        }
      }}
      onMouseOut={() => (hols.length > 0 || evs.length > 0) && setTooltipData(null)}
    >
      {/* Range background pill */}
      <div className="range-pill" style={{
        backgroundColor: rangeBg,
        borderTopLeftRadius: rL ? "9999px" : 0,
        borderBottomLeftRadius: rL ? "9999px" : 0,
        borderTopRightRadius: rR ? "9999px" : 0,
        borderBottomRightRadius: rR ? "9999px" : 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Today pulse ring */}
        {today && !(isStart || isEnd) && (
          <div className="today-ping" style={{
            width: "38px", height: "38px",
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            "--breathe-color": theme.accent,
            animation: "breathe 3s ease-in-out infinite",
          }} />
        )}

        {/* Date number */}
        <div style={{
          width: "38px", height: "38px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%", fontSize: "13px", fontWeight: 500,
          position: "relative",
          transition: "all 0.2s ease",
          background: (isStart || isEnd) && d.current
            ? `linear-gradient(135deg, ${theme.accent}, ${theme.glow.replace("0.4", "0.8")})`
            : "transparent",
          color: (isStart || isEnd) && d.current ? "#ffffff"
               : !d.current ? mutedText
               : today ? theme.accent
               : col === 5 ? (dark ? "#60a5fa" : "#3b82f6")
               : col === 6 ? (dark ? "#f87171" : "#ef4444")
               : bodyText,
          boxShadow: (isStart || isEnd) && d.current
            ? `0 4px 16px ${theme.glow}`
            : today && !(isStart || isEnd)
            ? `inset 0 0 0 2px ${theme.accent}`
            : "none",
          fontWeight: today || isStart || isEnd ? 700 : 500,
        }}>
          {d.day}
        </div>

        {/* Holiday Marker */}
        {hols.length > 0 && d.current && (
          <div style={{ fontSize: "10px", marginTop: "1px", lineHeight: 1 }}>
            {hols[0].emoji}
          </div>
        )}

        {/* Real Event Dots */}
        <div style={{ display: 'flex', gap: '2px', marginTop: '2px', position: 'absolute', bottom: '-8px' }}>
          {evs.map((_, ei) => (
            <div key={ei} className="event-dot" style={{ backgroundColor: theme.accent, opacity: 0.8 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
