  if (!bot) return;
  try {
    const data = await requestJson("admin/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.userId,
        id: bot.id,
        display_name: bot.display_name,
        district: bot.district,
        region: bot.region,
        country: bot.country,
        is_verified: Boolean(bot.is_verified),
        base_score: Number(bot.base_score) || 0,
        growth_rate: Number(bot.growth_rate) || 0,
        activity_days: Number(bot.activity_days) || 30,
      }),
    });
    state.admin.data.bots[index] = data.bot;
    showToast("Bot saqlandi.");
    await loadLeaderboard();
    render();
  } catch (error) {
    showToast(error.message || "Bot saqlanmadi.");
  }
}


function modulesDoneCount() {
  return Object.keys(sessionModules()).length;
}


function verificationModalHtml() {
  if (!state.verificationModal) return "";
  return `
    <div class="modal-backdrop" data-action="close-verification">
      <div class="modal" data-stop-click="true">
        <div class="modal-head">
          <div class="modal-title">${escapeHtml(state.verificationModal.name)}</div>
          <button class="modal-close" type="button" data-action="close-verification">x</button>
        </div>
        <div class="strategy-summary">
          <div class="card-copy">${escapeHtml(state.verificationModal.message)}</div>
        </div>
      </div>
    </div>
  `;
}


function achievementModalHtml() {
  if (!state.achievementModal) return "";
  const item = state.achievementModal;
  return `
    <div class="modal-backdrop" data-action="close-achievement">
      <div class="modal achievement-modal" data-stop-click="true">
        <div class="modal-head">
          <div>
            <div class="eyebrow">Fynex Yutuq</div>
            <div class="modal-title">${escapeHtml(item.title)}</div>
          </div>
          <button class="modal-close" type="button" data-action="close-achievement">×</button>
        </div>
        <div class="achievement-pop">
          <div class="achievement-pop__icon">${escapeHtml(item.icon)}</div>
          <div class="card-copy">${escapeHtml(item.description)}</div>
          <div class="helper-copy" style="margin-top:10px;">${item.unlocked ? "Bu yutuq sizning profilingizda faol." : "Hali qulflangan. Kerakli mezonni bajarganingizda ochiladi."}</div>
        </div>
      </div>
    </div>
  `;
}


