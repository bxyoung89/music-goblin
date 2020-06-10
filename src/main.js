// eslint-disable-next-line import/extensions
import StateManager from './stateManager.js';
import SongSearchModal from './renderers/songSearchModal.js';
import Playlist from './renderers/playlist.js';

const initialState = {
	allSongs: [],
};

StateManager.setState(initialState);

SongSearchModal.init();
Playlist.init();


window.fetch('./content.json')
	.then((response) => response.json())
	.then((content) => StateManager.setState({ allSongs: content }));
