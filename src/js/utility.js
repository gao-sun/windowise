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

	(type == 'ok') && (href = '#003-tick');
	(type == 'error') && (href = '#002-cancel');
	(type == 'info') && (href = '#004-info-button');
	(type == 'caution') && (href = '#005-danger');
	(type == 'min') && (href = '#006-line');
	(type == 'max') && (href = '#008-plus');
	(type == 'close') && (href = '#006-close');
	(type == 'nft-close') && (href = '#001-close-1');

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

Utility.makeButtons = (modal, options) => {
	let buttons = [];

	if(options.buttons === undefined) {
		if(options.type == 'caution' || options.type == 'info') {
			buttons.push(
				Button.create({
					text: 'Cancel',
					onClick: modal.close.bind(modal, 'cancel')
				})
			);
		}

		buttons.push(
			Button.create({
				text: 'OK',
				type: 'main',
				onClick: modal.close.bind(modal, 'ok')
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
					modal.close.bind(modal, options.buttons[i].id)
			}));
		}
	}

	return Utility.createDomTree({
		dom: Utility.createDiv('button-wrapper'),
		children: buttons
	});
}

export default Utility;