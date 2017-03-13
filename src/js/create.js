import Window from './window';
import Utility from './Utility';

let create = (dom, options) => {
	let title = dom.getElementsByClassName('title')[0].innerHTML;
	let content = dom.getElementsByClassName('content')[0].innerHTML;

	Utility.removeElement(dom);

	options.title = title;
	options.content = content;

	return new Window(options);
};

export default create;