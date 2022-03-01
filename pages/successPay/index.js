// pages/successPay/index.js
import {changePaying} from './../../apis/payRelationApis.js'
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.store.setState({
      navBkgColor:'#FFFFFF',
      navFontColor:'#292522',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    })
    this.setData({
      orderNo:options.orderNo
    })
    console.log("当前页面获取到的订单号----------",options.orderNo)
    changePaying({orderNo:options.orderNo}).then(res=>{
      if(res.Success){
        console.log("支付状态更新成功：",res)
      }else{
        console.log("支付状态更新失败：",res)
      }
    }).catch(err=>{
      console.log('支付状态更新失败',err)
    })
  },
  handleBackHome(){
    wx.switchTab({
      url: '/pages/servicePage/index'
    })
  },
  handleLookOrder(){
    wx.navigateTo({
			url: `/pages/orderDetail/index?orderNo=${this.data.orderNo}`,
		})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})