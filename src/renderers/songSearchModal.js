import StateManager from '../stateManager.js';
import makeNodeFromHtmlString from '../makeNodeFromHtmlString.js';

const modalId = 'song-search-modal';
const closeButtonId = 'song-search-close-button';
const inputId = 'song-search-input';
const songListId = 'song-list';
const noSongsIndicatorId = 'song-search-empty';

let hasRenderedAllSongs = false;

const makeSongHtml = (song) => {
	const htmlString = `
		<button class="song-search-song" data-search-song-id="${song.id}">
			<img class="song-search-song-image" src="${song.image}">
			<div class="song-search-song-info">
				<div class="song-search-artist-name">
					${song.artist}
				</div>
				<div class="song-search-song-name">
					${song.name}
				</div>
			</div>
		</button>
	`;
	return makeNodeFromHtmlString(htmlString);
};

const handleSongClick = (event) => {
	const songId = Number.parseInt(event.currentTarget.getAttribute('data-search-song-id'), 10);
	const { allSongs } = StateManager.getState();
	const matchingSong = allSongs.find((song) => song.id === songId);
	if (matchingSong) {
		StateManager.addSongToPlaylist(matchingSong);
	}
};

const render = (state) => {
	const modal = document.getElementById(modalId);
	const { open, searchText } = state.songSearch;
	if (!open) {
		modal.style.display = 'none';
		return;
	}
	modal.style.display = '';
	if (!hasRenderedAllSongs && state.allSongs.length > 0) {
		hasRenderedAllSongs = true;
		const songList = document.getElementById(songListId);
		const { allSongs } = state;
		allSongs.forEach((song) => {
			const songHtml = makeSongHtml(song);
			songList.appendChild(songHtml);
			songHtml.addEventListener('click', handleSongClick);
		});
	}
	const { allSongs } = state;
	const idToHidden = {};
	allSongs.forEach((song) => idToHidden[song.id] = song.name.toLowerCase().indexOf(searchText.trim().toLowerCase()) === -1 && song.name.toLowerCase().indexOf(searchText.trim().toLowerCase()) === -1);
	Object.keys(idToHidden).forEach((id) => {
		const hidden = searchText.trim() !== '' && idToHidden[id];
		const element = document.querySelector(`[data-search-song-id="${id}"]`);
		element.style.display = hidden ? 'none' : '';
	});
	const hiddenCount = Object.values(idToHidden).filter((value) => value).length;
	const noSongsIndicator = document.getElementById(noSongsIndicatorId);
	noSongsIndicator.style.display = hiddenCount === allSongs.length ? '' : 'none';
};

const close = () => {
	StateManager.setState({
		songSearch: {
			open: false,
			searchText: '',
		},
	});
	const input = document.getElementById(inputId);
	input.value = '';
};

const onInputChange = (event) => {
	const state = StateManager.getState();
	StateManager.setState({
		songSearch: {
			...state.songSearch,
			searchText: event.target.value,
		},
	});
};

const SongSearchModal = {
	render,
	init: () => {
		StateManager.setState({
			songSearch: {
				open: true,
				searchText: '',
			},
		});
		StateManager.subscribe(render);
		const closebutton = document.getElementById(closeButtonId);
		closebutton.addEventListener('click', close);
		const input = document.getElementById(inputId);
		input.addEventListener('keyup', onInputChange);

		render(StateManager.getState());
	},
	open: () => {
		StateManager.setState({
			songSearch: {
				open: true,
				searchText: '',
			},
		});
		const input = document.getElementById(inputId);
		input.value = '';
	},
	close,
};

export default SongSearchModal;
