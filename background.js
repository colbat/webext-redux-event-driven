import { configureStore } from "@reduxjs/toolkit";
import { wrapStore } from "webext-redux";
import counterReducer, { initialState } from "./counter.js";

// Since we are in a service worker, this is not persistent
// and this will be reset to false, as expected, whenever
// the service worker wakes up from idle.
let isInitialized = false;

// Optional: at the top level, we can safely deal with
// everything unrelated to the redux store.
//
// For example: initializing a badge.
chrome.storage.local.get("state", (storage) => {
  const state = storage.state || initialState;
  chrome.action.setBadgeText({ text: `${state.value}` });
});

// Initializes the Redux store
const init = (preloadedState) => {
  const store = configureStore({
    reducer: counterReducer,
    preloadedState,
  });

  wrapStore(store, { portName: "WEBEXT_REDUX_TEST" });

  // Subscribes to the redux store changes. For each state
  // change, we want to store the new state to the storage.
  store.subscribe(() => {
    chrome.storage.local.set({ state: store.getState() });

    // Optional: other things we want to do on state change
    // Here we update the badge text with the counter value.
    chrome.action.setBadgeText({ text: `${store.getState().value}` });
  });
};

// Listens for incomming connections from content
// scripts, or from the popup. This will be triggered
// whenever the extension "wakes up" from idle.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "POPUP") {
    // The popup was opened.
    // Gets the current state from the storage.
    chrome.storage.local.get("state", (storage) => {
      if (!isInitialized) {
        // 1. Initializes the redux store and the message passing.
        init(storage.state || initialState);
        isInitialized = false;
      }
      // 2. Sends a message to notify that the store is ready.
      chrome.runtime.sendMessage({ type: "STORE_INITIALIZED" });
    });
  }
});
