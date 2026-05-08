// ==UserScript==
// @name        Search boxes
// @description Fix sites without proper search markup.
// @match       *://*/*
// ==/UserScript==

document.querySelectorAll("input[placeholder*='Search']").forEach((element) => {
	element.setAttribute("type","search");
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
