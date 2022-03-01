import { bindUserPhone } from '../../apis/common.js'
export const phoneAuth = (e) => {
	let _this = this
	if (e.detail.errMsg == 'getPhoneNumber:ok') {
		return new Promise((resolve, reject) => {
			console.log('获取到加密的手机号===', e.detail)
			bindUserPhone({ bindPhone: e.detail.encryptedData, iv: e.detail.iv })
				.then((res) => {
					if (res.Success) {
						console.log('授权手机号接口成功...', res)
						getApp().globalData.isHavePhone = true
						// 是否授权完成
						getApp().globalData.isAuthAll = true
						resolve(true)
					}else{
						wx.showToast({
							title: "授权接口异常",
							icon: 'none',
							duration: 2000
						})
					}
				})
				.catch((err) => {
					console.log('授权手机号接口失败...', err)
					reject(false)
				})
		})
	}
}
