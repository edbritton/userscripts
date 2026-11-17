// ==UserScript==
// @name        Video fill toggle
// @description Auto-fill fullscreen videos (like iPhone pinch). Press 'z' or click floating button to toggle fill/contain.
// @match       *://*/*
// @version     1.6.3
// ==/UserScript==

const CONFIG = {
  autoCover: true,
  hotkey: "z",
  showButton: true
};

const CSS =
  'video[data-video-fill="cover"] { object-fit: cover !important; }' +
  'video[data-video-fill="contain"] { object-fit: contain !important; }' +
  'video[data-video-fill] { object-position: center !important; }' +
  '#video-fill-toggle-btn { position: fixed; z-index: 2147483647; display: none; width: auto; min-width: 34px; height: 34px; padding: 0 12px; gap: 6px; white-space: nowrap; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 999px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 38%), rgba(22, 22, 26, 0.55); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 1px 4px rgba(0, 0, 0, 0.35); color: #fff; cursor: pointer; align-items: center; justify-content: center; opacity: 1; right: 18px; bottom: 13px; transition: opacity 200ms ease, background 120ms ease; }' +
  '#video-fill-toggle-btn::before { content: ""; display: block; width: 18px; height: 18px; margin: auto; background: currentColor; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; -webkit-mask-size: contain; }' +
  '#video-fill-toggle-btn .vft-label { font: 500 12px/1 -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; color: rgba(255, 255, 255, 0.9); -webkit-user-select: none; user-select: none; pointer-events: none; white-space: nowrap; letter-spacing: 0.2px; }' +
  '#video-fill-toggle-btn:hover { background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 38%), rgba(22, 22, 26, 0.68); }' +
  '#video-fill-toggle-btn:active { background: linear-gradient(180deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0) 38%), rgba(20, 20, 24, 0.75); }' +
  '#video-fill-toggle-btn[data-idle="true"] { opacity: 0; pointer-events: none; }' +
  '#video-fill-toggle-btn[data-matched="true"]::before { display: none; }' +
  '#video-fill-toggle-btn[data-state="expand"]::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2019.2105%2025.7512%22%3E%3Crect%20height%3D%2225.7512%22%20opacity%3D%220%22%20width%3D%2219.2105%22%20x%3D%220%22%20y%3D%220%22%2F%3E%3Cpath%20d%3D%22M3.20351%2019.4325L15.6457%2019.4325C17.7615%2019.4325%2018.8492%2018.3465%2018.8492%2016.261L18.8492%209.49203C18.8492%207.40649%2017.7615%206.32055%2015.6457%206.32055L3.20351%206.32055C1.08769%206.32055%200%207.39848%200%209.49203L0%2016.261C0%2018.3545%201.08769%2019.4325%203.20351%2019.4325ZM3.31444%2017.5192C2.40643%2017.5192%201.91327%2017.0428%201.91327%2016.102L1.91327%209.65101C1.91327%208.70218%202.40643%208.23382%203.31444%208.23382L15.5348%208.23382C16.4348%208.23382%2016.9359%208.70218%2016.9359%209.65101L16.9359%2016.102C16.9359%2017.0428%2016.4348%2017.5192%2015.5348%2017.5192Z%22%2F%3E%3Cpath%20d%3D%22M7.22577%204.90747L11.6252%204.90747C12.2025%204.90747%2012.473%204.42075%2012.1635%203.91431L10.0117%200.387751C9.72519-0.0938878%209.12578-0.103653%208.83749%200.387751L6.69375%203.9063C6.38769%204.41099%206.63867%204.90747%207.22577%204.90747ZM7.22577%2020.8666C6.63867%2020.8666%206.38769%2021.3551%206.69375%2021.858L8.83749%2025.3863C9.12578%2025.8778%209.72519%2025.868%2010.0117%2025.3863L12.1635%2021.858C12.473%2021.3533%2012.2025%2020.8666%2011.6252%2020.8666Z%22%2F%3E%3C%2Fsvg%3E"); }' +
  '#video-fill-toggle-btn[data-state="shrink"]::before { -webkit-mask-image: url("data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2019.2105%2025.4293%22%3E%3Crect%20height%3D%2225.4293%22%20opacity%3D%220%22%20width%3D%2219.2105%22%20x%3D%220%22%20y%3D%220%22%2F%3E%3Cpath%20d%3D%22M3.20351%2019.2715L15.6457%2019.2715C17.7615%2019.2715%2018.8492%2018.1855%2018.8492%2016.1L18.8492%209.33104C18.8492%207.24549%2017.7615%206.15956%2015.6457%206.15956L3.20351%206.15956C1.08769%206.15956%200%207.23749%200%209.33104L0%2016.1C0%2018.1935%201.08769%2019.2715%203.20351%2019.2715ZM3.31444%2017.3582C2.40643%2017.3582%201.91327%2016.8818%201.91327%2015.941L1.91327%209.49002C1.91327%208.54119%202.40643%208.07283%203.31444%208.07283L15.5348%208.07283C16.4348%208.07283%2016.9359%208.54119%2016.9359%209.49002L16.9359%2015.941C16.9359%2016.8818%2016.4348%2017.3582%2015.5348%2017.3582Z%22%2F%3E%3Cpath%20d%3D%22M7.22577%200.0228506C6.63867%200.0228506%206.38769%200.519332%206.69375%201.02402L8.83749%204.55058C9.12578%205.03397%209.72343%205.02421%2010.0117%204.55058L12.1635%201.01601C12.473%200.509567%2012.2025%200.0228506%2011.6252%200.0228506ZM7.22577%2025.4293L11.6252%2025.4293C12.2025%2025.4293%2012.473%2024.9345%2012.1635%2024.4281L10.0117%2020.8998C9.72519%2020.4279%209.12578%2020.4101%208.83749%2020.8998L6.69375%2024.4281C6.38769%2024.9328%206.63867%2025.4293%207.22577%2025.4293Z%22%2F%3E%3C%2Fsvg%3E"); }';

