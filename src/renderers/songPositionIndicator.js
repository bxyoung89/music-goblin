import StateManager from '../stateManager.js';

const currentTimeId = 'current-time';
const songDurationId = 'song-duration';
const positionIndicatorKnobId = 'position-indicator-slider-knob';

let isDragging = false;
let wasPlaying = false;

const formatTime = (time) => {
	const timeAsInt = Math.round(time);
	const minutes = Math.floor(timeAsInt / 60) || 0;
	const seconds = (timeAsInt - minutes * 60) || 0;

	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


const render = (state) => {
	const { currentTimestampOfSong, songDuration, seekingTime } = state;

	const currentSongTime = seekingTime !== undefined ? seekingTime : currentTimestampOfSong;

	const currentTime = document.getElementById(currentTimeId);
	currentTime.innerHTML = formatTime(currentSongTime);

	const songDurationElement = document.getElementById(songDurationId);
	songDurationElement.innerHTML = formatTime(songDuration);

	const positionIndicatorKnob = document.getElementById(positionIndicatorKnobId);
	const totalWidth = positionIndicatorKnob.parentElement.getBoundingClientRect().width - 20;
	positionIndicatorKnob.style = `left: ${(currentSongTime / songDuration) * totalWidth}px`;
};

const Audio = {
	render,
	init: () => {
		StateManager.subscribe(render);
		render(StateManager.getState());
		const positionIndicatorKnob = document.getElementById(positionIndicatorKnobId);
		positionIndicatorKnob.addEventListener('mousedown', () => {
			isDragging = true;
			wasPlaying = StateManager.getState().isPlaying;
			StateManager.setState({ isPlaying: false });
		});
		document.addEventListener('mousemove', (event) => {
			if (!isDragging) {
				return;
			}
			const volumeControl = positionIndicatorKnob.parentElement;
			const boundingRect = volumeControl.getBoundingClientRect();
			const { pageX } = event;
			const start = boundingRect.left;
			const end = boundingRect.right;
			let percentage = 0;
			if (pageX > start) {
				percentage = Math.min(1, (pageX - start) / boundingRect.width);
			}
			if (pageX > end) {
				percentage = 1;
			}
			StateManager.setState({ seekingTime: StateManager.getState().songDuration * percentage });
		});
		document.addEventListener('mouseup', () => {
			if (!isDragging) {
				return;
			}
			isDragging = false;
			StateManager.setState({ isPlaying: wasPlaying, seekingTime: undefined });
		});
	},
};

export default Audio;
