// ==UserScript==
// @name        Dark title bar for movies
// @description Makes the Safari title bar black. Add and remove your own sites to the match lists.
// @match       https://www.disneyplus.com/*
// ==/UserScript==

// Should work forever
var metaThemeColor = document.querySelector("meta[name=theme-color]");
metaThemeColor.setAttribute("content", "#000000");
