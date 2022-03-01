// pages/freeOrder/index.js
import { createOrder } from './../../apis/orderRelationApis.js'
import { login } from './../../utils/functional/loginAuth.js'
import { encode } from 'js-base64';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClickBtn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // login()
    console.log("商品详情页传递的参数信息：", options)
    app.store.setState({
      navBkgColor:'#FFFFFF',
      navFontColor:'#292522',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    })
    app.store.setState({
      'orderDetailData.skuSalesSpecifications':options.skuSalesSpecifications=='null' ||options.skuSalesSpecifications==null?[]:[options.skuSalesSpecifications],
      'createOrderParams.spuId': options.spuId,
      'createOrderParams.skuId': options.skuId,
      'createOrderParams.orderAmount': options.orderAmount,
      'getSpuType':options.spuType
    })
    console.log('订单详情数据（免费下单页）：', app.store.getState().orderDetailData)
  },
  handleSubOrderPage(){
    app.store.setState({
      isShowCarKey: false,
    });
    this.selectComponent("#letter").onConfirm();
  },
  handleCreateFreeOrder() {
    const _this = this;
    if(!app.store.getState().createOrderParams.userName || !app.store.getState().createOrderParams.orderPhone){
      return;
    }
    let username = app.store.getState().createOrderParams.userName ? app.store.getState().createOrderParams.userName.replace(/(^\s*)|(\s*$)/g, "") : null;
    if (!username) {
      app.store.setState({
        'usernameInputTip': '请输入用户名',
      });
      return;
    }

    // 手机号校验
    const reg = /^1\d{10}$/
    if (reg.test(app.store.getState().createOrderParams.orderPhone)) {
      app.store.setState({
        'phoneInputTip': '',
      })
    } else {
      app.store.setState({
        'phoneInputTip': '请输入正确格式的手机号',
      })
      return;
    }
    // 手机号校验完成
    // 车牌号校验
    // const creg = /^[A-Z0-9]+$/g;
    const carno = app.store.getState().createOrderParams.orderCarNo;
    if ((carno.length<6||carno.length>7)&&carno) {
      wx.showToast({
        title: '请输入正确车牌号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 车牌号校验完成
    let getParamsData = { ...app.store.getState().createOrderParams };
    getParamsData.orderCarNo = app.store.getState().createOrderParams.orderCarNo ? (app.store.getState().carKeyDefaultVal + app.store.getState().createOrderParams.orderCarNo) : "";
    if (!_this.data.isClickBtn) {
      return;
    }
    _this.setData({
      'isClickBtn': false
    })
    setTimeout(() => {
      _this.setData({
        'isClickBtn': true
      })
    }, 3000)
    getParamsData.userName=encode(getParamsData.userName);
    createOrder(getParamsData).then(res => {
      console.log('创建免费订单完成：', res)
      if (!res.Success) {
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 2000
        })
        return;
      }
      else {
        wx.showToast({
          title: "报名成功，请尽快到门店使用",
          icon: 'none',
          duration: 2000, complete(e) {
            setTimeout(function () {
              wx.redirectTo({
                url: `/pages/orderDetail/index?orderNo=` + res.Data,
              })
            }, 2000);
          }
        })
        return;
      }
    }).catch(err => {
      wx.showToast({
				title: '网络开小差了',
				icon: 'none',
				duration: 2000
			})
      console.log('创建订单失败：', err)
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
    // login()
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