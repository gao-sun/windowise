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

	(type == 'min') && (href = '#001-line');
	(type == 'max') && (href = '#002-plus');
	(type == 'close') && (href = '#003-close');
	return `<svg class="icon ${ type }"><use xlink:href="${ href }" /></svg>`;
};

export default Utility;