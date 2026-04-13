            <div class="field">
              <label>Viloyat</label>
              <input data-bind="strategy.region" value="${escapeHtml(state.strategyDraft.region)}" />
            </div>
          </div>
          <div class="field">
            <label>Mamlakat</label>
            <input data-bind="strategy.country" value="${escapeHtml(state.strategyDraft.country)}" />
          </div>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="analyze-strategy">Tahlil qilish</button>
          </div>
        </div>

        ${strategy ? `
          <div class="split-grid" style="margin-top:14px;">
            <div class="strategy-summary">
              <div class="screen-note">Ehtimol</div>
              <div class="success-rate">${escapeHtml(strategy.success_rate)}%</div>
              <div class="field-hint">Estimated band: ${escapeHtml(Number(strategy.estimated_band || 0).toFixed(1))}</div>
            </div>
            <div class="strategy-summary">
              <div class="screen-note">Yo'nalish</div>
              <div class="screen-title" style="font-size:18px;">${escapeHtml(strategy.focus_mode)}</div>
              <div class="field-hint">${escapeHtml(strategy.main_message || "")}</div>
            </div>
          </div>
          <ul class="list-dots" style="margin-top:12px;">
            ${(strategy.daily_plan || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        ` : ""}
      </div>

      <div class="course-list">
        <button class="course-item" type="button" data-action="go-screen" data-screen="courses">
          <div class="course-item__icon course-icon">${icon("courses")}</div>
          <div class="course-main">
            <div class="course-name">Bugungi darslar</div>
            <div class="course-sub">${strategy ? `${strategy.daily_minutes} minutlik blok tayyor` : "Kurslar bo'limidan kerakli yo'nalishni tanlang"}</div>
            ${waveBar(strategy?.success_rate || 16)}
          </div>
          <div class="course-trail">${Math.round(strategy?.success_rate || 16)}%</div>
        </button>
        <button class="course-item" type="button" data-action="go-screen" data-screen="leaderboard">
          <div class="course-item__icon course-icon">${icon("ranking")}</div>
          <div class="course-main">
            <div class="course-name">Leaderboard</div>
            <div class="course-sub">${state.profile?.leaderboard?.my_rank ? `Siz hozir #${state.profile.leaderboard.my_rank}` : "Reytingni oching"}</div>
            ${waveBar(Math.min(100, Number(state.profile?.score_preview || 0)))}
          </div>
          <div class="course-trail">${Math.min(100, Number(state.profile?.score_preview || 0))}%</div>
        </button>
      </div>

      <button class="primary-button" type="button" data-action="go-screen" data-screen="courses">Kurslarga o'tish</button>
    </div>
  `;
}


function coursesScreenHtml() {
  const catalog = [
    { name: "Ingliz tili", level: "IELTS Foundation", progress: 52, lessons: 12, xp: 340, status: "active", action: "ielts" },
    { name: "IELTS Listening", level: "40 savol", progress: 46, lessons: 10, xp: 290, status: "active", action: "ielts" },
    { name: "IELTS Writing", level: "Task 1 + 2", progress: 38, lessons: 8, xp: 250, status: "active", action: "ielts" },
    { name: "IELTS Speaking", level: "Part 1-3", progress: 41, lessons: 9, xp: 270, status: "active", action: "ielts" },
    { name: "Vaqt boshqaruvi", level: "Asosiy yo'l", progress: 67, lessons: 14, xp: 560, status: "done", action: "home" },
    { name: "Mantiqiy fikrlash", level: "Asosiy blok", progress: 31, lessons: 5, xp: 140, status: "all", action: "courses" },
  ];
  const tabs = [
    { id: "all", label: "Barcha" },
    { id: "active", label: "Aktiv" },
    { id: "done", label: "Tugagan" },
  ];
  const visibleItems = catalog.filter((item) => state.courseTab === "all" || item.status === state.courseTab);
  return `
    <div class="screen-body">
      <div class="screen-title">Kurslar</div>
      <div class="american-progress-card">
        <div class="bar-head">
          <span>Ingliz tili progressi</span>
          <span class="mono">${Math.round(englishProgress())}%</span>
        </div>
        <div class="flag-progress">
          <div class="flag-progress__liquid" style="width:${englishProgress()}%;"></div>
          <div class="flag-progress__stars"></div>
          <div class="flag-progress__stripes"></div>
        </div>
        <div class="helper-copy">Ingliz tili darslarida progress oshgani sari kontur ichidagi rang ko'tariladi.</div>
      </div>
      <div class="chip-row">
        ${tabs.map((tab) => `
          <button class="chip ${state.courseTab === tab.id ? "is-active" : ""}" type="button" data-action="set-course-tab" data-tab="${tab.id}">${tab.label}</button>
        `).join("")}
      </div>
      <div class="course-list">
        ${visibleItems.map((item) => `
          <button class="course-item" type="button" data-action="go-screen" data-screen="${item.action}">
            <div class="course-item__icon">${item.name.includes("IELTS") ? icon("english") : item.name.includes("Vaqt") ? icon("clock") : icon("courses")}</div>
            <div class="course-main">
              <div class="course-name">${escapeHtml(item.name)}</div>
              <div class="course-sub">${escapeHtml(item.level)} · ${item.lessons} dars · ${item.xp} XP</div>
              ${waveBar(item.progress)}
            </div>
            <div class="course-trail">${item.progress}%</div>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}


function moduleResultHtml(moduleType) {
  const result = sessionModules()[moduleType];
  if (!result) {
    return `
      <div class="result-card">
        <div class="result-title">Hali topshirilmadi</div>
        <div class="helper-copy">Bu modul sovuq tekshiruvdan keyin shu yerda ko'rinadi.</div>
      </div>
    `;
  }
  const criteria = result.criteria || {};
  return `
    <div class="result-card">
      <div class="result-title">${escapeHtml(moduleType.toUpperCase())} natija</div>
      <div class="result-score">${Number(result.band_score || 0).toFixed(1)}</div>
      <div class="card-copy" style="margin-top:8px;">${escapeHtml(result.summary || "")}</div>
      ${Object.keys(criteria).length ? `
        <div class="criteria-grid">
          ${Object.entries(criteria).map(([label, value]) => `
            <div class="criteria-item">
              <div class="criteria-item__label">${escapeHtml(label.replaceAll("_", " "))}</div>
              <div class="criteria-item__value">${Number(value).toFixed(1)}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}
      ${result.weaknesses?.length ? `
        <ul class="list-dots" style="margin-top:10px;">
          ${result.weaknesses.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `;
}


function ieltsScreenHtml() {
  const activeModule = state.exam.activeModule;
  const moduleTabs = [
    { id: "reading", label: "Reading" },
    { id: "listening", label: "Listening" },
    { id: "writing", label: "Writing" },
    { id: "speaking", label: "Speaking" },
  ];
  const certificate = state.profile?.latest_certificate;
  const antiCheatActive = state.exam.session?.mode === "certified" && state.exam.session?.status === "active";

  let modulePane = "";
  if (activeModule === "reading") {
    modulePane = `
      <div class="module-card">
        <div class="module-card__title">Academic Reading band table</div>
        <div class="module-note">Rasmiy jadval: masalan 30/40 = 7.0 band.</div>
        <div class="field-grid" style="margin-top:12px;">
          <div class="field">
            <label>To'g'ri javoblar soni</label>
            <input data-bind="exam.readingRaw" type="number" min="0" max="40" value="${escapeHtml(state.exam.form.readingRaw)}" />
          </div>
          <div class="field">
            <label>Variant</label>
            <select data-bind="exam.readingVariant">
              <option value="academic" ${state.exam.form.readingVariant === "academic" ? "selected" : ""}>Academic</option>
              <option value="general" ${state.exam.form.readingVariant === "general" ? "selected" : ""}>General</option>
            </select>
          </div>
          <button class="primary-button" type="button" data-action="submit-module">Bandni hisoblash</button>
        </div>
      </div>
    `;
  } else if (activeModule === "listening") {
    modulePane = `
      <div class="module-card">
        <div class="module-card__title">Listening band table</div>
        <div class="module-note">40 ta savoldan nechta to'g'ri topdingiz, shuni kiriting.</div>
        <div class="field-grid" style="margin-top:12px;">
          <div class="field">
            <label>To'g'ri javoblar soni</label>
            <input data-bind="exam.listeningRaw" type="number" min="0" max="40" value="${escapeHtml(state.exam.form.listeningRaw)}" />
          </div>
          <button class="primary-button" type="button" data-action="submit-module">Bandni hisoblash</button>
        </div>
      </div>
    `;
  } else if (activeModule === "writing") {
    modulePane = `
      <div class="module-card">
        <div class="module-card__title">Strict Writing Examiner</div>
        <div class="module-note">GPT-4o yumshoq bermaydi. Zaif joyni ochiq aytadi.</div>
        <div class="field-grid" style="margin-top:12px;">
          <div class="field">
            <label>Task</label>
            <textarea data-bind="exam.writingPrompt">${escapeHtml(state.exam.form.writingPrompt)}</textarea>
          </div>
          <div class="field">
            <label>Javobingiz</label>
            <textarea data-bind="exam.writingAnswer">${escapeHtml(state.exam.form.writingAnswer)}</textarea>
          </div>
          <button class="primary-button" type="button" data-action="submit-module">Qattiq tekshiruv</button>
        </div>
      </div>
    `;
  } else {
    modulePane = `
      <div class="module-card">
        <div class="module-card__title">Speaking + Vosk</div>
        <div class="module-note">Mikrofon bilan yozib yuborsangiz, transcript Vosk orqali olinadi.</div>
        <div class="field-grid" style="margin-top:12px;">
          <div class="field">
