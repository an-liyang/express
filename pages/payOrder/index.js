// pages/payOrder/index.js
import { createPayOrder } from './../../apis/orderRelationApis.js'
import { makePay } from './../../apis/payRelationApis.js'
import { login } from './../../utils/functional/loginAuth.js'
import {userOrderCouponsList} from './../../apis/couponRelationApi.js'
import { encode } from 'js-base64';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClickBtn: true,
    curCouponStatus:true,
    show:false,
    params:{
      skuId:null,
      salePrice:null,
      spuId:null
    }
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
      'orderDetailData.skuSalesSpecifications':[options.skuSalesSpecifications],
      'createOrderParams.spuId': options.spuId,
      'createOrderParams.skuId': options.skuId,
      'createOrderParams.orderAmount': options.orderAmount,
      'createOrderParams.salePrice':options.salePrice,
      'getSpuType':options.spuType,
      'orderDetailData.payStatus':'',
      'orderDetailData.skuSalesPrice':options.salePrice
    })
    this.setData({
      'params.skuId':options.skuId,
      'params.salePrice':options.orderAmount,
      'params.spuId':options.spuId
    })
    this.getCouponsList(this.data.params)
    console.log('订单详情数据(付费下单页)：', app.store.getState().orderDetailData)
  },
  handleConfirmCoupon(){
    const _this =this;
    setTimeout(() => {
      app.store.setState({
        isShowCouponMask:false
      })
    },200)
    app.store.setState({
      payOrderCouponDefaultClick:app.store.getState().payOrderCouponTemporaryClick,
      payOrderCouponDefaultObj:app.store.getState().payOrderCouponTemporaryObj,
      isAnimation:false
    })
    if(app.store.getState().payOrderCouponTemporaryObj && app.store.getState().payOrderCouponTemporaryObj.orderAmount){
      app.store.setState({
        'orderDetailData.orderAmount':app.store.getState().payOrderCouponTemporaryObj.orderAmount,
        'createOrderParams.orderAmount':app.store.getState().payOrderCouponTemporaryObj.orderAmount
      })
    }else{
      app.store.setState({
        'orderDetailData.orderAmount':_this.data.params.salePrice,
        'createOrderParams.orderAmount':_this.data.params.salePrice
      })
    }
  },
  async reLoad(){
    // app.store.setState({
    //   isRequest: false,
    //   isShowLoading:true,
    //   isCurNoNetwork:false,
    //   isOrderLoad:false
    // })
    // await this.judgeNetwork()
    this.getCouponsList(this.data.params)
  },
  // 券列表无分页
  async getCouponsList(data){
    const _this=this;
    app.store.setState({
      isRequest: false,
      isShowLoading:true,
      isCurNoNetwork:false
    })
    await this.judgeNetwork()
    userOrderCouponsList(data).then(res=>{
      console.log('请求券列表：',res)
      setTimeout(()=>{
        app.store.setState({
          isRequest: true,
          isShowLoading:false,
          isOrderLoad:false
        })
      },500)
      if(res.Success){
        app.store.setState({
          payOderCouponList:res.Data
        })
        // app.store.getState().createOrderParams
          app.store.setState({
            payOrderCouponDefaultObj:res.Data.length>0 && _this.data.curCouponStatus ?res.Data[0]:null,
            payOrderCouponTemporaryObj:res.Data.length>0 && _this.data.curCouponStatus ?res.Data[0]:null,
            payOrderCouponTemporaryClick:res.Data.length>0 && _this.data.curCouponStatus ?res.Data[0].couponCode:null,
            payOrderCouponDefaultClick:res.Data.length>0 && _this.data.curCouponStatus ?res.Data[0].couponCode:null
          })
          if(res.Data[0] &&res.Data[0].orderAmount && _this.data.curCouponStatus){
            app.store.setState({
              'createOrderParams.orderAmount':res.Data[0].orderAmount,
              'orderDetailData.orderAmount':res.Data[0].orderAmount,
            })
          }
      }
    }).catch(err=>{
      wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000
      })
      setTimeout(()=>{
        app.store.setState({
          isShowLoading:false,
        })
      },500)
    })
  },
  handleSubOrderPage(){
    app.store.setState({
      isShowCarKey: false,
    });
    this.selectComponent("#letter").onConfirm();
  },
  handleCreatePayOrder() {
    const _this = this;
    // || app.store.getState().phoneInputTip || app.store.getState().usernameInputTip
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
    // console.log(app.store.getState().payOrderCouponDefaultObj,'优惠券')
    // 不为null的时候赋值
    if(app.store.getState().payOrderCouponDefaultObj){
      getParamsData['couponCode']=app.store.getState().payOrderCouponDefaultObj.couponCode;
      // couponType  优惠券类型 1满减 2折扣  discountRatio折扣比
      getParamsData['couponAmount']=app.store.getState().payOrderCouponDefaultObj.amoutOrder
    }
    // if(app.store.getState().payOrderCouponDefaultObj.couponType==1){
    //   getParamsData['couponAmount']=app.store.getState().payOrderCouponDefaultObj.deductionAmount
    // }else if(app.store.getState().payOrderCouponDefaultObj.couponType==2){
    //   getParamsData['couponAmount']=app.store.getState().payOrderCouponDefaultObj.discountRatio
    // }
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
    console.log("创建订单传参：",getParamsData)
    createPayOrder(getParamsData).then(res => {
      console.log('创建付费订单成功：', res)
      console.log('当前接口返回的订单编号为-------',res.Data)
      if(res.ErrCode && res.ErrCode==352||res.ErrCode==353){
        // 当前券已过期或已核销
        _this.setData({
          curCouponStatus:false
        })
        // 重新取商品现价
        app.store.setState({
          'orderDetailData.orderAmount':_this.data.params.salePrice,
          'createOrderParams.orderAmount':_this.data.params.salePrice
        })
      }else{
        _this.setData({
          curCouponStatus:true
        })
      }
      if (res.Success) {
        _this.toPay(res.Data)
      } else {
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 2000
        })
        _this.getCouponsList(this.data.params)
      }
    }).catch(err => {
      wx.showToast({
				title: err.Msg||'网络开小差了',
				icon: 'none',
				duration: 2000
			})
      console.log('创建订单失败：', err)
    })
  },
  // 发起支付
  toPay(orderNo) {
    const _this = this;
    makePay({ 'orderNo': orderNo }).then(res => {
      console.log('支付接口调用成功', res);
      if (res.Success) {
        _this.toWxPay(res, orderNo)
      } else {
        wx.showToast({
          title: res.Msg || "服务器繁忙,",
          icon: 'error',
          duration: 2000, complete(e) {
            setTimeout(function () {
              wx.redirectTo({
                url: `/pages/orderDetail/index?orderNo=` + orderNo,
              })
            }, 2000);
          }
        })
      }
    }).catch(err => {
      console.log('支付接口调用失败', err)
    })
  },
  // 调起支付
  toWxPay(res, orderNo) {
    wx.requestPayment({
      timeStamp: JSON.stringify(res.Data.timeStamp),
      nonceStr: res.Data.nonceStr,
      package: res.Data.package,
      signType: res.Data.signType,
      paySign: res.Data.paySign,
      success(res) {
        // 跳转支付成功页面
        wx.reLaunch({
          url: '/pages/successPay/index?orderNo=' + orderNo
        })
      },
      fail(res) {
        wx.redirectTo({
          url: `/pages/orderDetail/index?orderNo=` + orderNo,
        })
      }
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