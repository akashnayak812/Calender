import React from "react";
import DayCell from "./DayCell";
import { DAYS, sameD } from "../utils/calendarUtils";

export default function CalendarGrid({ 
  days, theme, dark, rangeStart, effectiveEnd, isInRange, isToday,
  handleDateClick, picking, setHovDate, fetchedHolidays, realEvents,
  popKey, setTooltipData, mutedText, bodyText, flipDir, flipKey, subtleText
}) {
  return (
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
          return (
            <DayCell
              key={idx}
              d={d}
              idx={idx}
              theme={theme}
              dark={dark}
              isToday={isToday(d)}
              isInRange={isInRange(d)}
              isStart={rangeStart && sameD(dObj, rangeStart)}
              isEnd={effectiveEnd && sameD(dObj, effectiveEnd)}
              handleDateClick={handleDateClick}
              picking={picking}
              setHovDate={setHovDate}
              hols={fetchedHolidays[`${d.year}-${d.month}-${d.day}`] || []}
              evs={realEvents[`${d.year}-${d.month}-${d.day}`] || []}
              isPop={popKey === `${d.year}-${d.month}-${d.day}`}
              setTooltipData={setTooltipData}
              mutedText={mutedText}
              bodyText={bodyText}
            />
          );
        })}
      </div>
    </div>
  );
}
