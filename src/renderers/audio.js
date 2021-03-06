import StateManager from '../stateManager.js';

let currentSong;
let currentHowl;
let previousPlay = false;

const idToHowlMap = {};

const render = (state) => {
	Howler.volume(state.volume); // start volume at 50 for tonight.
	const newSong = StateManager.getCurrentSong();
	const songHasNotChanged = JSON.stringify(currentSong) === JSON.stringify(newSong);
	if (state.seekingTime && currentHowl) {
		currentHowl.seek(state.seekingTime);
	}
	if (previousPlay !== state.isPlaying && currentHowl) {
		previousPlay = state.isPlaying;
		if (state.isPlaying) {
			currentHowl.play();
		} else {
			currentHowl.pause();
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
		const updateOnAnimationFrame = () => {
			const currentPosition = currentHowl.seek() || 0;
			StateManager.setState({
				currentTimestampOfSong: currentPosition,
			});
			if (!StateManager.getState().isPlaying) {
				return;
			}
			window.requestAnimationFrame(() => { updateOnAnimationFrame(); });
		};
		currentHowl = new Howl({
			src: currentSong.audio,
			html5: true,
			onend: () => {
				const { currentSongIndex, playlist } = StateManager.getState();
				const newIndex = currentSongIndex + 1;
				if (newIndex === playlist.length) {
					return;
				}
				StateManager.changeSong(newIndex);
			},
			onplay: () => {
				const duration = currentHowl.duration();
				StateManager.setState({
					songDuration: duration,
				});
				window.requestAnimationFrame(() => { updateOnAnimationFrame(); });
			},
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
