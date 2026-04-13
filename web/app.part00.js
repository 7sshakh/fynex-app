const tg = window.__fynexTg ?? window.Telegram?.WebApp ?? null;
const root = document.getElementById("app");

const STORAGE_THEME_KEY = "fynex-theme";
const STORAGE_USER_ID_KEY = "fynex-user-id";
const STORAGE_SCREEN_KEY = "fynex-screen";
const SCREENS = ["home", "courses", "ielts", "streak", "leaderboard", "more"];

const state = {
  now: Date.now(),
  userId: null,
  theme: localStorage.getItem(STORAGE_THEME_KEY) || "light",
  screen: "home",
  courseTab: "all",
  leaderboardScope: "district",
  profile: null,
  leaderboard: [],
  strategyDraft: {
    goal_text: "",
    timeframe_text: "",
    daily_minutes: 90,
    current_band: 5.0,
    target_band: 7.0,
    district: "",
    region: "",
    country: "",
  },
  exam: {
    mode: "practice",
    session: null,
    activeModule: "reading",
    form: {
      readingRaw: "30",
      readingVariant: "academic",
      listeningRaw: "30",
      writingPrompt: "Some people believe discipline matters more than motivation. Discuss both views and give your opinion.",
      writingAnswer: "",
      speakingPrompt: "Describe a difficult goal you still want to reach.",
      speakingTranscript: "",
    },
    speaking: {
      recording: false,
      mediaStream: null,
      audioContext: null,
      sourceNode: null,
      processor: null,
      monitorGain: null,
      chunks: [],
      sampleRate: 16000,
      audioBase64: "",
    },
  },
  admin: {
    open: false,
    loading: false,
    data: null,
  },
  achievementModal: null,
  verificationModal: null,
  toast: "",
  toastVisible: false,
  loading: true,
  bootError: "",
  footerTapCount: 0,
  footerTapAt: 0,
};


function telegramUser() {
  return tg?.initDataUnsafe?.user ?? null;
}


function query() {
  return new URLSearchParams(window.location.search);
}


function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


function requestCandidates(path) {
  const clean = path.replace(/^\/+/, "");
  return [`/api/${clean}`, `/${clean}`];
}


async function requestJson(path, options = {}) {
  let lastError = null;
  for (const candidate of requestCandidates(path)) {
    try {
      const response = await fetch(candidate, options);
      if (response.ok) return await response.json();
      let detail = `${candidate} -> ${response.status}`;
      try {
        const body = await response.json();
        if (body?.detail) detail = body.detail;
      } catch {
        // ignore non-json error payloads
      }
      lastError = new Error(detail);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error(`Request failed for ${path}`);
}


function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_THEME_KEY, theme);
  const themeColor = theme === "dark" ? "#0b1610" : "#fdfaf5";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  document.documentElement.style.backgroundColor = themeColor;
  document.body.style.backgroundColor = themeColor;
  if (theme === "dark") {
    tg?.setBackgroundColor?.("#0B1610");
    tg?.setHeaderColor?.("#0B1610");
  } else {
    tg?.setBackgroundColor?.("#FDFAF5");
    tg?.setHeaderColor?.("#FDFAF5");
  }
}


function toggleTheme() {
  setTheme(state.theme === "light" ? "dark" : "light");
  render();
}


function showToast(message) {
  state.toast = message;
  state.toastVisible = true;
  renderToastOnly();
  clearTimeout(showToast.timerId);
  showToast.timerId = window.setTimeout(() => {
    state.toastVisible = false;
    renderToastOnly();
  }, 2200);
}


function renderToastOnly() {
  const toast = document.querySelector(".toast");
  if (!toast) {
    render();
    return;
  }
  toast.textContent = state.toast;
  toast.classList.toggle("is-visible", state.toastVisible);
}


function storedUserId() {
  const raw = localStorage.getItem(STORAGE_USER_ID_KEY) || "";
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}


function ensureStandaloneUserId() {
  const existing = storedUserId();
  if (existing) return existing;
  const generated = 900000000 + Math.floor(Math.random() * 90000000);
  rememberUserId(generated);
  return generated;
}


function rememberUserId(userId) {
  if (!userId) return;
  localStorage.setItem(STORAGE_USER_ID_KEY, String(userId));
}


function storedScreen() {
  const screen = localStorage.getItem(STORAGE_SCREEN_KEY) || "";
  return SCREENS.includes(screen) ? screen : null;
}


function setScreen(screen, { shouldRender = true } = {}) {
  if (!SCREENS.includes(screen)) return;
  state.screen = screen;
  localStorage.setItem(STORAGE_SCREEN_KEY, screen);
  if (shouldRender) render();
}


function getUserId() {
  const telegramId = telegramUser()?.id ?? null;
  const queryId = Number(query().get("user_id") || 0);
  const resolved = telegramId ?? (queryId || storedUserId() || (window.__fynexStandalone ? ensureStandaloneUserId() : null));
  if (resolved) rememberUserId(resolved);
  return resolved || null;
}


function currentClock() {
  return new Date(state.now).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}


function icon(name) {
  const icons = {
    moon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
