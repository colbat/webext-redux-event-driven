import { Store } from "webext-redux";
import { countDecremented, countIncremented } from "./counter.js";

// Starts the connection
chrome.runtime.connect({ name: "POPUP" });

// Initializes the popup logic
const initPopup = () => {
  const store = new Store({ portName: "WEBEXT_REDUX_TEST" });

  store.ready().then(() => {
    console.log("Store is ready! State:", store.getState());

    // From here the store is perfectly usable and we are
    // certain that the connection is established.
    //
    // At this stage we could render a React app, for example:
    //
    // render(
    //   <Provider store={store}>
    //     <App />
    //   </Provider>,
    //   document.getElementById("root")
    // );

    const value = store.getState().value;
    document.getElementById("value").innerText = value;

    store.subscribe(() => {
      const value = store.getState().value;
      document.getElementById("value").innerText = value;
    });

    document.getElementById("btn-increment").addEventListener("click", () => {
      store.dispatch(countIncremented());
    });

    document.getElementById("btn-decrement").addEventListener("click", () => {
      store.dispatch(countDecremented());
    });
  });
};

// Listens for when the store gets initialized
chrome.runtime.onMessage.addListener((req) => {
  if (req.type === "STORE_INITIALIZED") {
    // Initializes the popup logic
    initPopup();
  }
});
