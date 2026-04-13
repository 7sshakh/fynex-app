const tg = window.__fynexTg ?? window.Telegram?.WebApp ?? null;
const root = document.getElementById("app");

const DEMO_CODE = "111111";
const STORAGE = {
  userId: "fynex-user-id",
  screen: "fynex-screen",
  lessonOpen: "fynex-lesson-open",
  lessonStage: "fynex-lesson-stage",
  selectedEnglishLevel: "fynex-english-level",
  theme: "fynex-theme",
  bookmarks: "fynex-bookmarks",
};

const ENGLISH_LEVELS = ["Beginner", "Elementary", "Intermediate", "Upper-Intermediate", "Advanced"];
const SCREENS = ["home", "courses", "streak", "leaderboard", "more"];

const state = {
  phase: "loading",
  userId: null,
  bootstrap: null,
  screen: localStorage.getItem(STORAGE.screen) || "home",
  register: {
    name: "",
    phone: "",
    code: "",
  },
  lessonOpen: localStorage.getItem(STORAGE.lessonOpen) === "1",
  lessonStage: localStorage.getItem(STORAGE.lessonStage) || "intro",
  selectedOptionId: null,
  reviewChallenge: null,
  englishLevelOpen: false,
  selectedEnglishLevel: localStorage.getItem(STORAGE.selectedEnglishLevel) || "",
  morePanel: "",
  answering: false,
  toast: "",
  toastVisible: false,
  theme: localStorage.getItem(STORAGE.theme) || "dark",
  timerRunning: false,
  timerSeconds: 0,
  timerInterval: null,
  searchQuery: "",
  courseFilter: "all",
  bookmarks: JSON.parse(localStorage.getItem(STORAGE.bookmarks) || "[]"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function currentUser() {
  return tg?.initDataUnsafe?.user ?? null;
}

function getOrCreateUserId() {
  const urlId = Number(new URLSearchParams(window.location.search).get("user_id") || 0);
  const telegramId = Number(currentUser()?.id || 0);
  const stored = Number(localStorage.getItem(STORAGE.userId) || 0);
  const candidate = urlId || telegramId || stored || (910000000 + Math.floor(Math.random() * 10000000));
  localStorage.setItem(STORAGE.userId, String(candidate));
  return candidate;
}

function showToast(message) {
  state.toast = message;
  state.toastVisible = true;
  render();
  clearTimeout(showToast.timerId);
  showToast.timerId = window.setTimeout(() => {
    state.toastVisible = false;
    render();
  }, 2200);
}

async function getJson(path, params = {}) {
  const url = new URL(`/api/${path.replace(/^\/+/, "")}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`${path} -> ${response.status}`);
  return await response.json();
}

async function postJson(path, payload) {
  const response = await fetch(`/api/${path.replace(/^\/+/, "")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `${path} -> ${response.status}`);
  }
  return await response.json();
}

function profile() {
  return state.bootstrap?.profile || {};
}

function courseList() {
  return state.bootstrap?.courses || [];
}

function currentLessonBundle() {
  return state.bootstrap?.current_lesson || null;
}

function reviewItems() {
  return state.bootstrap?.review_items || [];
}

function dailyQuests() {
  return state.bootstrap?.daily_quests || [];
}

function weeklyStats() {
  return state.bootstrap?.weekly_stats || { listening_minutes: 0, speaking_minutes: 0, weekly_xp: 0 };
}

function achievements() {
  return state.bootstrap?.achievements || [];
}

function customScenarios() {
  return state.bootstrap?.custom_scenarios || [];
}

function lessonMap() {
  return state.bootstrap?.lesson_map || [];
}

function leaderboard() {
  return state.bootstrap?.leaderboard || [];
}

function setScreen(screen) {
  if (!SCREENS.includes(screen)) return;
  state.screen = screen;
  localStorage.setItem(STORAGE.screen, screen);
  render();
}

function setLessonOpen(open, stage = "intro") {
  state.lessonOpen = open;
  state.lessonStage = stage;
  localStorage.setItem(STORAGE.lessonOpen, open ? "1" : "0");
  localStorage.setItem(STORAGE.lessonStage, stage);
}

function activeChallenge() {
  if (state.reviewChallenge) return state.reviewChallenge;
  const lesson = currentLessonBundle();
  if (!lesson) return null;
  return (
    lesson.challenges.find((item) => item.is_current) ||
    lesson.challenges.find((item) => !item.completed) ||
    lesson.challenges.at(-1) ||
    null
  );
}

function courseEmoji(slug) {
  if (slug.startsWith("english")) return "🇬🇧";
  if (slug === "math") return "🔢";
  if (slug === "physics") return "🧪";
  if (slug === "programming") return "💻";
  if (slug === "russian") return "🇷🇺";
  if (slug === "logic") return "🧠";
  return "📚";
}

function progressText() {
  const lesson = currentLessonBundle();
  if (!lesson) return "0 / 0";
  return `${lesson.lesson.completed_count} / ${lesson.lesson.total_challenges}`;
}

function fullPhoneNumber() {
  return `+998${state.register.phone.trim()}`;
}

async function refreshBootstrap() {
  state.bootstrap = await getJson("app/bootstrap", {
    user_id: state.userId,
    name: currentUser()?.first_name || state.register.name || "Fynex User",
  });
}

function syncPhase() {
  if (!state.bootstrap) {
    state.phase = "loading";
    return;
  }
  if (!state.bootstrap.registered) {
    state.phase = "register-name";
    state.register.name = currentUser()?.first_name || state.register.name;
    return;
  }
  state.register.name = state.bootstrap.profile?.name || state.register.name;
  state.register.phone = String(state.bootstrap.profile?.phone_number || "")
    .replace(/^\+998/, "")
    .replace(/\D/g, "")
    .slice(0, 9);
  state.phase = "app";
}

function canContinueName() {
  return state.register.name.trim().length >= 2;
}

function isValidPhone() {
  return /^\d{9}$/.test(state.register.phone.trim());
}

function setMorePanel(panel) {
  state.morePanel = panel;
  render();
}

async function completeRegistration() {
  await postJson("app/register", {
    user_id: state.userId,
    name: state.register.name.trim(),
    phone_number: fullPhoneNumber(),
    language: "uz",
  });
  await refreshBootstrap();
  syncPhase();
}

async function openCourse(slug) {
  if (slug === "english") {
    state.englishLevelOpen = true;
    render();
    return;
  }
  const result = await postJson("app/course/select", {
    user_id: state.userId,
    slug,
  });
  state.bootstrap.current_lesson = result.current_lesson;
  state.bootstrap.courses = result.courses;
  setScreen("courses");
  setLessonOpen(true, "intro");
}

async function startEnglishCourse() {
  if (!state.selectedEnglishLevel) {
    showToast("Darajani tanlang.");
    return;
  }
  const result = await postJson("app/course/select", {
    user_id: state.userId,
    slug: "english",
    level: state.selectedEnglishLevel,
  });
  state.bootstrap.current_lesson = result.current_lesson;
  state.bootstrap.courses = result.courses;
  state.englishLevelOpen = false;
  setScreen("courses");
  setLessonOpen(true, "intro");
}

async function submitAnswer() {
  const challenge = activeChallenge();
  if (!challenge || state.answering) return;
  if (challenge.type !== "SPEAKING" && !state.selectedOptionId) {
    showToast("Javobni tanlang.");
    return;
  }
  state.answering = true;
  render();
  try {
    const result = await postJson("app/answer", {
      user_id: state.userId,
      challenge_id: challenge.id,
      option_id: challenge.type === "SPEAKING" ? challenge.options[0]?.id ?? null : state.selectedOptionId,
    });
    state.bootstrap.current_lesson = result.current_lesson;
    state.bootstrap.lesson_map = result.lesson_map;
    state.bootstrap.review_items = result.review_items;
    state.bootstrap.daily_quests = result.daily_quests;
    state.bootstrap.weekly_stats = result.weekly_stats;
    state.bootstrap.achievements = result.achievements;
    state.bootstrap.leaderboard = result.leaderboard;
    state.bootstrap.profile = {
      ...state.bootstrap.profile,
      xp: result.result.xp,
      energy: result.result.energy,
      streak: result.result.streak,
    };
    state.selectedOptionId = null;
    state.reviewChallenge = null;
    showToast(result.result.correct ? `Ajoyib! +${result.result.xp_delta} XP` : "Bu safar bo'lmadi, yana urinib ko'ring.");
    setLessonOpen(true, result.result.lesson_completed ? "intro" : "quiz");
  } catch (error) {
    console.error(error);
    showToast("Javob yuborilmadi.");
  } finally {
    state.answering = false;
    render();
  }
}

function playAudio(text) {
  if (!text || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.93;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

async function generateScenario() {
  const result = await postJson("app/scenario/generate", { user_id: state.userId });
  state.bootstrap.custom_scenarios = result.custom_scenarios;
  showToast("Yangi scenario tayyor.");
}

function splashHtml() {
  return `
    <section class="splash-screen">
      <div class="splash-stage">
        <div class="splash-f">F</div>
        <div class="splash-word">
          <div class="splash-brand">Fynex</div>
          <div class="splash-tag">O'rganishning yangi davri</div>
        </div>
      </div>
    </section>
  `;
}

function authStepHtml({ title, subtitle, inputType = "text", inputMode = "text", bind, value, placeholder, buttonText, action, maxLength }) {
  return `
    <section class="auth-screen">
      <div class="auth-screen__orb auth-screen__orb--one"></div>
      <div class="auth-screen__orb auth-screen__orb--two"></div>
      <div class="auth-screen__body">
        <div class="auth-screen__emoji">${bind === "name" ? "👋" : bind === "phone" ? "📱" : "🔐"}</div>
        <div class="auth-screen__title">${title}</div>
        <div class="auth-screen__subtitle">${subtitle}</div>
        ${bind === "code" ? `<div class="auth-screen__hint">Demo kod: <strong>${DEMO_CODE}</strong></div>` : ""}
        ${
          bind === "phone"
            ? `
              <div class="phone-input-shell">
                <span class="phone-input-shell__prefix">+998</span>
                <input
                  class="auth-screen__input phone-input-shell__field"
                  data-bind="${bind}"
                  type="${inputType}"
                  inputmode="${inputMode}"
                  ${maxLength ? `maxlength="${maxLength}"` : ""}
                  value="${escapeHtml(value)}"
                  placeholder="${escapeHtml(placeholder)}"
                />
              </div>
            `
            : `
              <input
                class="auth-screen__input ${bind === "code" ? "auth-screen__input--code" : ""}"
                data-bind="${bind}"
                type="${inputType}"
                inputmode="${inputMode}"
                ${maxLength ? `maxlength="${maxLength}"` : ""}
                value="${escapeHtml(value)}"
                placeholder="${escapeHtml(placeholder)}"
              />
            `
        }
        <div class="auth-screen__actions">
          ${bind !== "name" ? `<button class="secondary-btn" type="button" data-action="auth-back">Orqaga</button>` : ""}
          <button class="primary-btn primary-btn--xl" type="button" data-action="${action}">${buttonText}</button>
        </div>
      </div>
    </section>
  `;
}

function registerNameHtml() {
  return authStepHtml({
    title: "Ismingizni kiriting",
    subtitle: "Shaxsiy sahifangiz shu ism bilan boshlanadi.",
    bind: "name",
    value: state.register.name,
    placeholder: "Masalan: Shaxriyor",
    buttonText: "Davom etish ✨",
    action: "to-phone",
  });
}

function registerPhoneHtml() {
  return authStepHtml({
    title: "Telefon raqamingiz",
    subtitle: "Hozircha demo tasdiqlash ishlaydi. Keyin real SMS ulanadi.",
    bind: "phone",
    value: state.register.phone,
    placeholder: "90 123 45 67",
    inputType: "tel",
    inputMode: "numeric",
    maxLength: 9,
    buttonText: "Kod olish 📩",
    action: "to-code",
  });
}

function registerCodeHtml() {
  return authStepHtml({
    title: "Tasdiqlash kodi",
    subtitle: "Kodni kiriting va darhol appga kiring.",
    bind: "code",
    value: state.register.code,
    placeholder: "111111",
    inputType: "tel",
    inputMode: "numeric",
    maxLength: 6,
    buttonText: "Kirish 🚀",
    action: "finish-registration",
  });
}

function topbarHtml() {
  const p = profile();
  return `
    <header class="topbar">
      <div class="topbar__brand">
        <div class="topbar__logo">F</div>
        <div>
          <div class="topbar__title">Fynex</div>
          <div class="topbar__subtitle">Learning app</div>
        </div>
      </div>
      <button class="topbar__profile" type="button" data-action="open-panel" data-panel="profile">
        <span>${escapeHtml((p.name || "F")[0])}</span>
      </button>
    </header>
  `;
}

function questsHtml() {
  return dailyQuests()
    .map(
      (quest) => `
        <div class="quest-card">
          <div>
            <div class="quest-card__title">${escapeHtml(quest.title)}</div>
            <div class="quest-card__meta">${quest.current}/${quest.target} • +${quest.reward_xp} XP</div>
          </div>
          <div class="quest-card__progress">${Math.round((quest.current / quest.target) * 100)}%</div>
        </div>
      `,
    )
    .join("");
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = state.theme === "light" ? "#f5f7fb" : "#060b11";
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE.theme, state.theme);
  applyTheme();
  render();
}

function toggleTimer() {
  if (state.timerRunning) {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
  } else {
    state.timerRunning = true;
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      const el = document.getElementById("timer-display");
      if (el) el.textContent = formatTimer(state.timerSeconds);
    }, 1000);
  }
  render();
}

function resetTimer() {
  clearInterval(state.timerInterval);
  state.timerRunning = false;
  state.timerSeconds = 0;
  render();
}

function formatTimer(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function toggleBookmark(id) {
  const idx = state.bookmarks.indexOf(id);
  if (idx >= 0) state.bookmarks.splice(idx, 1);
  else state.bookmarks.push(id);
  localStorage.setItem(STORAGE.bookmarks, JSON.stringify(state.bookmarks));
  render();
}

function isBookmarked(id) {
  return state.bookmarks.includes(id);
}

function courseColor(slug) {
  if (slug.startsWith("english")) return "var(--color-english)";
  if (slug === "math") return "var(--color-math)";
  if (slug === "physics") return "var(--color-physics)";
  if (slug === "programming") return "var(--color-programming)";
  if (slug === "russian") return "var(--color-russian)";
  if (slug === "logic") return "var(--color-logic)";
  return "var(--accent)";
}

function courseSlugName(slug) {
  if (slug.startsWith("english")) return "english";
  return slug;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return { emoji: "🌙", text: "Tinch tun" };
  if (hour < 12) return { emoji: "☀️", text: "Xayrli tong" };
  if (hour < 17) return { emoji: "🌤", text: "Xayrli kun" };
  if (hour < 21) return { emoji: "🌆", text: "Xayrli kech" };
  return { emoji: "🌙", text: "Tinch tun" };
}

function courseHighlightsHtml() {
  const courses = courseList();
  if (!courses.length) return "";
  return `
    <div class="panel">
      <div class="panel__title">📚 Kurslaringiz</div>
      <div class="quick-grid">
        ${courses.slice(0, 4).map(c => `
          <button class="quick-link" type="button" data-action="course-open" data-slug="${c.slug}" style="border-left:3px solid ${courseColor(c.slug)}">
            ${courseEmoji(c.slug)} ${escapeHtml(c.title)}
            <span style="color:var(--muted);font-size:12px;font-weight:600">${c.progress}%</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function homeHtml() {
  const p = profile();
  const lesson = currentLessonBundle();
  const stats = weeklyStats();
  const greet = getGreeting();
  return `
    <section class="page">
      <div class="hero hero--colorful">
        <div class="hero__emoji">${greet.emoji}</div>
        <div class="hero__title">${greet.text}, ${escapeHtml((p.name || "do'st").split(" ")[0])}</div>
        <div class="hero__chips">
          <div class="hero-chip">⚡ ${p.energy || 0}/5</div>
          <div class="hero-chip">🔥 ${p.streak || 0}</div>
          <div class="hero-chip" style="background:rgba(176,124,255,0.1);border-color:rgba(176,124,255,0.15)">🏅 ${p.xp || 0} XP</div>
        </div>
      </div>

      <div class="timer-widget">
        <div>
          <div class="timer-widget__label">⏱ O'qish vaqti</div>
          <div class="timer-widget__time" id="timer-display">${formatTimer(state.timerSeconds)}</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="timer-widget__btn ${state.timerRunning ? 'timer-widget__btn--stop' : 'timer-widget__btn--start'}" type="button" data-action="toggle-timer">
            ${state.timerRunning ? '⏸' : '▶'}
          </button>
          ${state.timerSeconds > 0 ? '<button class="timer-widget__btn timer-widget__btn--stop" type="button" data-action="reset-timer">↺</button>' : ''}
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card" style="border-top:3px solid var(--color-english)">
          <div class="dashboard-card__label">🎧 Tinglash</div>
          <div class="dashboard-card__value">${stats.listening_minutes}<small style="font-size:14px;font-weight:600;opacity:0.5"> min</small></div>
        </div>
        <div class="dashboard-card" style="border-top:3px solid var(--accent-coral)">
          <div class="dashboard-card__label">🎙 Gapirish</div>
          <div class="dashboard-card__value">${stats.speaking_minutes}<small style="font-size:14px;font-weight:600;opacity:0.5"> min</small></div>
        </div>
      </div>

      ${lesson ? `
      <div class="panel">
        <div class="panel__title" style="color:${courseColor(lesson.course?.slug || '')}">📖 Davom etish</div>
        <div class="panel__headline">${escapeHtml(lesson.lesson.title)}</div>
        <div class="panel__copy">${escapeHtml(lesson.unit?.title || "")}</div>
        <div class="progress-meta">
          <span>${progressText()}</span>
          <span>${lesson.lesson.percentage || 0}%</span>
        </div>
        <div class="progress"><div class="progress__fill" style="width:${lesson.lesson.percentage || 0}%"></div></div>
        <button class="primary-btn" type="button" data-action="resume-lesson" style="margin-top:14px">Davom etish ▶</button>
      </div>` : ''}

      ${courseHighlightsHtml()}

      <div class="panel">
        <div class="panel__title">🎯 Vazifalar</div>
        <div class="quest-list">${questsHtml()}</div>
      </div>

      ${
        reviewItems().length
          ? `
      <div class="panel">
        <div class="panel__title" style="color:var(--accent-coral)">🧩 Qayta ko'rish</div>
        <button class="secondary-btn" type="button" data-action="open-review" data-challenge-id="${reviewItems()[0].id}" style="margin-top:8px">
          Boshlash →
        </button>
      </div>`
          : ""
      }
    </section>
  `;
}

function liquidVisual(course) {
  return `
    <div class="liquid-visual">
      <div class="liquid-visual__fill" style="height:${course.progress}%"></div>
      <div class="liquid-visual__label">${escapeHtml(course.target_label || "Progress")}</div>
    </div>
  `;
}

function lessonMapHtml() {
  return lessonMap()
    .map(
      (unit) => `
        <div class="lesson-map-unit">
          <div class="lesson-map-unit__title">${escapeHtml(unit.title)}</div>
          <div class="lesson-map-list">
            ${unit.lessons
              .map(
                (lesson) => `
                  <div class="lesson-map-item lesson-map-item--${lesson.status}">
                    <span>${escapeHtml(lesson.title)}</span>
                    <strong>${lesson.percentage}%</strong>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      `,
    )
    .join("");
}

function coursesHtml() {
  const filtered = state.courseFilter === 'all' ? courseList() : courseList().filter(c => courseSlugName(c.slug) === state.courseFilter);
  return `
    <section class="page">
      <div class="search-bar">
        <span class="search-bar__icon">🔍</span>
        <input class="search-bar__input" type="text" placeholder="Kurs qidirish..." data-bind="search" value="${escapeHtml(state.searchQuery)}" />
      </div>

      <div class="category-chips">
        <button class="category-chip ${state.courseFilter === 'all' ? 'is-active' : ''}" type="button" data-action="course-filter" data-filter="all">Barchasi</button>
        <button class="category-chip ${state.courseFilter === 'english' ? 'is-active' : ''}" type="button" data-action="course-filter" data-filter="english" style="${state.courseFilter === 'english' ? '' : 'border-color:var(--color-english);color:var(--color-english)'}">🇬🇧 English</button>
        <button class="category-chip ${state.courseFilter === 'math' ? 'is-active' : ''}" type="button" data-action="course-filter" data-filter="math" style="${state.courseFilter === 'math' ? '' : 'border-color:var(--color-math);color:var(--color-math)'}">🔢 Matematika</button>
        <button class="category-chip ${state.courseFilter === 'physics' ? 'is-active' : ''}" type="button" data-action="course-filter" data-filter="physics" style="${state.courseFilter === 'physics' ? '' : 'border-color:var(--color-physics);color:var(--color-physics)'}">🧪 Fizika</button>
        <button class="category-chip ${state.courseFilter === 'programming' ? 'is-active' : ''}" type="button" data-action="course-filter" data-filter="programming" style="${state.courseFilter === 'programming' ? '' : 'border-color:var(--color-programming);color:var(--color-programming)'}">💻 Dasturlash</button>
      </div>

      ${filtered
        .filter(c => !state.searchQuery || c.title.toLowerCase().includes(state.searchQuery.toLowerCase()))
        .map(
          (course) => `
            <div class="course-card" data-course="${courseSlugName(course.slug)}">
              <div class="course-card__main">
                <div class="course-card__visual">${liquidVisual(course)}</div>
                <div class="course-card__content">
                  <div class="course-card__title" style="color:${courseColor(course.slug)}">${courseEmoji(course.slug)} ${escapeHtml(course.title)}</div>
                  <div class="course-card__text">${escapeHtml(course.description)}</div>
                  <div class="progress-meta">
                    <span>${course.lesson_count} dars</span>
                    <span style="color:${courseColor(course.slug)}">${course.progress}%</span>
                  </div>
                  <div class="progress"><div class="progress__fill" style="width:${course.progress}%;background:linear-gradient(90deg,${courseColor(course.slug)},var(--accent-3))"></div></div>
                </div>
              </div>
              <button class="primary-btn" type="button" data-action="course-open" data-slug="${course.slug}">
                ${course.slug === 'english' ? 'Darajani tanlab boshlash' : course.progress > 0 ? 'Davom etish ▶' : 'Boshlash ✨'}
              </button>
            </div>
          `,
        )
        .join('')}

      <div class="panel">
        <div class="panel__title">🗺 Darslar xaritasi</div>
        ${lessonMapHtml()}
      </div>
    </section>
  `;
}

function streakHtml() {
  const p = profile();
  const stats = weeklyStats();
  const days = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  const today = (new Date().getDay() + 6) % 7;
  return `
    <section class="page">
      <div class="hero hero--streak">
        <div class="hero__emoji hero__emoji--big flame-animated">🔥</div>
        <div class="hero__title">${p.streak || 0} kunlik streak</div>
        <div class="hero__text">Har kuni kichik progress katta natijaga olib boradi.</div>
        <div class="hero__chips" style="justify-content:center;margin-top:20px">
          ${days.map((d, i) => `<div class="hero-chip" style="${i <= today ? 'background:rgba(255,192,84,0.12);border-color:rgba(255,192,84,0.2);color:#ffc054' : ''}">${i < today ? '✅' : i === today ? '🔥' : '⬜'} ${d}</div>`).join('')}
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="dashboard-card__label">⚡ Energiya</div>
          <div class="dashboard-card__value">${p.energy || 0}<small style="font-size:14px;font-weight:600;opacity:0.5">/5</small></div>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-card__label">🏆 Haftalik XP</div>
          <div class="dashboard-card__value">${stats.weekly_xp}</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel__title">📊 Haftalik ritm</div>
        <div class="progress-meta"><span>🎧 Tinglash</span><span>${stats.listening_minutes} min</span></div>
        <div class="progress"><div class="progress__fill" style="width:${Math.min(100, stats.listening_minutes * 3)}%"></div></div>
        <div class="progress-meta"><span>🎙 Gapirish</span><span>${stats.speaking_minutes} min</span></div>
        <div class="progress"><div class="progress__fill" style="width:${Math.min(100, stats.speaking_minutes * 3)}%"></div></div>
      </div>
    </section>
  `;
}

function leaderboardHtml() {
  const medals = ['🥇', '🥈', '🥉'];
  return `
    <section class="page">
      <div class="panel">
        <div class="panel__title">🏆 Reyting</div>
        <div class="panel__copy">Bu hafta eng faol o'quvchilar reytingi — siz nechanchi o'rindasiz?</div>
      </div>
      <div class="leaderboard-list">
        ${leaderboard()
          .map(
            (item) => `
              <div class="leaderboard-row" ${item.rank <= 3 ? 'style="border-color:rgba(255,192,84,0.15);background:linear-gradient(135deg,rgba(255,192,84,0.04),rgba(255,138,80,0.02))"' : ''}>
                <div class="leaderboard-row__rank" ${item.rank <= 3 ? 'style="background:rgba(255,192,84,0.15);color:#ffc054"' : ''}>${medals[item.rank - 1] || '#' + item.rank}</div>
                <div class="leaderboard-row__body">
                  <div class="leaderboard-row__name">${escapeHtml(item.name)} ${item.verified ? '<span class="verified-badge">✓</span>' : ''}</div>
                  <div class="leaderboard-row__xp">${item.weekly_xp} XP</div>
                </div>
              </div>
            `,
          )
          .join('')}
      </div>
    </section>
  `;
}

function moreMenuHtml() {
  const items = [
    ["profile", "👤 Profil va sozlamalar"],
    ["faq", "❓ Ko'p beriladigan savollar"],
    ["help", "💬 Yordam va qo'llab-quvvatlash"],
    ["theme", "🎨 Ko'rinish sozlamalari"],
    ["about", "✨ Fynex haqida"],
    ["terms", "📄 Foydalanish shartlari"],
  ];
  return items
    .map(
      ([id, label]) => `
        <button class="more-link" type="button" data-action="open-panel" data-panel="${id}">
          <span>${label}</span>
          <span>›</span>
        </button>
      `,
    )
    .join("");
}

function moreHtml() {
  return `
    <section class="page">
      <div class="panel">
        <div class="panel__title">⚙️ Sozlamalar</div>
        <div class="more-links">${moreMenuHtml()}</div>
      </div>
    </section>
  `;
}

function lessonIntroHtml(lesson) {
  return `
    <section class="lesson-screen">
      <div class="lesson-screen__head">
        <div class="lesson-screen__kicker">${escapeHtml(lesson.course.title)} • ${escapeHtml(lesson.unit.title)}</div>
        <div class="lesson-screen__title">${escapeHtml(lesson.lesson.title)}</div>
        <div class="lesson-screen__text">Avval yangi so'zlarni ko'rib chiqing, keyin mashqni boshlaymiz.</div>
      </div>
      <div class="vocab-grid">
        ${lesson.lesson.intro_vocab
          .map(
            (item) => `
              <div class="vocab-card">
                <div class="vocab-card__type">${escapeHtml(item.type)}</div>
                <div class="vocab-card__word">${escapeHtml(item.word)}</div>
                <div class="vocab-card__translation">${escapeHtml(item.translation)}</div>
                <button class="secondary-btn secondary-btn--small" type="button" data-action="play-audio" data-text="${escapeHtml(item.audio_text)}">Tinglash 🔊</button>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="full-actions">
        <button class="secondary-btn" type="button" data-action="close-lesson">Orqaga</button>
        <button class="primary-btn" type="button" data-action="start-practice">Mashqni boshlash 🚀</button>
      </div>
    </section>
  `;
}

function lessonQuizHtml(lesson) {
  const challenge = activeChallenge();
  if (!challenge) {
    return `
      <section class="lesson-screen">
        <div class="hero hero--done">
          <div class="hero__emoji">🎉</div>
          <div class="hero__title">Lesson tugadi</div>
          <div class="hero__text">Yaxshi ish. Endi keyingi darsga o'tishingiz mumkin.</div>
          <button class="primary-btn" type="button" data-action="close-lesson">Bosh sahifaga qaytish</button>
        </div>
      </section>
    `;
  }
  return `
    <section class="lesson-screen">
      <div class="lesson-progress">
        <div class="progress-meta">
          <span>${escapeHtml(state.reviewChallenge ? "Review" : lesson.lesson.title)}</span>
          <span>${state.reviewChallenge ? "Qayta ko'rish" : progressText()}</span>
        </div>
        <div class="progress"><div class="progress__fill" style="width:${state.reviewChallenge ? 100 : lesson.lesson.percentage}%"></div></div>
      </div>
      <div class="question-card">
        <div class="question-card__type">${escapeHtml(challenge.type)}</div>
        <div class="question-card__title">${escapeHtml(challenge.question)}</div>
        ${challenge.prompt_text ? `
          <div class="question-card__prompt">
            <span>${escapeHtml(challenge.prompt_text)}</span>
            <button class="secondary-btn secondary-btn--small" type="button" data-action="play-audio" data-text="${escapeHtml(challenge.prompt_text)}">Audio 🔊</button>
          </div>
        ` : ""}
      </div>
      <div class="quiz-list">
        ${challenge.options
          .map(
            (option) => `
              <button class="quiz-option ${state.selectedOptionId === option.id ? "is-selected" : ""}" type="button" data-action="pick-option" data-option-id="${option.id}">
                <span class="quiz-option__emoji">${escapeHtml(option.image_hint || "•")}</span>
                <span class="quiz-option__text">${escapeHtml(option.text)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="full-actions">
        <button class="secondary-btn" type="button" data-action="close-lesson">Orqaga</button>
        <button class="primary-btn" type="button" data-action="submit-answer">${state.answering ? "Yuborilmoqda..." : "Tasdiqlash ✅"}</button>
      </div>
    </section>
  `;
}

function lessonOverlayHtml() {
  const lesson = currentLessonBundle();
  if (!state.lessonOpen || !lesson) return "";
  return `
    <div class="fullscreen-overlay">
      <div class="fullscreen-overlay__inner">
        ${state.lessonStage === "intro" ? lessonIntroHtml(lesson) : lessonQuizHtml(lesson)}
      </div>
    </div>
  `;
}

function englishLevelOverlayHtml() {
  if (!state.englishLevelOpen) return "";
  return `
    <div class="fullscreen-overlay">
      <div class="fullscreen-overlay__inner">
        <section class="selection-screen">
          <div class="selection-screen__emoji">🇬🇧</div>
          <div class="selection-screen__title">Ingliz tili darajasi</div>
          <div class="selection-screen__text">O'zingizga mos bosqichni tanlang.</div>
          <div class="selection-grid">
            ${ENGLISH_LEVELS.map((level) => `
              <button class="selection-card ${state.selectedEnglishLevel === level ? "is-active" : ""}" type="button" data-action="pick-english-level" data-level="${level}">
                ${level}
              </button>
            `).join("")}
          </div>
          <div class="full-actions">
            <button class="secondary-btn" type="button" data-action="close-english-level">Orqaga</button>
            <button class="primary-btn" type="button" data-action="start-english-level">Boshlash ✨</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

function panelContent() {
  const p = profile();
  if (state.morePanel === "faq") {
    return `
      <div class="panel-screen__title">FAQ</div>
      <div class="faq-item"><strong>Qanday boshlayman?</strong><span>Kursni tanlang va birinchi darsni boshlang.</span></div>
      <div class="faq-item"><strong>Progress saqlanadimi?</strong><span>Ha, qayerda to'xtagan bo'lsangiz, o'sha joydan davom etasiz.</span></div>
    `;
  }
  if (state.morePanel === "profile") {
    return `
      <div class="panel-screen__title">Profil va sozlamalar</div>
      <div class="faq-item"><strong>👤 Ism</strong><span>${escapeHtml(p.name || "Kiritilmagan")}</span></div>
      <div class="faq-item"><strong>📞 Telefon</strong><span>${escapeHtml(p.phone_number || "Kiritilmagan")}</span></div>
      <div class="faq-item"><strong>📚 Kurslar</strong><span>${escapeHtml((p.current_course || "Hali tanlanmagan").replaceAll("-", " "))}</span></div>
      <div class="faq-item"><strong>🔥 Streak</strong><span>${p.streak || 0} kun</span></div>
    `;
  }
  if (state.morePanel === "help") {
    return `
      <div class="panel-screen__title">Yordam</div>
      <div class="faq-item"><strong>Support</strong><span>@fynex_support orqali yozishingiz mumkin.</span></div>
      <div class="faq-item"><strong>Takliflar</strong><span>Keyingi yangilanishlar uchun fikrlaringizni yuboring.</span></div>
    `;
  }
  if (state.morePanel === "theme") {
    return `
      <div class="panel-screen__title">Ko'rinish</div>
      <button class="theme-toggle ${state.theme === 'light' ? 'theme-toggle--light' : ''}" type="button" data-action="toggle-theme">
        <div>
          <div class="theme-toggle__label">${state.theme === 'dark' ? '🌙 Qorong\'i rejim' : '☀️ Yorug\' rejim'}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px">Bosing — o'zgartiring</div>
        </div>
        <div class="theme-toggle__switch"></div>
      </button>
      <div class="faq-item"><strong>Hozirgi uslub</strong><span>${state.theme === 'dark' ? 'Qorong\'i (Dark)' : 'Yorug\' (Light)'}</span></div>
    `;
  }
  if (state.morePanel === "about") {
    return `
      <div class="panel-screen__title">Ilova haqida</div>
      <div class="faq-item"><strong>Fynex</strong><span>Bu ko'p fanli learning app: ingliz tili, matematika, fizika, dasturlash va boshqa yo'nalishlar uchun.</span></div>
    `;
  }
  if (state.morePanel === "terms") {
    return `
      <div class="panel-screen__title">Foydalanuvchi shartlari</div>
      <div class="faq-item"><strong>Asosiy qoida</strong><span>Ilova ichidagi materiallardan o'rganish maqsadida foydalaniladi va progress sizning profilingizga biriktiriladi.</span></div>
    `;
  }
  return "";
}

function morePanelHtml() {
  if (!state.morePanel) return "";
  return `
    <div class="fullscreen-overlay">
      <div class="fullscreen-overlay__inner">
        <section class="panel-screen">
          ${panelContent()}
          <div class="full-actions">
            <button class="secondary-btn" type="button" data-action="close-panel">Ortga</button>
            <button class="primary-btn" type="button" data-action="close-panel">Yopish</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

function navHtml() {
  const items = [
    ["home", "🏠", "Bosh sahifa"],
    ["courses", "📚", "Kurslar"],
    ["streak", "🔥", "Streak"],
    ["leaderboard", "🏆", "Reyting"],
    ["more", "⚙️", "Yana"],
  ];
  return `
    <nav class="bottom-nav">
      ${items
        .map(
          ([id, icon, label]) => `
            <button class="nav-btn ${state.screen === id ? "is-active" : ""}" type="button" data-action="screen" data-screen="${id}">
              <span class="nav-btn__icon">${icon}</span>
              <span class="nav-btn__label">${label}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

function screenHtml() {
  if (state.screen === "home") return homeHtml();
  if (state.screen === "courses") return coursesHtml();
  if (state.screen === "streak") return streakHtml();
  if (state.screen === "leaderboard") return leaderboardHtml();
  return moreHtml();
}

function appHtml() {
  return `
    <section class="app-shell">
      ${topbarHtml()}
      <main class="screen-area">${screenHtml()}</main>
      ${navHtml()}
      ${lessonOverlayHtml()}
      ${englishLevelOverlayHtml()}
      ${morePanelHtml()}
      <div class="toast ${state.toastVisible ? "is-visible" : ""}">${escapeHtml(state.toast)}</div>
    </section>
  `;
}

function render() {
  if (!root) return;
  if (state.phase === "loading") {
    root.innerHTML = `<section class="loading-screen"><div class="loading-dot"></div></section>`;
    return;
  }
  if (state.phase === "splash") {
    root.innerHTML = splashHtml();
    return;
  }
  if (state.phase === "register-name") {
    root.innerHTML = registerNameHtml();
    return;
  }
  if (state.phase === "register-phone") {
    root.innerHTML = registerPhoneHtml();
    return;
  }
  if (state.phase === "register-code") {
    root.innerHTML = registerCodeHtml();
    return;
  }
  root.innerHTML = appHtml();
}

function bindEvents() {
  root.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "to-phone") {
      if (!canContinueName()) return showToast("Ismni to'liqroq kiriting.");
      state.phase = "register-phone";
      render();
      return;
    }

    if (action === "to-code") {
      if (!isValidPhone()) return showToast("Telefon +998 bilan to'g'ri yozilsin.");
      state.phase = "register-code";
      render();
      return;
    }

    if (action === "finish-registration") {
      if (state.register.code.trim() !== DEMO_CODE) return showToast("Demo kod: 111111");
      await completeRegistration();
      render();
      return;
    }

    if (action === "auth-back") {
      if (state.phase === "register-phone") state.phase = "register-name";
      else if (state.phase === "register-code") state.phase = "register-phone";
      render();
      return;
    }

    if (action === "screen") {
      setScreen(target.dataset.screen);
      return;
    }

    if (action === "course-open") {
      await openCourse(target.dataset.slug);
      render();
      return;
    }

    if (action === "pick-english-level") {
      state.selectedEnglishLevel = target.dataset.level;
      localStorage.setItem(STORAGE.selectedEnglishLevel, state.selectedEnglishLevel);
      render();
      return;
    }

    if (action === "close-english-level") {
      state.englishLevelOpen = false;
      render();
      return;
    }

    if (action === "start-english-level") {
      await startEnglishCourse();
      render();
      return;
    }

    if (action === "resume-lesson") {
      state.reviewChallenge = null;
      setLessonOpen(true, state.lessonStage || "intro");
      render();
      return;
    }

    if (action === "close-lesson") {
      state.reviewChallenge = null;
      state.selectedOptionId = null;
      setLessonOpen(false, "intro");
      render();
      return;
    }

    if (action === "start-practice") {
      setLessonOpen(true, "quiz");
      render();
      return;
    }

    if (action === "pick-option") {
      state.selectedOptionId = Number(target.dataset.optionId || 0);
      render();
      return;
    }

    if (action === "submit-answer") {
      await submitAnswer();
      return;
    }

    if (action === "open-review") {
      const item = reviewItems().find((review) => review.id === Number(target.dataset.challengeId || 0));
      if (!item) return showToast("Review savoli topilmadi.");
      state.reviewChallenge = item;
      state.selectedOptionId = null;
      setLessonOpen(true, "quiz");
      render();
      return;
    }

    if (action === "generate-scenario") {
      try {
        await generateScenario();
        render();
      } catch (error) {
        console.error(error);
        showToast("Scenario yaratilmadi.");
      }
      return;
    }

    if (action === "open-panel") {
      setMorePanel(target.dataset.panel || "");
      return;
    }

    if (action === "close-panel") {
      setMorePanel("");
      return;
    }

    if (action === "play-audio") {
      playAudio(target.dataset.text || "");
      return;
    }

    if (action === "toggle-theme") {
      toggleTheme();
      return;
    }

    if (action === "toggle-timer") {
      toggleTimer();
      return;
    }

    if (action === "reset-timer") {
      resetTimer();
      return;
    }

    if (action === "toggle-bookmark") {
      toggleBookmark(target.dataset.id || "");
      return;
    }

    if (action === "course-filter") {
      state.courseFilter = target.dataset.filter || "all";
      render();
      return;
    }
  });

  root.addEventListener("input", (event) => {
    const element = event.target;
    if (!element.dataset.bind) return;
    if (element.dataset.bind === "name") state.register.name = element.value;
    if (element.dataset.bind === "phone") state.register.phone = element.value.replace(/\D/g, "").slice(0, 9);
    if (element.dataset.bind === "code") state.register.code = element.value.replace(/\D/g, "").slice(0, 6);
    if (element.dataset.bind === "search") {
      state.searchQuery = element.value;
      render();
    }
  });
}

async function boot() {
  state.userId = getOrCreateUserId();
  bindEvents();
  render();
  state.phase = "splash";
  applyTheme();
  render();
  window.setTimeout(async () => {
    try {
      await refreshBootstrap();
      syncPhase();
    } catch (error) {
      console.error(error);
      state.phase = "register-name";
    }
    render();
  }, 1700);
}

boot();
