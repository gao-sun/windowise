import { Frame } from 'animatorjs';

let Animation = {};

Animation.overlay_in = [
	new Frame('.wwise-overlay-in-1', 0),
	new Frame('.wwise-overlay-in-2', 300)
];

Animation.overlay_out = [
	new Frame('.wwise-overlay-out-1', 300)
];

Animation.pop_in = [
	new Frame('.wwise-pop-in-1', 0),
	new Frame('.wwise-pop-in-2', { duration: 200, 'timing-function': 'ease-in' }),
	new Frame('.wwise-pop-in-3', { duration: 100, 'timing-function': 'linear' }),
	new Frame('.wwise-pop-in-4', { duration: 100, 'timing-function': 'linear' })
];

Animation.pop_out = [
	new Frame('.wwise-pop-out-1', { duration: 250, 'timing-function': 'ease-in' })
];

Animation.flip_in = [
	new Frame('.wwise-flip-in-1', 0),
	new Frame('.wwise-flip-in-2', 500)
];

Animation.flip_out = [
	new Frame('.wwise-flip-out-1', 400)
];

Animation.min_in = [
	new Frame('.wwise-min-in-1', 0),
	new Frame('.wwise-min-in-2', 350)
];

Animation.min_out = [
	new Frame('.wwise-min-out-1', 400)
];

let dirs = ['top', 'bottom', 'left', 'right'];
for(let i in dirs) {
	let key = dirs[i];

	Animation[key + '_in'] = [
		new Frame('.wwise-' + key + '-in-1', 0),
		new Frame('.wwise-' + key + '-in-2', 500),
	];

	Animation[key + '_out'] = [
		new Frame('.wwise-' + key + '-out-1', 400)
	];
}

export default Animation;