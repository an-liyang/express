const fs = require('fs')
const { resolve } = require('path')
const config = require('./config.js')

let getEnvData = config[process.argv.slice(2)[0]]
fs.readFile(resolve('./', './project.config.json'), (res, data) => {
	if (res) throw res
	console.log('拼接后的路径:', resolve('./', './project.config.json'))
	console.log(
		'当前文件的appid:',
		JSON.parse(data).appid,
		'当前环境对应的appid:',
		getEnvData.APP_ID
	)
	const dealData = JSON.parse(data)
	dealData.appid = getEnvData.APP_ID
	console.log('修改后当前文件的appid:', dealData.appid)
	fs.writeFile(
		resolve('./', './project.config.json'),
		JSON.stringify(dealData),
		'utf8',
		(res) => {
			if (res) throw res
			console.log('appid修改成功~')
		}
	)
})
fs.writeFile(
	'./config.js',
	`module.exports = ${JSON.stringify(getEnvData)}`,
	'utf8',
	(res) => {
		if (res) throw res
		console.log('地址修改成功~')
	}
)
