import StateManager from '../stateManager.js';

const volumeControlSliderKnobId = 'volume-control-slider-knob';
const volumeControlIconId = 'volume-control-icon';

let isDraggingVolume = false;

const getVolumeIconFromVolume = (volume) => {
	if (volume === 0) {
		return './src/images/speaker-silent-outline-with-a-cross.svg';
	}
	if (volume < 0.33) {
		return './src/images/speaker-volume-1.svg';
	}
	if (volume < 0.66) {
		return './src/images/speaker-volume-2.svg';
	}
	return './src/images/speaker-volume-3.svg';
};

const render = (state) => {
	const { volume } = state;
	const volumeControlIcon = document.getElementById(volumeControlIconId);
	volumeControlIcon.src = getVolumeIconFromVolume(volume);

	const volumeControlSliderKnob = document.getElementById(volumeControlSliderKnobId);
	const volumeControl = volumeControlSliderKnob.parentElement;
	const volumeControlWidth = volumeControl.getBoundingClientRect().width;
	volumeControlSliderKnob.style = `left: ${(volumeControlWidth - 20) * volume}px`;
};

const Audio = {
	render,
	init: () => {
		StateManager.subscribe(render);
		render(StateManager.getState());
		const volumeControlSliderKnob = document.getElementById(volumeControlSliderKnobId);
		volumeControlSliderKnob.addEventListener('mousedown', () => {
			isDraggingVolume = true;
		});
		document.addEventListener('mousemove', (event) => {
			if (!isDraggingVolume) {
				return;
			}
			const volumeControl = volumeControlSliderKnob.parentElement;
			const boundingRect = volumeControl.getBoundingClientRect();
			const { pageX } = event;
			const start = boundingRect.left;
			const end = boundingRect.right;
			let volume = 0;
			if (pageX > start) {
				volume = Math.min(1, (pageX - start) / boundingRect.width);
			}
			if (pageX > end) {
				volume = 1;
			}
			StateManager.setState({ volume });
		});
		document.addEventListener('mouseup', () => {
			isDraggingVolume = false;
		});
	},
};

export default Audio;
