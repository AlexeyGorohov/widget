import './assets/css/main.css';
import App from './App.svelte';

var CBWidget = new App({
	target: document.body,
	props: {
		CBID: undefined
	}
});

export default CBWidget;

// https://github.com/jenyayel/js-widget/blob/master/src/main.js