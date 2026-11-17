// ==UserScript==
// @name        YouTube window mini player
// @description Hide top bar, and fill video to window when playing. Perfect for putting videos in a corner of the screen.
// @match       *://www.youtube.com/*
// @exclude     *://music.youtube.com/*
// @version     1.0.12
// @run-at      document-start
// @grant       none
// ==/UserScript==

(() => {
  "use strict";

  if (window.top !== window) return;

  const ACTIVE = "yt-ah-active",
        TOOLBAR = "yt-ah-toolbar-visible",
        SIZED = "yt-ah-sized",
        FS = "yt-ah-fullscreen",
        STYLE_ID = "yt-ah-style",
        TOP_REVEAL = 12,
        TOOLBAR_HIDE_DELAY = 1200,
        DEACTIVATE_DELAY = 600;

  const CONTAINER_IDS = new Set([
    "full-bleed-container",
    "player-full-bleed-container",
    "player-theater-container",
    "player-wide-container",
    "player-container-outer",
    "player-container-inner",
    "player-container",
  ]);

  const CSS = `
    html.${ACTIVE} #masthead-spacer {
      display: none !important;
      height: 0 !important;
    }
    html.${ACTIVE} #masthead-container {
      transform: translateY(-100%) !important;
      transition: transform 180ms ease !important;
      will-change: transform;
    }
    html.${ACTIVE}.${TOOLBAR} #masthead-container {
      transform: translateY(0) !important;
    }
    html.${ACTIVE} #page-manager,
    html.${ACTIVE} ytd-page-manager {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
    html.${ACTIVE} ytd-app {
      padding-top: 0 !important;
    }
    html.${ACTIVE} ytd-watch-flexy {
      --ytd-watch-flexy-masthead-height: 0px;
    }

    html.${ACTIVE} ytd-watch-flexy #secondary,
    html.${ACTIVE} ytd-watch-flexy #secondary-inner {
      display: none !important;
    }
    ytd-watch-flexy #comments,
    ytd-watch-flexy ytd-comments {
      display: none !important;
    }
    html.${ACTIVE} ytd-watch-flexy #columns.ytd-watch-flexy {
      display: block !important;
      width: 100% !important;
    }
    html.${ACTIVE} ytd-watch-flexy #primary.ytd-watch-flexy {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    html.${ACTIVE} ytd-watch-flexy #primary-inner.ytd-watch-flexy,
    html.${ACTIVE} ytd-watch-flexy #single-column-container.ytd-watch-flexy {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
    }
    html.${ACTIVE} ytd-watch-flexy #player.ytd-watch-flexy {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
    }

    html.${ACTIVE}:not(.${FS}) ytd-watch-flexy .${SIZED} {
      position: relative !important;
      width: var(--yt-ah-player-w) !important;
      height: var(--yt-ah-player-h) !important;
      max-width: none !important;
      max-height: none !important;
      min-width: 0 !important;
      min-height: 0 !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: #000 !important;
    }

    html.${ACTIVE}:not(.${FS}) ytd-watch-flexy ytd-player,
    html.${ACTIVE}:not(.${FS}) ytd-watch-flexy #movie_player,
    html.${ACTIVE}:not(.${FS}) ytd-watch-flexy .html5-video-container {
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      min-width: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    html.${ACTIVE}:not(.${FS}) ytd-watch-flexy .html5-video-container {
      position: absolute !important;
      inset: 0 !important;
    }
    html.${ACTIVE}:not(.${FS}) ytd-watch-flexy video.html5-main-video {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain !important;
      object-position: center center !important;
    }

    html.${ACTIVE} ytd-watch-flexy #below.ytd-watch-flexy {
      max-width: 1280px !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding-left: 24px !important;
      padding-right: 24px !important;
      box-sizing: border-box !important;
    }

    @media (prefers-reduced-motion: reduce) {
      html.${ACTIVE} #masthead-container { transition: none !important; }
    }
  `;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  const root = document.documentElement;

  injectStyle();

  let video = null;
  const fsBound = new WeakSet();
  let active = false,
      sized = [],
      lastWidth = 0,
      lastHeight = 0,
      sizeFrame = 0,
      hideTimer = 0,
      deactivateTimer = 0;

  function isWatchPath() {
    const path = location.pathname;
    return path === "/watch" || path === "/live" || path.startsWith("/live/");
  }

  function isWatchPage() {
    return isWatchPath() && !!document.querySelector("ytd-watch-flexy");
  }

  function getVideo() {
    const flexy = document.querySelector("ytd-watch-flexy");
    if (!flexy) return null;
    return (
      flexy.querySelector("#movie_player video.html5-main-video") ||
      flexy.querySelector("#movie_player video") ||
      flexy.querySelector("video.html5-main-video") ||
      null
    );
  }

  function markContainers() {
    const next = [];
    let el = video ? video.parentElement : null;
    while (el) {
      if (el.id && CONTAINER_IDS.has(el.id)) {
        el.classList.add(SIZED);
        next.push(el);
      }
      el = el.parentElement;
    }
    for (const previous of sized) {
      if (!next.includes(previous)) previous.classList.remove(SIZED);
    }
    sized = next;
  }

  function isFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;
    const player = document.getElementById("movie_player");
    if (player && player.classList.contains("ytp-fullscreen")) return true;
    const flexy = document.querySelector("ytd-watch-flexy");
    if (flexy && flexy.hasAttribute("fullscreen")) return true;
    if (
      video &&
      (video.webkitDisplayingFullscreen ||
        video.webkitPresentationMode === "fullscreen")
    ) {
      return true;
    }
    return false;
  }

  function isMiniplayer() {
    return !!document.querySelector("ytd-miniplayer[active]");
  }

  function shouldBeActive() {
    return (
      isWatchPage() &&
      !!video &&
      video.videoWidth > 0 &&
      video.videoHeight > 0 &&
      !video.paused &&
      !video.ended &&
      !isFullscreen() &&
      !isMiniplayer()
    );
  }

  function syncSize() {
    if (!video || !video.videoWidth || !video.videoHeight) return;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth,
          viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    if (viewportWidth < 200 || viewportHeight < 120) return;
    const aspect = video.videoWidth / video.videoHeight,
          height = Math.floor(Math.min(viewportHeight, viewportWidth / aspect)),
          width = Math.min(viewportWidth, Math.floor(height * aspect));
    if (width < 200 || height < 120) return;
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width;
    lastHeight = height;
    root.style.setProperty("--yt-ah-player-w", width + "px");
    root.style.setProperty("--yt-ah-player-h", height + "px");
  }

  function activate() {
    clearTimeout(deactivateTimer);
    deactivateTimer = 0;
    if (active) return;
    active = true;
    lastWidth = 0;
    lastHeight = 0;
    syncSize();
    root.classList.add(ACTIVE);
    root.classList.remove(TOOLBAR);
  }

  function deactivateNow() {
    clearTimeout(deactivateTimer);
    deactivateTimer = 0;
    clearTimeout(hideTimer);
    hideTimer = 0;
    for (const el of sized) el.classList.remove(SIZED);
    sized = [];
    root.style.removeProperty("--yt-ah-player-w");
    root.style.removeProperty("--yt-ah-player-h");
    if (active) {
      active = false;
      root.classList.remove(ACTIVE);
      root.classList.remove(TOOLBAR);
    }
  }

  function sync() {
    const next = getVideo();
    if (next !== video) {
      video = next;
      if (video && !fsBound.has(video)) {
        fsBound.add(video);
        video.addEventListener("webkitbeginfullscreen", refreshFullscreen, true);
        video.addEventListener("webkitendfullscreen", refreshFullscreen, true);
      }
    }

    observeFlexy();

    const fullscreen = isFullscreen();
    root.classList.toggle(FS, fullscreen);

    if (fullscreen) {
      clearTimeout(deactivateTimer);
      deactivateTimer = 0;
      return;
    }

    if (shouldBeActive()) {
      activate();
      syncSize();
      markContainers();
      return;
    }

    if (active && !deactivateTimer) {
      deactivateTimer = setTimeout(() => {
        deactivateTimer = 0;
        if (!shouldBeActive()) deactivateNow();
      }, DEACTIVATE_DELAY);
    }
  }

  let settleTimers = [];

  function settleLayout() {
    for (const timer of settleTimers) clearTimeout(timer);
    settleTimers = [];
    [0, 60, 150, 300, 600].forEach((delay) => {
      settleTimers.push(
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
          scheduleSync();
        }, delay)
      );
    });
  }

  function refreshFullscreen() {
    root.classList.toggle(FS, isFullscreen());
    scheduleSync();
    settleLayout();
  }

  let flexyObserver = null,
      flexyObserved = null;

  function observeFlexy() {
    const flexy = document.querySelector("ytd-watch-flexy");
    if (!flexy) return;
    if (flexy === flexyObserved) return;
    if (flexyObserver) flexyObserver.disconnect();
    flexyObserved = flexy;
    flexyObserver = new MutationObserver(() => refreshFullscreen());
    flexyObserver.observe(flexy, {
      attributes: true,
      attributeFilter: ["fullscreen"],
    });
  }

  function scheduleSync() {
    if (sizeFrame) return;
    sizeFrame = requestAnimationFrame(() => {
      sizeFrame = 0;
      sync();
    });
  }

  function masthead() {
    return document.getElementById("masthead-container");
  }

  function showToolbar() {
    if (!active) return;
    clearTimeout(hideTimer);
    hideTimer = 0;
    root.classList.add(TOOLBAR);
  }

  function scheduleToolbarHide() {
    if (!active) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      hideTimer = 0;
      const mast = masthead();
      if (mast && mast.contains(document.activeElement)) return;
      root.classList.remove(TOOLBAR);
    }, TOOLBAR_HIDE_DELAY);
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      if (!active) return;
      if (event.clientY <= TOP_REVEAL) {
        showToolbar();
        return;
      }
      if (root.classList.contains(TOOLBAR)) {
        const mast = masthead(),
              height = mast ? mast.getBoundingClientRect().height : 56;
        if (event.clientY <= height + 8) {
          showToolbar();
          return;
        }
      }
      scheduleToolbarHide();
    },
    { passive: true, capture: true }
  );

  document.addEventListener(
    "pointerleave",
    () => {
      if (active) scheduleToolbarHide();
    },
    true
  );

  document.addEventListener(
    "focusin",
    (event) => {
      if (!active) return;
      const mast = masthead();
      if (mast && mast.contains(event.target)) showToolbar();
    },
    true
  );

  document.addEventListener(
    "focusout",
    () => {
      if (!active) return;
      const mast = masthead();
      if (mast && mast.contains(document.activeElement)) return;
      scheduleToolbarHide();
    },
    true
  );

  ["play", "playing", "pause", "ended", "emptied", "loadedmetadata", "durationchange", "resize"].forEach(
    (type) => document.addEventListener(type, scheduleSync, true)
  );

  [
    "fullscreenchange",
    "webkitfullscreenchange",
    "webkitbeginfullscreen",
    "webkitendfullscreen",
  ].forEach((type) => document.addEventListener(type, refreshFullscreen, true));

  ["yt-navigate-finish", "yt-page-data-updated", "popstate", "pageshow"].forEach((type) => {
    window.addEventListener(type, () => {
      if (!isWatchPage()) deactivateNow();
      scheduleSync();
    });
  });

  document.addEventListener("DOMContentLoaded", scheduleSync, { once: true });

  window.addEventListener("resize", scheduleSync, { passive: true });
  window.addEventListener("orientationchange", scheduleSync, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleSync, { passive: true });
  }

  setInterval(sync, 1000);
  scheduleSync();
})();
