import { Queue } from 'animatorjs';
import Animation from './animation';
import Utility from './utility';

let defaultOptions = {
	animation: 'pop',
	topbar: {
		showClose: true,
		showMin: false
	},
	keepOverlay: false,
	position: 'center',
	overlay: false,
	clickOverlayToClose: true,
	removeBackground: false,
};

class Window {
	constructor(options) {
		// Init options
		this.options = JSON.parse(JSON.stringify(defaultOptions));
		for(let i in options) {
			(options[i] != undefined) && (this.options[i] = options[i]);
		}

		let position = this.options.position;
		if(position.indexOf(' ') == -1) {
			if(position == 'left' || position == 'right') {
				position = position + ' center';
			} else if(position == 'top' || position == 'bottom') {
				position = 'center ' + position;
			} else {
				position = position + ' ' + position;
			}
		}
		this.options.position = position;

		// Overlay
		if(this.options.overlay) {
			let cuurentOverlay = document.getElementsByClassName('wwise-overlay');

			if(cuurentOverlay.length) {
				this.overlay = cuurentOverlay[0];
				this.hasOverlay = true;
			} else {
				this.overlay = Utility.createDiv('wwise-overlay');
			}
			
			this.overlayClickHandler = this.close.bind(this, undefined);
		} else {
			this.options.clickOverlayToClose = false;
		}
		
		// Topbar
		let contentClassName = 'content';
		if(this.options.topbar) {
		// Topbar Controls
			let controls = [];

			if(this.options.topbar.showMin) {
				controls.push(Utility.createDiv(null, Utility.makeIconHTML('min')));
				controls[controls.length - 1].addEventListener('click', this.min.bind(this));
			}

			if(this.options.topbar.showClose) {
				controls.push(Utility.createDiv(null, Utility.makeIconHTML('close')));
				controls[controls.length - 1].addEventListener('click', this.close.bind(this, undefined));
			}
			
			let titleDom = null;

			if(typeof this.options.title === 'string') {
				titleDom = Utility.createDiv('title', this.options.title);
			} else {
				titleDom = Utility.createDomTree({
					dom: Utility.createDiv('title'),
					children: [ this.options.title ]
				});
			}

			this.topbar = Utility.createDomTree({ 
				dom: Utility.createDiv('topbar'),
				children: [
					{
						dom: Utility.createDiv('control'),
						children: controls.map(value => { return { dom: value }; })
					},
					{
						dom: titleDom
					},
					{
						dom: Utility.createDiv('clear')
					}
				]
			});
		} else {
			contentClassName += ' no-topbar';
		}

		// Content
		if(typeof this.options.content === 'string') {
			this.content = Utility.createDomTree({
				dom: Utility.createDiv(contentClassName, this.options.content)
			});
		} else {
			this.content = Utility.createDomTree({
				dom: Utility.createDiv(contentClassName),
				children: [ this.options.content ]
			});
		}
		(this.options.removeBackground) && (this.content.style.background = 'initial');

		// Window
		this.window = Utility.createDomTree({ 
			dom: Utility.createDiv('wwise default'),
			children: [
				this.topbar,
				this.content
			]
		});

		// Wrapper
		this.wrapper = Utility.createDomTree({
			dom: Utility.createDiv('wwise-wrapper'),
			children: [ this.window ]
		});

		// Whole DOM
		this.dom = Utility.createDomTree({
			dom: Utility.createDiv(),
			children: [ this.wrapper ]
		});

		// Position
		let positions = this.options.position.split(' ');
		let translateX = -50, translateY = -50;

		if(positions[0] == 'left') {
			translateX = 0;
			this.wrapper.classList.add('left');
		} else if(positions[0] == 'right') {
			translateX = -100;
			this.wrapper.classList.add('right');
		} else if(positions[0] == 'center') {
			this.wrapper.classList.add('h-center');
		} else {
			this.wrapper.style.left = positions[0];
		}

		if(positions[1] == 'top') {
			translateY = 0;
			this.wrapper.classList.add('top');
		} else if(positions[1] == 'bottom') {
			translateY = -100;
			this.wrapper.classList.add('bottom');
		} else if(positions[1] == 'center') {
			this.wrapper.classList.add('v-center');
		} else {
			this.wrapper.style.top = position[1];
		}

		this.window.style.transform = `translate(${ translateX }%, ${ translateY }%)`;

		if(this.options.style) {
			for(let i in this.options.style) {
				this.window.style[i] = this.options.style[i];
			}
		}

		if(this.options.margin) {
			this.wrapper.style.margin = this.options.margin;
		}

		// Border
		if(this.options.noBorder) {
			this.window.classList.add('no-border');
		}

		// Draggable
		if(this.options.draggable) {
			this.draggable();
		}
	}

