import "./assets/css/main.css";

import App from "./App.svelte";

var CBWidgetPopup = new App({
  target: document.body,
  props: {
    CBID: null
  }
});

export default CBWidgetPopup;