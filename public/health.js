// health.js
// Drop into /public/js/health.js
// Default API (change if your route differs)
const API_URL = "/api/health";

const overallBadge = document.getElementById("overallBadge");
const dbStatusEl = document.getElementById("dbStatus");
const timestampEl = document.getElementById("timestamp");
const payloadEl = document.getElementById("payload");
const historyList = document.getElementById("historyList");
const refreshBtn = document.getElementById("refreshBtn");
const autoToggle = document.getElementById("autoToggle");
const intervalSelect = document.getElementById("interval");
const apiUrlEl = document.getElementById("apiUrl");
const copyBtn = document.getElementById("copyBtn");
const errorMsg = document.getElementById("errorMsg");
const backBtn = document.getElementById("backBtn");

apiUrlEl.textContent = API_URL;

// Back button
backBtn.addEventListener("click", () => {
  window.location.href = "/";
});

let history = []; // keep last N checks
const HISTORY_LIMIT = 20;
let autoTimer = null;

function setBadge(status) {
  if (!status) {
    overallBadge.style.background = "gray";
    overallBadge.textContent = "—";
    return;
  }
  if (status === "ok" || status === "healthy" || status === "success") {
    overallBadge.style.background = getComputedStyle(document.documentElement).getPropertyValue('--ok');
    overallBadge.textContent = "OK";
  } else {
    overallBadge.style.background = getComputedStyle(document.documentElement).getPropertyValue('--err');
    overallBadge.textContent = "ERROR";
  }
}

// format timestamp for UI
function niceTime(ts) {
  try {
    const d = new Date(ts);
    if (isNaN(d)) return ts;
    return d.toLocaleString();
  } catch {
    return ts;
  }
}

async function fetchHealth() {
  try {
    errorMsg.hidden = true;
    const res = await fetch(API_URL, {cache: "no-store"});
    if (!res.ok) {
      // try to parse JSON error
      let body = null;
      try { body = await res.json(); } catch(e) { body = await res.text(); }
      addHistory({ ok: false, status: res.status, body });
      showError(`HTTP ${res.status} — ${JSON.stringify(body)}`);
      return;
    }

    const response = await res.json();
    // Extract the actual health data from the wrapped response
    const data = response.data || response;
    
    // UI binding
    setBadge(data.status || (data.status === undefined ? (data.ok ? "ok" : "error") : data.status));
    dbStatusEl.textContent = data.database ?? data.db ?? "unknown";
    timestampEl.textContent = niceTime(data.timestamp ?? new Date().toISOString());
    payloadEl.textContent = JSON.stringify(data, null, 2);
    copyBtn.disabled = false;

    addHistory({ ok: true, status: data.status, body: data, ts: new Date().toISOString() });

  } catch (err) {
    addHistory({ ok: false, status: "network", body: err.message, ts: new Date().toISOString() });
    showError("Network error: " + err.message);
  }
}

function showError(msg) {
  errorMsg.hidden = false;
  errorMsg.textContent = msg;
  setBadge("error");
  dbStatusEl.textContent = "disconnected";
  timestampEl.textContent = niceTime(new Date().toISOString());
  payloadEl.textContent = "{}";
  copyBtn.disabled = true;
}

function addHistory(item) {
  // item: {ok: boolean, status, body, ts}
  item.ts = item.ts || new Date().toISOString();
  history.unshift(item);
  if (history.length > HISTORY_LIMIT) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  for (const h of history) {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.innerHTML = `<strong>${h.ok ? "OK" : "ERR"}</strong> ${h.status ?? ""}`;
    const right = document.createElement("div");
    right.className = "meta-time";
    right.textContent = niceTime(h.ts);
    li.appendChild(left);
    li.appendChild(right);
    historyList.appendChild(li);
  }
}

refreshBtn.addEventListener("click", fetchHealth);
copyBtn.addEventListener("click", () => {
  const text = payloadEl.textContent || "{}";
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy JSON", 1200);
  });
});

autoToggle.addEventListener("change", () => {
  if (autoToggle.checked) startAuto();
  else stopAuto();
});

intervalSelect.addEventListener("change", () => {
  if (autoToggle.checked) {
    stopAuto();
    startAuto();
  }
});

function startAuto() {
  const ms = parseInt(intervalSelect.value, 10) || 10000;
  autoTimer = setInterval(fetchHealth, ms);
  refreshBtn.disabled = true;
  refreshBtn.textContent = "Auto...";
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  refreshBtn.disabled = false;
  refreshBtn.textContent = "Refresh";
}

// initial fetch
fetchHealth();
