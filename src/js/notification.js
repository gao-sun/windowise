import Utility from './utility';
import Window from './window';

let defaultOptions = {
	type: null,
	animation: 'right',
	position: 'right top',
	noBorder: true,
	showClose: true,
	clickToClose: false,
	closeAfter: null
};

class Nft {
	constructor(__options) {
		this.options = JSON.parse(JSON.stringify(defaultOptions));
		for(let i in __options) {
			(__options[i] != undefined) && (this.options[i] = __options[i]);
		}

		this.closeHandler = this.close.bind(this);

		let options = this.options;
		let wwiseOptions = {};

		wwiseOptions.topbar = false;
		wwiseOptions.content = this.constructContent(options);
		wwiseOptions.overlay = false;
		wwiseOptions.animation = options.animation;
		wwiseOptions.position = options.position;
		wwiseOptions.margin = '10px 15px';
		wwiseOptions.noBorder = options.noBorder;
		wwiseOptions.removeBackground = true;

		this.wwise = new Window(wwiseOptions);
	}

	constructContent(options) {
		let dom = Utility.createDiv('nft' + (options.type ? (' preset ' + options.type) : ''));

		// Content
		let content = null;

		if(options.type) {
			let innerContent = null;

			if(typeof options.content === 'string') {
				innerContent = Utility.createDiv('inner-content', options.content);
			} else {
				innerContent = Utility.createDomTree({
					dom: Utility.createDiv('inner-content'), 
					children: [options.content]
				});
			}

			content = Utility.createDomTree({
				dom: Utility.createDiv('content'),
				children: [
					Utility.createDiv('state', Utility.makeIconHTML(options.type)),
					innerContent
				]
			});
		}else if(typeof options.content === 'string') {
			content = Utility.createDiv('content', options.content);
		}

		let close = null;
		if(options.showClose) {
			close = Utility.createDomTree({
				dom: Utility.createDiv('close'),
				children: [ Utility.createDiv(null, Utility.makeIconHTML('nft-close')) ]
			});

			close.addEventListener('click', this.closeHandler);
		}

		if(options.clickToClose) {
			dom.addEventListener('click', this.closeHandler);
		}
		
		return Utility.createDomTree({
			dom: dom,
			children: [ content, close ]
		});
	}

	open() {
		let f = this.wwise.open();

		this.promise = new Promise((resolve) => { this.promiseResolve = resolve; });
		this.wwise.getPromise().then(this.promiseResolve);

		if(this.options.closeAfter) {
			window.setTimeout(() => {
				this.close();
			}, this.options.closeAfter);
		}
		
		return f;
	}

	close() {
		this.wwise.close();
	}

	getPromise() {
		return this.promise;
	}
}

export default Nft;