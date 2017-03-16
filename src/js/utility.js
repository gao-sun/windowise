import Button from './button';

let Utility = {};

Utility.createElement = (tag, className, innerHTML, attributes) => {
	let dom = document.createElement(tag);

	(className) && (dom.className = className);
	(innerHTML) && (dom.innerHTML = innerHTML);
	if(attributes) {
		for(let i in attributes) {
			dom.setAttribute(i, attributes[i]);
		}
	}

	return dom;
};

Utility.createDiv = (className, innerHTML, attributes) => {
	return Utility.createElement('div', className, innerHTML, attributes);
};

Utility.createDomTree = (tree) => {
	if(!tree || !tree.hasOwnProperty('dom')) {
		return tree;
	}

	let dom = tree.dom;

	if(tree.children) {
		for(let i in tree.children) {
			if(!tree.children[i]) {
				continue;
			}

			dom.appendChild(Utility.createDomTree(tree.children[i]));
		}
	}

	return dom;
};

Utility.removeElement = (dom) => {
	(dom != null) && (dom.parentNode.removeChild(dom));
};

Utility.appendToBody = (dom) => {
	document.body.appendChild(dom);
};

Utility.makeIconHTML = (type) => {
	let href = '';

	(type == 'ok') && (href = '#tick');
	(type == 'error') && (href = '#cancel');
	(type == 'info') && (href = '#info-button');
	(type == 'caution') && (href = '#danger');
	(type == 'min') && (href = '#line');
	(type == 'close') && (href = '#close');

	return `<svg class="icon ${ type }"><use xlink:href="${ href }" /></svg>`;
};

Utility.makeNftContent = (options) => {
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

		if(options.type == 'text') {
			content = Utility.createDomTree({
				dom: Utility.createDiv('content text'),
				children: [ innerContent ]
			});
		} else {
			content = Utility.createDomTree({
				dom: Utility.createDiv('content'),
				children: [
					Utility.createDiv('state', Utility.makeIconHTML(options.type)),
					innerContent
				]
			});
		}
	} else if(typeof options.content === 'string') {
		content = Utility.createDiv('content', options.content);
	}

	return content;
};

Utility.standardizeButtons = (modal, options) => {
	let buttons = [];	

	if(options.buttons === undefined) {
		if(options.type == 'caution' || options.type == 'info') {
			buttons.push({
				key: 27,
				text: 'Cancel',
				onClick: modal.close.bind(modal, 'cancel')
			});
		}

		buttons.push({
			key: 13,
			text: 'OK',
			type: 'main',
			onClick: modal.close.bind(modal, 'ok')
		});

		return buttons;
	}

	buttons = options.buttons;

	if(!(buttons.constructor === Array)) {
		buttons = [buttons];
	}

	for(let i in buttons) {
		(!buttons[i].onClick) && (buttons[i].onClick = modal.close.bind(modal, buttons[i].id));
	}

	return buttons;
};

Utility.makeButtons = (buttonArr) => {
	let buttons = [];

	if(buttonArr) {
		for(let i in buttonArr) {
			buttons.push(Button.create({
				text: buttonArr[i].text ? buttonArr[i].text : 'OK',
				type: buttonArr[i].normal ? null : 'main',
				onClick: buttonArr[i].onClick
			}));
		}
	}

	return Utility.createDomTree({
		dom: Utility.createDiv('button-wrapper'),
		children: buttons
	});
}

Utility.bindButtonKeyEvents = (buttonArr) => {
	let handler = (event) => {
		for(let i in buttonArr) {
			if(buttonArr[i].key === event.keyCode) {
				buttonArr[i].onClick();
				return;
			}
		}
	};
	window.addEventListener('keydown', handler);
	return handler;
};

Utility.unbindButtonKeyEvents = (handler) => {
	window.removeEventListener('keydown', handler);
};

export default Utility;