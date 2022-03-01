import {
	updateUserInfoByToken,
	getPersonalCenterInfo,
} from '../../apis/common.js'
import { encode } from 'js-base64';
const app = getApp()

// 判断是否授权过手机号
const isBindPhone = (callback,pres) => {
	if (pres.Success && pres.Data && pres.Data.wechatPhone) {
		wx.setStorageSync('userPhone', pres.Data.wechatPhone)
		getApp().store.setState({
			isTipMask:false
		})
		// 是否授权完成
		getApp().globalData.isAuthAll = true
		callback()
		console.log('手机号已授权，无需再次授权...',pres.Data.wechatPhone)
	} else {
		console.log('接口判断到手机号未授权,需授权...',pres.Data.wechatPhone)
		getApp().store.setState({
			isTipMask:true
		})
	}
}
// 用户信息授权
export const userAuth = (callback) => {
	return new Promise((resolve, reject) => {
		getPersonalCenterInfo({ bussinessId: getApp().globalData.bussinessId })
		.then((pres) => {
			console.log('个人中心数据请求成功---', pres)
			if(pres.Success){
				if(pres.Success && pres.Data && (pres.Data.nickName || pres.Data.headImage)){
					// 用户信息已授权
					console.log('用户信息已授权,无需再授权...',pres.Data)
					wx.setStorageSync('userInfo', pres.Data)
					isBindPhone(callback,pres)
					resolve()
				}else if(pres.Success && pres.Data){
					// 用户信息未授权
					console.log('用户信息未授权，需要授权...',pres.Data)
					wx.getSetting({
						success: function (data) {
							if (data.authSetting['scope.userInfo'] === true) {
								wx.getUserProfile({
									desc: '需要获取你的个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
									success: (res) => {
										console.log('获取用户信息成功：', res.userInfo)
										wx.setStorageSync('userInfo', res.userInfo)
										updateUserInfoByToken({
											nickName: encode(res.userInfo.nickName),
											headImage: res.userInfo.avatarUrl,
										})
											.then((res) => {
												if (res.Success) {
													// 判断是否绑定过手机号；有则不弹提示，无则弹出提示
													isBindPhone(callback,pres)
													console.log('用户信息更新成功...')
												} else {
													console.log('用户信息更新失败...')
												}
											})
											.catch((err) => {
												console.log('err---------------',err)
												console.log('用户信息更新接口请求异常...')
											})
										resolve()
									},
									fail:function(err){
										console.log('err1---------------',err)
									}
								})
							} else {
								console.log("用户已拒绝授权，不会出现弹窗，进入fail回调1...")
								console.log('用户信息接口未授权，需要先授权')
								reject()
							}
						},
						fail:function(){
              console.log("用户已拒绝授权，不会出现弹窗，进入fail回调...")
              wx.showModal({
                title: '是否授权获取用户信息',
                // content: '请确认授权',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success (res) {
                        console.log('再次授权时，用户同意了授权用户信息...')
                      },
                      fail(){
                        console.log('再次授权时，用户又拒绝了授权用户信息...')
                      }
                    })
                  }
                }
              })
            }
					})
				}else{
					reject(pres)
					// 接口异常
					wx.showToast({
						title: pres.Msg,
						icon: 'none',
						duration: 2000
					})
				}
			}
		})
		.catch((perr) => {
			console.log('个人中心数据请求失败---', perr)
			reject(perr)
			wx.showToast({
				title: '网络开小差了',
				icon: 'none',
				duration: 2000,
			})
		})

	})
}
