// pages/home/home.js
const { getTestTitles } = require('../../utils/api.js')
const { getUserId } = require('../../utils/storage.js')
const { showLoading, hideLoading, showError, vibrateShort, debounce } = require('../../utils/util.js')

Page({
  data: {
    testTitles: [],
    loading: false,
    refreshing: false,
    animationClass: ''
  },

  onLoad() {
    // 检查登录状态
    const userId = getUserId()
    if (!userId) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    this.loadTestTitles()
  },

  onShow() {
    // 页面显示动画
    this.setData({
      animationClass: 'fade-in'
    })
  },

  onPullDownRefresh() {
    this.refreshData()
  },

  /**
   * 加载测试主题列表
   */
  async loadTestTitles() {
    if (this.data.loading) return

    this.setData({ loading: true })
    showLoading('加载中...')

    try {
      const titles = await getTestTitles()
      
      if (Array.isArray(titles)) {
        // 按id倒序排列
        const sortedTitles = titles.sort((a, b) => b.id - a.id)
        
        this.setData({
          testTitles: sortedTitles,
          loading: false
        })

        // 添加卡片动画
        this.animateCards()
      } else {
        throw new Error('数据格式错误')
      }
    } catch (error) {
      console.error('加载测试主题失败:', error)
      this.setData({ loading: false })
    } finally {
      hideLoading()
    }
  },

  /**
   * 刷新数据
   */
  refreshData: debounce(async function() {
    this.setData({ refreshing: true })
    
    try {
      await this.loadTestTitles()
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      this.setData({ refreshing: false })
      wx.stopPullDownRefresh()
    }
  }, 1000),

  /**
   * 卡片动画
   */
  animateCards() {
    const cards = this.data.testTitles
    cards.forEach((card, index) => {
      setTimeout(() => {
        const key = `testTitles[${index}].animated`
        this.setData({
          [key]: true
        })
      }, index * 100)
    })
  },

  /**
   * 点击测试主题卡片
   */
  onTitleTap(e) {
    const { id } = e.currentTarget.dataset
    vibrateShort()

    // 卡片点击动画
    const index = this.data.testTitles.findIndex(item => item.id === id)
    if (index !== -1) {
      const key = `testTitles[${index}].clicking`
      this.setData({
        [key]: true
      })

      setTimeout(() => {
        this.setData({
          [key]: false
        })
        
        // 跳转到答题页
        wx.navigateTo({
          url: `/pages/question/question?titleId=${id}`
        })
      }, 200)
    }
  },

  /**
   * 重试加载
   */
  onRetry() {
    vibrateShort()
    this.loadTestTitles()
  },

  /**
   * 分享应用
   */
  onShareAppMessage() {
    return {
      title: '趣味人格测试 - 发现真实的自己',
      path: '/pages/login/login',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '趣味人格测试 - 发现真实的自己',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})