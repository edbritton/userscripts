// ==UserScript==
// @name        Make WebApp
// @description Bookmark a normal site like a PWA on iOS.
// @match       *://*/*
// ==/UserScript==

// Should work forever
var meta = document.createElement('meta');
meta.name = 'apple-mobile-web-app-capable';
meta.content = 'yes';
document.getElementsByTagName('head')[0].appendChild(meta);
