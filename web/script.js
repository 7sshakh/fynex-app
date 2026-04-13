const tg = window.Telegram?.WebApp ?? null;
const TELEGRAM_READY_TIMEOUT_MS = 1400;

async function waitForTelegram() {
  if (!tg) return null;
  tg.ready();
  tg.expand();

  return new Promise((resolve) => {
    const startedAt = Date.now();

    const poll = () => {
      const hasUser = Boolean(tg.initDataUnsafe?.user?.id);
      const hasInitData = typeof tg.initData === "string" && tg.initData.length > 0;
      if (hasUser || hasInitData || Date.now() - startedAt >= TELEGRAM_READY_TIMEOUT_MS) {
        resolve(tg);
        return;
      }
      window.setTimeout(poll, 60);
    };

    poll();
  });
}

window.__fynexTg = tg;
window.__fynexStandalone =
  window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
window.__fynexTelegramReadyPromise = waitForTelegram();

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
  try {
    await navigator.serviceWorker.register("/sw.js");
  } catch (error) {
    console.warn("Fynex service worker registration skipped", error);
  }
}

async function boot() {
  await window.__fynexTelegramReadyPromise;
  await registerServiceWorker();
  await import(`/assets/app.js?v=20260411v2`);
}

boot().catch((error) => {
  console.error("Fynex frontend failed to boot", error);
});
