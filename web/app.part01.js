      </svg>
    `,
    sun: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 2.5V5.2M12 18.8v2.7M21.5 12h-2.7M5.2 12H2.5M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9M18.7 18.7l-1.9-1.9M7.2 7.2 5.3 5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    home: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M9.5 20.5v-5h5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    courses: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M5 5.5V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M9 7.5h7M9 11h7M9 14.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    ielts: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M6 4.5h8a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H6v-15Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    streak: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M12.4 3.5c1.8 2.4 4.3 4.7 4.3 8a4.7 4.7 0 1 1-9.4 0c0-1.9 1-3.5 2.3-5 .5 1.5 1.3 2.5 2.8 3.5 0-2.2.7-4.4 0-6.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    more: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <circle cx="12" cy="5.5" r="1.8" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
        <circle cx="12" cy="18.5" r="1.8" fill="currentColor"/>
      </svg>
    `,
    english: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15M8 4.5c-1.7 2-2.5 4.6-2.5 7.5S6.3 17.5 8 19.5M16 4.5c1.7 2 2.5 4.6 2.5 7.5s-.8 5.5-2.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `,
    exam: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/>
        <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    ranking: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M7 18V9M12 18V5M17 18v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    trophy: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M8 4.5h8v3.2a4 4 0 0 1-8 0V4.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M9.5 16h5M10 19.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M8 6H5.5A1.5 1.5 0 0 0 4 7.5c0 2.3 1.7 4.2 4 4.5M16 6h2.5A1.5 1.5 0 0 1 20 7.5c0 2.3-1.7 4.2-4 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    clock: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 7.8v4.7l3 1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  };
  return icons[name] || "";
}


function loadingShellHtml() {
  return `
    <div class="screen-body">
      <div class="hero-block">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="skeleton skeleton-card"></div></div>
        <div class="stat-card"><div class="skeleton skeleton-card"></div></div>
      </div>
      <div class="progress-card"><div class="skeleton skeleton-panel"></div></div>
      <div class="strategy-card"><div class="skeleton skeleton-panel tall"></div></div>
    </div>
  `;
}


function waveBar(percent) {
  const safe = Math.max(0, Math.min(100, Number(percent) || 0));
  return `
    <div class="progress-bar">
      <div class="progress-bar__fill" style="width:${safe}%"></div>
    </div>
  `;
}


function progressFromCourse(course) {
  return Math.min(96, Math.max(8, (Number(course?.current_day || 1) * 14)));
}


function englishProgress() {
  const lessons = Number(state.profile?.completed_lessons || 0);
  const strategyRate = Number(state.profile?.strategy?.success_rate || 0);
  return Math.max(12, Math.min(100, strategyRate || lessons * 9 || 24));
}


function achievementsData() {
  const streak = Number(state.profile?.streak_count || 0);
  const completed = Number(state.profile?.completed_lessons || 0);
  const focusMinutes = Number(state.profile?.focus_minutes || 0);
  const band = Number(state.profile?.latest_overall_band || 0);

  return [
    {
      id: "starter",
      title: "Birinchi qadam",
      description: "1 ta dars tugatildi.",
      unlocked: completed >= 1,
      icon: "01",
    },
    {
      id: "consistent",
      title: "Barqaror ritm",
      description: "7 kunlik streak yig'ildi.",
      unlocked: streak >= 7,
      icon: "07",
    },
    {
      id: "deep_focus",
      title: "Chuqur fokus",
      description: "120 daqiqa foydali vaqt yig'ildi.",
      unlocked: focusMinutes >= 120,
      icon: "FX",
    },
    {
      id: "band7",
      title: "IELTS 7.0",
      description: "Yakuniy natijada 7.0+ band oling.",
      unlocked: band >= 7,
      icon: "7+",
    },
  ];
}


function achievementsSummary() {
  const all = achievementsData();
  return {
    unlocked: all.filter((item) => item.unlocked),
    locked: all.filter((item) => !item.unlocked),
  };
}


function sessionModules() {
  return state.exam.session?.modules || {};
}


function sessionCountdown() {
  if (!state.exam.session?.started_at) return "02:00:00";
  const startedAt = new Date(state.exam.session.started_at).getTime();
  const maxSeconds = state.exam.session.mode === "certified" ? 7200 : 3600;
  const left = Math.max(0, maxSeconds - Math.floor((state.now - startedAt) / 1000));
  const hours = String(Math.floor(left / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const seconds = String(left % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}


function parseSocialHours(text) {
  const source = String(text || "").toLowerCase();
  const values = (source.match(/\d+(?:\.\d+)?/g) || []).map(Number);
  if (!values.length) {
    return (Number(state.profile?.daily_study_minutes) || 120) / 60;
  }
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (source.includes("min") || source.includes("daq")) return average / 60;
  return average;
}


function strategySummary() {
  return state.profile?.strategy || null;
}


function hydrateDrafts() {
  const strategy = strategySummary();
  state.strategyDraft.goal_text = strategy?.goal_text || state.profile?.user_goal || state.strategyDraft.goal_text;
  state.strategyDraft.timeframe_text = strategy?.timeframe?.original_text || state.profile?.study_deadline_text || state.strategyDraft.timeframe_text;
  state.strategyDraft.daily_minutes = strategy?.daily_minutes || state.profile?.daily_study_minutes || state.strategyDraft.daily_minutes;
  state.strategyDraft.current_band = strategy?.current_band || state.profile?.current_band || state.strategyDraft.current_band;
  state.strategyDraft.target_band = strategy?.target_band || state.profile?.target_band || state.strategyDraft.target_band;
  state.strategyDraft.district = state.profile?.district || state.strategyDraft.district;
  state.strategyDraft.region = state.profile?.region || state.strategyDraft.region;
  state.strategyDraft.country = state.profile?.country || state.strategyDraft.country;
}


async function loadProgress() {
  const userId = state.userId;
  if (!userId) return;
  state.profile = await requestJson(`progress?user_id=${userId}`);
  hydrateDrafts();
  if (state.profile?.active_exam) {
    state.exam.session = state.profile.active_exam;
    state.exam.mode = state.profile.active_exam.mode || state.exam.mode;
  }
}


