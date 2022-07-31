# webext-redux-event-driven

This is an experiment to use [webext-redux](https://github.com/tshaddix/webext-redux) in event driven web extensions.

With [Manifest v3](https://developer.chrome.com/docs/extensions/mv3/intro/), we no longer have a persistent background script
that keeps running as long as the browser is open. We now have [service workers](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#man-sw)
that go idle after a short time when the extension is not used. This means that any state stored in that service worker won't be kept,
as well as any connection that was initialized for message passing between the extensions and the background scripts or the popup.

As a consequence, and at the time of writing `webext-redux` (v2.1.9) can't be used right way in Manifest v3 extensions.

It's still possible to use it by adapting the code architecture a bit, and this is what this repo attemps to demonstrate.

1. To solve the non-persistence issue of the Redux store, we can use the [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/) API.
2. To solve the issue connection not being kept for message passing, we can make sure that the connection is established before attempting to send messages.

