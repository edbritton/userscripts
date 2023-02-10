// ==UserScript==
// @name        Prusa themes
// @description Auto dark theme. Sets Prusa sites titlebar to Prusa orange (#fa6831) or maybe the grey (#f5f5f5).
// @match       https://www.printables.com/*
// @match       https://*prusa*.com/*
// ==/UserScript==

var metaThemeColor = document.querySelector("meta[name=theme-color]");
metaThemeColor.setAttribute("content", "#fa6831");

var root = document.getElementsByTagName('html')[0];
window.matchMedia("(prefers-color-scheme: dark)").matches ? root.classList.add("theme-dark") : root.classList.remove("theme-dark");
