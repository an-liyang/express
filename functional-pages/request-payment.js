// var httpUtil = require("./HttpUtil");
let maintenancePay = require('./requestPayTypes/maintenancePay')
let couponOrderPay = require('./requestPayTypes/couponOrderPay')
exports.beforeRequestPayment = function (paymentArgs, callback) {
	// 注意：
	// 功能页函数（这个函数）不应 require 其他非 functional-pages 目录中的文件，
	// 其他非 functional-pages 目录中的文件也不应 require 这个目录中的文件，
	// 这样的 require 调用在未来将不被支持。
	//
	// 同在 functional-pages 中的文件可以 require
	if (!paymentArgs.type || paymentArgs.type == 1) {
		maintenancePay.dealMaintenancePayFunc(paymentArgs, callback)
	} else if (paymentArgs.type == 2) {
		couponOrderPay.dealCouponOrderFunc(paymentArgs, callback)
	}
}
