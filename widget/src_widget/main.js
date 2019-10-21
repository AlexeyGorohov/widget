// https://github.com/jenyayel/js-widget/blob/master/src/main.js
import '../public/cbwidgetpopup.js';

class CBWidget{
    constructor(CBID){
        this.CBID = CBID || '';
        this.observeModal();
        this.setEventsBtns();
    }

    getModalWidget() {
        return document.querySelector('.widget-cb');
    }

    setEventsBtns() {
        const btns = document.querySelectorAll('[data-cinemabox-id]');

        btns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.getModalWidget().classList.add('show');
            })
        })
    }

    observeModal() {
        const widget = this.getModalWidget();

        const options = {
            attributes: true,
            attributeOldValue: true,
        };

        const callbackMutation = (mutations) => {
            mutations.forEach(({ target }) => { 
                if(target.classList.contains('show')) {
                    this.setEventOutsideWidget();
                } else {
                    this.removeEventOutsideWidget();
                }
            })
        };

        const observer = new MutationObserver(callbackMutation);

        observer.observe(widget, options);
    }

    setEventOutsideWidget() {
        document.addEventListener('click', this.listenerWidget.bind(this));
    }

    listenerWidget(event) {
        const widget = this.getModalWidget();
        const isClickInside = widget.contains(event.target);

        console.log(isClickInside, 'isClickInside');

        // if (!isClickInside) {
        //     widget.classList.remove('show');
        // }
    }
}

new CBWidget();