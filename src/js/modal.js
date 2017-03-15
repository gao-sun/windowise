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

		let buttons = Utility.makeButtons(this, options);

		// Content
		let content = null;
		if(typeof options.content === 'string') {
			content = Utility.createDiv(null, options.content);
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
		let f = this.wwise.open();

		this.value = undefined;
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

export default Modal;