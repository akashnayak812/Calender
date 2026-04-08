import React from "react";
import SeasonalHero from "./SeasonalHero";
import MiniMonth from "./MiniMonth";
import { MONTHS } from "../utils/calendarUtils";

export default function CalendarLeftPanel({ 
  month, year, season, theme, dark, upcomingItems, loading, 
  handleHolidayClick, goToMonth, cardBorder, subtleText, bodyText
}) {
  return (
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
  );
}
