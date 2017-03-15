import Utility from './utility';
import Window from './window';

let defaultOptions = {
	type: null,
	textAlign: 'center',
	clickToClose: false,
	closeAfter: null,
	buttons: undefined,
};

let defaultWwiseOptions = {
	position: 'top',
	noBorder: true,
	overlay: false,
	clickOverlayToClose: true,
	style: null,
};

class Push {
	constructor(__options) {
		this.options = JSON.parse(JSON.stringify(defaultOptions));
		for(let i in __options) {
			(__options[i] != undefined) && (this.options[i] = __options[i]);
		}

		this.closeHandler = this.close.bind(this, 'click');

		let options = this.options;
		let wwiseOptions = JSON.parse(JSON.stringify(defaultWwiseOptions));

		for(let i in wwiseOptions) {
			(options.hasOwnProperty(i)) && (wwiseOptions[i] = options[i]);
		}

		wwiseOptions.topbar = false;
		wwiseOptions.content = this.constructContent(options);
		wwiseOptions.animation = wwiseOptions.position;
		wwiseOptions.removeBackground = true;

		this.wwise = new Window(wwiseOptions);
	}

	constructContent(options) {
		let dom = Utility.createDiv('push' + ((options.type && options.type != 'text') ? (' preset ' + options.type) : ''));

		dom.style.textAlign = options.textAlign;

		// Content
		let content = Utility.makeNftContent(options);

		let buttons = Utility.makeButtons(this, options);

		(!buttons.innerHTML) && (buttons = null);

		if(options.clickToClose) {
			dom.addEventListener('click', this.closeHandler);
		}
		
		return Utility.createDomTree({
			dom: dom,
			children: [ content, buttons ]
		});
	}

	open() {
		let f = this.wwise.open();

		this.promise = new Promise((resolve) => { this.promiseResolve = resolve; });
		this.wwise.getPromise().then(this.handlePromiseResolve.bind(this));

		if(this.options.closeAfter) {
			window.setTimeout(() => {
				this.close('timer');
			}, this.options.closeAfter);
		}
		
		return f;
	}

	close(value) {
		this.value = value;
		this.wwise.close();
	}

	getPromise() {
		return this.promise;
	}

	handlePromiseResolve() {
		this.promiseResolve(this.value);
	}
}

export default Push;