function getFullscreenVideo() {
  const root = document.fullscreenElement || document.webkitFullscreenElement;
  if (root) return root.localName === "video" ? root : root.querySelector("video");
  for (const v of document.querySelectorAll("video")) {
    if (v.webkitDisplayingFullscreen || v.webkitPresentationMode === "fullscreen") return v;
  }
  return null;
}

function toggleFill(video) {
  if (!video) return;
  video.dataset.videoFill = video.dataset.videoFill === "cover" ? "contain" : "cover";
  syncButtonIcon(video);
}

let fillButton = null,
    fillLabel = null;
const naturalDims = new WeakMap();

const ASPECT_NAMED = [
  { label: "iPhone Duo", ratio: 1.4, numerals: "1.4:1" },
  { label: "iPhone Duo", ratio: 1.41, numerals: "1.41:1" },
  { label: "IMAX", ratio: 1.43, numerals: "1.43:1" },
  { label: "Flat", ratio: 1.85, numerals: "1.85:1" },
  { label: "CinemaScope", ratio: 2.35, numerals: "2.35:1" },
  { label: "CinemaScope", ratio: 2.39, numerals: "2.39:1" },
  { label: "UltraWide", ratio: 2.37, numerals: "2.37:1" },
  { label: "Ultra Panavision", ratio: 2.76, numerals: "2.76:1" }
];

const ASPECT_COMMON = [
  { label: "1:1", numerals: "1:1", ratio: 1 },
  { label: "9:16", numerals: "9:16", ratio: 9 / 16 },
  { label: "3:4", numerals: "3:4", ratio: 3 / 4 },
  { label: "2:3", numerals: "2:3", ratio: 2 / 3 },
  { label: "5:4", numerals: "5:4", ratio: 5 / 4 },
  { label: "4:3", numerals: "4:3", ratio: 4 / 3 },
  { label: "3:2", numerals: "3:2", ratio: 3 / 2 },
  { label: "16:10", numerals: "16:10", ratio: 16 / 10 },
  { label: "16:9", numerals: "16:9", ratio: 16 / 9 },
  { label: "21:9", numerals: "21:9", ratio: 21 / 9 },
  { label: "2:1", numerals: "2:1", ratio: 2 }
];

const ASPECT_LABEL_TOLERANCE = 0.005;

function getScreenAspect() {
  return window.screen.width && window.screen.height
    ? window.screen.width / window.screen.height
    : window.innerWidth / window.innerHeight;
}

function getVideoDims(video) {
  if (!video) return null;
  const width = video.videoWidth,
        height = video.videoHeight,
        cached = naturalDims.get(video),
        liveAspect = width && height ? width / height : 0,
        screenAspect = getScreenAspect(),
        looksRendered =
    liveAspect && Math.abs(liveAspect - screenAspect) / screenAspect < 0.001;
  if (!looksRendered && width && height) return { w: width, h: height };
  if (cached && cached.w && cached.h) return cached;
  if (width && height) return { w: width, h: height };
  return null;
}

function describeAspect(width, height) {
  if (!width || !height) return null;
  const ratio = width / height;
  let best = null,
      bestDelta = Infinity;
  for (const entry of ASPECT_NAMED) {
    const delta = Math.abs(ratio - entry.ratio) / entry.ratio;
    if (delta <= ASPECT_LABEL_TOLERANCE && delta < bestDelta) {
      best = entry;
      bestDelta = delta;
    }
  }
  if (!best) {
    for (const entry of ASPECT_COMMON) {
      const delta = Math.abs(ratio - entry.ratio) / entry.ratio;
      if (delta <= ASPECT_LABEL_TOLERANCE && delta < bestDelta) {
        best = entry;
        bestDelta = delta;
      }
    }
  }
  if (best) return { label: best.label, numerals: best.numerals };
  const numerals = ratio.toFixed(2) + ":1";
  return { label: numerals, numerals: numerals };
}

