// pages/myLoveCar/index.js
const app = getApp()
import {getAllCar,delCar,updateDefaultCar} from '../../apis/carRelationApis.js'
import { baseInfoJudge } from './../../utils/functional/index.js'
import { login} from './../../utils/functional/loginAuth.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClicked: false,
    currentCar: {}, // 当前车辆操作车辆参数
    title: '',
    // 删除车辆信息
    isShowDel: false,
    delCarInfo: {
      carId: '',
      isPresent: ''
    },
    // 车辆列表
    myCarList: []
  },
  // 弱网重载
  async reLoad(){
    app.store.setState({
      isShowLoading:true,
      isCurNoNetwork:false,
    })
    await this.initPageStatus()
    this.getAllCarList()
  },
  // 添加车辆/编辑车辆
  toBoundCar(e) {
    const _this = this
    _this.setData({
      "currentCar.type": e.currentTarget.dataset.type,
      "currentCar.isset": e.currentTarget.dataset.isset,
      "currentCar.id": e.currentTarget.dataset.id || ''
    })
    if(app.globalData.isAuthAll){
      let url = '../../pages/boundCar/index?type='+e.currentTarget.dataset.type+'&isset='+e.currentTarget.dataset.isset;
      if(e.currentTarget.dataset.type == 'edit'){
        url = url + '&carId=' + e.currentTarget.dataset.id
      }
      wx.navigateTo({
        url: url,
      })
    }else{
      // 标注当前授权按钮的类型，用以手机授权成功的页面更新回调
      app.store.setState({
        curClickAuthBtn: 'boundCar'
      })
       // 是否可点击判断，授权接口api不支持在节流回调里调用
       if(this.data.isClicked){return false}
       this.setData({
         isClicked: true,
       })
       const _this=this;
       setTimeout(()=>{
         _this.setData({
           isClicked: false
         })
       },2000)
      baseInfoJudge(()=>{
        // 用户信息授权成功，刷新页面
        app.store.setState({
          active: 'boundCar',
        });
        let url = '../../pages/boundCar/index?type='+e.currentTarget.dataset.type+'&isset='+e.currentTarget.dataset.isset;
        if(e.currentTarget.dataset.type == 'edit'){
          url = url + '&carId=' + e.currentTarget.dataset.id
        }
        wx.navigateTo({
          url: url,
        })
      })
    }
  },
	// 手机号授权成功
	updatePageFunc() {
		// 我的爱车授权按钮的类型：boundCar
    const getCurType=app.store.getState().curClickAuthBtn
    if(getCurType=='boundCar') {
      app.store.setState({
				active: 'boundCar',
			});
      let url = '../../pages/boundCar/index?type='+this.data.currentCar.type+'&isset='+this.data.currentCar.isset;
      if(e.currentTarget.dataset.type == 'edit'){
        url = url + '&carId=' + this.data.currentCar.id
      }
      wx.navigateTo({
        url: url,
      })
    }
	},
  // 设为默认车辆
  setDefaultCar(e) {
    const data = {
      carId: e.currentTarget.dataset.id,
      isPresent: e.currentTarget.dataset.type
    }
    updateDefaultCar(data).then((res) => {
      const _this =  this;
      if (res.Success) {
        _this.getAllCarList()
      }
    })
    .catch((err) => {
      console.log('车辆列表', err)
      wx.showToast({
				title: '网络开小差了',
				icon: 'none',
				duration: 2000
			})
    })
  },
  // 删除爱车--弹框
  delateCar(e){
    this.setData({
      isShowDel: true,
      delCarInfo: {
        carId: e.currentTarget.dataset.id,
        isPresent: e.currentTarget.dataset.type
      }
    })
  },
  // 取消删除
  onClose(){
    this.setData({
      isShowDel: false
    })
  },
  // 确认删除
  onOk(){
    const _this = this;
    delCar(_this.data.delCarInfo).then(res=>{
      if(res.Success){
        this.getAllCarList()
        this.onClose()
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch((err) => {
      wx.showToast({
				title: '网络开小差了',
				icon: 'none',
				duration: 2000
			})
    })
  },
  // 获取车辆列表
  getAllCarList() {
    // loading开启
    app.store.setState({
      isShowLoading:true,
      isCurNoNetwork:false,
    })
    getAllCar().then((res) => {
      const _this =  this;
      if (res.Success) {
        _this.setData({
          myCarList: res.Data,
        })
        // loading关闭
        setTimeout(()=>{
          app.store.setState({
            isShowLoading:false,
          })
        },200)
      }
      console.log('车辆列表', res)
    })
    .catch((err) => {
      console.log('车辆列表', err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.store.setState({
    //   navBkgColor:'#FFFFFF',
    //   navFontColor:'#292522',
    //   navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    // })
    const _this = this
    // 记录跳转来源
    if(options.source){
      app.store.setState({
        sourceCar: options.source
      })
    }
    // 修改标题，根据功能变化
    const title = options.type === 'look'?'我的爱车':'切换爱车'
		// _this.setData({
		// 	title: title
    // })
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 页面销毁时执行,跳转指定页面
  onUnload: function () {
    const url = app.store.$state.sourceCar=="my"?'/pages/myPage/index':'/pages/servicePage/index'
    wx.reLaunch({
      url: url
    })
  },
  onShow: function(){
    // 获取车辆列表
    this.getAllCarList()
  }
})