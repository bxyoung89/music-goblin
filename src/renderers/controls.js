import StateManager from '../stateManager.js';
import SongSearchModal from './songSearchModal.js';

const songSearchModalLauncherId = 'song-search-modal-launcher';
const previousButtonId = 'previous-button';
const playButtonId = 'play-button';
const nextButtonId = 'next-button';


const render = (state) => {
	const { playlist, currentSongIndex, isPlaying } = state;

	const previousButton = document.getElementById(previousButtonId);
	previousButton.disabled = playlist.length === 0 || currentSongIndex === 0;

	const playButton = document.getElementById(playButtonId);
	playButton.firstElementChild.src = isPlaying ? './src/images/play-triangle-outline.svg' : './src/images/pause-multimedia-outlined-button.svg';
	playButton.disabled = playlist.length === 0;

	const nextButton = document.getElementById(nextButtonId);
	nextButton.disabled = playlist.length === 0 || currentSongIndex === playlist.length -1;
};

const Audio = {
	render,
	init: () => {
		StateManager.setState({
			isPlaying: false,
		});
		StateManager.subscribe(render);
		render(StateManager.getState());
		const songSearchModalLauncher = document.getElementById(songSearchModalLauncherId);
		songSearchModalLauncher.addEventListener('click', () => {
			SongSearchModal.open();
		});

		const previousButton = document.getElementById(previousButtonId);
		previousButton.addEventListener('click', () => {
			const { currentSongIndex } = StateManager.getState();
			StateManager.changeSong(currentSongIndex - 1);
		});

		const playButton = document.getElementById(playButtonId);
		playButton.addEventListener('click', () => {
			const { isPlaying } = StateManager.getState();
			StateManager.setState({ isPlaying: !isPlaying });
		});

		const nextButton = document.getElementById(nextButtonId);
		nextButton.addEventListener('click', () => {
			const { currentSongIndex } = StateManager.getState();
			StateManager.changeSong(currentSongIndex + 1);
		});
	},
};

export default Audio;
