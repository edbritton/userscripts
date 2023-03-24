// ==UserScript==
// @name        Dark title bar for movies
// @description Makes the Safari title bar black. Add and remove your own sites to the match lists.
// @match       https://www.disneyplus.com/*
// @version     0.0.1
// @updateURL   https://raw.githubusercontent.com/edbritton/userscripts/main/scripts/Dark%20title%20bar%20for%20movies.js
// ==/UserScript==

// Should work forever
var metaThemeColor = document.querySelector("meta[name=theme-color]");
metaThemeColor.setAttribute("content", "#000000");