import StateManager from '../stateManager.js';

let currentSong;
let currentHowl;
let previousPlay = false;

const idToHowlMap = {};

const render = (state) => {
	Howler.volume(state.volume); // start volume at 50 for tonight.
	const newSong = StateManager.getCurrentSong();
	const songHasNotChanged = JSON.stringify(currentSong) === JSON.stringify(newSong);
	if (previousPlay !== state.isPlaying && currentHowl) {
		previousPlay = state.isPlaying;
		if (state.isPlaying) {
			currentHowl.play();
		} else {
			currentHowl.stop();
		}
	}
	if (songHasNotChanged) {
		return;
	}
	if (currentHowl) {
		currentHowl.stop();
		currentHowl = undefined;
	}
	currentSong = newSong;
	// saving the howl prevents us from downloading the mp3 again.
	const savedHowl = idToHowlMap[currentSong.id];
	if (savedHowl) {
		currentHowl = savedHowl;
	} else {
		currentHowl = new Howl({
			src: currentSong.audio,
			html5: true,
		});
		idToHowlMap[currentSong.id] = currentHowl;
	}

	// todo time stuff in here
	// https://github.com/goldfire/howler.js#documentation
	// https://github.com/goldfire/howler.js/blob/master/examples/player/player.js#L42
	if (state.isPlaying) {
		previousPlay = true;
		currentHowl.play();
	}
};

const Audio = {
	render,
	init: () => {
		StateManager.setState({
			volume: 0.1,
			isPlaying: false,
		});
		StateManager.subscribe(render);
		render(StateManager.getState());
	},
};

export default Audio;