function syncButtonIcon(video) {
  if (!fillButton) return;
  const cover = !!video && video.dataset.videoFill === "cover";
  fillButton.dataset.state = cover ? "shrink" : "expand";
  const dims = getVideoDims(video),
        aspect = dims ? describeAspect(dims.w, dims.h) : null;
  if (fillLabel) fillLabel.textContent = aspect ? aspect.label : "";
  const action = cover ? "Contain" : "Fill screen";
  fillButton.title =
    aspect && aspect.numerals !== aspect.label
      ? action + " (z) · " + aspect.numerals
      : action + " (z)";
  fillButton.setAttribute("aria-label", cover ? "Contain" : "Fill screen");
}

function boot() {
  if (window.__videoFillBooted) return;
  window.__videoFillBooted = true;
  document.documentElement.dataset.videoFillBooted = "1";
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  let button = null;
  if (CONFIG.showButton) {
    button = document.createElement("button");
    button.id = "video-fill-toggle-btn";
    fillButton = button;
    const label = document.createElement("span");
    label.className = "vft-label";
    button.appendChild(label);
    fillLabel = label;
    syncButtonIcon(null);
    Object.assign(button.style, {
      position: "fixed",
      zIndex: "2147483647",
      display: "none"
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFill(getFullscreenVideo());
    });
    document.body.appendChild(button);
  }

  const BAR_CLEARANCE = 13,
        CORNER_GAP = 18,
        IDLE_MS = 2500,
        ASPECT_TOLERANCE = 0.005;
  let lastPointer = Date.now();

  function matchesScreenAspect(video) {
    const dims = getVideoDims(video);
    if (!dims) return false;
    return Math.abs(dims.w / dims.h - getScreenAspect()) / getScreenAspect() < ASPECT_TOLERANCE;
  }

  window.addEventListener(
    "pointermove",
    () => { lastPointer = Date.now(); },
    true
  );

  let wasFullscreen = false,
      lastRight = CORNER_GAP,
      lastBottom = BAR_CLEARANCE;

  function frame() {
    let anyFullscreen = false,
        video = null,
        bestArea = 0;
    for (const v of document.querySelectorAll("video")) {
      const fullscreen =
        v.webkitDisplayingFullscreen ||
        v.webkitPresentationMode === "fullscreen" ||
        (document.fullscreenElement && document.fullscreenElement.contains(v));
      if (fullscreen && v.videoWidth && v.videoHeight) {
        anyFullscreen = true;
        if (!v.dataset.videoFill) v.dataset.videoFill = CONFIG.autoCover ? "cover" : "contain";
        const box = v.getBoundingClientRect(),
              area = box.width > 0 && box.height > 0 ? box.width * box.height : 0;
        if (!video) video = v;
        if (area > bestArea) {
          bestArea = area;
          video = v;
        }
      } else if (v.videoWidth && v.videoHeight) {
        naturalDims.set(v, { w: v.videoWidth, h: v.videoHeight });
      }
    }
    const matched = matchesScreenAspect(video);
    if (anyFullscreen !== wasFullscreen) {
      wasFullscreen = anyFullscreen;
      if (anyFullscreen) syncButtonIcon(video);
      else syncButtonIcon(null);
      if (!anyFullscreen) {
        for (const v of document.querySelectorAll("video[data-video-fill]")) {
          delete v.dataset.videoFill;
        }
      }
    }
    if (button) {
      button.dataset.matched = matched ? "true" : "false";
      button.style.display = anyFullscreen ? "flex" : "none";
    }
    if (anyFullscreen && button) {
      if (video) {
        const rect = video.getBoundingClientRect(),
              right = Math.max(0, window.innerWidth - rect.right) + CORNER_GAP,
              bottom = Math.max(0, window.innerHeight - rect.bottom) + BAR_CLEARANCE;
        if (right !== lastRight || bottom !== lastBottom) {
          lastRight = right;
          lastBottom = bottom;
          button.style.right = right + "px";
          button.style.bottom = bottom + "px";
        }
      }
      button.dataset.idle = Date.now() - lastPointer > IDLE_MS ? "true" : "false";
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== CONFIG.hotkey || event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      const target = event.target;
      if (target && (target.isContentEditable || target.closest("input, textarea, select"))) return;
      const video = getFullscreenVideo();
      if (!video) return;
      event.preventDefault();
      toggleFill(video);
    },
    true
  );

  requestAnimationFrame(frame);
}

if (document.body) boot();
else document.addEventListener("DOMContentLoaded", boot);
