// pages/myCoupon/index.js
import {userReceivedCouponList} from './../../apis/couponRelationApi.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curClick:'usable',
    params:{
      couponStatus:0,//可用传0；不可用传1
      current:1,
      pageSize:10,
      total:null
    },
    headTitleList:[
      {
        desc:'可用',
        name:'usable',
        id:0
      },
      {
        desc:'不可用',
        name:'unusable',
        id:1
      }
    ],
    couponList:[],
    curPullDownStatus:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow: function () {
    this.setData({
      'params.current':1,
      couponList:Array.from([])
    })
    this.getCouponList()
    // app.store.setState({
    //   isRequest: false,
    //   isShowLoading:true,
    //   isCurNoNetwork:false,
    //   isOrderLoad:false
    // })
  },
  async handleToggle(e){
    console.log(e.currentTarget.dataset.name)
    app.store.setState({
      isRequest: false,
      isShowLoading:true,
      isCurNoNetwork:false
    })
    await this.judgeNetwork()
    this.setData({
      'params.couponStatus':e.currentTarget.dataset.id,
      'params.current':1,
      couponList:Array.from([]),
      curClick:e.currentTarget.dataset.name
    })
    this.getCouponList()
  },
  async reLoad(){
    app.store.setState({
      isRequest: false,
      isShowLoading:true,
      isCurNoNetwork:false,
      isOrderLoad:false
    })
    await this.judgeNetwork()
    this.setData({
      'params.current':1,
      couponList:Array.from([])
    })
    this.getCouponList()
  },
  async getCouponList(){
    if(this.data.params.total && this.data.couponList.length>=this.data.params.total){
      setTimeout(()=>{
        app.store.setState({
          isRequest: true,
          isShowLoading:false,
          isOrderLoad:true
        })
      },500)
      console.log("加载完毕2..")
      return;
    }
    app.store.setState({
      isRequest: false,
      isShowLoading:true,
      isCurNoNetwork:false,
      isOrderLoad:false
    })
    await this.judgeNetwork()
    userReceivedCouponList(this.data.params).then(res=>{
      console.log('优惠券列表请求成功：',res)
      if(this.data.couponList.length>=res.Data.total){
        console.log('加载完毕3...')
        setTimeout(()=>{
          app.store.setState({
            isRequest: true,
            isShowLoading:false,
            isOrderLoad:true
          })
        },500)
        return;
      }
      if(res.Success && res.Data && res.Data.records.length>0){
        this.setData({
          couponList:[...this.data.couponList,...res.Data.records],
          'params.current':res.Data.current+1,
          'params.total':res.Data.total
        })
        if(res.Data.records.length<this.data.params.pageSize){
          setTimeout(()=>{
            app.store.setState({
              isRequest: true,
              isShowLoading:false,
              isOrderLoad:true
            })
          },500)
          return false;
        }
        setTimeout(()=>{
          app.store.setState({
            isRequest: true,
            isShowLoading:false,
            isOrderLoad:false
          })
        },500)
        console.log("我的优惠券列表请求成功",this.data.couponList)
      }else{
        console.log('加载完毕1...')
          setTimeout(()=>{
            app.store.setState({
              isRequest: true,
              isShowLoading:false,
              isOrderLoad:true
            })
          },500)
          return;
      }
    }).catch(err=>{
      console.log("请求我的优惠券列表报错：",err)
      wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000,
      })
      setTimeout(()=>{
        app.store.setState({
          isShowLoading:false,
        })
      },500)
    })
  },
  async pullDownEvent(){
    console.log("下拉刷新事件生效...")
    const _this =this;
    this.setData({
      'curPullDownStatus':true,
      'params.current':1,
      couponList:Array.from([])
    })
    this.getCouponList()
  },
  async loadTopEvent(){
    console.log("上拉加载事件生效...")
    this.setData({
      'curPullDownStatus':false
    })
    this.getCouponList()
  },
  toCouponCenter(){
    wx.navigateTo({
      url: `/pages/couponCenter/index`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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