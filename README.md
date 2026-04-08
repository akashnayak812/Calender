# 🗓️ Premium Interactive Calendar

A high-fidelity, professional-grade React calendar component designed as a showstopper portfolio piece. It features a sophisticated "booklet" aesthetic with generative seasonal illustrations, persistent notes, and a responsive glassmorphism UI.

![Premium Calendar Preview](https://raw.githubusercontent.com/akashdegavath/Calender/main/preview.png) *(Note: Add your actual preview image here)*

## ✨ Features

### 🎨 Visual Excellence
- **Generative Seasonal Heroes**: Custom SVG-based illustrations that automatically change based on the month (Cherry blossoms for Spring, Sun for Summer, Falling leaves for Autumn, and Snowflakes for Winter).
- **Glassmorphism Design**: A premium transparent UI with smooth transitions, spiral-bound binding effects, and realistic page-curls.
- **Dynamic Themes**: 12 unique color palettes—one for each month—with matching glow effects and accents.
- **State-of-the-Art Animations**: Smooth 3D-like page flips, hero illustrations pulses, and micro-interactions for dates and buttons.

### 🛠️ Functionality
- **Dual-Mode UI**: High-contrast Dark and Light modes with persistent state saved in `localStorage`.
- **Date Range Selection**: Interactive selection of date ranges with elegant highlight capsules.
- **Interactive Sidebar**:
    - **Upcoming Holidays**: Clickable holiday chips that jump the calendar to the specific date.
    - **Mini Year Overview**: Scrollable mini-calendars for rapid month/year navigation.
- **Persistent Notepad**: A dedicated notes section that saves content to `localStorage` per specific date or range.
- **Back to Today**: Quick-jump badge and month-title interaction to return to the current date.

### ⌨️ Keyboard Shortcuts
- `ArrowLeft` / `ArrowRight`: Navigate between months.
- `T`: Jump back to Today's month and date.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables & Keyframe Animations.
- **Icons/Emoji**: Native Emojis for zero-dependency visual flair.
- **Persistence**: Web Storage API (`localStorage`).

## 📁 Architecture

The project follows a clean, modular component architecture:

```text
src/
├── components/
│   ├── SeasonalHero.jsx  # Generative SVG illustration logic
│   ├── MiniMonth.jsx     # Preview calendar components
│   └── Notepad.jsx       # Persistent notes & character counting
├── PremiumCalendar.jsx   # Main orchestrator & state management
├── App.jsx               # Root wrapper
└── index.css             # Global resets & animation tokens
```

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/akashdegavath/Calender.git
cd Calender
npm install
```

### 2. Run Locally
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

*Designed and Developed by [Akash Degavath](https://github.com/akashdegavath)*
# Calender
