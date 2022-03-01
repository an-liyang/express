import $http from './../utils/httpRequest/http.js'

export async function getRequest(data) {
	return await $http.get(
		'/saas-wechat-user/gatewaytest/txckcashbackapi/live/getstatus',
		{
			auto: 'get-test',
		}
	)
}
// 历史门店
export async function pastBussinessInfo(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/pastBussinessInfo', data)
}
// 切换门店
export async function switchBussiness(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/switchBussiness',data)
}
// 登录code换取token
export async function wechatAuth(data) {
	return await $http.post('/saas-wechat-user/api/user/wechatAuth', {
		loginCode: data.loginCode,
		bussinessId: data.bussinessId,
	})
}
// 更新token及用户信息
export async function updateUserInfoByToken(data) {
	return await $http.post(
		'/saas-wechat-user/api/user/updateUserInfoByToken',
		data
	)
}
// 获取用户信息(这个接口只返回用户昵称和图像)
export async function getUserInfoByToken(data) {
	return await $http.post('/saas-wechat-user/api/user/getUserInfoByToken', data)
}
// 个人中心信息获取
export async function getPersonalCenterInfo(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/centerInfo', data)
}
// 获取门店信息
export async function getShopInfo(data) {
	return await $http.post(
		'/saas-wechat-user/api/userinfo/unLoginbussinessInfo',
		data
	)
}
// 绑定手机号
export async function bindUserPhone(data) {
	return await $http.post('/saas-wechat-user/api/user/bindUserPhone', data)
}
