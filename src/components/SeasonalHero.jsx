import React, { useMemo } from "react";

const SEASON_PALETTES = {
  winter: {
    bg: ["#0f172a","#1e3a5f","#1e40af"],
    accent: "#60a5fa",
    particles: ["#93c5fd","#bfdbfe","#dbeafe","#e0f2fe"],
    icon: "❄️",
    glow: "rgba(96,165,250,0.3)",
  },
  spring: {
    bg: ["#064e3b","#065f46","#047857"],
    accent: "#34d399",
    particles: ["#6ee7b7","#a7f3d0","#fbbf24","#f9a8d4"],
    icon: "🌸",
    glow: "rgba(52,211,153,0.3)",
  },
  summer: {
    bg: ["#7c2d12","#b45309","#d97706"],
    accent: "#fbbf24",
    particles: ["#fde68a","#fed7aa","#fef3c7","#fef9c3"],
    icon: "☀️",
    glow: "rgba(251,191,36,0.3)",
  },
  autumn: {
    bg: ["#431407","#78350f","#92400e"],
    accent: "#f59e0b",
    particles: ["#fbbf24","#f97316","#ef4444","#dc2626"],
    icon: "🍂",
    glow: "rgba(245,158,11,0.3)",
  },
};

export default function SeasonalHero({ month, season }) {
  const palette = SEASON_PALETTES[season];
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      color: palette.particles[i % palette.particles.length],
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
    }));
  }, [month, palette]); // Re-calculate when palette changes (season changes)

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${palette.bg[0]}, ${palette.bg[1]}, ${palette.bg[2]})`,
    }}>
      {/* Floating orbs */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{
          position: "absolute", width: "200px", height: "200px",
          borderRadius: "50%", top: "-40px", right: "-30px",
          background: `radial-gradient(circle, ${palette.glow}, transparent 70%)`,
          animation: "heroOrb1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "160px", height: "160px",
          borderRadius: "50%", bottom: "20px", left: "-20px",
          background: `radial-gradient(circle, ${palette.glow}, transparent 70%)`,
          animation: "heroOrb2 10s ease-in-out infinite",
        }} />
      </div>

      {/* Particles */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r={p.size / 10}
            fill={p.color}
            opacity="0.6"
          >
            <animate attributeName="cy" values={`${p.y};${p.y - 15};${p.y}`} dur={`${p.duration}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur={`${p.duration}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Season icon */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "72px", opacity: 0.15, filter: "blur(1px)",
        animation: "heroIconPulse 4s ease-in-out infinite",
      }}>
        {palette.icon}
      </div>

      {/* Mesh overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)",
      }} />
    </div>
  );
}
