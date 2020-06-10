// eslint-disable-next-line import/extensions
import StateManager from './stateManager.js';
import SongSearchModal from './renderers/songSearchModal.js';
import Playlist from './renderers/playlist.js';
import CurrentSongImage from './renderers/currentSongImage.js';
import Audio from './renderers/audio.js';

const initialState = {
	allSongs: [],
};

StateManager.setState(initialState);

SongSearchModal.init();
Playlist.init();
CurrentSongImage.init();
Audio.init();


window.fetch('./content.json')
	.then((response) => response.json())
	.then((content) => StateManager.setState({ allSongs: content }));
