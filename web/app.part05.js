            <label>Speaking prompt</label>
            <textarea data-bind="exam.speakingPrompt">${escapeHtml(state.exam.form.speakingPrompt)}</textarea>
          </div>
          <div class="button-row">
            <button class="secondary-button" type="button" data-action="${state.exam.speaking.recording ? "stop-recording" : "start-recording"}">
              ${state.exam.speaking.recording ? "Yozishni tugatish" : "Mikrofonni boshlash"}
            </button>
          </div>
          <div class="field">
            <label>Transcript</label>
            <textarea data-bind="exam.speakingTranscript">${escapeHtml(state.exam.form.speakingTranscript)}</textarea>
          </div>
          <div class="helper-copy">${state.exam.speaking.audioBase64 ? "Audio tayyor. Istasangiz transcriptni ham qoldiring." : "Audio bo'lmasa, transcriptni qo'lda yozing."}</div>
          <button class="primary-button" type="button" data-action="submit-module">Speaking baholash</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="screen-body">
      <div class="session-head">
        <div>
          <div class="screen-title">IELTS Lab</div>
          <div class="screen-note">Hammasi bitta joyda va aniq tartibda.</div>
        </div>
        <div class="countdown">${sessionCountdown()}</div>
      </div>

      <div class="american-progress-card">
        <div class="bar-head">
          <span>Ingliz tili yo'li</span>
          <span class="mono">${Math.round(englishProgress())}%</span>
        </div>
        <div class="flag-progress">
          <div class="flag-progress__liquid" style="width:${englishProgress()}%;"></div>
          <div class="flag-progress__stars"></div>
          <div class="flag-progress__stripes"></div>
        </div>
      </div>

      <div class="progress-card">
        <div class="bar-head">
          <span>Imtihon jarayoni</span>
          <span class="mono">${modulesDoneCount()}/4</span>
        </div>
        ${waveBar(modulesDoneCount() * 25)}
        <div class="helper-copy" style="margin-top:8px;">
          ${antiCheatActive ? "Qattiq nazorat yoqilgan. 60 soniyada 3 marta chiqilsa test reset bo'ladi." : "Mashq rejimi erkinroq. Yakuniy rejim esa aniq nazorat bilan o'tadi."}
        </div>
      </div>

      <div class="chip-row">
        <button class="chip ${state.exam.mode === "practice" ? "is-active" : ""}" type="button" data-action="set-exam-mode" data-mode="practice">Mashq</button>
        <button class="chip ${state.exam.mode === "certified" ? "is-active" : ""}" type="button" data-action="set-exam-mode" data-mode="certified">Yakuniy</button>
      </div>

      <div class="button-row">
        <button class="primary-button" type="button" data-action="start-exam">${state.exam.session?.status === "active" ? "Imtihonni davom ettirish" : "Yangi imtihonni boshlash"}</button>
      </div>

      <div class="module-tabs">
        ${moduleTabs.map((module) => `
          <button class="module-tab ${activeModule === module.id ? "is-active" : ""}" type="button" data-action="set-module" data-module="${module.id}">
            <div>
              <div class="course-name">${module.label}</div>
              <div class="module-status">${sessionModules()[module.id] ? `${Number(sessionModules()[module.id].band_score || 0).toFixed(1)} band` : "hali topshirilmagan"}</div>
            </div>
            <div class="module-pill">${sessionModules()[module.id] ? "tayyor" : "ochiq"}</div>
          </button>
        `).join("")}
      </div>

      ${modulePane}
      ${moduleResultHtml(activeModule)}

      ${certificate ? `
        <div class="certificate-card">
          <div class="certificate-title">Certificate ready</div>
          <div class="certificate-score">${Number(certificate.overall_band || 0).toFixed(1)}</div>
          <div class="certificate-meta">Code: ${escapeHtml(certificate.certificate_code)}</div>
          <div class="card-copy" style="margin-top:8px;">Bir sitting ichida 4 modul ham 7.0+ bo'lgani uchun sertifikat berildi.</div>
        </div>
      ` : ""}
    </div>
  `;
}


function streakScreenHtml() {
  const days = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  const done = Array.from({ length: 7 }, (_, index) => index < Math.min(6, Number(state.profile?.streak_count || 0)));
  return `
    <div class="screen-body">
      <div class="streak-hero">
        <div class="screen-title">Faollik</div>
        <div class="hero-subtitle">Hech qachon to'xtama.</div>
        <div class="flame">🔥</div>
        <div class="streak-number">${escapeHtml(state.profile?.streak_count || 0)}</div>
        <div class="screen-note">kunlik streak</div>
      </div>

      <div class="weekly-grid">
        ${days.map((day, index) => `
          <div class="day-box">
            <div class="day-dot ${done[index] ? "is-done" : ""}">${done[index] ? "✓" : ""}</div>
            <div class="day-label">${day}</div>
          </div>
        `).join("")}
      </div>

      <div class="badges-grid">
        <div class="badge-card">
          <div class="badge-icon">7d</div>
          <div class="course-name">Birinchi hafta</div>
          <div class="screen-note">ketma-ket yo'l</div>
        </div>
        <div class="badge-card">
          <div class="badge-icon">Top</div>
          <div class="course-name">Top temp</div>
          <div class="screen-note">intizom ishlayapti</div>
        </div>
      </div>
    </div>
  `;
}

function leaderboardScreenHtml() {
  return `
    <div class="screen-body">
      <div class="screen-title">Leaderboard</div>
      <div class="leaderboard-card">
        <div class="bar-head">
          <span>Reyting</span>
          <span class="mono">${state.profile?.leaderboard?.my_rank ? `#${state.profile.leaderboard.my_rank}` : "--"}</span>
        </div>
        <div class="chip-row" style="margin-bottom:12px;">
          ${["district", "region", "country", "world"].map((scope) => `
            <button class="chip ${state.leaderboardScope === scope ? "is-active" : ""}" type="button" data-action="set-scope" data-scope="${scope}">
              ${scope === "district" ? "Tuman" : scope === "region" ? "Viloyat" : scope === "country" ? "Mamlakat" : "Dunyo"}
            </button>
          `).join("")}
        </div>
        <div class="leaderboard-list">
          ${state.leaderboard.map((item) => `
            <button class="leaderboard-item" type="button" data-action="open-verification" data-name="${escapeHtml(item.name)}">
              <div class="leaderboard-item__left">
                <div class="leaderboard-rank">#${item.rank}</div>
                <div class="leaderboard-main">
                  <div class="leaderboard-name">
                    ${escapeHtml(item.name)}
                    ${item.is_verified ? `<span class="verified-badge">✓</span>` : ""}
                  </div>
                  <div class="leaderboard-meta">${escapeHtml(item.district || item.region || item.country || "")}${item.is_bot ? " · bot" : ""}</div>
                </div>
              </div>
              <div class="leaderboard-score">${item.score}</div>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}


function moreScreenHtml() {
  const achievements = achievementsSummary();
  const certificate = state.profile?.latest_certificate;
  return `
    <div class="screen-body">
      <div class="screen-title">Boshqa</div>
      <div class="mirror-card">
        <div class="eyebrow">Profil</div>
        <div class="mirror-facts" style="margin-top:12px;">
          <div class="mirror-fact">
            <span class="mirror-fact__icon">👤</span>
            <span class="course-name">${escapeHtml(state.profile?.name || "Fynex User")}</span>
          </div>
          <div class="mirror-fact">
            <span class="mirror-fact__icon">📞</span>
            <span class="course-name">${escapeHtml(state.profile?.phone_number || "Telefon kiritilmagan")}</span>
          </div>
          <div class="mirror-fact">
            <span class="mirror-fact__icon">📚</span>
            <span class="course-name">${escapeHtml((state.profile?.courses || []).map((item) => `${item.title} ${item.level_label}`).join(", ") || "Kurs tanlanmagan")}</span>
          </div>
        </div>
      </div>

      <div class="leaderboard-card">
        <div class="bar-head">
          <span>Mening yutuqlarim</span>
          <span class="mono">${achievements.unlocked.length}/${achievements.unlocked.length + achievements.locked.length}</span>
        </div>
        <div class="badges-grid">
          ${achievements.unlocked.map((item) => `
            <button class="badge-card" type="button" data-action="open-achievement" data-achievement="${item.id}">
              <div class="badge-icon">${escapeHtml(item.icon)}</div>
              <div class="course-name">${escapeHtml(item.title)}</div>
              <div class="screen-note">Unlocked</div>
            </button>
          `).join("")}
          ${achievements.locked.map((item) => `
            <button class="badge-card badge-card--locked" type="button" data-action="open-achievement" data-achievement="${item.id}">
              <div class="badge-icon">🔒</div>
              <div class="course-name">${escapeHtml(item.title)}</div>
              <div class="screen-note">Locked</div>
            </button>
          `).join("")}
        </div>
      </div>

      <div class="certificate-card">
        <div class="certificate-title">Mening sertifikatlarim</div>
        ${certificate && Number(certificate.overall_band || 0) >= 7 ? `
          <div class="certificate-score">${Number(certificate.overall_band || 0).toFixed(1)}</div>
          <div class="certificate-meta">Code: ${escapeHtml(certificate.certificate_code)}</div>
          <div class="card-copy" style="margin-top:8px;">Sertifikat 7.0+ natija uchun ochilgan.</div>
        ` : `
          <div class="card-copy">Bu blok faqat 7.0+ natija olganlar uchun ochiladi.</div>