	open(fromMin) {
		if(this.opened) {
			return;
		}

		this.promise = new Promise((resolve) => { this.promiseResolve = resolve; });
		this.appendDoms();
		this.opened = true;

		if(this.options.clickOverlayToClose) {
			this.overlay.addEventListener('click', this.overlayClickHandler);
		}

		let animation = fromMin ? 'min' : this.options.animation;

		if(animation) {
			if(animation == 'min' || animation == 'flip') {
				this.dom.classList.add('wwise-perspective');
			}

			let q = [ (new Queue(this.wrapper, Animation[animation + '_in'], { instant: true, applyOnEnd: true })).getPromise() ];

			if(this.options.overlay && !this.hasOverlay) {
				q.push((new Queue(this.overlay, Animation.overlay_in, { instant: true, applyOnEnd: true })).getPromise());
			}

			return Promise.all(q).then(() => {
				this.dom.classList.remove('wwise-perspective');
			});
		}

		return Promise.resolve();
	}

	close(toMin) {
		if(!this.opened) {
			return;
		}

		this.opened = false;

		let animation = toMin ? 'min' : this.options.animation;

		(this.overlay) && (this.overlay.removeEventListener('click', this.overlayClickHandler));

		if(animation) {
			if(animation == 'min' || animation == 'flip') {
				this.dom.classList.add('wwise-perspective');
			}

			let q = [ (new Queue(this.wrapper, Animation[animation + '_out'], { instant: true, applyOnEnd: true })).getPromise() ];

			if(this.options.overlay && !this.options.keepOverlay) {
				q.push((new Queue(this.overlay, Animation.overlay_out, { instant: true, applyOnEnd: true })).getPromise());
			}

			return Promise.all(q).then(() => {
				this.removeDoms();
				this.dom.classList.remove('wwise-perspective');
				this.promiseResolve();
			});
		}
		
		this.removeDoms();
		return Promise.resolve();
	}

	min() {
		this.close(true);
	}

	resume() {
		this.open(true)
	}

	getPromise() {
		return this.promise;
	}

	appendDoms() {
		(this.options.overlay && !this.hasOverlay) && (Utility.appendToBody(this.overlay));
		Utility.appendToBody(this.dom);
	}

	removeDoms() {
		Utility.removeElement(this.dom);
		(!this.options.keepOverlay) && (Utility.removeElement(this.overlay));
	}

	// Draggable functions
	draggable(enabled = true) {
		if(!this.topbar) {
			return;
		}

		if(enabled) {
			this.draggableMouseMoveHandler = this.handleDraggableMouseMove.bind(this);
			this.draggableMouseDownHandler = this.handleDraggableMouseDown.bind(this);
			this.draggableMouseUpHandler = this.handleDraggableMouseUp.bind(this);
			this.draggableMouseOutHandler = this.handleDraggableMouseOut.bind(this);

			window.addEventListener('mousemove', this.draggableMouseMoveHandler);
			window.addEventListener('mouseout', this.draggableMouseOutHandler);
			this.topbar.addEventListener('mousedown', this.draggableMouseDownHandler);
			window.addEventListener('mouseup', this.draggableMouseUpHandler);
		} else {
			window.removeEventListener('mousemove', this.draggableMouseMoveHandler);
			window.removeEventListener('mouseout', this.draggableMouseOutHandler);
			this.topbar.removeEventListener('mousedown', this.draggableMouseDownHandler);
			window.removeEventListener('mouseup', this.draggableMouseUpHandler);
		}
	}

	handleDraggableMouseMove(event) {
		if(this.inDragging) {
			let delta = { x: event.clientX - this.dragPrev.x, y: event.clientY - this.dragPrev.y };
			let style = window.getComputedStyle(this.wrapper);
			let option = this.options.draggable;
			let left = parseFloat(style.left);
			let top = parseFloat(style.top);

			// Handle percentage for Safari
			// http://stackoverflow.com/questions/22034989/is-there-a-bug-in-safari-with-getcomputedstyle
			if(style.left.indexOf('%') != -1) {
				left = style.left;
				left = left.substr(0, left.length - 1);
				left = parseInt(left);

				let w = window,
					d = document,
					e = d.documentElement,
					g = d.getElementsByTagName('body')[0],
					width = w.innerWidth || e.clientWidth || g.clientWidth;

				left = (left * width) / 100;
			}

			if(style.top.indexOf('%') != -1) {
				top = style.top;
				top = top.substr(0, top.length - 1);
				top = parseInt(top);

				let w = window,
					d = document,
					e = d.documentElement,
					g = d.getElementsByTagName('body')[0],
					height = w.innerHeight || e.clientHeight || g.clientHeight;

				top = (top * height) / 100;
			}

			// Move
			if(option == true || option == 'horizontal') {
				this.wrapper.style.left = (left + delta.x) + 'px';
			}

			if(option == true || option == 'vertical') {
				this.wrapper.style.top = (top + delta.y) + 'px';
			}

			this.dragPrev = { x: event.clientX, y: event.clientY };
		}
	}

	handleDraggableMouseDown(event) {
		this.inDragging = true;
		this.dragPrev = { x: event.clientX, y: event.clientY };
	}

	handleDraggableMouseUp(event) {
		this.inDragging = false;
	}

	handleDraggableMouseOut(event) {
		let target = event.relatedTarget;

		if(!target || target.nodeName == 'HTML') {
			this.inDragging = false;
		}
	}
}

export default Window;