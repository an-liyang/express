const md5 = require('md5')
export const setSignature = (timeStr, Config, requestData) => {
	const reData = requestData?JSON.stringify(requestData):"";
	console.log(reData);
	let singStr = (`${Config['URL_ID']}${timeStr}${reData}${Config['URL_SECRET']}`).toUpperCase()
	// console.log('未加密---', singStr)
	// console.log('加密串---', md5(singStr))
	return md5(singStr).toUpperCase()
}
