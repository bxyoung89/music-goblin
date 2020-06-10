import StateManager from '../stateManager.js';

const imageIds = ['current-song-image', 'current-song-image-background'];
const logoPath = './src/logo-placeholder.jpg';

let previousImage = '';

const render = () => {
	const currentSong = StateManager.getCurrentSong();
	const newImage = currentSong ? currentSong.image : logoPath;

	if (newImage === previousImage) {
		return;
	}

	previousImage = newImage;
	imageIds.forEach((imageId) => {
		const imageElement = document.getElementById(imageId);
		imageElement.src = newImage;
	});
};

const Playlist = {
	render,
	init: () => {
		StateManager.subscribe(render);
		render(StateManager.getState());
	},
};

export default Playlist;
