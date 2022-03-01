// pages/historyStorePage/index.js
import {pastBussinessInfo,switchBussiness} from './../../apis/common.js'
import { login} from './../../utils/functional/loginAuth.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    params:{
      current:1,
      pageSize:10,
      total:null
    },
    bid:null,
    isLoaded:false,
    dataList:[],
    curPullDownStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  handleConfirm:function(e){
    this.setData({
      bid:e.currentTarget.dataset.id
    })
    app.store.setState({
      'isConfirmMask':true
    })
  },
  handleToStore:async function(e){
    const _this =this;
    await this.switchStoreApi(()=>{
      console.log('当前商户id:',this.data.bid)
      wx.setStorage({
				key: 'bussinessId',
				data: this.data.bid,
      })
      app.globalData.isAuthAll = false;
      app.globalData.bussinessId = this.data.bid
    if(this.data.bid){
      login().then(()=>{
        wx.reLaunch({
          url: '/pages/servicePage/index?bussinessId=' + this.data.bid
        })
      }).catch((err)=>{
        console.log("切换门店-授权token-跳转首页失败...",err)
      })
      app.store.setState({
        'isConfirmMask':false
      })
    }
    })
    

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.setData({
      curPullDownStatus:false
    });
    app.store.setState({
      navBkgColor:'#FFFFFF',
      navFontColor:'#292522',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    })
    app.store.setState({
      'isConfirmMask':false
    })
    await this.initPageStatus()
    this.storeListApi()
  },
  async storeListApi(){
    const _this = this;
    console.log("当前传参：",this.data.params,_this.data.dataList)

    if(this.data.params.total && _this.data.dataList.length<=this.data.params.total){
      _this.setData({
        'isLoaded':true
      })
      setTimeout(()=>{
        app.store.setState({
          isShowLoading:false
        })
      },500)
      return;
    }
    app.store.setState({
      isRequest: false,
      isShowLoading:true,
    })
    await this.judgeNetwork()
    pastBussinessInfo(this.data.params).then(res=>{
      console.log("历史商户列表接口：",res)
      if(res.Success){
        _this.setData({
          'curPullDownStatus':false,
          'isLoaded':false
        })
        setTimeout(()=>{
          app.store.setState({
            isShowLoading:false
          })
        },500)
        if(res.Data.records.length<=0 || res.Data.total<=_this.data.params.total){
          console.log("数据加载完毕...")
          setTimeout(()=>{
            app.store.setState({
              isShowLoading:false
            })
          },500)
          _this.setData({
            'isLoaded':true
          })
          console.log('数据加载完毕',this.data.isLoaded)
          return;
        }
        if(res.Data.records){
          res.Data.records.map(item=>{
            if(item.tenantMainBusiness){
              const labelArr=item.tenantMainBusiness.split(',')
              item.tenantMainBusiness=labelArr
            }
          })
        }
        _this.setData({
          'params.current':res.Data.current+1,
          'params.pageSize':res.Data.size,
          'params.total':res.Data.total,
          'dataList':[..._this.data.dataList,...Array.from(res.Data.records)]
        })
      }else{
        this.setData({
          curPullDownStatus:false,
        })
        setTimeout(()=>{
          app.store.setState({
            isShowLoading:false
          })
        },500)
        wx.showToast({
          title: res.Msg||'接口异常',
          icon: 'none',
          duration: 2000,
        })
      }
    }).catch(err=>{
      console.log('接口异常',err)
      this.setData({
        curPullDownStatus:false,
      })
      setTimeout(()=>{
        app.store.setState({
          isShowLoading:false
        })
      },500)
      wx.showToast({
				title: err.Msg||'网络开小差了',
				icon: 'none',
				duration: 2000,
			})
    })
  },
  switchStoreApi(callback){
    console.log("切换数据接口传递的token值为：",wx.getStorageSync('token'))
    switchBussiness({token:wx.getStorageSync('token')}).then(res=>{
      console.log("切换数据时接口响应状态",res)
      if(!res.Success){
        wx.showToast({
          title: res.Msg||'接口异常',
          icon: 'none',
          duration: 2000,
        })
      }else{
        callback()
      }
    }).catch(err=>{
      console.log("切换数据时接口响应异常：",err)
      wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000,
      })
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
  async reLoad(){
    await this.initPageStatus()
    this.storeListApi()
  },
  async pullDownEvent(){
    const _this =this;

    _this.setData({
      'params.current':1,
      'params.pageSize':10,
      'params.total':null,
      'dataList':Array.from([]),
      'curPullDownStatus':true,
      'isLoaded':false
    })
    await this.storeListApi()
  },
  async loadTopEvent(){
    console.log("触发上拉加载事件...")
    if(app.store.getState().isCurNoNetwork){
      return;
    }
    await this.initPageStatus()
    await this.storeListApi()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})