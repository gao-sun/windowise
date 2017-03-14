import Utility from './utility';

let Button = {};

Button.create = (options) => {
	let className = 'button' + (options.type ? (' ' + options.type) : '');
	let button = Utility.createDiv(className, options.text);
	button.addEventListener('click', options.onClick);
	return button;
};

export default Button;