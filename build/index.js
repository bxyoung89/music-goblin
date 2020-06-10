const fs = require('fs');
const path = require('path');

const getAllFilesInDirectory = (directoryPath) => {
	const subDirectoriesAndFiles = fs.readdirSync(directoryPath);

	const files = [];
	subDirectoriesAndFiles.forEach((subDirectoryOrFile) => {
		const totalPathOfChild = path.join(directoryPath, '/', subDirectoryOrFile);
		const isDirectory = fs.statSync(totalPathOfChild).isDirectory();
		if (!isDirectory) {
			files.push(totalPathOfChild);
			return;
		}
		const subDirectoryFiles = getAllFilesInDirectory(totalPathOfChild);
		files.push(...subDirectoryFiles);
	});

	return files;
};

const allContentFiles = getAllFilesInDirectory(path.join(__dirname, '../content'));
const allJSONFiles = allContentFiles.filter((file) => file.endsWith('.json'));
const combinedJSON = allJSONFiles.map((file, index) => {
	const fileContent = `${fs.readFileSync(file)}`;
	try {
		const parsedJSON = JSON.parse(fileContent);
		return JSON.stringify({ ...parsedJSON, id: index });
	} catch (e) {
		console.log(`Could not parse ${file}. Skipping`);
		return undefined;
	}
}).filter((file) => !!file).join(',');
const contentJSONPath = path.join(__dirname, '../content.json');
if (fs.existsSync(contentJSONPath)) {
	fs.unlinkSync(contentJSONPath);
}
fs.writeFileSync(contentJSONPath, `[${combinedJSON}]`);
