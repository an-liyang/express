var md5 = require('./md5');

var baseUrl = {
    "dev":"http://172.20.4.89:2021"
    ,"prod":"https://vip.yichehuoban.cn/gateway/"
    ,"beta":"https://vip.yichehuoban.cn/gatewaytest/"
}
var appid = "B8668937-50F9-447D-8B33-601CB505D0AA";
var prodSercert = "B4E3AC7C-4A0D-469B-8F17-BA29B9E300AD";
var betaSercert = "FD70AA63-EEAB-43BF-8BCD-12476588223E";


function httpUtil(requestUrl, requestData, version,callback, errFun) {
  var time = new Date().getTime();
  var url = baseUrl[version]
  var sercert="";
  if ('dev' === version) {
    sercert=betaSercert;
  }
  if ('beta' === version) {
    sercert=betaSercert;
  }
  if ('prod' === version) {
    sercert=prodSercert;
  }
  console.log("请求完整路径:",url + requestUrl + appid + '/' + time + '/' + sign(appid, sercert, time, requestData))
  wx.request({
    url: url + requestUrl + appid + '/' + time + '/' + sign(appid, sercert, time, requestData),
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    data: requestData,
    success(res) {
      if(res.data.ErrCode==0){
        callback(res.data);
      }else{
        errFun(res.data.Msg);
      }
    },
    fail(res) {
      errFun(res);
    }
  })
}

function sign(appid, appkey, timestimp, requestData) {
  var singStr = (appid + timestimp + requestData + appkey).toUpperCase();
  return md5.md5(singStr);
}
module.exports = {
  httpUtil: httpUtil
}