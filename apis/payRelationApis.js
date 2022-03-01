import $http from './../utils/httpRequest/http.js'
// 发起支付
export async function makePay(data) {
	return await $http.post('/saas-wechat-pay/api/pay/makePay', data)
}
// 修改支付单为支付中
export async function changePaying(data) {
	return await $http.post('/saas-wechat-pay/api/pay/changePaying', data)
}
