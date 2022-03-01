// components/comLetterKey/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    curVal: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyList: ['港', '澳', '学', '警', '领'], 
    numList: ['1', '2', '3', '4', '5','6', '7', '8', '9', '0'], 
    letterList: [
      ['Q', 'W', 'E', 'R', 'T','Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G','H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B','N', 'M']
    ],
    curValue:''
  },
  lifetimes: {
    attached: function() {
      console.log("当前车牌号数据：",this.properties.curVal)
      this.setData({
        curValue: this.properties.curVal
      })
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 防止点击空白处隐藏键盘
    catchtapFalse(){
      return false
    },
    onConfirm() {
      this.triggerEvent('onConfirm',this.data.curValue)
    },
    handleInput(e) {
      if(this.data.curValue.length<7){
        this.setData({
          curValue: this.data.curValue + e.currentTarget.dataset.val
        })
        this.triggerEvent('handleInput',this.data.curValue)
      }
    },
    handleDel() {
      if(this.data.curValue.length>=1){
        this.setData({
          curValue: this.data.curValue.substring(0,this.data.curValue.length-1)
        })
        this.triggerEvent('handleInput',this.data.curValue)
      }
    }
  }
})
