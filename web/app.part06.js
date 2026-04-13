        `}
      </div>
    </div>
  `;
}


function renderScreen() {
  if (state.loading) {
    return loadingShellHtml();
  }
  if (state.bootError) {
    return `
      <div class="screen-body">
        <div class="screen-title">Fynex</div>
        <div class="result-card">
          <div class="result-title">App ochilmadi</div>
          <div class="card-copy">${escapeHtml(state.bootError)}</div>
          <button class="primary-button" type="button" data-action="retry-bootstrap" style="margin-top:12px;">Qayta urinish</button>
        </div>
      </div>
    `;
  }
  if (state.screen === "home") return homeScreenHtml();
  if (state.screen === "courses") return coursesScreenHtml();
  if (state.screen === "ielts") return ieltsScreenHtml();
  if (state.screen === "streak") return streakScreenHtml();
  if (state.screen === "leaderboard") return leaderboardScreenHtml();
  return moreScreenHtml();
}


function render() {
  setTheme(state.theme);
  const navItems = [
    { id: "home", icon: icon("home"), label: "Home" },
    { id: "courses", icon: icon("courses"), label: "Kurslar" },
    { id: "streak", icon: icon("streak"), label: "Streak" },
    { id: "leaderboard", icon: icon("ranking"), label: "Leaderboard" },
    { id: "more", icon: icon("more"), label: "Boshqa" },
  ];
  root.innerHTML = `
    <div class="scene">
      <div class="phone-wrap">
        <div class="device">
          <div class="statusbar">
            <span class="statusbar-time">${currentClock()}</span>
            <div class="status-pill">
              <span class="status-dot"></span>
              <span>FYNEX</span>
            </div>
            <span class="status-end">${icon("courses")}</span>
          </div>
          <div class="device-top">
            <button class="theme-toggle" type="button" data-action="toggle-theme">
              <span class="theme-toggle__icon">${state.theme === "light" ? icon("moon") : icon("sun")}</span>
              <span>${state.theme === "light" ? "Tun rejimi" : "Kun rejimi"}</span>
            </button>
          </div>
          <div class="screen-shell">
            ${renderScreen()}
          </div>
          <div class="bottom-nav">
            ${navItems.map((item) => `
              <button class="nav-item ${state.screen === item.id ? "is-active" : ""}" type="button" data-action="go-screen" data-screen="${item.id}">
                <span class="nav-item__icon">${item.icon}</span>
                <span>${item.label}</span>
                ${state.screen === item.id ? `<span class="nav-dot"></span>` : ""}
              </button>
            `).join("")}
          </div>
        </div>
      </div>
      ${verificationModalHtml()}
      ${achievementModalHtml()}
      ${adminModalHtml()}
      ${toastHtml()}
    </div>
  `;
}


function tickClock() {
  state.now = Date.now();
  const timeNode = document.querySelector(".statusbar-time");
  if (timeNode) timeNode.textContent = currentClock();
  const countdownNode = document.querySelector(".countdown");
  if (countdownNode) countdownNode.textContent = sessionCountdown();
}


function updateByBinding(path, value) {
  if (path.startsWith("strategy.")) {
    const key = path.replace("strategy.", "");
    state.strategyDraft[key] = value;
    return;
  }
  if (path.startsWith("exam.")) {
    const key = path.replace("exam.", "");
    state.exam.form[key] = value;
    return;
  }
  if (path.startsWith("admin.settings.") && state.admin.data) {
    const key = path.replace("admin.settings.", "");
    state.admin.data.settings[key] = value === "true" ? true : value === "false" ? false : value;
    return;
  }
  if (path.startsWith("admin.bot.") && state.admin.data) {
    const parts = path.split(".");
    const index = Number(parts[2]);
    const key = parts[3];
    if (state.admin.data.bots[index]) {
      state.admin.data.bots[index][key] = value === "true" ? true : value === "false" ? false : value;
    }
  }
}


async function startSpeakingRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextCtor) {
      showToast("Brauzer audio context bermadi.");
      return;
    }
    const audioContext = new AudioContextCtor();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    const monitorGain = audioContext.createGain();
    monitorGain.gain.value = 0;
    state.exam.speaking.chunks = [];
    processor.onaudioprocess = (event) => {
      state.exam.speaking.chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    };
    sourceNode.connect(processor);
    processor.connect(monitorGain);
    monitorGain.connect(audioContext.destination);

    state.exam.speaking.mediaStream = stream;
    state.exam.speaking.audioContext = audioContext;
    state.exam.speaking.sourceNode = sourceNode;
    state.exam.speaking.processor = processor;
    state.exam.speaking.monitorGain = monitorGain;
    state.exam.speaking.sampleRate = audioContext.sampleRate;
    state.exam.speaking.recording = true;
    state.exam.speaking.audioBase64 = "";
    render();
    showToast("Mikrofon tinglayapti.");
  } catch (error) {
    showToast(error.message || "Mikrofon ochilmadi.");
  }
}


function stopAudioNodes() {
  const speaking = state.exam.speaking;
  speaking.processor?.disconnect();
  if (speaking.processor) speaking.processor.onaudioprocess = null;
  speaking.monitorGain?.disconnect();
  speaking.sourceNode?.disconnect();
  speaking.mediaStream?.getTracks?.().forEach((track) => track.stop());
  speaking.audioContext?.close?.();
}


function mergeAudioChunks(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });
  return merged;
}


function downsampleBuffer(buffer, inputRate, outputRate) {
  if (outputRate >= inputRate) return buffer;
  const ratio = inputRate / outputRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffset = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let index = offsetBuffer; index < nextOffset && index < buffer.length; index += 1) {
      accum += buffer[index];
      count += 1;
    }
    result[offsetResult] = count ? accum / count : 0;
    offsetResult += 1;
    offsetBuffer = nextOffset;
  }
  return result;
}


function encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset, value) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
