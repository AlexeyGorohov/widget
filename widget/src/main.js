import "./assets/css/main.css";
import App from "./App.svelte";

var btns = document.querySelectorAll("[data-cinemabox-id]");

var CBWidget = new App({
  target: document.body,
  props: {
    CBID: null,
    btns: btns
  }
});

export default CBWidget;

// https://github.com/jenyayel/js-widget/blob/master/src/main.js
