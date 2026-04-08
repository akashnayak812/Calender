import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import SeasonalHero from "./components/SeasonalHero";
import MiniMonth from "./components/MiniMonth";
import Notepad from "./components/Notepad";
import { CALENDAR_CONFIG } from "./config/calendarConfig";

/* ─── Constants ─────────────────────────────────────────────────────── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const SEASONS = ["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"];

/* ─── Per-Month Accent Themes ───────────────────────────────────────── */
const MONTH_THEMES = [
  { accent: "#60a5fa", glow: "rgba(96,165,250,0.4)" },   // Jan
  { accent: "#f472b6", glow: "rgba(244,114,182,0.4)" },   // Feb
  { accent: "#34d399", glow: "rgba(52,211,153,0.4)" },    // Mar
  { accent: "#a78bfa", glow: "rgba(167,139,250,0.4)" },   // Apr
  { accent: "#4ade80", glow: "rgba(74,222,128,0.4)" },    // May
  { accent: "#facc15", glow: "rgba(250,204,21,0.4)" },    // Jun
  { accent: "#fb923c", glow: "rgba(251,146,60,0.4)" },    // Jul
  { accent: "#f87171", glow: "rgba(248,113,113,0.4)" },   // Aug
  { accent: "#38bdf8", glow: "rgba(56,189,248,0.4)" },    // Sep
  { accent: "#f59e0b", glow: "rgba(245,158,11,0.4)" },    // Oct
  { accent: "#a1a1aa", glow: "rgba(161,161,170,0.4)" },   // Nov
  { accent: "#ef4444", glow: "rgba(239,68,68,0.4)" },     // Dec
];

/* ─── Fetch Google Calendar Data ────────────────────────────────────── */
const HOLIDAY_EMOJI_MAP = {
  "New Year": "🎆",
  "Christmas": "🎄",
  "Valentine": "💕",
  "Halloween": "🎃",
  "Independence": "🇮🇳",
  "Republic": "🇮🇳",
  "Gandhi": "🕶️",
  "Diwali": "🪔",
  "Holi": "🎨",
  "Eid": "🌙",
  "Good Friday": "✝️",
  "Easter": "🥚",
  "Thanksgiving": "🦃",
  "May Day": "👷",
};

function getHolidayEmoji(title) {
  for (const key in HOLIDAY_EMOJI_MAP) {
    if (title.includes(key)) return HOLIDAY_EMOJI_MAP[key];
  }
  return "🏷️";
}

async function fetchGoogleCalendarEvents(year, month, calendarId) {
  const { apiKey } = CALENDAR_CONFIG;
  if (!apiKey) return {};

  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    
    const eventsMap = {};
    (data.items || []).forEach(item => {
      const start = item.start.date || item.start.dateTime;
      if (start) {
        const d = new Date(start);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!eventsMap[key]) eventsMap[key] = [];
        
        const isHoliday = calendarId.includes("holiday");
        eventsMap[key].push({
          name: item.summary || "Untitled",
          emoji: isHoliday ? getHolidayEmoji(item.summary || "") : "📍",
          isHoliday
        });
      }
    });
    return eventsMap;
  } catch (err) {
    console.error(`Fetch error for ${calendarId}:`, err);
    return {};
  }
}

/* ─── Utility ───────────────────────────────────────────────────────── */
function buildDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOff = (first.getDay() + 6) % 7;
  const total = last.getDate();
  const prevLast = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = startOff - 1; i >= 0; i--) {
    const d = prevLast - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    days.push({ day: d, current: false, month: m, year: y });
  }
  for (let i = 1; i <= total; i++) {
    days.push({ day: i, current: true, month, year });
  }
  const rem = 42 - days.length;
  for (let i = 1; i <= rem; i++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    days.push({ day: i, current: false, month: m, year: y });
  }
  return days;
}

function dNum(d) { return d.year * 10000 + d.month * 100 + d.day; }
function sameD(a, b) { return a && b && dNum(a) === dNum(b); }

