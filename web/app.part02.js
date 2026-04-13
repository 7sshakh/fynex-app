async function loadLeaderboard() {
  if (!state.userId) return;
  const data = await requestJson(`leaderboard?user_id=${state.userId}&scope=${state.leaderboardScope}`);
  state.leaderboard = data.leaderboard || [];
  if (state.profile) {
    state.profile.leaderboard = {
      scope: data.scope,
      my_rank: data.my_rank,
      my_score: data.my_score,
    };
  }
}


async function reloadData() {
  state.loading = true;
  render();
  try {
    await loadProgress();
    await loadLeaderboard();
    state.bootError = "";
  } catch (error) {
    state.bootError = error.message || "Yuklashda xato yuz berdi.";
  } finally {
    state.loading = false;
    render();
  }
}


async function analyzeStrategy() {
  if (!state.userId) return;
  if (!state.strategyDraft.goal_text.trim() || !state.strategyDraft.timeframe_text.trim()) {
    showToast("Maqsad va muddatni kiriting.");
    return;
  }
  try {
    const data = await requestJson("strategy/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.userId,
        goal_text: state.strategyDraft.goal_text,
        timeframe_text: state.strategyDraft.timeframe_text,
        daily_minutes: Number(state.strategyDraft.daily_minutes) || 90,
        current_band: Number(state.strategyDraft.current_band) || 5,
        target_band: Number(state.strategyDraft.target_band) || 7,
        district: state.strategyDraft.district,
        region: state.strategyDraft.region,
        country: state.strategyDraft.country,
      }),
    });
    state.profile.strategy = data.strategy;
    state.profile.user_goal = data.strategy.goal_text;
    state.profile.daily_study_minutes = data.strategy.daily_minutes;
    state.profile.current_band = data.strategy.current_band;
    state.profile.target_band = data.strategy.target_band;
    state.profile.district = state.strategyDraft.district;
    state.profile.region = state.strategyDraft.region;
    state.profile.country = state.strategyDraft.country;
    await loadLeaderboard();
    render();
    showToast("Reja yangilandi.");
  } catch (error) {
    showToast(error.message || "Strategiya hisoblanmadi.");
  }
}


async function ensureExamSession() {
  if (state.exam.session?.status === "active" && state.exam.session?.mode === state.exam.mode) {
    return state.exam.session;
  }
  const data = await requestJson("exams/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: state.userId, mode: state.exam.mode }),
  });
  state.exam.session = data.session;
  render();
  return state.exam.session;
}


async function syncExamSession() {
  if (!state.exam.session?.session_id) return;
  try {
    const data = await requestJson(`exams/${state.exam.session.session_id}`);
    state.exam.session = data.session;
    if (state.exam.session.status === "reset") {
      showToast("Imtihon qayta boshlandi.");
    }
    render();
  } catch {
    // ignore silent sync failure
  }
}


async function submitModule() {
  try {
    const session = await ensureExamSession();
    const moduleType = state.exam.activeModule;
    const payload = {
      user_id: state.userId,
      module_type: moduleType,
      reading_variant: state.exam.form.readingVariant,
      prompt_text: "",
      answer_text: null,
      transcript: null,
      audio_base64: null,
      raw_score: null,
    };

    if (moduleType === "reading") {
      payload.raw_score = Number(state.exam.form.readingRaw) || 0;
    } else if (moduleType === "listening") {
      payload.raw_score = Number(state.exam.form.listeningRaw) || 0;
    } else if (moduleType === "writing") {
      payload.prompt_text = state.exam.form.writingPrompt;
      payload.answer_text = state.exam.form.writingAnswer;
    } else {
      payload.prompt_text = state.exam.form.speakingPrompt;
      payload.transcript = state.exam.form.speakingTranscript;
      payload.audio_base64 = state.exam.speaking.audioBase64 || null;
    }

    const data = await requestJson(`exams/${session.session_id}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    state.exam.session = {
      ...session,
      status: data.status,
      modules: data.modules,
      total_band: data.overall_band || 0,
    };
    if (data.certificate) {
      state.profile.latest_certificate = data.certificate;
      showToast("Sertifikat tayyor.");
    } else if (data.status === "submitted") {
      showToast("Sitting yakunlandi. 7.0 yetmadi.");
    } else {
      showToast(`${moduleType} saqlandi.`);
    }
    await loadProgress();
    await loadLeaderboard();
    render();
  } catch (error) {
    showToast(error.message || "Modul yuborilmadi.");
  }
}


async function postSecurityEvent(eventType, useBeacon = false) {
  const session = state.exam.session;
  if (!session?.session_id || session.mode !== "certified" || session.status !== "active") return;
  const url = `/api/exams/${session.session_id}/security`;
  const body = JSON.stringify({ user_id: state.userId, event_type: eventType });
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    return;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
    if (response.ok) {
      const data = await response.json();
      if (data.status === "reset") {
        state.exam.session.status = "reset";
        state.exam.session.reset_reason = data.reason;
        render();
        showToast("3 chiqish aniqlandi. Session reset.");
      }
    }
  } catch {
    // ignore background anti-cheat errors
  }
}


async function loadAdmin() {
  if (!state.profile?.is_admin || !state.userId) return;
  state.admin.loading = true;
  render();
  try {
    const data = await requestJson(`admin/overview?user_id=${state.userId}`);
    state.admin.data = data;
  } catch (error) {
    showToast(error.message || "Admin panel ochilmadi.");
  } finally {
    state.admin.loading = false;
    render();
  }
}


async function saveAdminSettings() {
  if (!state.admin.data?.settings) return;
  try {
    const data = await requestJson("admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: state.userId, settings: state.admin.data.settings }),
    });
    state.admin.data.settings = data.settings;
    render();
    showToast("Admin sozlamalari saqlandi.");
  } catch (error) {
    showToast(error.message || "Admin sozlamasi saqlanmadi.");
  }
}


async function saveAdminBot(index) {
  const bot = state.admin.data?.bots?.[index];
