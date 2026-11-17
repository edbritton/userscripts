// ==UserScript==
// @name         YouTube Hide Shorts
// @version      1.1.1
// @description  Hide Shorts navigation, search filters, and shelves on YouTube in multiple languages
// @author       umbertoragone
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @downloadURL  https://github.com/umbertoragone/youtube-hide-shorts/raw/main/hide-shorts.user.js
// @updateURL    https://github.com/umbertoragone/youtube-hide-shorts/raw/main/hide-shorts.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
  "use strict";

  const MINI_GUIDE_ENTRY_SELECTOR =
    'ytd-mini-guide-renderer ytd-mini-guide-entry-renderer > a#endpoint[href]';
  const GUIDE_ENTRY_SELECTOR =
    "ytd-guide-section-renderer ytd-guide-entry-renderer";
  const CHANNEL_TAB_SELECTOR =
    "#tabsContainer yt-tab-group-shape .tabGroupShapeTabs > yt-tab-shape";
  const SHORTS_SHELF_SELECTOR =
    "ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer";
  const SEARCH_CHIP_SELECTOR =
    "ytd-search yt-chip-cloud-renderer yt-chip-cloud-chip-renderer";
  const SEARCH_SHORTS_SHELF_SELECTOR = "ytd-search grid-shelf-view-model";
  // Distinct tab labels, ordered by first appearance in YouTube's language menu.
  const SHORTS_LABELS = new Set([
    "kortvideo's",
    "shorts",
    "curts",
    "lühivideod",
    "ama-short",
    "short",
    "video fupi",
    "shorts-videoer",
    "kratki videoposnetki",
    "šorts",
    "кыска видеолор",
    "шортс",
    "youtube shorts",
    "կարճ հոլովակներ",
    "کوته‌ویدیوها",
    "მოკლე ვიდეოები",
    "ショート",
  ]);
  const SHORTS_LABEL_PATTERNS = [
    /(?:^|[^a-z0-9])shorts?(?:$|[^a-z0-9])/i,
    /(?:^|[^a-z0-9])šorts?(?:$|[^a-z0-9])/i,
  ];

  function isShortsLabel(value) {
    const label = value?.replace(/\s+/g, " ").trim().toLowerCase();
    return (
      SHORTS_LABELS.has(label || "") ||
      SHORTS_LABEL_PATTERNS.some((pattern) => pattern.test(label || ""))
    );
  }

  // YouTube reconciles and recycles these nodes during SPA navigation. Removing
  // them breaks its child indexes; leaving a hidden marker on a reused node
  // would also hide an unrelated tab on the next page.
  const HIDDEN_ATTRIBUTE = "data-youtube-hide-shorts";
  const style = document.createElement("style");
  style.textContent = `[${HIDDEN_ATTRIBUTE}] { display: none !important; }`;
  (document.head || document.documentElement).appendChild(style);
  let targets = new Set();

  function hideElement(element) {
    if (element?.isConnected) targets.add(element);
  }

  function hideShortsMiniGuideEntry() {
    const entries = document.querySelectorAll(MINI_GUIDE_ENTRY_SELECTOR);
    for (const endpoint of entries) {
      let pathname;
      try {
        pathname = new URL(endpoint.getAttribute("href"), window.location.origin)
          .pathname;
      } catch {
        continue;
      }

      if (pathname === "/shorts" || pathname === "/shorts/") {
        hideElement(endpoint.closest("ytd-mini-guide-entry-renderer"));
      }
    }
  }

  function hideShortsGuideEntry() {
    const entries = document.querySelectorAll(GUIDE_ENTRY_SELECTOR);
    for (const entry of entries) {
      const endpoint = entry.querySelector(":scope > a#endpoint");
      const title = endpoint?.getAttribute("title")?.trim();
      const label = entry
        .querySelector("yt-formatted-string.title")
        ?.textContent.trim();

      if (isShortsLabel(title) || isShortsLabel(label)) {
        hideElement(entry);
      }
    }
  }

  function hideChannelShortsTab() {
    const tabs = document.querySelectorAll(CHANNEL_TAB_SELECTOR);
    for (const tab of tabs) {
      const labels = [
        tab.getAttribute("aria-label"),
        tab.getAttribute("tab-title"),
        tab.getAttribute("title"),
        tab.querySelector(".ytTabShapeTab")?.textContent,
        tab.textContent,
      ];
      if (labels.some(isShortsLabel)) {
        hideElement(tab);
      }
    }
  }

  function hideShortsShelf() {
    const shelves = document.querySelectorAll(SHORTS_SHELF_SELECTOR);
    for (const shelf of shelves) {
      hideElement(shelf.closest("ytd-rich-section-renderer") || shelf);
    }
  }

  function hideSearchShorts() {
    if (window.location.pathname !== "/results") return;

    const chips = document.querySelectorAll(SEARCH_CHIP_SELECTOR);
    for (const chip of chips) {
      const labels = [
        chip.getAttribute("aria-label"),
        chip.querySelector(".ytChipShapeText")?.textContent,
      ];
      if (labels.some(isShortsLabel)) {
        hideElement(chip);
      }
    }

    const shelves = document.querySelectorAll(SEARCH_SHORTS_SHELF_SELECTOR);
    for (const shelf of shelves) {
      if (
        shelf.querySelector(
          "ytm-shorts-lockup-view-model, ytm-shorts-lockup-view-model-v2",
        )
      ) {
        hideElement(shelf);
      }
    }
  }

  function hideShorts() {
    targets = new Set();
    hideShortsMiniGuideEntry();
    hideShortsGuideEntry();
    hideChannelShortsTab();
    hideShortsShelf();
    hideSearchShorts();

    for (const element of document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`)) {
      if (!targets.has(element)) element.removeAttribute(HIDDEN_ATTRIBUTE);
    }
    for (const element of targets) {
      if (!element.hasAttribute(HIDDEN_ATTRIBUTE)) {
        element.setAttribute(HIDDEN_ATTRIBUTE, "");
      }
    }
  }

  let hideScheduled = false;
  function scheduleHideShorts() {
    if (hideScheduled) return;
    hideScheduled = true;

    window.requestAnimationFrame(() => {
      hideScheduled = false;
      hideShorts();
    });
  }

  const observer = new MutationObserver(scheduleHideShorts);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    // Ignore our own marker to avoid an observer/render loop.
    attributeFilter: ["aria-label", "tab-title", "title", "href", "is-shorts"],
  });

  window.addEventListener("yt-navigate-finish", scheduleHideShorts);
  window.addEventListener("yt-page-data-updated", scheduleHideShorts);
  window.addEventListener("popstate", scheduleHideShorts);
  window.addEventListener("pageshow", scheduleHideShorts);

  hideShorts();
  console.log("[YouTube Hide Shorts] Loaded and hiding shorts");
})();
