import { Frame } from 'animatorjs';
import frames from './frames';

let Animation = {};

Animation.overlay_in = [
	new Frame(frames['wwise-overlay-in-1'], 0),
	new Frame(frames['wwise-overlay-in-2'], 400)
];

Animation.overlay_out = [
	new Frame(frames['wwise-overlay-out-1'], 300)
];

Animation.pop_in = [
	new Frame(frames['wwise-pop-in-1'], 0),
	new Frame(frames['wwise-pop-in-2'], { duration: 200, 'timing-function': 'ease-in' }),
	new Frame(frames['wwise-pop-in-3'], { duration: 100, 'timing-function': 'linear' }),
	new Frame(frames['wwise-pop-in-4'], { duration: 100, 'timing-function': 'linear' })
];

Animation.pop_out = [
	new Frame(frames['wwise-pop-out-1'], { duration: 250, 'timing-function': 'ease-in' })
];

Animation.flip_in = [
	new Frame(frames['wwise-flip-in-1'], 0),
	new Frame(frames['wwise-flip-in-2'], 500)
];

Animation.flip_out = [
	new Frame(frames['wwise-flip-out-1'], 400)
];

Animation.min_in = [
	new Frame(frames['wwise-min-in-1'], 0),
	new Frame(frames['wwise-min-in-2'], 350)
];

Animation.min_out = [
	new Frame(frames['wwise-min-out-1'], 400)
];

let dirs = ['top', 'bottom', 'left', 'right'];
for(let i in dirs) {
	let key = dirs[i];

	Animation[key + '_in'] = [
		new Frame(frames['wwise-' + key + '-in-1'], 0),
		new Frame(frames['wwise-' + key + '-in-2'], { duration: 400, 'timing-function': 'ease-out' }),
	];

	Animation[key + '_out'] = [
		new Frame(frames['wwise-' + key + '-out-1'], { duration: 400, 'timing-function': 'ease-in' })
	];
}

export default Animation;