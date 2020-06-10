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
		const { playlist, currentSongIndex } = state;
		setState({
			playlist: [
				...(playlist || []),
				song,
			],
			currentSongIndex: playlist.length === 0 ? 0 : currentSongIndex,
		});
	},
	getCurrentSong: () => {
		const { currentSongIndex, playlist } = state;
		if (currentSongIndex === undefined) {
			return undefined;
		}
		return playlist[currentSongIndex];
	},
};

export default StateManager;
