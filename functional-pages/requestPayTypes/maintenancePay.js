// 保养支付
var httpUtil = require("./../HttpUtil");
let orderCode =''
 //小程序端来源标识
let orderFrom = 'T'
function dealMaintenancePayFunc(paymentArgs, callback){
  console.log('paymentArgs===',paymentArgs)
  //小程序端来源标识
  orderCode = paymentArgs.orderCode;
  if (orderCode){
    orderPay(paymentArgs,callback)
  }else{
    let createOrderReqData = {
      "DealerId": paymentArgs.dealerId,
      "UserId": paymentArgs.userId,
      "UserName": paymentArgs.userName,
      "UserPhone": paymentArgs.userPhone,
      "OrderFrom": orderFrom,
      "Mileage": paymentArgs.mileage,
      "ProductId": paymentArgs.ProductId,
      "extra": paymentArgs.extra,
      "OpenId": paymentArgs.openId,
      "UserCouponId": paymentArgs.UserCouponId
  }
      console.log('创建保养订单时传递的参数：', createOrderReqData)
      //创建订单
      httpUtil.httpUtil('txckorder/api/order/new/', JSON.stringify(createOrderReqData), paymentArgs.version, (res) => {
        console.info('创建保养订单接口响应值：',res);
        if (!res.Success) { //创建订单失败
            console.log('创建订单接口响应异常...')
            callback(res);
        }
        orderCode = res.Data.OrderCode
        orderPay(paymentArgs,callback)
    }, (err) => {
        callback(err);
    })
  }
}
function orderPay(paymentArgs,callback){
  var requestData = '{"PayType":"2","openId":"' + paymentArgs.openId + '","OrderCode":"' + orderCode + '"}';
  httpUtil.httpUtil('znbkpay/api/pay/wechatPay/', requestData, paymentArgs.version, (res) => {
    console.log("支付订单响应值：",res)
    let payargs = res.Data.PayInfo.WXPayInfo;
    let requestPaymentArgs = {
        timeStamp: payargs.Timestamp,
        nonceStr: payargs.Noncestr,
        package: payargs.PackageStr,
        signType: 'MD5',
        paySign: payargs.Sign,
        extraData: { // 用 extraData 传递自定义数据
            orderCode: orderCode,
            successCallBackUrl: paymentArgs.successCallBackUrl
        },
    };
    return callback(null, requestPaymentArgs);
  }, (err) => {
    console.log("支付订单接口异常：",err)
      return callback(err);
  });
}
module.exports = {
  dealMaintenancePayFunc: dealMaintenancePayFunc
}