// eslint-disable-next-line import/extensions
import StateManager from './stateManager.js';
import SongSearchModal from './renderers/songSearchModal.js';

const initialState = {
	playlist: [],
	currentSong: undefined,
	allSongs: [],
};

StateManager.setState(initialState);

SongSearchModal.init();


window.fetch('./content.json')
	.then((response) => response.json())
	.then((content) => StateManager.setState({ allSongs: content }));
