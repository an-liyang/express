import $http from './../utils/httpRequest/http.js'
// 创建付费订单
export async function createPayOrder(data) {
	return await $http.post('/saas-wechat-order/api/order/createPayOrder', data)
}
// 创建免费订单
export async function createOrder(data) {
	return await $http.post('/saas-wechat-order/api/order/createOrder', data)
}
// 订单详情
export async function orderDetail(data) {
	return await $http.post('/saas-wechat-order/api/detailOrder/search', data)
}
// 查询待支付、待服务订单数量
export async function orderNumber(data) {
	return await $http.post('/saas-wechat-order/api/myOrder/orderNumber', data)
}
// 全部订单
export async function allOrder(data) {
	return await $http.post('/saas-wechat-order/api/myOrder/allOrder', data)
}
// 待支付订单
export async function unPaid(data) {
	return await $http.post('/saas-wechat-order/api/myOrder/unPaid', data)
}
// 待服务订单
export async function unService(data) {
	return await $http.post('/saas-wechat-order/api/myOrder/unService', data)
}
// 已关闭
export async function closed(data) {
	return await $http.post('/saas-wechat-order/api/myOrder/closed', data)
}
// 已完成
export async function finished(data) {
	return await $http.post('/saas-wechat-order/api/myOrder/finished', data)
}
