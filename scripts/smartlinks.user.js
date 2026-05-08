// ==UserScript==
// @name        Smartlink banners
// @description Add smartlink banners if possible.
// @match       *://*/*
// @version     0.0.1
// ==/UserScript==

//id957430475

let head = document.getElementsByTagName("head")[0],
    body = document.getElementsByTagName("body")[0],
    meta = document.createElement('meta'),
    idno = body.innerHTML.match(/href=.*apple.*id([0-9]*).*/);

meta.name = 'apple-itunes-app';
meta.content = 'app-id='+idno[1];
head.append(meta);