// ==UserScript==
// @name        Search boxes
// @description Tries to make all search boxes behave themselves, and adds a "/" hotkey.
// @match       *://*/*
// @run-at      document-start
// ==/UserScript==

const search_boxes = [
	"input[placeholder*='Search']",
	"input[type='search']",
	"[role='searchbox']",
	"input[name='q']",
].join(", ");

document.querySelectorAll(search_boxes).forEach((element) => {
	element.setAttribute("type","search");
	element.setAttribute("role","searchbox");
	element.setAttribute("results","5");
	element.setAttribute("placeholder","検索【けんさく】");
	//element.setAttribute("lang","ja-JP")
});
//spellcheck="false"

document.addEventListener("keyup", e => {
  if (e.key === "/") {
    e.preventDefault();
    document.querySelectorAll("input[type='search']")[0].focus();
  }
});
