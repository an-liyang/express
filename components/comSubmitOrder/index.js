// components/comSubmitOrder/index.js
const app = getApp()
import {getDefaultCar} from './../../apis/carRelationApis.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    phoneInputTip: '',
    usernameInputTip: '',
    isShowLetterKey: false
  },
  lifetimes: {
    attached:function() {
      const getUserInfo=wx.getStorageSync('userInfo')
      const getPhone=wx.getStorageSync('userPhone')
      const storeInfo=wx.getStorageSync('storeInfo')
      getDefaultCar().then(res=>{
        if(res.Success&&res.Data.licensePlateNumber){
          app.store.setState({
            'carKeyDefaultVal':res.Data.licensePlateNumber.slice(0,1),
            'createOrderParams.orderCarNo':res.Data.licensePlateNumber.slice(1)
          })
        }
      }).catch(err=>{
        app.store.setState({
          'createOrderParams.orderCarNo':''
        })
      })
      // 在组件实例进入页面节点树时执行  wx.getStorageSync('userInfo')
      app.store.setState({
        'createOrderParams.userName':getUserInfo.nickName,
        'createOrderParams.orderPhone':getPhone,
        'phoneInputTip': '',
        'usernameInputTip': '',
        'createOrderParams.orderRemark':''
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleC(){
      return;
    },
    showPopup() {
      app.store.setState({
        isShowCarKey: true,
      });
      this.setData({
        isShowLetterKey: false,
      });
    },
    // 确认的首字的时候，展示字母键盘
    onConfirmText() {
      this.setData({
        isShowLetterKey: true,
      });
    },
    changeInputPhone(e){
      app.store.setState({
        'createOrderParams.orderPhone':e.detail
      })
    },
    handleInputPhone(e) {
      const reg = /^1\d{10}$/
      if (reg.test(e.detail.value)) {
        app.store.setState({
          // 'createOrderParams.orderPhone': e.detail.value,
          'phoneInputTip': '',
        })
      } else {
        app.store.setState({
          'phoneInputTip': '请输入正确格式的手机号',
        })
      }
    },
    // 字母键盘显示-车牌所属省份影藏
    showLetterKey() {
      app.store.setState({
        isShowCarKey: false,
      });
      this.setData({
        isShowLetterKey: true,
      });
    },
    // 字母键盘相关事件
    onConfirm(){
      this.setData({
        isShowLetterKey: false,
      });
      // 校验
      this.checkVal(app.store.getState().createOrderParams.orderCarNo)
    },
    // 字母键盘相关事件
    handleInput(val){
      app.store.setState({
        'createOrderParams.orderCarNo': val.detail
      })
    },
    // 校验车牌号位数
    checkVal(val){
      if(val&&val.length<6||val.length>7){
        wx.showToast({
          title: '请输入正确车牌号码',
          icon: 'none',
          duration: 2000
        })
        this.setData({ 
          isValidate: false 
        });
        return false
      }
    },
    changeInputRemark(e){
      app.store.setState({
        'createOrderParams.orderRemark':e.detail
      })
    },
    changeInputName(e){
      app.store.setState({
        'createOrderParams.userName':e.detail
      })
    },
    handleInputName(e) {
      let username = e.detail.value?e.detail.value.replace(/(^\s*)|(\s*$)/g, ""):null;
      if (!username) {
        app.store.setState({
          'usernameInputTip': '请输入用户名',
        });
        return;
      }
      else{
        app.store.setState({
          'usernameInputTip': '',
        });
      }
      // app.store.setState({
      //   'createOrderParams.userName':username
      // })
    }
  }
})
