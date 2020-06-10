export default (htmlString) => {
	const parser = new DOMParser();
	const document = parser.parseFromString(htmlString, 'text/html');
	return document.body.firstChild;
};
