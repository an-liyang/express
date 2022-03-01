import { setSignature } from './setSignature.js'
import { login } from './../functional/loginAuth.js'
const Config = require('./../../config.js')
const setTime = new Date().getTime()

class Http {
	constructor() {
		this.baseUrl = Config.API_URL
	}
	request(url, data, method) {
		const _this = this
		let getUrlFromSig = `${url}/${Config['URL_ID']}/${setTime}/${setSignature(
			setTime,
			Config,
			data
		)}`
		console.log('请求的完整地址：',`${_this.baseUrl}${getUrlFromSig}`)
		return new Promise((resolve, reject) => {
			wx.request({
				url: `${_this.baseUrl}${getUrlFromSig}`, //域名接口地址
				timeout:5000,
				method: method, //配置method方法
				dataType: 'json',
				responseType: 'text',
				data: method === 'GET' ? data : JSON.stringify(data), //如果是GET,GET自动让数据成为query String,其他方法需要让options.data转化为字符串
				header: {
					token: wx.getStorageSync('token'),
					'Content-Type': 'application/json',
					Authorization: '',
				},
				success(request) {
					// console.log('request=======',request)
					//监听成功后的操作
					if (request.statusCode == 404) {
						reject(request)
						return
					} else {
						// token过期
						if (request.data.code == 300 || request.data.code == 301) {
							console.log('过期token0----------',wx.getStorageSync('token'),url)
							if(wx.getStorageSync('token')){
								wx.showToast({
									title: '登录信息过期，请关闭小程序重新进入',
									icon: 'none',
									duration: 2000,
								})
							}else{
								setTimeout(()=>{
									console.log("11111-----",wx.getStorageSync('token'),!wx.getStorageSync('token'))
									if(!wx.getStorageSync('token')){
										wx.showToast({
											title: '登录信息过期，请关闭小程序重新进入',
											icon: 'none',
											duration: 2000,
										})
									}
								},2000)
							}
							login().then(()=>{
								console.log("=========================http token过期 login...")
								console.log('最新token----------',wx.getStorageSync('token'))
							}).catch(err=>{
								console.log("token过期，重新登录报错:",err)
							})
							reject()
						}
						resolve(request.data)
					}
					resolve(request.data)
				},
				fail(error) {
					// wx.showToast({
					// 	title: '网络请求失败，请检查网络1',
					// 	icon: 'none',
					// 	duration: 2000,
					// })
					//返回失败也同样传入reject()方法
					console.log('网络请求失败，请检查网络')
					reject(error)
				},
			})
		})
	}
	get(url, data) {
		return this.request(url, data, 'GET')
	}
	post(url, data) {
		return this.request(url, data, 'POST')
	}
}
const $http = new Http()
export default $http
