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
		setState({
			playlist: [
				...(state.playlist || []),
				song,
			],
		});
	},
};

export default StateManager;
