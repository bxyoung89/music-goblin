let state = {};
const subscribers = [];

const notifySubscribers = () => {
	subscribers.forEach((subscriber) => subscriber(state));
};

const setState = (newState) => {
	state = { ...state, ...newState };
	notifySubscribers();
};

const StateManager = {
	getState: () => state,
	setState,
	subscribe: (callback) => subscribers.push(callback),
	addSongToPlaylist: (song) => {
		const { playlist } = state;
		setState({
			playlist: [
				...(playlist || []),
				song,
			],
		});
		if (playlist.length === 0) {
			setTimeout(() => this.changeSong(0));
		}
	},
	getCurrentSong: () => {
		const { currentSongIndex, playlist } = state;
		if (currentSongIndex === undefined) {
			return undefined;
		}
		return playlist[currentSongIndex];
	},
	changeSong: (playlistIndex) => {
		this.setState({
			currentSongIndex: playlistIndex,
			songTime: 0,
			songLength: 0,
			songPosition: 0,
		});
	},
};

export default StateManager;
