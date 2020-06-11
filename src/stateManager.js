let state = {};
const subscribers = [];

const notifySubscribers = () => {
	subscribers.forEach((subscriber) => subscriber(state));
};

const setState = (newState) => {
	state = { ...state, ...newState };
	notifySubscribers();
};

const 	changeSong = (playlistIndex, play) => {
	const newState = {
		currentSongIndex: playlistIndex,
		songDuration: 0,
		currentTimestampOfSong: 0,
	};
	if (play) {
		newState.isPlaying = play;
	}
	setState(newState);
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
			setTimeout(() => changeSong(0, true));
		}
	},
	getCurrentSong: () => {
		const { currentSongIndex, playlist } = state;
		if (currentSongIndex === undefined) {
			return undefined;
		}
		return playlist[currentSongIndex];
	},
	changeSong,
};

export default StateManager;
