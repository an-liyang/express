// pages/orderList/index.js
const app=getApp()
import { login } from './../../utils/functional/loginAuth.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    curPullDownStatus:false
  },
  // onPageScroll(e){
	// 	setNavFunc(e,app)
  // },
  async reLoad(){
    app.store.setState({
      isRequest: false,
      isShowLoading:true,
      isCurNoNetwork:false,
      'orderListParams.pageNo':1,
      'orderListParams.total':null,
      orderListData:Array.from([])
    })
    await this.initPageStatus()
    this.handleOrderList()
    this.handleGetNumber()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // login()
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
    this.setData({
      curPullDownStatus:false
    });
    // console.log("1111111")
    app.store.setState({
      isOrderLoad:false,
      navBkgColor:'#FFFFFF',
      navFontColor:'#292522',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    })
    if(app.store.getState().orderListData.length<=0){
      this.initPageStatus()
    }
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
  async pullDownEvent(){
    app.store.setState({
      'orderListParams.pageNo':1,
      'orderListParams.total':null,
      orderListData:Array.from([]),
      // 'curPullDownStatus':true,
      'isRequest':false,
      'isOrderLoad':false
    })
    await this.handleOrderList()
    this.handleGetNumber()
    this.setData({
      'curPullDownStatus':true
    })
    setTimeout(()=>{
      this.setData({
        'curPullDownStatus':false
      })
    },800)
  },
  async loadTopEvent(){
    console.log("上拉加载事件生效...")
    const _this =this;
    if(app.store.getState().isOrderLoad){
      return;
    }
    await _this.initPageStatus()
    await _this.handleOrderList()
    _this.handleGetNumber()
    if(app.store.getState().orderListParams.total && app.store.getState().orderListData.length>=app.store.getState().orderListParams.total){
      console.log("数据加载完毕1...")
      app.store.setState({
        isOrderLoad:true,
        isShowLoading:false
      })
      return;
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    // console.log("触发上拉加载....")
  }
})