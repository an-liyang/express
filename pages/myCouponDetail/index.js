// pages/myCouponDetail/index.js
import {userReceivedCouponDetail} from './../../apis/couponRelationApi.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      templateId:'',
      couponCode:''
    },
    detailData:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.setData({
      'params.templateId':options.id,
      'params.couponCode':options.code
    })
    this.getDetailData()
  },
  async reLoad(){
    this.setData({
      detailData:{}
    })
    this.getDetailData()
  },
  async getDetailData(){
    app.store.setState({
      isShowLoading:true,
      isCurNoNetwork:false,
    })
    await this.judgeNetwork()
    userReceivedCouponDetail(this.data.params).then(res=>{
      // 需要将 tenantMainBusiness（主营业务）转为数组
      if(res.Success){
        setTimeout(()=>{
          app.store.setState({
            isShowLoading:false
          })
        },500)
        let _tenantMainBusiness;
        if(res.Data.tenantMainBusiness){
          _tenantMainBusiness=res.Data.tenantMainBusiness.split(',')
        }else{
          _tenantMainBusiness=[]
        }
        
        this.setData({
          detailData:Object.assign({},res.Data),
          'detailData.tenantMainBusiness':_tenantMainBusiness
        })
      }else{
        wx.showToast({
          title: '接口异常',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(()=>{
          app.store.setState({
            isShowLoading:false
          })
        },500)
      }
      console.log('券详情获取成功:',res)
    }).catch(err=>{
      setTimeout(()=>{
        app.store.setState({
          isShowLoading:false
        })
      },500)
      console.log('券详情获取失败:',err)
      wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000,
      })
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
    // app.store.setState({
    //   isShowLoading:true,
    //   isCurNoNetwork:false,
    // })
  },
  handleToUse(){
    wx.navigateTo({
      url: `/pages/couponAvailableGoods/index?id=${this.data.detailData.templateId}&code=${this.data.detailData.couponCode}`
    })
  },
  handleToCopy(){
    console.log('复制内容：',app.store.getState().orderDetailData.writeoffCode)
    wx.setClipboardData({
      data: this.data.detailData.writeOffCode,
      success (res) {
        console.log('复制成功：',res)
      }
    })
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
    this.getDetailData()
    // 停止下拉刷新
		wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})