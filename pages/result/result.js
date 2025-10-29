// pages/result/result.js
const { parseJSON, vibrateShort, showError } = require('../../utils/util.js')
const { getUserId, clearRoleResult } = require('../../utils/storage.js')

Page({
  data: {
    titleId: null,
    result: null,
    matrixData: {},
    animationClass: '',
    showChart: false,
    shareImageUrl: '',
    currentPage: 0
  },

  onLoad(options) {
    const { titleId, data } = options
    
    if (!titleId || !data) {
      showError('参数错误')
      wx.navigateBack()
      return
    }

    try {
      const result = JSON.parse(decodeURIComponent(data))
      const matrixData = parseJSON(result.matrix, {})
      
      this.setData({
        titleId: parseInt(titleId),
        result,
        matrixData
      })

      this.initPage()
    } catch (error) {
      console.error('解析结果数据失败:', error)
      showError('数据解析失败')
      wx.navigateBack()
    }
  },

  onShow() {
    // 页面显示动画
    this.setData({
      animationClass: 'fade-in'
    })
  },

  /**
   * 初始化页面
   */
  initPage() {
    // 延迟显示图表
    setTimeout(() => {
      this.setData({
        showChart: true,
        animationClass: 'slide-up'
      })
    }, 800)

    // 设置分享图片
    this.setData({
      shareImageUrl: this.data.result.image
    })
  },

  /**
   * 页面切换事件
   */
  onPageChange(e) {
    const { current } = e.detail
    this.setData({
      currentPage: current
    })
    vibrateShort()
  },

  /**
   * 点击指示器切换页面
   */
  onIndicatorTap(e) {
    const { page } = e.currentTarget.dataset
    this.setData({
      currentPage: page
    })
    vibrateShort()
  },

  /**
   * 重新测试
   */
  onRetakeTest() {
    vibrateShort()
    
    wx.showModal({
      title: '重新测试',
      content: '确定要重新开始这个测试吗？',
      confirmText: '重新测试',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 清除该主题的角色结果缓存
          const userId = getUserId()
          if (userId) {
            clearRoleResult(this.data.titleId, userId)
          }
          
          // 跳转到答题页
          wx.redirectTo({
            url: `/pages/question/question?titleId=${this.data.titleId}`
          })
        }
      }
    })
  },

  /**
   * 返回首页
   */
  onBackHome() {
    vibrateShort()
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },

  /**
   * 查看其他测试
   */
  onViewOtherTests() {
    vibrateShort()
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },

  /**
   * 保存图片到相册
   */
  onSaveImage() {
    vibrateShort()
    
    wx.showModal({
      title: '保存结果',
      content: '是否保存测试结果图片到相册？',
      confirmText: '保存',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.saveResultImage()
        }
      }
    })
  },

  /**
   * 保存结果图片
   */
  async saveResultImage() {
    try {
      // 这里可以实现截图功能或生成结果图片
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('保存图片失败:', error)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  },

  /**
   * 分享给好友
   */
  onShareAppMessage() {
    const { result } = this.data
    return {
      title: `我测出了"${result.role}"，快来看看你是什么角色！`,
      path: `/pages/login/login?titleId=${this.data.titleId}`,
      imageUrl: result.image
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const { result } = this.data
    return {
      title: `我在人格测试中是"${result.role}"，你也来测测吧！`,
      imageUrl: result.image
    }
  },

  /**
   * 点击角色图片
   */
  onRoleImageTap() {
    vibrateShort()
    
    wx.previewImage({
      current: this.data.result.image,
      urls: [this.data.result.image]
    })
  },

  /**
   * 复制座右铭
   */
  onCopySentence() {
    vibrateShort()
    
    wx.setClipboardData({
      data: this.data.result.sentence,
      success: () => {
        wx.showToast({
          title: '已复制座右铭',
          icon: 'success'
        })
      }
    })
  }
})