import StateManager from '../stateManager.js';

let currentSong;
let currentHowl;

const idToHowlMap = {};

const render = () => {
	const newSong = StateManager.getCurrentSong();
	if (JSON.stringify(currentSong) === JSON.stringify(newSong)) {
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

	Howler.volume(0.1); // start volume at 50 for tonight.
	// todo time stuff in here
	// https://github.com/goldfire/howler.js#documentation
	// https://github.com/goldfire/howler.js/blob/master/examples/player/player.js#L42
	currentHowl.play();
};

const Audio = {
	render,
	init: () => {
		StateManager.setState({
			volume: 50,
		});
		StateManager.subscribe(render);
		render(StateManager.getState());
	},
};

export default Audio;
