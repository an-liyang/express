// 券订单支付
var httpUtil = require("./../HttpUtil");
let orderCode = ''
let userId = ''
let stockId = ''
    //小程序端来源标识
let orderFrom = 'T'

function dealCouponOrderFunc(paymentArgs, callback) {
    console.log('paymentArgs===', paymentArgs)
    orderCode = paymentArgs.orderCode;
    if (orderCode) {
        // 支付
        orderPay(paymentArgs, callback)
    } else {
        // 创建订单
        let requestData = {
            "ProductId": paymentArgs.stockId,
            "OrderFrom": orderFrom,
            "UserId": paymentArgs.userId,
            "UserName": paymentArgs.userName,
            "UserPhone": paymentArgs.userPhone,
            "OpenId": paymentArgs.openId,
            "CityName": paymentArgs.cityName,
            "ChannelId": paymentArgs.channelId,
            "extra": paymentArgs.extra
        }
        console.log('创建券订单请求参数：', requestData)
        httpUtil.httpUtil('txckorder/api/couponorder/create/', JSON.stringify(requestData), paymentArgs.version, (res) => {
            console.log('创建券订单接口响应值:', res)
            if (!res.Success) { //创建订单失败
                console.log('创建券订单接口响应异常...')
                return callback(res);
                console.log("1111")
            }
            orderCode = res.Data.OrderCode
            userId = res.Data.UserId
            stockId = res.Data.StockId
            orderPay(paymentArgs, callback)
        }, (err) => {
            console.log('创建券订单接口异常:', err)
            return callback(err);
        });
    }
}

function orderPay(paymentArgs, callback) {
    let requestData = {
        "OrderCode": orderCode,
        "orderFrom": orderFrom,
        "PayType": "2",
        "openId": paymentArgs.openId,
        "productInfo": '[{"ProductId":' + paymentArgs.stockId + ',"ProductName":' + paymentArgs.CouponProductName + '}]',
    }
    console.log("券支付请求参数:", requestData)
    httpUtil.httpUtil('znbkpay/api/pay/wechatCouponPay/', JSON.stringify(requestData), paymentArgs.version, (res) => {
        console.log("券支付订单响应值：", res)
        let payargs = res.Data.PayInfo.WXPayInfo;
        let requestPaymentArgs = {
            timeStamp: payargs.Timestamp,
            nonceStr: payargs.Noncestr,
            package: payargs.PackageStr,
            signType: 'MD5',
            paySign: payargs.Sign,
            extraData: { // 用 extraData 传递自定义数据
                orderCode: orderCode,
                userId: userId,
                stockId: stockId,
                openId: paymentArgs.openId,
                successCallBackUrl: paymentArgs.successCallBackUrl
            },
        };
        return callback(null, requestPaymentArgs);
    }, (err) => {
        console.log("券支付订单接口异常：", err)
        return callback(err);
    });
}
module.exports = {
    dealCouponOrderFunc: dealCouponOrderFunc
}