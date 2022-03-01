import $http from './../utils/httpRequest/http.js'

// 获取热卖商品列表
export async function getGoodsList(data) {
	return await $http.post('/saas-wechat-user/api/userinfo/productList', data)
}
// 获取商品详情
export async function getGoodsDetail(data) {
	return await $http.post('/saas-wechat-user/api/user/product/detail', data)
}
// 校验商品信息
export async function checkGoods(data) {
	return await $http.post('/saas-wechat-user/api/user/product/valid', data)
}
// 生成商品二维码
export async function createQrCode(data) {
	return await $http.post(
		'/saas-wechat-user/api/user/product/shareQrCode',
		data
	)
}
// 获取二维码参数
export async function getDetailScene(data) {
	return await $http.post('/saas-wechat-user/api/user/product/getScene', data)
}
