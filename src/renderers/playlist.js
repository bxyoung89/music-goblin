import StateManager from '../stateManager.js';
import makeNodeFromHtmlString from '../makeNodeFromHtmlString.js';

const playlistSongsId = 'playlist-songs';

const initialState = {
	playlist: [],
	currentSongIndex: undefined,
};

let previousState = initialState;


const makeSongHtml = (song, index) => {
	const htmlString = `
		<div class="playlist-song" data-playlist-index="${index}">
			<button class="playlist-song-play-button">
				<img class="playlist-song-image" src="${song.image}">
				<div class="playlist-song-info">
					<div class="playlist-artist-info">
						${song.artist}
					</div>
					<div class="playlist-song-name">
						${song.name}
					</div>
				</div>
			</button>
			<button class="playlist-song-delete-button">
				<div class="playlist-x">+</div>
			</button>
		</div>
	`;
	return makeNodeFromHtmlString(htmlString);
};

const onPlayClicked = (index) => {
	StateManager.setState({
		currentSongIndex: index,
	});
};

const onDeleteClicked = (index) => {
	const { currentSongIndex, playlist } = StateManager.getState();
	let newCurrentSongIndex = currentSongIndex;
	if (currentSongIndex > index) {
		newCurrentSongIndex -= 1;
	}
	if (playlist.length === 1) {
		newCurrentSongIndex = undefined;
	}
	StateManager.setState({
		playlist: playlist.filter((song, i) => i !== index),
	});
	StateManager.changeSong(newCurrentSongIndex);
};

const render = (state) => {
	const { playlist, currentSongIndex } = state;
	const playlistHasChanged = JSON.stringify(playlist) !== JSON.stringify(previousState.playlist);
	const currentSongIndexHasChanged = currentSongIndex !== previousState.currentSongIndex;

	const playlistSongsElement = document.getElementById(playlistSongsId);

	// if playlist has changed do a full re render
	if (playlistHasChanged) {
		playlistSongsElement.innerHTML = '';
		playlist.forEach((song, index) => {
			const songHtml = makeSongHtml(song, index);
			playlistSongsElement.appendChild(songHtml);
			const playButton = document.querySelector(`[data-playlist-index="${index}"] .playlist-song-play-button`);
			playButton.addEventListener('click', () => onPlayClicked(index));
			const deleteButton = document.querySelector(`[data-playlist-index="${index}"] .playlist-song-delete-button`);
			deleteButton.addEventListener('click', () => onDeleteClicked(index));
		});
	}
	// if just current song has changed, just update the classes
	if (playlistHasChanged || currentSongIndexHasChanged) {
		const playlistSongs = document.querySelectorAll('.playlist-song');
		playlistSongs.forEach((songElement) => {
			const dataIndex = Number.parseInt(songElement.getAttribute('data-playlist-index'), 10);
			songElement.classList.remove('selected');
			if (dataIndex === currentSongIndex) {
				songElement.classList.add('selected');
			}
		});
	}

	previousState = state;
};

const Playlist = {
	render,
	init: () => {
		StateManager.setState(initialState);
		StateManager.subscribe(render);
		render(StateManager.getState());
	},
};

export default Playlist;
