import StateManager from '../stateManager.js';

const currentTimeId = 'current-time';
const songDurationId = 'song-duration';
const positionIndicatorKnobId = 'position-indicator-slider-knob';

// let isDraggingVolume = false;

const formatTime = (time) => {
	const timeAsInt = Math.round(time);
	const minutes = Math.floor(timeAsInt / 60) || 0;
	const seconds = (timeAsInt - minutes * 60) || 0;

	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};


const render = (state) => {
	const { currentTimestampOfSong, songDuration } = state;

	const currentTime = document.getElementById(currentTimeId);
	currentTime.innerHTML = formatTime(currentTimestampOfSong);

	const songDurationElement = document.getElementById(songDurationId);
	songDurationElement.innerHTML = formatTime(songDuration);

	const positionIndicatorKnob = document.getElementById(positionIndicatorKnobId);
	const totalWidth = positionIndicatorKnob.parentElement.getBoundingClientRect().width - 20;
	positionIndicatorKnob.style = `left: ${(currentTimestampOfSong / songDuration) * totalWidth}px`;
};

const Audio = {
	render,
	init: () => {
		StateManager.subscribe(render);
		render(StateManager.getState());
		// const volumeControlSliderKnob = document.getElementById(volumeControlSliderKnobId);
		// volumeControlSliderKnob.addEventListener('mousedown', () => {
		// 	isDraggingVolume = true;
		// });
		// document.addEventListener('mousemove', (event) => {
		// 	if (!isDraggingVolume) {
		// 		return;
		// 	}
		// 	const volumeControl = volumeControlSliderKnob.parentElement;
		// 	const boundingRect = volumeControl.getBoundingClientRect();
		// 	const { pageX } = event;
		// 	const start = boundingRect.left;
		// 	const end = boundingRect.right;
		// 	let volume = 0;
		// 	if (pageX > start) {
		// 		volume = Math.min(1, (pageX - start) / boundingRect.width);
		// 	}
		// 	if (pageX > end) {
		// 		volume = 1;
		// 	}
		// 	StateManager.setState({ volume });
		// });
		// document.addEventListener('mouseup', () => {
		// 	isDraggingVolume = false;
		// });
	},
};

export default Audio;
