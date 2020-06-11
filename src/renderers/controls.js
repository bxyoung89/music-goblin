import StateManager from '../stateManager.js';
import SongSearchModal from './songSearchModal.js';

const songSearchModalLauncherId = 'song-search-modal-launcher';

const render = () => {
	// stuff
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
	},
};

export default Audio;
