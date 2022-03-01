// pages/myPage/components/entryList/index.js
import { baseInfoJudge } from './../../../../utils/functional/index.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    centerInfoData:{
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isClicked: false,
    couponTimer:false,
    carTimer:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toCoupon(){
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
      // 标注当前授权按钮的类型，用以手机授权成功的页面更新回调
			app.store.setState({
				curClickAuthBtn:'myCoupon'
      })
      baseInfoJudge(()=>{
        wx.navigateTo({
          url: '/pages/myCoupon/index'
        })
      })
    },
    toCarPage(){
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
     // 标注当前授权按钮的类型，用以手机授权成功的页面更新回调
			app.store.setState({
				curClickAuthBtn:'myCar'
			})
			baseInfoJudge(()=>{
				// 用户信息授权成功，刷新页面
				wx.navigateTo({
					url: '/pages/myLoveCar/index?type=look&source=my'
				})
			})
    },
    toHisPage(){
      wx.navigateTo({
        url: '/pages/historyStorePage/index'
      })
    }
  }
})
