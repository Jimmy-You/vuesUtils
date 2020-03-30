const constFiles = require.context('.', false, /\.js$/);

let constObj = {};

constFiles.keys().forEach(key => {
	if(key === './index.js') return;
	constObj = { ...constObj, ...constFiles(key).default}
})

export default constObj;