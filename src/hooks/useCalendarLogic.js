import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  MONTHS, SEASONS, buildDays, fetchGoogleCalendarEvents, dNum, sameD, MONTH_THEMES 
} from "../utils/calendarUtils";
import { CALENDAR_CONFIG } from "../config/calendarConfig";

export function useCalendarLogic() {
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

  return {
    month, year, rangeStart, rangeEnd, hovDate, picking, dark, flipDir, flipKey, popKey,
    tooltipData, realEvents, fetchedHolidays, loading, theme, season, days, notesKey, notesLabel,
    setDark, navigate, goToMonth, goToday, handleDateClick, setHovDate, setRangeStart, setRangeEnd,
    setPicking, setPopKey, setTooltipData, isInRange, isToday, upcomingItems,
    effectiveEnd,
  };
}
