import $http from './../utils/httpRequest/http.js'

// 热卖商品可用优惠券列表
export async function goodsCouponList(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/getCouponLabelList', data)
}
// 领取优惠券
export async function reciveCoupon(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/receiveCoupon', data)
}
// 用户已领取优惠券列表
export async function userReceivedCouponList(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/userReceivedCoupon', data)
}
// 我的优惠券详情
export async function userReceivedCouponDetail(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/userReceivedCouponDetail', data)
}
// 店铺相关
// 获取优惠券列表
export async function getCouponList(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/bussCouponList', data)
}
// 券模板详情
export async function getCouponDetail(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/couponDetail', data)
}
// 下单页优惠券列表，无分页
export async function userOrderCouponsList(data) {
	return await $http.post('/saas-wechat-order/api/order/userOrderCouponsList', data)
}
// 商品可用优惠列表
export async function goodsAvaCouponList(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/proUsableCouponList', data)
}
// 商品可用优惠标签
export async function goodsAvaCouponLabel(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/getCouponDetailLabelList', data)
}
// 优惠券可用商品列表
export async function couponAvaGoodsList(data) {
	return await $http.post('/saas-wechat-user/api/usercoupon/couponUsablePorductList', data)
}
// 扫码进入详情，获取id
export async function couponTemplateId(data) {
	return await $http.post('/saas-wechat-user/api/user/coupon/getScene',data)
}