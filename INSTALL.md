# Installation

Both firefox and chrome have 2 modes for installing the extension: **developer** and **user**. Developer mode allows You to access console and HTML inspector, but does not persist when You close the browser window. User mode is for when the extension is installed from the official add-on store - [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/) or [Chrome Web Store](https://chrome.google.com/webstore/category/extensions). This requires the extension to be signed. Fortunately, both stores have an 'unlisted' option that You can use for You own purposes.



## 1. Create Spotify application

We will use Spotify API to access current song API endpoint.

1. Go to [developer.spotify.com](https://developer.spotify.com/dashboard/applications).
2. Click 'create an app'
3. We don't need any special permissions, so fill out the rest of the form
4. After app is created read it's `Client ID`, `Client Secret`
5. In `Edit Settings` watch out for 'Redirect URIs' - we will need to add this later



## 2. Build the app

1. Create `src/config.js`, fill out `clientId` and `clientSecret` for Your Spotify app (data from step 1.4). Use `src/config.example.js` as a template
2. `yarn install` or local equivalent
3. Start webpack in development mode: `yarn start`. This will compile the code into `extension/dist`. It has watch mode already build-in
4. Look around inside `extension` folder - there is manifest file there if You need to modify it (should not be needed though)



## 3. (optional) Developing on firefox

1. Go to `about:debugging#addons`
2. `Load Temporary Add-on` - point it into `extension/manifest.json`
3. Click `Enable add-on debugging` on top of the page and then `Debug` for specific extension in order to bring up the console (may need to click 'Ok' in special dialog)
4. Click dots in console's top-right corner, `Disable Popup Auto-Hide` for better debug experience



## 4. (optional) Developing on chrome

1. Go to `chrome://extensions/`
2. Click `Load unpacked`, select the `extension` folder
3. Right click the extension popup to show the console



## 5. Linking with spotify ('Redirect URIs')

During authorization to Spotify API, we will need to provide `redirect url`. Same `redirect url` needs to be whitelisted in our Spotify application dev portal.

1. In console there should be a warning like
> Will do spotify auth with redirect url 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxx.extensions.allizom.org/'. Make sure it is allowed in spotify app settings (in spotify dev portal)
2. Copy the url from step 5.1 into 'Redirect URIs' in app's Spotify dev portal (step 1.5)
3. After clicking the extension popup button, You will be asked to sign into Spotify.
4. The add-on should work after signing in.



## 6. Publishing on [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/)

1. Build production version of the extension: `yarn build`
2. There should be `spotify-lyrics-popup.zip` that is ready to be published. [Additional instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Package_your_extension_).
3. Register on [https://addons.mozilla.org](https://addons.mozilla.org)
4. [Submit the extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on). Pay close attention to ['On your own'](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on#Self-distribution) and ['On this site'](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on#Self-distribution) options.



## 7. Publishing on [Chrome Web Store](https://chrome.google.com/webstore/category/extensions).

1. Build production version of the extension: `yarn build`
2. There should be `spotify-lyrics-popup.zip` that is ready to be published. [Additional instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Package_your_extension_).
3. Go to https://chrome.google.com/webstore/developer/dashboard and login with google credentials
4. Fill out the form and upload the file
