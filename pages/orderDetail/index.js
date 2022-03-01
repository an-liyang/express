// pages/orderDetail/index.js
const app = getApp()
import { orderDetail } from './../../apis/orderRelationApis.js'
import { login} from './../../utils/functional/loginAuth.js'
import {debounce} from './../../utils/util.js'
// import {setNavFunc} from './../../utils/setNavStyleFunc.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageType: null,
    pageStatus: -9999,
    orderNo: '',
    dataObj: {}
  },
  // onPageScroll(e){
	// 	setNavFunc(e,app)
  // },
  async reLoad(){
    await this.initPageStatus()
    this.getOrderDetail(this.data.orderNo)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("订单详情页获取到的参数信息：", options)
		app.store.setState({
      navBkgColor:'#FF7700',
			navFontColor:'#FFFFFF',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back-white.png',
      'getSpuType':options.spuType
    })
    this.setData({
      'orderNo':options.orderNo
    })
    this.getOrderDetail(options.orderNo)
  },
  getOrderDetail(orderNo) {
    var _this = this;
    app.store.setState({
      'isShowLoading':true
    })
    orderDetail({ 'orderNo': orderNo }).then(res => {
      if (res.Success) {
        app.store.setState({
          'isShowLoading':false
        })
        _this.setData({
          'pageStatus': res.Data.orderStatus,
          'pageType': res.Data.spuType,
          'orderNo': orderNo
        })
        const _data=Object.assign({}, res.Data)
        if(_data['skuSalesSpecifications']){
          _data['skuSalesSpecifications']=_data['skuSalesSpecifications'].split(',')
        }else{
          _data['skuSalesSpecifications']=[]
        }
        if(_data['couponAmount']){
          _data['discountRule']=_data['couponAmount']
        }else{
          _data['discountRule']=''
        }
        app.store.setState({
          orderDetailData: Object.assign({}, _data),
        })
        console.log('请求详情成功', app.store.getState().orderDetailData)
      }
    }).catch(err => {
      wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000,
      })
      console.log('请求详情失败', err)
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
    login()
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