My collection of Userscripts
============================
These are some Userscripts I find useful.

> [!NOTE]
> Most of them are little scripts I've cobbled together for my own purposes, but if I found someone else's script before making one, then it'll be in this repo too and the header will show that.


Where to use them
-----------------
On Mac, iPhone, and iPad the Safari extension by @quoid is maybe the best option. It can sync across the cloud and give you a consistent experience, plus you don't need to use some other smelly browser.

https://appstore.com/justinwasack/userscripts

[quoid/userscripts](https://github.com/quoid/userscripts)

*Other Userscript implimentations exist, and these should work in them, but may require modification of the header section.*


Why use them
------------
If you're wondering this, maybe your experience of the internet has been pretty smooth, but sometimes a website will use a font or colour which doesn't quite meet your needs.

Maybe the website has a dark theme but doesn't trigger it automatically,  
perhaps the streaming site you're watching a movie on could do with the titlebar being a little darker,  
how about that page that uses a colour scheme which makes the text impossible to read.

Userscripts let you fix it.


When they will break
--------------------
Because these scripts manipulate how other people's websites look and behave, when those people change their websites, stuff can break. Sorry, that's just the way it works.

Some of the Userscripts will work until WebKit, HTML, or CSS is changed -- so are likely to live much much longer.

---

| Userscript                  | Description                                                  | Type |
|-----------------------------|--------------------------------------------------------------|:----:|
| [Dark title bar for movies] | Makes the Safari title bar black. Add and remove your own sites to the match lists. |  JS  |
| [DuckDuckGo bottom navbar] | Bottom buttons for navigation when in portrait |  CSS  |
| [DuckDuckGo fit page width] | Keep DuckDuckGo results contained within the page bounds. |  CSS  |
| [DuckDuckGo font] | I know you can change the font on the site, but then it breaks auto-darkmode |  CSS  |
| [YouTube Hide Shorts] | Hide Shorts navigation, search filters, and shelves on YouTube in multiple languages |  JS  |
| [Home Assistant Fira Code] | Use Fira Code font in Home Assistant's YAML editor. |  CSS  |
| [Make WebApp] | Bookmark a normal site like a PWA on iOS. |  JS  |
| [Prusa themes] | Auto dark theme. Sets Prusa sites titlebar to Prusa orange. |  JS  |
| [Search boxes] | Tries to make all search boxes behave themselves, and adds a "/" hotkey. |  JS  |
| [Smartlink banners] | Add smartlink banners if possible. |  JS  |
| [Wiki system fonts] | Use the nicer default UI fonts. |  CSS  |

[Dark title bar for movies]: scripts/dark-title-bar-for-movies.user.js
[DuckDuckGo bottom navbar]: scripts/ddg-bottom-nav.user.css
[DuckDuckGo fit page width]: scripts/ddg-fit-width.user.css
[DuckDuckGo font]: scripts/ddg-font.user.css
[YouTube Hide Shorts]: scripts/hide-shorts.user.js
[Home Assistant Fira Code]: scripts/homeassistant-fira-code.user.css
[Make WebApp]: scripts/make-webapp.user.js
[Prusa themes]: scripts/prusa-themes.user.js
[Search boxes]: scripts/search-box.user.js
[Smartlink banners]: scripts/smartlinks.user.js
[Wiki system fonts]: scripts/wiki.user.css
