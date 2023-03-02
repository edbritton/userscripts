// ==UserScript==
// @name        Prusa themes
// @description Auto dark theme. Sets Prusa sites titlebar to Prusa orange.
// @match       https://www.printables.com/*
// @match       https://www.prusa3d.com/*
// @match       https://prusament.com/*
// ==/UserScript==

// Should work forever
const prusaOrange = "#fa6831",
      galaxyBlack = "#454447";

let lightMeta = document.createElement("meta"), defaultMeta = document.createElement("meta");

document.querySelectorAll("meta[name=theme-color]").forEach((element) => element.remove());

lightMeta.name = defaultMeta.name = "theme-color";
lightMeta.setAttribute("media", "(prefers-color-scheme:light)");

lightMeta.content = prusaOrange;
defaultMeta.content = galaxyBlack;

document.getElementsByTagName("head")[0].append(lightMeta, defaultMeta);

// May break in the future
let root = document.getElementsByTagName("html")[0];
window.matchMedia("(prefers-color-scheme: light)").matches ? root.classList.remove("theme-dark") : root.classList.add("theme-dark");
