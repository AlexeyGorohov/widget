import App from './App.svelte';

var cinemaBoxWidget = new App({
	target: document.body,
	props: {
		CBID: undefined
	}
});

export default cinemaBoxWidget;