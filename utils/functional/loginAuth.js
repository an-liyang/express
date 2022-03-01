import { wechatAuth, bindUserPhone } from '../../apis/common.js'
const app=getApp()
export const login = () => {
	return new Promise((resolve,reject)=>{
		wx.login({
			success(res) {
				console.log("登录success响应的res",res)
				if (res.code) {
					console.log('登录code:', res.code,'商户id:',getApp().globalData.bussinessId)
					//发起网络请求
					wechatAuth({ loginCode: res.code, bussinessId: getApp().globalData.bussinessId })
						.then((res) => {
							if (res.Success) {
								getApp().globalData.isLogin = true
								console.log('登录接口请求成功,已获取登录状态...', res)
								try {
									wx.setStorageSync('token', res.Data)
									console.log('登录接口返回的token------------',res.Data)
									resolve(wx.setStorageSync('token', res.Data))
								} catch (e) {
									reject()
								}
							}
						})
						.catch((err) => {
							getApp().globalData.isLogin = false
							console.log('登录请求接口失败，当前未登录...', err)
						})
				} else {
					console.log('登录失败！' + res.errMsg)
				}
			},
			fail(err){
				console.log("登录失败=====",err)
			}
		})
	})
}
