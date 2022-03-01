// pages/goodsDetail/index.js
import { getGoodsDetail, checkGoods, createQrCode,getDetailScene } from '../../apis/goodsRelationApis.js'
import { goodsAvaCouponLabel } from '../../apis/couponRelationApi.js'
import {getPersonalCenterInfo} from './../../apis/common.js'
import { baseInfoJudge } from './../../utils/functional/index.js'
import { login } from './../../utils/functional/loginAuth.js'
import {getScene} from '../../utils/util.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClicked: false,//是否可点击
    getQrCodeUrl: '',
    time: 0, // 倒计时
    timeData: {}, // 时间对象
    currentImg: '1',
    duration: 500,  // 滑动动画时长
    isHasGoods: true, // 是否有货
    isShowTop: false, // 是否展示回到顶部
    top: 0, //详情距离顶部的距离
    isShowSelet: false, // 是否展示选择规格
    isSelectName: '', // 选中的规格名字
    isSelectObj: {}, // 选中的规格对象
    isDays: true, //是否大于12小时
    isTimeCutShow: false, //是否展示倒计时
    timer: null, //定时任务，是否展示天数、时分秒
    isShareShow: false, //分享
    goodsInfo: {}, // 商品信息
    // 弹框数据
    isShowTip: false,
    msg: '',
    tipType: '0', // 0限购，1无货，2下架
    isClickBuy: false, // 防止重复点击购买,
    goodsAvaCouponLabelData:[],// 商品可用优惠券标签
    isRequsted: false
  },
  // 商品可用优惠-标签列表
  requestGoodsAvaCouponLabel(){
    const _this = this
    goodsAvaCouponLabel({skuId:_this.data.isSelectObj.skuId}).then(res=>{
      // console.log(res);
      if(res.Success){
        if(res.Data){
          _this.setData({
            goodsAvaCouponLabelData: [...res.Data[0].list]
          })
        }else{
          _this.setData({
            goodsAvaCouponLabelData: []
          })
        }
      }
    }).catch(err=>{
      
    })
  },
  // 优惠券弹框
  toRecived(){
    app.store.setState({
      'goodsCouponParams.current': 1,
      'goodsCouponParams.total': null,
      goodsAvaCouponListData: Array.from([]),
      isMoreCoupon: true
    })
    if(app.globalData.isAuthAll){
      app.store.setState({
        isShowCouponMask:!app.store.getState().isShowCouponMask
      })
      // 获取当前sku的券列表
      this.requestGoodsAvaCoupon(this.data.isSelectObj.skuId);
    }else{
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
        curClickAuthBtn: 'getCoupon'
      })
     
      baseInfoJudge(()=>{
        // 用户信息授权成功，刷新页面
        app.store.setState({
          active: 'getCoupon',
        });
        app.store.setState({
          isShowCouponMask:!app.store.getState().isShowCouponMask
        })
        // 获取当前sku的券列表
        this.requestGoodsAvaCoupon(this.data.isSelectObj.skuId);
      })
    }
  },
  // 图片预览
  previewImg(e) {
    // console.log(e);
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: e.currentTarget.dataset.list      // urls数组项必须是 string
    })
  },
  // 单个图片预览
  previewImgOne(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: [e.currentTarget.dataset.img]      // urls数组项必须是 string
    })
  },
  bindchange(e) {
    // console.log(e.detail);
    this.setData({
      currentImg: e.detail.current+1
    })
  },
  // 多规格选择-显示与关闭
  selectSpecifications() {
    this.setData({
      isShowSelet: true,
      // isSelectObj: this.data.goodsInfo.defaultSkuInfo,
      isSelectName: this.data.goodsInfo.defaultSkuInfo.skuSalesSpecifications
    })
  },
  closeSpecifications() {
    this.setData({
      isShowSelet: false
    })
  },
  // 切换规格
  handleTrigger(e) {
    // console.log(e.currentTarget.dataset.name);
    this.setData({
      isSelectName: e.currentTarget.dataset.name,
      isSelectObj: e.currentTarget.dataset.obj
    })
  },
  // 确认选择规格
  confirmSpecifications() {
    this.setData({
      isShowSelet: false,
      "goodsInfo.defaultSkuInfo": Object.assign({}, this.data.isSelectObj),
      isHasGoods: this.data.isSelectObj.skuReleaseCount > 0 ? true : false
    });
    // 生成商品二维码
    this.requestQrCode(this.data.goodsInfo.spuId,this.data.isSelectObj.skuId)
    // 获取当前sku优惠券
    this.requestGoodsAvaCouponLabel()
  },
  // 倒计时改变
  onChange(e) {
    // console.log(e);
    this.setData({
      timeData: e.detail,
    });
    if(e.detail.days == 0&&this.data.isDays==true){
      let dateEnd = this.data.goodsInfo.spuShelfEndTime
      let dateBegin = new Date();//获取当前时间
      let dateDiff = dateEnd - dateBegin.getTime();//时间差的毫秒数
      this.setData({
        isDays: false,
        time: dateDiff
      })
    }
  },
  // 拨打电话
  handleToCall() {
    // console.log(app.store.$state.orderDetailData);
    const getPhone = app.store.$state.storeInfo.tenantAppointmentPhone ? app.store.$state.storeInfo.tenantAppointmentPhone : '4000168168'
    wx.showActionSheet({
      itemList: [getPhone],
      success(res) {
        wx.makePhoneCall({
          phoneNumber: getPhone
        })
      },
      fail(res) {
        console.log('wx.showActionSheet拉起异常', res.errMsg)
      }
    })
  },

  // 预约、购买 授权判断
  handleToBuy() {
    const _this = this
     // 是否可点击判断，授权接口api不支持在节流回调里调用
     if(this.data.isClicked){return false}
     this.setData({
       isClicked: true,
     })
     setTimeout(()=>{
       _this.setData({
         isClicked: false
       })
     },2000)
    if(app.globalData.isAuthAll){
      _this.toBuy()
    }else{
      // 标注当前授权按钮的类型，用以手机授权成功的页面更新回调
      app.store.setState({
        curClickAuthBtn: 'toBuy'
      })
      baseInfoJudge(()=>{
        // 用户信息授权成功，刷新页面
        app.store.setState({
          active: 'toBuy',
        });
        _this.toBuy()
      })
    }
  },
  // 刷新页面获取用户信息
  refresh(){
    getPersonalCenterInfo({bussinessId: app.globalData.bussinessId}).then(res=>{
      if(res.Success){
        wx.setStorageSync('userInfo', res.Data)
        wx.setStorageSync('userPhone', res.Data.wechatPhone)
      }
      console.log('授权之后，刷新用户信息成功...',res)
    }).catch(err=>{
      console.log('授权之后，刷新用户信息失败...',err)
    })
  },
  // 手机号授权成功
  updatePageFunc() {
    // 详情页面授权按钮的类型：toBuy
    const getCurType=app.store.getState().curClickAuthBtn
    if(getCurType=='toBuy') {
      app.store.setState({
        active: 'toBuy',
      });
      this.toBuy()
    }else if(getCurType=='getCoupon'){
      app.store.setState({
        active: 'getCoupon',
      });
      console.log(333333);
    }
  },
  // 预约、购买
  // 商品类型 1免费 2收费 （限时标签）
  async toBuy() {
    const _this = this
    await _this.refresh()
    const data = {
      skuId: _this.data.isSelectObj.skuId,
      skuSalesPrice: _this.data.isSelectObj.skuSalesPrice
    }
    checkGoods(data).then(res => {
      console.log('商品校验',res);
      _this.setData({
        isClickBuy: false
      })
      if (res.Success) {
        // 0 未上架  1上架中  2 已下架 3待上架 4 已封禁
        if (res.Data.spuStatus == 2||res.Data.spuStatus == 4) {
          _this.setData({
            isShowTip: true,
            msg: '商品下架了，试试别的吧',
            tipType: '2'
          })
          return false;
        }
        if (res.Data.skuReleaseCount == 0) {
          _this.setData({
            isShowTip: true,
            msg: '商品被抢光了，试试别的吧',
            tipType: '1'
          })
          return false;
        }
        // 1限购 2不限购
        if (res.Data.spuLimitationType == 1 && res.Data.orderedCount >= res.Data.spuLimitationCount ) {
          _this.setData({
            isShowTip: true,
            msg: '此商品为限购商品，您已超出了购买数量',
            tipType: '0'
          })
          return false;
        }
        if (res.Data.changePrice) {
          wx.showToast({
            title: '价格有变动，请刷新后重试',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        _this.dealGoodsDetailData(_this.data.goodsInfo)
        let spuId = _this.data.goodsInfo.spuId;
        let skuId = _this.data.isSelectObj.skuId;
        let skuSalesSpecifications = _this.data.isSelectObj.skuSalesSpecifications;
        let orderAmount = _this.data.isSelectObj.skuSalesPrice;
        let bussinessId = app.globalData.bussinessId;
        let salePrice=_this.data.isSelectObj.skuSalesPrice

        let url = _this.data.goodsInfo.spuType == 1 ? '../../pages/freeOrder/index' : '../../pages/payOrder/index';
        wx.navigateTo({
          url: `${url}?spuId=${spuId}&skuId=${skuId}&skuSalesSpecifications=${skuSalesSpecifications}&orderAmount=${orderAmount}&bussinessId=${bussinessId}&spuType=${_this.data.goodsInfo.spuType}&salePrice=${salePrice}`,
        })
      }
    }).catch(()=>{
      _this.setData({
        isClickBuy: false
      })
    }).catch(err=>{
      wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000,
      })
    })
  },
  // 我知道了
  onClose() {
    this.setData({
      isShowTip: false,
      msg: ''
    })
    switch (this.data.tipType) {
      case '1':
        this.requestGoodsDetail(this.goodsInfo.spuId)
        break;
      case '2':
        wx.switchTab({
          url: '/pages/servicePage/index'
        })
        break;
      default:
        break;
    }
  },
  // 分享
  handleShare() {
    this.setData({ isShareShow: true });
  },
  handleHideShareMask() {
    this.setData({ isShareShow: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // loading开启
    app.store.setState({
      isShowLoading:true,
    })
    const _this = this
    _this.setData({
      isRequsted: false
    })
    const skuId = options.skuId?options.skuId:''
    console.log('二维码携带参数',options.scene,getScene(options.scene));
    if(options.scene){
      const getObj = getScene(options.scene)
      login().then(res => {
        // setTimeout(()=>{
          getDetailScene({ k: getObj.k }).then(res1=>{
            if(res1.Success){
              app.getStoreInfo()
              _this.requestGoodsDetail(res1.Data.spuId,res1.Data.skuId)
            }
          })
        // },800)
      })
    }else{
      login().then(res => {
        // setTimeout(()=>{
          app.getStoreInfo()
          _this.requestGoodsDetail(options.spuId,skuId)
        // },800)
      })
    }
  },
  // 生成商品二维码
  requestQrCode(spuId,skuId){
    const _this = this
    createQrCode({
      spuId: spuId,
      skuId: skuId
    }).then(res=>{
      if(res.Success){
        _this.setData({
          getQrCodeUrl: res.Data
        })
      }else{
        wx.getStorage({
          key: 'storeInfo',
          success (res) {
            console.log('生成失败获取店铺二维码：',res.data.wechatQrcode);
            _this.setData({
              getQrCodeUrl: res.data.wechatQrcode
            })
          }
        })
      }
    })
  },
  // 商品详情
  requestGoodsDetail(spuId,skuId) {
    console.log("当前businessid:",app.globalData.bussinessId,wx.getStorageSync('bussinessId'))
    console.log("进入商品详情页接口:",spuId,skuId)
    getGoodsDetail({ spuId: spuId }).then((res) => {
      const _this = this;
      if (res.Success) {
        console.log("商品详情页接口返回参数：",res)
        // loading关闭
        app.store.setState({
          isShowLoading:false,
        })
        _this.setData({
          isRequsted: true
        })
        res.Data.spuSalesContext = res.Data.spuSalesContext.replace(/\<img/gi, '<img class="rich-img" ');//正则给img标签增加class
        // 多规格商品扫码进入详情
        if(skuId && res.Data.skuInfoList.length>1){
          const defaultobj = res.Data.skuInfoList.find((item)=>{
            return item.skuId == skuId
          })
          res.Data.defaultSkuInfo = Object.assign({},defaultobj)
          console.log('多规格商品扫码进入详情：',res.Data.defaultSkuInfo);
        }
        // 生成商品二维码
        _this.requestQrCode(res.Data.spuId,res.Data.defaultSkuInfo.skuId)
        // 赋值
        _this.setData({
          goodsInfo: res.Data,
        })
        // 商品状态  0 未上架  1上架中  2 已下架
        if(res.Data.spuStatus == 2||res.Data.spuStatus == 4){
          wx.showToast({
            title: '此商品已下架',
            icon: 'none',
            duration: 2000,
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/servicePage/index'
            })
          },2000)
          return
        }
        _this.dealGoodsDetailData(_this.data.goodsInfo)
        // 默认---选中的规格
        _this.setData({
          isSelectObj: res.Data.defaultSkuInfo,
        })
        // 默认---选中的规格--是否有货
        if (res.Data.defaultSkuInfo.skuReleaseCount == 0) {
          _this.setData({
            isHasGoods: false,
          })
        }
        // 倒计时
        // spuCountdownOpen 0 开启 1不开启
        if (res.Data.spuCountdownOpen == 0) {
          clearInterval(_this.data.timer)
          _this.data.timer = setInterval(() => {
            let dateEnd = res.Data.spuShelfEndTime;
            let dateBegin = new Date();//获取当前时间
            let dateDiff = dateEnd - dateBegin.getTime();//时间差的毫秒数
            let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
            console.log(" 相差 " + dayDiff + "天")
            if (dayDiff < 0) {
              clearInterval(_this.data.timer)
              return false
            }
            // 倒计时开启时间
            let dateStart = res.Data.spuCountdownTime * 3600000;
            if (dateDiff <= dateStart) {
              _this.setData({
                isTimeCutShow: true
              })
              clearInterval(_this.data.timer)
              if (dayDiff == 0) {
                _this.setData({
                  isDays: false,
                  time: dateDiff
                })
              } else {
                _this.setData({
                  isDays: true,
                  time: dateDiff
                })
                // console.log(_this.data.time,66666);
              }
              _this.setData({
                isTimeCutShow: true
              })
            } else {
              _this.setData({
                isTimeCutShow: false
              })
            }
          }, 1000)
        }
      }
      // 获取详情的高度
      let query = wx.createSelectorQuery()
      wx.nextTick(() => {
        query.select('#goods-detail').boundingClientRect((rect) => {
          if(rect){
            let top = rect.top
            _this.setData({
              top: top
            })
          }
        }).exec()
      })
      // 获取当前sku优惠券
      _this.requestGoodsAvaCouponLabel()
      console.log('商品详情', res)
    })
      .catch((err) => {
        console.log('商品详情', err)
      })
  },
  // 回到顶部
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200
    })
  },
  // 监听页面滚动
  onPageScroll: function (res) {
    // console.log(res)
    if (res.scrollTop > this.data.top) {
      this.setData({ isShowTop: true })
    } else {
      this.setData({ isShowTop: false })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // login()
    app.store.setState({
      navBkgColor:'#FFFFFF',
      navFontColor:'#292522',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
      isShowCouponMask: false // 弹框组件全局公用，页面初始化，不展示
    })
  },
  onHide: function () {
    console.log('onHide');
    clearInterval(this.data.timer)
  },
  onUnload: function () {
    console.log('onUnload');
    clearInterval(this.data.timer)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('进入商品详情页的分享事件...',app.globalData.bussinessId,wx.getStorageSync('bussinessId'))
    var _this = this;
    var url = "pages/goodsDetail/index";
    // if (app.globalData.bussinessId) {
      console.log("详情页分享函数触发-----",app.globalData.bussinessId)
      url += "?bussinessId=" + app.globalData.bussinessId + '&spuId=' + _this.data.goodsInfo.spuId + '&skuId=' + _this.data.isSelectObj.skuId;
    // }
    return {
      title: _this.data.goodsInfo.spuTitle,
      path: url,
      imageUrl: this.data.goodsInfo.spuImages[0],
    }
  },
})