/* ─── Global Styles ─────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

@keyframes heroOrb1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 20px) scale(1.1); }
}
@keyframes heroOrb2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(15px, -15px) scale(1.15); }
}
@keyframes heroIconPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.22; }
}
@keyframes fadeSlideIn {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes calPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}
@keyframes calFlipFwd {
  0% { transform: perspective(1200px) rotateY(-90deg); opacity: 0; }
  100% { transform: perspective(1200px) rotateY(0); opacity: 1; }
}
@keyframes calFlipBwd {
  0% { transform: perspective(1200px) rotateY(90deg); opacity: 0; }
  100% { transform: perspective(1200px) rotateY(0); opacity: 1; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes curlHover {
  0% { width: 40px; height: 40px; }
  100% { width: 60px; height: 60px; }
}
@keyframes dotPing {
  0% { transform: scale(1); opacity: 1; }
  75% { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
}
@keyframes breathe {
  0%, 100% { box-shadow: 0 0 0 0 var(--breathe-color); }
  50% { box-shadow: 0 0 0 6px transparent; }
}

.event-dot {
  width: 4px; height: 4px; border-radius: 50%;
  margin: 1px; transition: transform 0.2s ease;
}
.cal-cell:hover .event-dot { transform: scale(1.5); }

.premium-cal * { box-sizing: border-box; }
.premium-cal {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.cal-pop { animation: calPop 200ms ease; }
.cal-flip-fwd { animation: calFlipFwd 450ms cubic-bezier(0.23,1,0.32,1); }
.cal-flip-bwd { animation: calFlipBwd 450ms cubic-bezier(0.23,1,0.32,1); }

.cal-cell {
  transition: transform 120ms ease, background 150ms ease;
  cursor: pointer;
  user-select: none;
}
.cal-cell:hover { transform: scale(1.12); z-index: 2; }
.cal-cell.disabled { cursor: default; pointer-events: none; }

.cal-notepad {
  background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.05) 27px, rgba(0,0,0,0.05) 28px);
  padding-left: 20px;
  border-left: 2px solid rgba(239,68,68,0.25);
}
.cal-notepad-dark {
  background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(255,255,255,0.05) 27px, rgba(255,255,255,0.05) 28px);
  border-left: 2px solid rgba(239,68,68,0.15);
}

.cal-curl { position: relative; overflow: hidden; }
.cal-curl::after {
  content: ''; position: absolute; bottom: 0; right: 0;
  width: 44px; height: 44px;
  background: linear-gradient(225deg, transparent 45%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.08) 50%, var(--curl-bg, #faf7f2) 50%);
  pointer-events: none; z-index: 5;
  transition: width 0.3s, height 0.3s;
}
.cal-curl:hover::after { width: 56px; height: 56px; }

.nav-btn {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 12px;
  border: none; cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}
.nav-btn:hover { background: rgba(0,0,0,0.05); }
.nav-btn.dark:hover { background: rgba(255,255,255,0.05); }
.nav-btn:active { transform: scale(0.95); }

.notes-area {
  resize: none; outline: none; border: none;
  font-family: 'Inter', sans-serif;
  font-size: 13px; line-height: 28px;
  width: 100%; background: transparent;
}
.notes-area::placeholder { opacity: 0.4; }

.today-ping {
  position: absolute; inset: 0; border-radius: 50%;
  animation: dotPing 2s cubic-bezier(0,0,0.2,1) infinite;
}

.range-pill {
  position: absolute; inset: 0;
  transition: background 150ms ease, border-radius 150ms ease;
}

/* scrollbar styling */
.mini-scroll::-webkit-scrollbar { height: 0; width: 0; }

.theme-toggle {
  position: fixed; top: 20px; right: 20px; z-index: 100;
  width: 48px; height: 48px; border-radius: 16px;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
  backdrop-filter: blur(12px);
}
.theme-toggle:hover { transform: scale(1.1) rotate(15deg); }
.theme-toggle:active { transform: scale(0.95); }

