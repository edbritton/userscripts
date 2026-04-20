// ==UserScript==
// @name         DuckDuckGo layout cleaner
// @namespace    duckduckgo_layout_cleaner
// @description  Remove useless clutter from duckduckgo.com
// @match        *://duckduckgo.com/*
// @match        *://duckduckgo.com/*
// @run-at       document-end
// @encoding     utf-8
// @license      MIT
// @version      2022.09
// ==/UserScript==

function removeByClass(clsname) {
    var a1 = document.getElementsByClassName(clsname);
    for(var i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);
}

(function() {
    if (document.location.href === "https://duckduckgo.com/") {
      document.location.href = "https://duckduckgo.com/?t=ffab";
    }
  
    setTimeout(function() {
        removeByClass('js-tagline');
        removeByClass("header--aside__item");
        removeByClass("header--aside__item social");
        removeByClass("feedback-prompt");
        removeByClass("js-feedback-btn-wrap");
        removeByClass("footer");
        removeByClass("badge-link");
        removeByClass("js-onboarding-ed");
        removeByClass("content-info__items");
        removeByClass("content-info__title");
    }, 1000);
})();
