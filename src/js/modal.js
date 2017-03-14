import Utility from './utility';
import Window from './window';
import Button from './button';

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

		// Buttons 
		let buttons = [];

		if(options.buttons === undefined) {
			if(options.type == 'caution' || options.type == 'info') {
				buttons.push(
					Button.create({
						text: 'Cancel',
						onClick: this.close.bind(this, 'cancel')
					})
				);
			}

			buttons.push(
				Button.create({
					text: 'OK',
					type: 'main',
					onClick: this.close.bind(this, 'ok')
				})
			);
		} else if(options.buttons) {
			if(!(options.buttons.constructor === Array)) {
				options.buttons = [options.buttons];
			}

			for(let i in options.buttons) {
				buttons.push(Button.create({
					text: options.buttons[i].text ? options.buttons[i].text : 'OK',
					type: options.buttons[i].normal ? null : 'main',
					onClick: options.buttons[i].onClick ? 
						options.buttons[i].onClick :
						this.close.bind(this, options.buttons[i].id)
				}));
			}
		}

		// Content
		let content = null;
		if(typeof options.content === 'string') {
			content = Utility.createDiv(null, options.content);
		}

		// Operations
		let operation = null;

		if(buttons.length > 0) {
			operation = Utility.createDomTree({
				dom: Utility.createDiv('operation ' + options.type),
				children: [ 
					Utility.createDomTree({
						dom: Utility.createDiv('button-wrapper'),
						children: buttons
					})
				]
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