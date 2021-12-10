## Spotify lyrics web extension


Browser extension to display lyrics for currently playing Spotify/YouTube song. Check out the *'Q: Where can I get this extension?'* below.

![ext-preview]


## FAQ


**Q: What happened to lyrics on Spotify?**

A: Long, long time ago Spotify had extensions system. The most popular of them all was the one that showed lyrics for currently playing song. [Then, Spotify removed that functionality](https://www.wired.co.uk/article/spotify-axes-apps). Fortunately, they partnered with Musixmatch and we had separate button for that. Good times! [Then, Spotify removed that functionality](https://blog.musixmatch.com/i-know-its-over-a-parting-of-ways-and-it-s-done-but-didn-t-we-have-fun-8bb27193494d).

Back to *now*. I've had some experience with writing browser extensions and there exists an official (but still experimental) Spotify API endpoint to get name of current song. We can combine this 2 facts and create web extension to automatically download the lyrics.


**Q: Why should I use browser extension?**

A: You are right, there are many separate apps that can easily show You the lyrics. The problem is... well, these are *separate* apps. To use them, You need to keep another window open, and also setup an autorun when You login to Your PC (or manually start the app). What would You have done if You didn't have app like this? The answer is simple - You would bring up Your browser, and google! This extension aims to make this whole process automatic. Actually, we can even go step further and display the lyrics for You! We can also detect if the current tab is YouTube, so this functionality is thrown for free.


**Q: Does it work if I'm listening to Spotify on other device (phone etc.)?**

A: Yes, this extension uses official *current song* Spotify API endpoint. It's marked as experimental, but works good enough. No more hacking with spotify web player! Ofc. You still need a browser that has this extension installed.


**Q: Where can I get this extension?**

A: This extension is distributed as a source code. I have not uploaded it publicly to any of the browser add-on stores or anything like that. The page that You are reading is the only author-endorsed way to get this extension.

I am aware that this limits the potential user base. I am fine with it. Having the extension publicly available would mean that I am willing to provide some form of tech support for it. Well, I am not. For all intents and purposes this is just a simple app created for my own amusement. It may sound harsh, but keep in mind stories like [left-pad](https://www.davidhaney.io/npm-left-pad-have-we-forgotten-how-to-program/) and [event-stream](https://github.com/dominictarr/event-stream/issues/116) - the latter happened just month ago.

And there is also the fact that `api.spotify.com/v1/me/player/currently-playing` is marked as experimental.


**Q: What about the permissions?**

A: As I've mentioned, this extension is a proof of concept. We want to fetch the lyrics without having separate external service, and without the hassle of authenticating to various 3rd party accounts. This means scrapping the web pages. Unfortunately, the web extension popup is just another website, which means that CORS still applies. We can turn it off by adding certain values in `manifest.json` (web extensions have A LOT of control over the browser), but the end user will have to be informed about that.

Since this extension is distributed as source code, feel free to read through it.


**Q: How do I display lyrics for YouTube?**

A: When on YouTube tab, there is separate button in top left corner. Click it!


**Q: Where do You get the lyrics from?**

A: Current lyrics providers are: [Genius](https://genius.com/) and [Musixmatch](https://www.musixmatch.com/).


**Q: Any interesting takeaways?**

A: UX for extensions is actually quite interesting. At first I thought I would need a refresh button / pooling (for when the spotify song changes). And also fancy song-progress indicators. Turns out, instead of refreshing, the user can just display the popup again. And most song lyrics are short enough to fit on 2 screens. There were a couple of things like that: error handling, recognisable images, fitting as much functionality as possible etc..


## Installation

I've created separate instruction file: [INSTALL.md](INSTALL.md).


[ext-preview]:gh-images/readme-preview.gif
