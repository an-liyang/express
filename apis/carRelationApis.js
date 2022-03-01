import $http from './../utils/httpRequest/http.js'

// 获取默认爱车
// 存到store
export async function getDefaultCar() {
	return await $http.post('/saas-wechat-user/api/userinfo/getMyLoveCar')
}
// 获取车辆列表
export async function getAllCar() {
	return await $http.post('/saas-wechat-user/api/userinfo/myCarList')
}
// 获取当前车辆
export async function getCarDetail(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/currentCar', data)
}
// 删除当前车辆
export async function delCar(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/delMyCar', data)
}
// 设为默认车辆
export async function updateDefaultCar(data) {
	return await $http.post(
		'/saas-wechat-user/api/userinfo/updateMyLoveCar',
		data
	)
}
// 添加爱车
export async function addCar(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/addMyCar', data)
}
// 编辑爱车
export async function editCar(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/editMyCar', data)
}
