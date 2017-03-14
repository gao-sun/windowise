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

export default Utility;