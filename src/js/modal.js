import Utility from './utility';
import Window from './window';

class Modal {
	constructor(__options) {
		let options = this.options = __options;

		(!options.type) && (options.type = 'ok');

		let wwiseOptions = {};

		wwiseOptions.topbar = false;
		wwiseOptions.content = this.constructContent({ 
			type: options.type,
			title: options.title,
			text: options.text,
			content: options.content,
			buttons: options.buttons
		});
		wwiseOptions.overlay = true;
		wwiseOptions.keepOverlay = options.keepOverlay;
		wwiseOptions.clickOverlayToClose = false;
		wwiseOptions.animation = options.animation;
		wwiseOptions.zIndex = options.zIndex;

		this.wwise = new Window(wwiseOptions);
	}

	constructContent(options) {
		let dom = Utility.createDiv('modal');
		let main = Utility.createDomTree({
			dom: Utility.createDiv('main ' + options.type),
			children: [ 
				Utility.createDiv(null, Utility.makeIconHTML(options.type)),
				Utility.createDiv('title', options.title),
				Utility.createDiv('text', options.text)
			]
		});

		this.buttonArr = Utility.standardizeButtons(this, options);
		let buttons = Utility.makeButtons(this.buttonArr);

		// Content
		let content = null;
		if(options.content) {
			if(typeof options.content === 'string') {
				content = Utility.createDiv(null, options.content);
			} else {
				content = options.content;
			}
		}

		// Operations
		let operation = null;

		if(buttons.innerHTML) {
			operation = Utility.createDomTree({
				dom: Utility.createDiv('operation ' + options.type),
				children: [ buttons ]
			});
		}

		// Border radius
		if(!content && !operation) {
			main.classList.add('no-op');
		}
		
		return Utility.createDomTree({
			dom: dom,
			children: [ main, content, operation ]
		});
	}

	open() {
		if(this.wwise.opened) {
			return;
		}

		let f = this.wwise.open();

		this.value = undefined;
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

export default Modal;