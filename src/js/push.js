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
	overlay: false,
	clickOverlayToClose: false,
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

		(options.buttons === undefined) && (options.buttons = []);

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

		let append = (options.append) ? ( (typeof options.append === 'string') ? Utility.createDiv(null, options.append) : options.append ) : null;

		this.buttonArr = Utility.standardizeButtons(this, options);
		let buttons = Utility.makeButtons(this.buttonArr);

		(!buttons.innerHTML) && (buttons = null);

		if(options.clickToClose) {
			dom.addEventListener('click', this.closeHandler);
		}
		
		return Utility.createDomTree({
			dom: dom,
			children: [ content, append, buttons ]
		});
	}

	open() {
		if(this.wwise.opened) {
			return;
		}

		let f = this.wwise.open();

		this.promise = new Promise((resolve) => { this.promiseResolve = resolve; });
		this.wwise.getPromise().then(this.handlePromiseResolve.bind(this));
		this.keyHandler = Utility.bindButtonKeyEvents(this.buttonArr);

		if(this.options.closeAfter) {
			window.setTimeout(() => {
				this.close('timer');
			}, this.options.closeAfter);
		}
		
		return f;
	}

	close(value) {
		if(!this.wwise.opened) {
			return;
		}

		this.value = value;
		Utility.unbindButtonKeyEvents(this.keyHandler);
		return this.wwise.close();
	}

	getPromise() {
		return this.promise;
	}

	handlePromiseResolve() {
		this.promiseResolve(this.value);
	}
}

export default Push;