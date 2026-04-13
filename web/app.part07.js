  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }
  return new Uint8Array(buffer);
}


function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const slice = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}


function buildRecordedAudio() {
  const speaking = state.exam.speaking;
  if (!speaking.chunks.length) return "";
  const merged = mergeAudioChunks(speaking.chunks);
  const normalized = downsampleBuffer(merged, speaking.sampleRate, 16000);
  const wavBytes = encodeWav(normalized, 16000);
  return bytesToBase64(wavBytes);
}


function stopSpeakingRecording() {
  stopAudioNodes();
  state.exam.speaking.audioBase64 = buildRecordedAudio();
  state.exam.speaking.recording = false;
  render();
  showToast(state.exam.speaking.audioBase64 ? "Audio tayyor." : "Audio yozilmadi.");
}


function bindGlobalEvents() {
  root.addEventListener("click", async (event) => {
    const stopper = event.target.closest("[data-stop-click]");
    if (stopper) {
      event.stopPropagation();
      return;
    }
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;
    const { action } = actionTarget.dataset;

    if (action === "toggle-theme") {
      toggleTheme();
      return;
    }
    if (action === "go-screen") {
      setScreen(actionTarget.dataset.screen);
      return;
    }
    if (action === "analyze-strategy") {
      await analyzeStrategy();
      return;
    }
    if (action === "set-course-tab") {
      state.courseTab = actionTarget.dataset.tab;
      render();
      return;
    }
    if (action === "set-scope") {
      state.leaderboardScope = actionTarget.dataset.scope;
      await loadLeaderboard();
      render();
      return;
    }
    if (action === "set-exam-mode") {
      state.exam.mode = actionTarget.dataset.mode;
      render();
      return;
    }
    if (action === "start-exam") {
      await ensureExamSession();
      showToast(state.exam.mode === "certified" ? "Yakuniy imtihon boshlandi." : "Mashq boshlandi.");
      return;
    }
    if (action === "set-module") {
      state.exam.activeModule = actionTarget.dataset.module;
      render();
      return;
    }
    if (action === "submit-module") {
      await submitModule();
      return;
    }
    if (action === "open-verification") {
      const item = state.leaderboard.find((entry) => entry.name === actionTarget.dataset.name);
      state.verificationModal = {
        name: item?.name || "Verified",
        message: item?.verification_message || "Ushbu foydalanuvchi 1 oy davomida faol va intizomli bo'lgani uchun tasdiqlangan.",
      };
      render();
      return;
    }
    if (action === "open-achievement") {
      const item = achievementsData().find((entry) => entry.id === actionTarget.dataset.achievement);
      if (item) {
        state.achievementModal = item;
        render();
      }
      return;
    }
    if (action === "close-achievement") {
      state.achievementModal = null;
      render();
      return;
    }
    if (action === "close-verification") {
      state.verificationModal = null;
      render();
      return;
    }
    if (action === "secret-admin") {
      if (!state.profile?.is_admin) {
        showToast("Bu eshik siz uchun yopiq.");
        return;
      }
      const now = Date.now();
      state.footerTapCount = now - state.footerTapAt < 1800 ? state.footerTapCount + 1 : 1;
      state.footerTapAt = now;
      if (state.footerTapCount >= 5) {
        state.admin.open = true;
        await loadAdmin();
      }
      return;
    }
    if (action === "close-admin") {
      state.admin.open = false;
      render();
      return;
    }
    if (action === "save-admin-settings") {
      await saveAdminSettings();
      return;
    }
    if (action === "save-admin-bot") {
      await saveAdminBot(Number(actionTarget.dataset.botIndex));
      return;
    }
    if (action === "retry-bootstrap") {
      await reloadData();
      return;
    }
    if (action === "start-recording") {
      await startSpeakingRecording();
      return;
    }
    if (action === "stop-recording") {
      stopSpeakingRecording();
    }
  });

  root.addEventListener("input", (event) => {
    const element = event.target;
    if (!element.dataset.bind) return;
    updateByBinding(element.dataset.bind, element.value);
  });

  root.addEventListener("change", (event) => {
    const element = event.target;
    if (!element.dataset.bind) return;
    updateByBinding(element.dataset.bind, element.value);
  });

  document.addEventListener("visibilitychange", async () => {
    if (document.hidden) {
      await postSecurityEvent("exit", true);
    } else {
      await postSecurityEvent("return");
      await syncExamSession();
    }
  });
}


async function boot() {
  await window.__fynexTelegramReadyPromise?.catch(() => null);
  tg?.ready?.();
  tg?.expand?.();
  state.userId = getUserId();
  setTheme(state.theme);
  bindGlobalEvents();
  render();

  if (!state.userId) {
    state.loading = false;
    state.bootError = "Ilovani yuklashda xato yuz berdi.";
    render();
    return;
  }

  const initialView = query().get("view");
  const restoredScreen = storedScreen();
  if (SCREENS.includes(initialView)) {
    setScreen(initialView, { shouldRender: false });
  } else if (["dashboard", "home"].includes(initialView)) {
    setScreen("home", { shouldRender: false });
  } else if (initialView === "results") {
    setScreen("leaderboard", { shouldRender: false });
  } else if (initialView === "settings") {
    setScreen("more", { shouldRender: false });
  } else if (restoredScreen) {
    setScreen(restoredScreen, { shouldRender: false });
  }
  await reloadData();
}


window.setInterval(tickClock, 1000);


boot();
