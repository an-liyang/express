// pages/goodsDetail/components/shareMask/index.js
Component({
  /**
   * 组件的属性列表  
   */
  properties: {
    getItemInfo:{
      type:Object,
      value:{
        spuTitle:'标题啦啦啦',
        defaultSkuInfo:{
          skuSalesPrice:100,
          skuSalesOldPrice:99
        }
      }
    },
    isShareShow:{
      type:Boolean,
      value:false
    },
    getImgUrl:{
      type:String,
      value:''
    },
    getQrCodeUrl:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    src:'',
    posterParams:{
      width:295,
      height:472,
      dealImg:'',
      dealQrCode:'',
      imgWidth:295,
      imgHeight:295,
      imgX:0,
      imgY:0,
      qrWidth:72,
      qrHeight:72,
      qrX:8,
      qrY:376,
      pixelRatio:1,
      arcRadius:14
    }
  },
  lifetimes: {
    attached: async function() {
      console.log(this.properties.getItemInfo)
      console.log(this.properties.getImgUrl)
      console.log(this.properties.getQrCodeUrl)
      // 在组件实例进入页面节点树时执行
      const _this=this;
      await _this.canvasToSrc().then(res=>{
        _this.setData({
          src:res
        })
      }).catch(err=>{
        console.log(err)
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
    getTemporatyRqCodeUrl(){
      const _this =this;
      return new Promise((resolve,reject)=>{
        if(!_this.properties.getQrCodeUrl){
          resolve()
          return
        }
        wx.getImageInfo({
          src: _this.properties.getQrCodeUrl,
          success: function (res) {
            _this.data.posterParams.dealQrCode = res.path
            resolve(res.path)
          },
          fail: function (err) {
            reject(err)
            wx.showToast({
              title: '二维码临时地址出错',
              icon: 'none',
            })
          },
        })
      })
    },
    getTemporatyImgUrl(){
      const _this =this;
      console.log("传递的商品图片：",_this.properties.getImgUrl)
      return new Promise(function (resolve,reject) {
        // if(!_this.properties.getImgUrl){resolve();return}
        wx.getImageInfo({
          src: _this.properties.getImgUrl,
          success: function (res) {
            _this.data.posterParams.dealImg = res.path
            resolve(res.path)
          },
          fail: function (err) {
            reject(err)
            wx.showToast({
              title: '商品图片临时地址出错',
              icon: 'none',
            })
          },
        })
      })
    },
    //处理文字多出省略号显示
    //   this.dealWords({
    //     ctx: ctx,//画布上下文
    //     fontSize: 16,//字体大小
    //     word: name,//需要处理的文字
    //     maxWidth: 100,//一行文字最大宽度
    //     x: 0,//文字在x轴要显示的位置
    //     y: 0,//文字在y轴要显示的位置
    //     maxLine: 3//文字最多显示的行数
    // })
    dealWords(options) {
      options.ctx.setFontSize(options.fontSize) //设置字体大小
      var allRow = Math.ceil(
        options.ctx.measureText(options.word).width / options.maxWidth
      ) //实际总共能分多少行
      var count = allRow >= options.maxLine ? options.maxLine : allRow //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数

      var endPos = 0 //当前字符串的截断点
      for (var j = 0; j < count; j++) {
        var nowStr = options.word.slice(endPos) //当前剩余的字符串
        var rowWid = 0 //每一行当前宽度
        if (options.ctx.measureText(nowStr).width > options.maxWidth) {
          //如果当前的字符串宽度大于最大宽度，然后开始截取
          for (var m = 0; m < nowStr.length; m++) {
            rowWid += options.ctx.measureText(nowStr[m]).width //当前字符串总宽度
            if (rowWid > options.maxWidth) {
              if (j === options.maxLine - 1) {
                //如果是最后一行
                options.ctx.fillText(
                  nowStr.slice(0, m - 1) + '...',
                  options.x,
                  options.y + (j + 1) * 18
                ) //(j+1)*18这是每一行的高度
              } else {
                options.ctx.fillText(
                  nowStr.slice(0, m),
                  options.x,
                  options.y + (j + 1) * 18
                )
              }
              endPos += m //下次截断点
              break
            }
          }
        } else {
          //如果当前的字符串宽度小于最大宽度就直接输出
          options.ctx.fillText(
            nowStr.slice(0),
            options.x,
            options.y + (j + 1) * 18
          )
        }
      }
    },
    async drawToCanvas(){
      const _this =this;
      await Promise.all([_this.getTemporatyRqCodeUrl(),_this.getTemporatyImgUrl(),_this.getPix()]).then((res)=>{
        console.log(
          '获取到的临时图片地址：',
          _this.data.posterParams.dealImg,
          _this.data.posterParams.dealQrCode
        );
        const ctx = wx.createCanvasContext('myCanvas')
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, _this.data.posterParams.width, _this.data.posterParams.height)
        ctx.setStrokeStyle('white')
        ctx.strokeStyle = 'white'; // 设置绘制圆形边框的颜色
        // 画img
        if(_this.data.posterParams.dealImg){
          ctx.drawImage(_this.data.posterParams.dealImg, _this.data.posterParams.imgX, _this.data.posterParams.imgY, _this.data.posterParams.imgWidth, _this.data.posterParams.imgHeight);
        }
        // 画rqcode
        if(_this.data.posterParams.dealQrCode){
          ctx.drawImage(_this.data.posterParams.dealQrCode, _this.data.posterParams.qrX, _this.data.posterParams.qrY, _this.data.posterParams.qrWidth, _this.data.posterParams.qrHeight);
        }
        // 描述语
        if(_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice||_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice==0){
          ctx.font="normal bold 12px"
          ctx.setFillStyle('#F5222D')
          ctx.setFontSize(24)
          ctx.setTextAlign('left')
          ctx.fillText(_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice||_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice==0?_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice:'', 26, _this.data.posterParams.imgHeight+40)
        }
        ctx.setFontSize(14)
        ctx.fillText('￥',12,this.data.posterParams.imgHeight+40)
        // 量售价的尺寸
        let saleWidth=ctx.measureText(_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice||_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice==0?'￥'+_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice:'').width;
        let getSalesPriceLen=_this.properties.getItemInfo.defaultSkuInfo.skuSalesPrice.toString()
        let oldPriceX=0;
        if(getSalesPriceLen.length>=8){
          oldPriceX=saleWidth+68
        }else{
          oldPriceX=saleWidth+40
        }
        // 测原价的文本尺寸,划线
        if(_this.properties.getItemInfo.defaultSkuInfo.skuSalesOldPrice){
          ctx.setFillStyle('#A3A09D')
          ctx.setFontSize(10)
          let textWidth=ctx.measureText(_this.properties.getItemInfo.defaultSkuInfo.skuSalesOldPrice||_this.properties.getItemInfo.defaultSkuInfo.skuSalesOldPrice==0?'￥'+_this.properties.getItemInfo.defaultSkuInfo.skuSalesOldPrice:'').width
          ctx.setStrokeStyle('#A3A09D');
          ctx.moveTo(oldPriceX,_this.data.posterParams.imgHeight+36);
          ctx.lineTo(oldPriceX+textWidth+2,_this.data.posterParams.imgHeight+36);
          // 划线结束
          ctx.setTextAlign('left')
          ctx.fillText(_this.properties.getItemInfo.defaultSkuInfo.skuSalesOldPrice||_this.properties.getItemInfo.defaultSkuInfo.skuSalesOldPrice==0?'￥'+_this.properties.getItemInfo.defaultSkuInfo.skuSalesOldPrice:'', oldPriceX, _this.data.posterParams.imgHeight+40)
        }

        ctx.setFillStyle('#5C5A58')
        ctx.font="normal 12px"
        _this.dealWords({
          ctx: ctx, //画布上下文
          fontSize: 12, //字体大小
          word: _this.properties.getItemInfo.spuTitle, //需要处理的文字
          maxWidth: 275, //一行文字最大宽度
          x: 12, //文字在x轴要显示的位置
          y: _this.data.posterParams.imgHeight+45, //文字在y轴要显示的位置
          maxLine: 1, //文字最多显示的行数
        })

        ctx.font="normal bold 16px PingFangSC-Bold, PingFang SC"
        ctx.setFillStyle('#292522')
        ctx.setFontSize(16)
        ctx.setTextAlign('left')
        ctx.fillText('长按识别小程序码查看', 92, _this.data.posterParams.imgHeight+123)
        /* 绘制 */
        ctx.stroke()
        ctx.draw()
      })
    },
    async canvasToSrc(){
      const _this=this;
      await _this.drawToCanvas()
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            fileType:'jpg',
            quality: 1,
            width: _this.data.posterParams.width* _this.data.posterParams.pixelRatio,
            height: _this.data.posterParams.height*_this.data.posterParams.pixelRatio,
            destWidth: _this.data.posterParams.width*_this.data.posterParams.pixelRatio, //乘以像素比，防止模糊
					  destHeight: _this.data.posterParams.height*_this.data.posterParams.pixelRatio,
            canvasId: 'myCanvas',
            success(res) {
              return resolve(res.tempFilePath)
            },
          })
        },500)
      })
    },
   //获取像素比
    getPix() {
      const _this = this
      wx.getSystemInfo({
        success(res) {
          _this.data.posterParams.pixelRatio = res.pixelRatio
        },
      })
    },
    saveToAlbum(){
      const _this=this;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功');
              wx.saveImageToPhotosAlbum({
                filePath: _this.data.src,
                success: function (res) {
                    console.log('图片已保存');
                    wx.showToast({
                      title: '已保存到手机相册',
                      icon: 'none',
                      duration: 2000
                    })
                    _this.onClickHide()
                    
                },
                fail: function (res) {
                    console.log('保存失败');
                }
            })
            },
            fail(){
              console.log("用户已拒绝授权，不会出现弹窗，进入fail回调...")
              wx.showModal({
                title: '是否授权保存图片到相册功能',
                // content: '请确认授权',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success (res) {
                        console.log('再次授权时，用户同意了授权相册功能...')
                      },
                      fail(){
                        console.log('再次授权时，用户又拒绝了授权相册功能...')
                      }
                    })
                  }
                }
              })
            }
          })
        }else{
          console.log("已经授权成功了，无需授权...")
          wx.saveImageToPhotosAlbum({
            filePath: _this.data.src,
            success: function (res) {
                console.log('图片已保存');
                wx.showToast({
                  title: '已保存到手机相册',
                  icon: 'none',
                  duration: 2000
                })
                _this.onClickHide()
            },
            fail: function (res) {
                console.log('保存失败');
            }
        })
        }
      },
      fail(){
        console.log('wx.getSetting---fail...')
      }
    })
    },
    onClickHide() {
      this.triggerEvent('handleHideShareMask')
    },
  }
})
