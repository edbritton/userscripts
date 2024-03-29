My collection of Userscripts
============================
These are some Userscripts I find useful.

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

I'll try to add comments in the codes to let less experienced coders know the weak points.

---

| Userscript                  | Description                                                  | Type |
|-----------------------------|--------------------------------------------------------------|:----:|
| [Dark title bar for movies] | Makes the title bar black on your preferred streaming sites. |  JS  |
| [DuckDuckGo font]           | Set DuckDuckGo font without breaking auto-darkmode.          |  CSS |
| [Make WebApp]               | Forces a page to save to home screen as a WebApp, poorly.    |  JS  |
| [Prusa themes]              | Activates the site's dark theme on systems light/dark mode.  |  JS  |

[Dark title bar for movies]: scripts/Dark%20title%20bar%20for%20movies.js
[DuckDuckGo font]: scripts/ddg%20font.css
[Make WebApp]: scripts/Make%20WebApp.js
[Prusa themes]: scripts/Prusa%20themes.js
