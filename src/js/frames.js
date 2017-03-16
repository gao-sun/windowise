let frames = {};

// Overlay
frames['wwise-overlay-in-1'] = {
	opacity: '0',
}

frames['wwise-overlay-in-2'] = {
	opacity: '1',
}

frames['wwise-overlay-out-1'] = {
	opacity: '0',
}

// Pop
frames['wwise-pop-in-1'] = {
	transform: 'scale(0.5, 0.5)',
	'margin-top': '50px',
	opacity: '.5',
}

frames['wwise-pop-in-2'] = {
	transform: 'scale(1, 1)',
	'margin-top': '0',
	opacity: '1',
}

frames['wwise-pop-in-3'] = {
	transform: 'scale(1.05, 1.05)',
}

frames['wwise-pop-in-4'] = {
	transform: 'scale(1, 1)',
}

frames['wwise-pop-out-1'] = {
	transform: 'scale(0.25, 0.25)',
	'margin-top': '50px',
	opacity: '0',
}

// Flip

frames['wwise-flip-in-1'] = {
	transform: 'rotateX(60deg) scaleX(.5)',
	opacity: '.2',
}

frames['wwise-flip-in-2'] = {
	transform: 'none',
	opacity: '1',
}

frames['wwise-flip-out-1'] = {
	transform: 'rotateX(60deg) scaleX(.5)',
	opacity: '0',
}


// Top
frames['wwise-top-in-1'] = {
	transform: 'translateY(-30vh)',
	opacity: '.5',
}

frames['wwise-top-in-2'] = {
	transform: 'none',
	opacity: '1',
}

frames['wwise-top-out-1'] = {
	transform: 'translateY(-30vh)',
	opacity: '0',
}

// Bottom
frames['wwise-bottom-in-1'] = {
	transform: 'translateY(30vh)',
	opacity: '.5',
}

frames['wwise-bottom-in-2'] = {
	transform: 'none',
	opacity: '1',
}

frames['wwise-bottom-out-1'] = {
	transform: 'translateY(30vh)',
	opacity: '0',
}

// Left
frames['wwise-left-in-1'] = {
	transform: 'translateX(-30vw)',
	opacity: '.5',
}

frames['wwise-left-in-2'] = {
	transform: 'none',
	opacity: '1',
}

frames['wwise-left-out-1'] = {
	transform: 'translateX(-30vw)',
	opacity: '0',
}

// Right
frames['wwise-right-in-1'] = {
	transform: 'translateX(30vw)',
	opacity: '.5',
}

frames['wwise-right-in-2'] = {
	transform: 'none',
	opacity: '1',
}

frames['wwise-right-out-1'] = {
	transform: 'translateX(30vw)',
	opacity: '0',
}

// Min
frames['wwise-min-in-1'] = {
	'margin-top': '0',
	transform: 'rotateX(-60deg) scale(0.2, 1.8) translateY(80vh)',
	opacity: '.2',
}

frames['wwise-min-in-2'] = {
	transform: 'none',
	opacity: '1',
}

frames['wwise-min-out-1'] = {
	'margin-top': '30vh',
	transform: 'rotateX(-60deg) scale(0.05, 2) translateY(30vh)',
	opacity: '0',
}

export default frames;