.holiday-chip {
  display: flex; alignItems: center; gap: 10px;
  padding: 8px 12px; border-radius: 12px;
  cursor: pointer; transition: all 0.2s ease;
  border: 1px solid transparent;
}
.holiday-chip:hover { transform: translateX(4px); border-color: var(--accent-light); background: var(--bg-hover); }
`;

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function PremiumCalendar() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hovDate, setHovDate] = useState(null);
  const [picking, setPicking] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cal-theme");
      if (saved) return saved === "dark";
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    }
    return false;
  });
  const [flipDir, setFlipDir] = useState(null);
  const [flipKey, setFlipKey] = useState(0);
  const [popKey, setPopKey] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [realEvents, setRealEvents] = useState({});
  const [fetchedHolidays, setFetchedHolidays] = useState({});
  const [loading, setLoading] = useState(false);

  const theme = MONTH_THEMES[month];
  const season = SEASONS[month];


  const days = useMemo(() => buildDays(year, month), [year, month]);

  const notesKey = useMemo(() => {
    if (rangeStart && rangeEnd) {
      return `cal-n-${rangeStart.year}-${rangeStart.month}-${rangeStart.day}-${rangeEnd.year}-${rangeEnd.month}-${rangeEnd.day}`;
    }
    return `cal-n-${year}-${month}`;
  }, [rangeStart, rangeEnd, year, month]);

  const notesLabel = useMemo(() => {
    if (rangeStart && rangeEnd && !sameD(rangeStart, rangeEnd)) {
      return `${MONTHS[rangeStart.month]} ${rangeStart.day} → ${MONTHS[rangeEnd.month]} ${rangeEnd.day}`;
    }
    if (rangeStart && !rangeEnd && !picking) {
      return `${MONTHS[rangeStart.month]} ${rangeStart.day}`;
    }
    return `${MONTHS[month]} ${year}`;
  }, [rangeStart, rangeEnd, picking, month, year]);

  useEffect(() => {
    localStorage.setItem("cal-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const personalCalId = CALENDAR_CONFIG.calendarId;
      const holidayCalId = "en.indian#holiday@group.v.calendar.google.com";
      
      try {
        const [events, hols] = await Promise.all([
          fetchGoogleCalendarEvents(year, month, personalCalId),
          fetchGoogleCalendarEvents(year, month, holidayCalId)
        ]);
        
        if (active) {
          setRealEvents(events);
          setFetchedHolidays(hols);
          setLoading(false);
        }
      } catch (err) {
        console.error("Calendar Load Error:", err);
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [year, month]);

  const navigate = useCallback((dir) => {
    setFlipDir(dir > 0 ? "fwd" : "bwd");
    setFlipKey(k => k + 1);
    if (dir > 0) {
      if (month === 11) { setMonth(0); setYear(y => y + 1); }
      else setMonth(m => m + 1);
    } else {
      if (month === 0) { setMonth(11); setYear(y => y - 1); }
      else setMonth(m => m - 1);
    }
    setRangeStart(null);
    setRangeEnd(null);
    setPicking(false);
    setHovDate(null);
  }, [month]);

  const goToMonth = useCallback((m, y = year) => {
    const dir = y > year || (y === year && m > month) ? 1 : -1;
    setFlipDir(dir > 0 ? "fwd" : "bwd");
    setFlipKey(k => k + 1);
    setMonth(m);
    setYear(y);
    setRangeStart(null);
    setRangeEnd(null);
    setPicking(false);
    setHovDate(null);
  }, [month, year]);

  const goToday = () => {
    const todayM = now.getMonth();
    const todayY = now.getFullYear();
    if (month === todayM && year === todayY) return;
    goToMonth(todayM, todayY);
  };

  const handleHolidayClick = (d) => {
    setRangeStart({ year: d.year, month: d.month, day: d.day });
    setRangeEnd(null);
    setPicking(false);
    setPopKey(`${d.year}-${d.month}-${d.day}`);
  };

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

  const handleDateClick = (d) => {
    if (!d.current) return;
    const clicked = { year: d.year, month: d.month, day: d.day };
    if (!picking && !rangeEnd) {
      setRangeStart(clicked); setRangeEnd(null); setPicking(true);
      setPopKey(`${d.year}-${d.month}-${d.day}`);
      return;
    }
    if (picking) {
      if (dNum(clicked) > dNum(rangeStart)) {
        setRangeEnd(clicked); setPicking(false);
      } else {
        setRangeStart(clicked); setRangeEnd(null);
      }
      setPopKey(`${d.year}-${d.month}-${d.day}`);
      return;
    }
    setRangeStart(clicked); setRangeEnd(null); setPicking(true);
    setPopKey(`${d.year}-${d.month}-${d.day}`);
  };

  const effectiveEnd = useMemo(() => {
    if (rangeEnd) return rangeEnd;
    if (picking && hovDate && dNum(hovDate) > dNum(rangeStart)) return hovDate;
    return null;
  }, [rangeEnd, picking, hovDate, rangeStart]);

  const isInRange = (d) => {
    if (!rangeStart || !effectiveEnd) return false;
    const n = dNum(d);
    return n >= dNum(rangeStart) && n <= dNum(effectiveEnd);
  };

  const isToday = (d) =>
    d.current && d.day === now.getDate() && d.month === now.getMonth() && d.year === now.getFullYear();

  /* ─── Upcoming items in this month ──────────────────────────── */
  const upcomingItems = useMemo(() => {
    const list = [];
    days.forEach(d => {
      if (!d.current) return;
      const key = `${d.year}-${d.month}-${d.day}`;
      const hols = fetchedHolidays[key] || [];
      const evs = realEvents[key] || [];
      hols.forEach(h => list.push({ ...d, name: h.name, emoji: h.emoji, isHoliday: true }));
      evs.forEach(e => list.push({ ...d, name: e.name, emoji: e.emoji || "📍", isHoliday: false }));
    });
    return list.slice(0, 4);
  }, [days, fetchedHolidays, realEvents]);

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
      <style>{GLOBAL_CSS}</style>

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

          {/* ════════════════════════════════════════════════════════
              LEFT PANEL — Hero + Mini Year
              ════════════════════════════════════════════════════════ */}
          <div style={{
            width: "38%", display: "flex", flexDirection: "column",
            borderRight: `1px solid ${cardBorder}`,
          }}>
            {/* Hero */}
            <div style={{ flex: 1, position: "relative", minHeight: "280px" }}>
              <SeasonalHero month={month} season={season} />

              {/* Month/Year Badge */}
              <div style={{
                position: "absolute", bottom: "20px", left: "20px", right: "20px",
                zIndex: 10,
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "36px", fontWeight: 700,
                  color: "#ffffff",
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                  lineHeight: 1.1,
                }}>
                  {MONTHS[month]}
                </div>
                <div style={{
                  fontSize: "16px", fontWeight: 300,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "4px",
                  marginTop: "4px",
                }}>
                  {year}
                </div>
              </div>

              {/* Season badge */}
              <div style={{
                position: "absolute", top: "16px", left: "16px",
                padding: "6px 14px", borderRadius: "100px",
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "11px", fontWeight: 600,
                letterSpacing: "1.5px", textTransform: "uppercase",
                zIndex: 10,
              }}>
                {season}
              </div>
            </div>

            {/* Upcoming Items (Holidays + Real Events) */}
            {upcomingItems.length > 0 && (
              <div style={{
                padding: "16px 20px",
                borderTop: `1px solid ${cardBorder}`,
              }}>
                <div style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
                  textTransform: "uppercase", color: subtleText,
                  marginBottom: "10px",
                }}>
                  {loading ? "Syncing..." : "Upcoming"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {upcomingItems.map((h, i) => (
                    <div
                      key={i}
                      className="holiday-chip"
                      onClick={() => handleHolidayClick(h)}
                      style={{
                        animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both`,
                        background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                        "--accent-light": theme.accent,
                        "--bg-hover": dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{h.emoji}</span>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: bodyText }}>
                          {h.name}
                        </div>
                        <div style={{ fontSize: "10px", color: subtleText }}>
                          {MONTHS[h.month]} {h.day} {h.isHoliday ? "" : "(Event)"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mini Year Overview */}
            <div style={{
              padding: "12px 16px",
              borderTop: `1px solid ${cardBorder}`,
            }}>
              <div style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
                textTransform: "uppercase", color: subtleText,
                marginBottom: "8px",
              }}>
                {year} Overview
              </div>
              <div className="mini-scroll" style={{
                display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
                gap: "4px",
              }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <MiniMonth
                    key={i} year={year} month={i}
                    currentMonth={month} onClick={goToMonth}
                    theme={theme} dark={dark}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              RIGHT PANEL — Calendar Grid + Notes
              ════════════════════════════════════════════════════════ */}
          <div style={{ width: "62%", display: "flex", flexDirection: "column" }}>

            {/* Navigation Header */}
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
                    {(!isToday({day: now.getDate(), month: now.getMonth(), year: now.getFullYear()}) || month !== now.getMonth() || year !== now.getFullYear()) && (
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

            {/* Calendar Grid */}
            <div
              key={flipKey}
              className={flipDir === "fwd" ? "cal-flip-fwd" : flipDir === "bwd" ? "cal-flip-bwd" : ""}
              style={{ transformOrigin: "center center", padding: "0 24px" }}
            >
              {/* Day Headers */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
                marginBottom: "4px",
              }}>
                {DAYS.map((d, i) => (
                  <div key={d} style={{
                    textAlign: "center", fontSize: "11px", fontWeight: 600,
                    padding: "8px 0", letterSpacing: "0.5px",
                    color: i === 5 ? (dark ? "#60a5fa" : "#3b82f6")
                         : i === 6 ? (dark ? "#f87171" : "#ef4444")
                         : subtleText,
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Date Cells */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px 0",
              }}>
                {days.map((d, idx) => {
                  const dObj = { year: d.year, month: d.month, day: d.day };
                  const inRange = isInRange(dObj);
                  const isStart = rangeStart && sameD(dObj, rangeStart);
                  const isEnd = effectiveEnd && sameD(dObj, effectiveEnd);
                  const today = isToday(d);
                  const col = idx % 7;
                  const hKey = `${d.year}-${d.month}-${d.day}`;
                  const hols = fetchedHolidays[hKey] || [];
                  const evs = realEvents[hKey] || [];
                  const isPop = popKey === hKey;

                  let rangeBg = "transparent";
                  let rL = false, rR = false;
                  if (inRange && d.current) {
                    rangeBg = dark ? `${theme.accent}18` : `${theme.accent}15`;
                    if (isStart || col === 0) rL = true;
                    if (isEnd || col === 6) rR = true;
                  }

                  return (
                    <div
                      key={idx}
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
                })}
              </div>
            </div>

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
                  {Math.abs(dNum(effectiveEnd) - dNum(rangeStart)) + 1} days selected
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

            {/* Notepad */}
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
