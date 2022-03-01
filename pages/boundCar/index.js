// pages/boundCar/index.js
const app = getApp()
import {getCarDetail,addCar,editCar,getDefaultCar} from '../../apis/carRelationApis.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    isFromH5:false,
    isEdit: false, // 是否是编辑
    isValidate: false, // 保存按钮的状态
    carModel: '', //选中的车型
    currentCar: {
      carLogo: '',
      cardId: '', // 车款ID
      csId: '', // 车型ID
      brandId: '', //品牌id
      cardName: '', // 车款名称	
      csName: '', // 车型名称	
      brandName: '', // 品牌名称
      licensePlateNumber: '', // 车牌号
      vin: '', // 车架号
      isPresent: false, // 是否为当前爱车
    },
    selectFlag: {
      id: '', //当前车辆id
      type: '', // 车辆操作类型
      isset: true, //是否展示设置为默认
    },
    isset: true, //没有或者只有1辆的时候不展示
    issetOld: true, //非默认车辆展示
    isShowLetterKey: false, // 字母键盘
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
    // 判断底部按钮状态
    if(this.data.carModel&&!this.data.currentCar.vin||(this.data.currentCar.vin&&this.data.currentCar.vin.length>=17)){
      this.setData({ 
        isValidate: true 
      });
    }else{
      this.setData({ 
        isValidate: false 
      });
    }
  },
  // 字母键盘相关事件
  onConfirm(val){
    // console.log(val.detail,'输入的值');
    this.setData({
      isShowLetterKey: false,
    });
    // 校验
    this.checkVal(val.detail)
  },
  handleInput(val){
    // console.log(val.detail,'输入的值');
    this.setData({
      "currentCar.licensePlateNumber": val.detail,
    });
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
  // 点击页面，车牌所属省份-弹框隐藏，字母键盘隐藏
  handleSubOrderPage(){
    app.store.setState({
      isShowCarKey: false,
    });
    if(this.data.isShowLetterKey){
      this.setData({
        isShowLetterKey: false,
      });
      // 校验
      this.checkVal(this.data.currentCar.licensePlateNumber)
    }
  },
  // 车牌所属省份-弹框-字母键盘隐藏
  showPopup(){
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
  // 默认爱车开关
  handleChange({detail}) {
    this.setData({ 
      "currentCar.isPresent": detail 
    });
  },
  // 输入框失去焦点，判断必填项
	bindBlur() {
    // console.log(this.data.currentCar);
    if(this.data.currentCar.vin&&this.data.currentCar.vin.length<17){
      wx.showToast({
        title: '请输入正确车架号',
        icon: 'none',
        duration: 2000,
      })
      this.setData({ 
        isValidate: false 
      });
      return false
    }
    // 判断底部按钮状态
    if(this.data.currentCar.licensePlateNumber&&this.data.carModel){
      this.setData({ 
        isValidate: true 
      });
    }else{
      this.setData({ 
        isValidate: false 
      });
    }
  },
  // 输入时赋值
  bindInput(e) {
    // console.log(e.detail);
    var key = e.currentTarget.dataset.name;
    var value = e.detail;
    this.setData({
      [`currentCar.${key}`]: value
    })
    // console.log(e);
  },
  // 选择车型
  toSelectCarModels() {
    wx.redirectTo({
      url: '../../pages/selectCarModels/index',
    })
  },
  // 保存爱车
  saveCar(e) {
    if(!this.data.isValidate){
      return false
    }
    const data = JSON.parse(JSON.stringify(this.data.currentCar)) 
    // 是否当前爱车 1是0否
    data.licensePlateNumber = app.store.getState().carKeyDefaultVal+this.data.currentCar.licensePlateNumber,
    data.isPresent = this.data.currentCar.isPresent?'1':'0'
    data.id = this.data.currentCar.id?this.data.currentCar.id:''
    if(this.data.isEdit){
      editCar(data).then((res) => {
        const _this =  this;
        if (res.Success) {
          wx.redirectTo({
            url: '../../pages/myLoveCar/index?type=look',
          })
        }
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 2000
        })
        console.log('编辑车辆', res)
      })
      .catch((err) => {
        wx.showToast({
          title: '网络开小差了',
          icon: 'none',
          duration: 2000
        })
      })
    }else{
      if(this.data.isset=='false'){
        data.isPresent = '1'
      }
      addCar(data).then((res) => {
        const _this =  this;
        if (res.Success) {
          wx.redirectTo({
            url: '../../pages/myLoveCar/index?type=look',
          })
        }
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 2000
        })
        console.log('添加车辆', res)
      })
      .catch((err) => {
        wx.showToast({
          title: '网络开小差了',
          icon: 'none',
          duration: 2000
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const _this =  this;
    // 如果不是h5跳转回来，记录车辆操作状态
    // 不是h5跳转回来，修改车型信息
    if(!options.brandId){
      const data = {
        "id": options.carId||'',
        "type": options.type,
        "isset": options.isset,
      }
      wx.setStorage({
				key:"selectFlag",
				data:JSON.stringify(data)
      })
      this.setData({
        isFromH5:false
      })
    }else{
      this.setData({
        isFromH5:true
      })
      if(!options.serialName && !options.serialId){return;}
      _this.setData({
        "currentCar.carLogo": options.brandLogo || '',
        "currentCar.cardId": options.carId || '', // 车款ID
        "currentCar.csId": options.serialId || '', // 车型ID
        "currentCar.brandId": options.brandId || '', //品牌id
        "currentCar.cardName": options.carName || '', // 车款名称	
        "currentCar.csName": options.serialName || '', // 车型名称	
        "currentCar.brandName": options.brandName || '', // 品牌名称
        // 车型赋值
        carModel: options.brandId?decodeURI(options.brandName)+decodeURI(options.serialName)+decodeURI(options.carName):''
      })
      // 判断底部按钮状态
      if(options.brandId&&_this.data.currentCar.licensePlateNumber){
        _this.setData({
          isValidate: true
        })
      }
    }
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 手机虚拟键返回，会出现不走onload的情况
    // app.store.setState({
    //   navBkgColor:'#FFFFFF',
    //   navFontColor:'#292522',
    //   navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    // })
    app.store.setState({
      isShowCarKey: false,
    });
    const _this =  this;
    wx.getStorage({
      key: 'selectFlag',
      success: async (res1) => {
        const result = JSON.parse(res1.data)
        // console.log(result);
        // 修改标题，根据功能变化
        const title = result.type === 'add'?'添加爱车':'编辑爱车'
        _this.setData({
          // title: title,
          isset: result.isset
        })
        wx.setNavigationBarTitle({
          title: title
        })
        // 编辑获取新车辆信息
        if(result.type === 'edit'){
          _this.setData({
            isEdit: true
          })
          const res = await getCarDetail({ carId:result.id })
          if (res.Success) {
            if(!_this.data.isFromH5){
              _this.setData({
                "currentCar.carLogo":res.Data.carLogo,
                "currentCar.cardId": res.Data.cardId, // 车款ID
                "currentCar.csId": res.Data.csId, // 车型ID
                "currentCar.brandId": res.Data.brandId, //品牌id
                "currentCar.cardName":res.Data.cardName,
                "currentCar.csName":res.Data.csName,
                "currentCar.brandName":res.Data.brandName,
                carModel: res.Data.brandName+res.Data.csName+res.Data.cardName, //车型赋值
              })
            }
            _this.setData({
              "currentCar.licensePlateNumber": res.Data.licensePlateNumber.substr(1),
              "currentCar.vin": res.Data.vin,
              "currentCar.isPresent": res.Data.isPresent==1?true:false,
              "currentCar.id": res.Data.id,
              isValidate: true,
              issetOld: res.Data.isPresent==1?false:true
            })
            // console.log(_this.data.currentCar);
            // 车牌省市赋值
            app.store.setState({
              carKeyDefaultVal: res.Data.licensePlateNumber.substr(0,1),
            });
          }
        }else{
          _this.setData({
            isEdit: false
          })
          // 默认车牌省份
          getDefaultCar().then(res=>{
            if(res.Success&&res.Data.licensePlateNumber){
              app.store.setState({
                'carKeyDefaultVal':res.Data.licensePlateNumber.slice(0,1),
              })
            }
          })
        }
      }
    })
  },
})