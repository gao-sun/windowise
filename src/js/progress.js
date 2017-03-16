import Utility from './utility';

class Progress {
	constructor(options) {
		(options === undefined) && (options = {});

		let background = null;

		if(options.percentage) {
			(options.color) && (background = options.color);

			this.bar = Utility.createDiv('bar');
			this.dom = Utility.createDomTree({
				dom: Utility.createDiv('wwise-progress'),
				children: [ this.bar ]
			});
		} else {
			(options.color) && (background = 'linear-gradient(to right, rgba(221, 221, 221, 0), ' + options.color + ', rgba(221, 221, 221, 0))');

			this.bar = Utility.createDiv('wait');
			this.dom = Utility.createDomTree({
				dom: Utility.createDiv('wwise-progress'),
				children: [ this.bar ]
			});
		}

		this.bar.style.background = background;
	}

	set(value) {
		(value > 100) && (value = 100);
		this.bar.style.width = value + '%';
	}

}

export default Progress;