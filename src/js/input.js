import Utility from './utility';
import Modal from './modal';

let defaultOptions = {
	showCancel: false,
	okText: 'OK',
	cancelText: 'Cancel',
	placeholder: '',
	validator: null
};

let defaultWwiseOptions = {
	type: 'info',
	keepOverlay: false,
	title: 'Input',
	text: ''
};


class Input {
	constructor(__options) {
		// Init options
		this.options = JSON.parse(JSON.stringify(defaultOptions));
		for(let i in __options) {
			(__options[i] != undefined) && (this.options[i] = __options[i]);
		}

		let options = this.options;
		let wwiseOptions = JSON.parse(JSON.stringify(defaultWwiseOptions));

		for(let i in wwiseOptions) {
			(options.hasOwnProperty(i)) && (wwiseOptions[i] = options[i]);
		}

		// Buttons
		let buttons = [];

		if(options.showCancel) {
			buttons.push({ key: 27, text: options.cancelText, normal: true, onClick: this.handleCancel.bind(this) });
		}

		buttons.push({ key: 13, text: options.okText, onClick: this.handleOk.bind(this) });
		wwiseOptions.buttons = buttons;

		// Input
		this.input = Utility.createElement('input', 'input', null, { placeholder: options.placeholder });
		this.error = Utility.createDiv('error');

		wwiseOptions.content = Utility.createDomTree({
			dom: Utility.createDiv('input-wrapper'),
			children: [ this.input, this.error ]
		});

		this.modal = new Modal(wwiseOptions);
	}

	handleCancel() {
		this.close().then(this.promiseReject.bind(this));
	}

	handleOk() {
		if(this.options.validator) {
			this.options.validator(this.input.value).then(
				() => { this.close().then(this.promiseResolve.bind(this, this.input.value)); },
				(msg) => { this.error.innerText = msg; }
			);

			return;
		}

		this.close().then(this.promiseResolve.bind(this, this.input.value));
	}

	open() {
		if(this.modal.wwise.opened) {
			return;
		}

		let f = this.modal.open();
		this.input.value = '';
		this.error.innerText = '';
		this.input.focus();
		this.promise = new Promise((resolve, reject) => { 
			this.promiseResolve = resolve; 
			this.promiseReject = reject; 
		});

		return f;
	}

	close() {
		if(!this.modal.wwise.opened) {
			return;
		}

		return this.modal.close();
	}

	getPromise() {
		return this.promise;
	}
}

export default Input;