function adminModalHtml() {
  if (!state.admin.open) return "";
  const settings = state.admin.data?.settings || {};
  const bots = state.admin.data?.bots || [];
  return `
    <div class="modal-backdrop" data-action="close-admin">
      <div class="modal" data-stop-click="true">
        <div class="modal-head">
          <div>
            <div class="modal-title">Hidden Admin</div>
            <div class="helper-copy">Obuna, narx va botlar shu yerdan boshqariladi.</div>
          </div>
          <button class="modal-close" type="button" data-action="close-admin">x</button>
        </div>
        ${state.admin.loading ? `
          <div class="field-grid" style="margin-top:12px;">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-panel"></div>
          </div>
        ` : `
          <div class="admin-section">
            <div class="screen-note">Platforma</div>
            <div class="inline-grid" style="margin-top:10px;">
              <input class="small-input" data-bind="admin.settings.monthly_price" type="number" value="${escapeHtml(settings.monthly_price ?? 19)}" placeholder="Oyiga" />
              <input class="small-input" data-bind="admin.settings.quarterly_price" type="number" value="${escapeHtml(settings.quarterly_price ?? 49)}" placeholder="Kvartal" />
              <input class="small-input" data-bind="admin.settings.yearly_price" type="number" value="${escapeHtml(settings.yearly_price ?? 159)}" placeholder="Yillik" />
              <input class="small-input" data-bind="admin.settings.bot_count" type="number" value="${escapeHtml(settings.bot_count ?? 8)}" placeholder="Bot count" />
              <input class="small-input" data-bind="admin.settings.bot_score_bias" type="number" value="${escapeHtml(settings.bot_score_bias ?? 0)}" placeholder="Bot bias" />
              <select class="small-input" data-bind="admin.settings.subscription_enabled">
                <option value="true" ${settings.subscription_enabled ? "selected" : ""}>Subscription ON</option>
                <option value="false" ${!settings.subscription_enabled ? "selected" : ""}>Subscription OFF</option>
              </select>
            </div>
            <div style="margin-top:10px;">
              <button class="secondary-button" type="button" data-action="save-admin-settings">Saqlash</button>
            </div>
          </div>
          <div class="admin-section">
            <div class="screen-note">Leaderboard bots</div>
            ${bots.slice(0, 8).map((bot, index) => `
              <div class="admin-bot">
                <input class="small-input" data-bind="admin.bot.${index}.display_name" value="${escapeHtml(bot.display_name)}" />
                <div class="inline-grid">
                  <input class="small-input" data-bind="admin.bot.${index}.base_score" type="number" value="${escapeHtml(bot.base_score)}" />
                  <input class="small-input" data-bind="admin.bot.${index}.growth_rate" type="number" step="0.01" value="${escapeHtml(bot.growth_rate)}" />
                </div>
                <div class="inline-grid">
                  <input class="small-input" data-bind="admin.bot.${index}.district" value="${escapeHtml(bot.district)}" />
                  <input class="small-input" data-bind="admin.bot.${index}.region" value="${escapeHtml(bot.region)}" />
                </div>
                <div class="inline-grid">
                  <input class="small-input" data-bind="admin.bot.${index}.country" value="${escapeHtml(bot.country)}" />
                  <select class="small-input" data-bind="admin.bot.${index}.is_verified">
                    <option value="true" ${bot.is_verified ? "selected" : ""}>Verified</option>
                    <option value="false" ${!bot.is_verified ? "selected" : ""}>Hidden tick</option>
                  </select>
                </div>
                <button class="ghost-button" type="button" data-action="save-admin-bot" data-bot-index="${index}">Botni saqlash</button>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `;
}


function toastHtml() {
  return `<div class="toast ${state.toastVisible ? "is-visible" : ""}">${escapeHtml(state.toast)}</div>`;
}


function homeScreenHtml() {
  const strategy = strategySummary();
  const coachNotes = [
    "Bir blokni oxirigacha olib boring, keyin mavzuni almashtiring.",
    "Bugungi eng muhim darsni ertaroq tugatish tempni ushlab turadi.",
    "Natija kuchli bo'lishi uchun reja qisqa va aniq bo'lishi kerak.",
  ];

  return `
    <div class="screen-body">
      <div class="hero-block">
        <div class="hero-title">Salom, ${escapeHtml(state.profile?.first_name || telegramUser()?.first_name || "Do'st")}</div>
        <div class="hero-subtitle">Kunlik reja va AI Coach tavsiyalari shu yerda.</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">${icon("streak")}</div>
          <div class="card-figure">${escapeHtml(state.profile?.streak_count || 0)}</div>
          <div class="screen-note">kun streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">${icon("clock")}</div>
          <div class="card-figure">${escapeHtml(state.profile?.focus_minutes || 0)}</div>
          <div class="screen-note">daqiqa</div>
        </div>
      </div>

      <div class="progress-card">
        <div class="bar-head">
          <span>Kunlik temp</span>
          <span class="mono">${escapeHtml(strategy?.success_rate || 0)}%</span>
        </div>
        ${waveBar(strategy?.success_rate || 16)}
        <div class="helper-copy" style="margin-top:8px;">
          ${strategy ? escapeHtml(strategy.summary) : "Maqsad va muddatni kiriting. AI Coach sizga real tempni hisoblaydi."}
        </div>
      </div>

      <div class="strategy-card">
        <div class="eyebrow">AI Coach</div>
        <div class="screen-title" style="font-size:19px;">Sizning ta'lim yo'lingiz</div>
        <div class="helper-copy" style="margin-top:6px;">${escapeHtml(coachNotes[(state.profile?.streak_count || 0) % coachNotes.length])}</div>
        <div class="field-grid" style="margin-top:12px;">
          <div class="field">
            <label>Maqsad</label>
            <input data-bind="strategy.goal_text" value="${escapeHtml(state.strategyDraft.goal_text)}" placeholder="Masalan: IELTS 7.0 yoki 15-iyungacha 6.5" />
          </div>
          <div class="inline-grid">
            <div class="field">
              <label>Muddat</label>
              <input data-bind="strategy.timeframe_text" value="${escapeHtml(state.strategyDraft.timeframe_text)}" placeholder="3 oy / 2 hafta / 15-iyun" />
            </div>
            <div class="field">
              <label>Kunlik minut</label>
              <input data-bind="strategy.daily_minutes" type="number" value="${escapeHtml(state.strategyDraft.daily_minutes)}" />
            </div>
          </div>
          <div class="inline-grid">
            <div class="field">
              <label>Hozirgi band</label>
              <input data-bind="strategy.current_band" type="number" step="0.5" value="${escapeHtml(state.strategyDraft.current_band)}" />
            </div>
            <div class="field">
              <label>Maqsad band</label>
              <input data-bind="strategy.target_band" type="number" step="0.5" value="${escapeHtml(state.strategyDraft.target_band)}" />
            </div>
          </div>
          <div class="inline-grid">
            <div class="field">
              <label>Tuman</label>
              <input data-bind="strategy.district" value="${escapeHtml(state.strategyDraft.district)}" />
            </div>
