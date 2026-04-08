import { CALENDAR_CONFIG } from "../config/calendarConfig";

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export const SEASONS = ["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"];

export const MONTH_THEMES = [
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

export function getHolidayEmoji(title) {
  for (const key in HOLIDAY_EMOJI_MAP) {
    if (title.includes(key)) return HOLIDAY_EMOJI_MAP[key];
  }
  return "🏷️";
}

export async function fetchGoogleCalendarEvents(year, month, calendarId) {
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

export function buildDays(year, month) {
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

export function dNum(d) { return d.year * 10000 + d.month * 100 + d.day; }
export function sameD(a, b) { return a && b && dNum(a) === dNum(b); }
