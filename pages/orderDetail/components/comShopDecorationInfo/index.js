// pages/orderDetail/components/comShopDecorationInfo/index.js
import {makePay} from './../../../../apis/payRelationApis.js'
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 发起支付
   handlePay(e){
    const _this=this;
    if(app.store.getState().expireTime=='00:00:00'){
      return;
    }
    makePay({'orderNo':e.currentTarget.dataset.orderno}).then(res=>{
      console.log('支付接口调用成功',res)
      if(res.Success){
        _this.toWxPay(res,e.currentTarget.dataset.orderno)
      }else{
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 2000
        })
      }
      
    }).catch(err=>{
      console.log('支付接口调用失败',err)
    })
   },
  // 调起支付
  toWxPay(res,orderNo){
    wx.requestPayment({
      timeStamp: JSON.stringify(res.Data.timeStamp),
      nonceStr: res.Data.nonceStr,
      package: res.Data.package,
      signType: res.Data.signType,
      paySign: res.Data.paySign,
      success (res) {
        // 跳转支付成功页面
        wx.reLaunch({
          url: '/pages/successPay/index?orderNo='+orderNo
        })
        console.log('微信支付成功',res)
       },
      fail (res) { 
        console.log('微信支付失败',res)
      }
    })
  }
  }
})
