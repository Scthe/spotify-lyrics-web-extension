# Installation

Both Firefox and Chrome have 2 modes for installing the extension: **developer** and **user**. Developer mode allows you to access the console and HTML inspector but does not persist when you close the browser window. User mode is for when the extension is installed from the official add-on store - [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/) or [Chrome Web Store](https://chrome.google.com/webstore/category/extensions). This requires the extension to be signed. Fortunately, both stores have an 'unlisted' option that you can use for your own purposes.



## 1. Create the Spotify application

We will use Spotify API to access the current song API endpoint.

1. Go to [developer.spotify.com](https://developer.spotify.com/dashboard/applications).
2. Click `Create app`.
3. We don't need any special permissions, so fill out the rest of the form.
4. After the app is created read its `Client ID`, `Client Secret`.
5. In `Edit` watch out for `Redirect URIs` - we will need to add this later.



## 2. Install the app

1. Clone this repository.
1. In `src/config.ts`, fill out `clientId` and `clientSecret` for your Spotify app (data from step 1.4).
1. `yarn install`.
1. Update `extension\manifest.json` with your values for `version`, `browser_specific_settings.gecko.id`. Prevents "duplicate addon id" error during submission to the store.



## 3. Local development

In the next step, we whitelist our extension's redirect URI in the Spotify developer portal. You have to execute it on both Firefox and Chrome.

### Local development - Firefox

1. Start Vite in watch mode with `yarn dev` to compile the code into `extension/dist`.
1. Go to `about:debugging#addons`.
1. Click `Load Temporary Add-on` and point it to `extension/manifest.json`.
1. Click `Inspect` next to our new temporary extension to open dev tools.
1. Click the three horizontal dots button in console's top-right corner, and then `Disable Popup Auto-Hide` for a better debugging experience.
1. The extension is already installed and should be accessible in the toolbar. By default, Firefox might relegate it to dropdown accessible through the 🧩 button.

### Local development - Chrome

1. Go to `chrome://extensions/`.
2. Click `Load unpacked`, and select the `extension` folder.
3. Right-click the extension popup to show the console.



## 4. Linking with Spotify ('Redirect URIs')

During authorization to Spotify API, we will need to provide a `redirect URI`. The same `redirect URI` needs to be whitelisted in our Spotify application dev portal.

1. In the console there should be a warning like:
> Will do Spotify auth with redirect url 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxx.extensions.allizom.org/'. Make sure it is allowed in Spotify app settings.
1. Copy the URL from the console message into 'Redirect URIs' in the app's Spotify dev portal (step 1.5).
2. After clicking the extension popup button, you will be asked to sign into Spotify.
3. The add-on should work after signing in.


## 5. Publish unlisted extension

### Publishing on [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/)

1. [Build production version](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Package_your_extension_) of the extension: `yarn build`.
2. There should be `spotify-lyrics-popup.zip` ready to be published.
3. Register on [https://addons.mozilla.org](https://addons.mozilla.org)
4. [Submit the extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on).
5. Upload the ZIP file into [mozilla.org/upload-unlisted](https://addons.mozilla.org/en-GB/developers/addon/submit/upload-unlisted).
6. Install the signed extension (`.xpi` file) from `Manage status & versions`.
    - You can also right-click and `Save link as` to get the copy of `.xpi` file.


### Publishing on [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)

1. Build production version of the extension: `yarn build`
2. There should be `spotify-lyrics-popup.zip` ready to be published.
3. Go to https://chrome.google.com/webstore/developer/dashboard and log in with Google credentials.
4. Fill out the form and upload the file.
