import { Queue } from 'animatorjs';
import Animation from './animation';
import Utility from './Utility';

class Window {
	constructor(options) {
		// Init options
		this.options = options;

		if(options.animation == undefined) {
			this.options.animation = 'fade';
		}

		// Init position
		if(!options.position) {
			this.options.position = 'center';
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

		// Init overlay
		if(options.overlay && options.clickOverlayToClose == undefined) {
			this.options.clickOverlayToClose = true;
		}

		// Overlay
		if(this.options.overlay) {
			this.overlay = Utility.createDiv('wwise-overlay');
			if(this.options.clickOverlayToClose) {
				this.overlay.addEventListener('click', this.close.bind(this, undefined));
			}
		}

		// Topbar Controls
		let controls = [];

		if(this.options.showMinButton) {
			controls.push(Utility.createDiv(null, Utility.makeIconHTML('min')));
			controls[controls.length - 1].addEventListener('click', this.min.bind(this));
		}

		controls.push(Utility.createDiv(null, Utility.makeIconHTML('close')));
		controls[controls.length - 1].addEventListener('click', this.close.bind(this, undefined));

		// Topbar
		let contentClassName = 'content';

		if(this.options.topbar == undefined || this.options.topbar) {
			this.topbar = Utility.createDomTree({ 
				dom: Utility.createDiv('topbar'),
				children: [
					{
						dom: Utility.createDiv('control'),
						children: controls.map(value => { return { dom: value }; })
					},
					{
						dom: Utility.createDiv('title', this.options.title)
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
		this.content = Utility.createDomTree({
			dom: Utility.createDiv(contentClassName, this.options.content)
		});

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
			children: [ this.overlay, this.wrapper ]
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

		if(this.options.margin) {
			this.wrapper.style.margin = this.options.margin;
		}

		// Size
		if(this.options.width) {
			this.window.style.width = this.options.width;
		}

		if(this.options.height) {
			this.window.style.height = this.options.height;
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

		Utility.appendToBody(this.dom);
		this.opened = true;

		let animation = fromMin ? 'min' : this.options.animation;

		if(animation) {
			if(animation == 'min') {
				this.dom.classList.add('wwise-perspective');
			}

			let q = [ (new Queue(this.wrapper, Animation[animation + '_in'], { instant: true, applyOnEnd: true })).getPromise() ];

			if(this.options.overlay) {
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

		if(animation) {
			if(animation == 'min') {
				this.dom.classList.add('wwise-perspective');
			}

			let q = [ (new Queue(this.wrapper, Animation[animation + '_out'], { instant: true, applyOnEnd: true })).getPromise() ];

			if(this.options.overlay) {
				q.push((new Queue(this.overlay, Animation.overlay_out, { instant: true, applyOnEnd: true })).getPromise());
			}

			return Promise.all(q).then(() => {
				Utility.removeElement(this.dom);
				this.dom.classList.remove('wwise-perspective');
			});
		}
		
		Utility.removeElement(this.dom);
		return Promise.resolve();
	}

	min() {
		this.close(true);
	}

	resume() {
		this.open(true)
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