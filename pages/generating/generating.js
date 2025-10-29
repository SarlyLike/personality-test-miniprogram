// pages/generating/generating.js
const { getRole } = require('../../utils/api.js')
const { getUserId, setRoleResult } = require('../../utils/storage.js')
const { showError, vibrateShort } = require('../../utils/util.js')

Page({
  data: {
    titleId: null,
    generating: false,
    animationClass: '',
    particles: [],
    progressText: '正在分析你的答案...',
    progressSteps: [
      '正在分析你的答案...',
      '正在解读你的性格特征...',
      '正在匹配最适合的角色...',
      '正在生成专属结果...',
      '马上就好了...'
    ],
    currentStep: 0
  },

  onLoad(options) {
    const { titleId } = options
    if (!titleId) {
      showError('参数错误')
      wx.navigateBack()
      return
    }

    // 检查登录状态
    const userId = getUserId()
    if (!userId) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    this.setData({ titleId: parseInt(titleId) })
    this.initPage()
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
    // 生成粒子效果
    this.generateParticles()
    
    // 启动入场动画
    setTimeout(() => {
      this.setData({
        animationClass: 'scale-in'
      })
    }, 500)
  },

  /**
   * 生成粒子
   */
  generateParticles() {
    const particles = []
    for (let i = 0; i < 20; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 3
      })
    }
    this.setData({ particles })
  },

  /**
   * 开始生成角色
   */
  async startGeneration() {
    if (this.data.generating) return

    // 设置生成状态和初始进度
    this.setData({ 
      generating: true,
      currentStep: 0,
      progressText: this.data.progressSteps[0]
    })

    // 启动进度动画
    this.startProgressAnimation()

    // 模拟生成过程
    await this.simulateGeneration()

    // 获取真实结果
    await this.fetchResult()
  },

  /**
   * 启动进度动画
   */
  startProgressAnimation() {
    const updateProgress = () => {
      if (!this.data.generating) return

      const nextStep = (this.data.currentStep + 1) % this.data.progressSteps.length
      this.setData({
        currentStep: nextStep,
        progressText: this.data.progressSteps[nextStep]
      })

      if (this.data.generating) {
        setTimeout(updateProgress, 1500)
      }
    }

    setTimeout(updateProgress, 1500)
  },

  /**
   * 模拟生成过程
   */
  simulateGeneration() {
    return new Promise(resolve => {
      // 模拟2-4秒的生成时间
      const duration = 2000 + Math.random() * 2000
      setTimeout(resolve, duration)
    })
  },

  /**
   * 获取结果
   */
  async fetchResult() {
    try {
      const userId = getUserId()
      const result = await getRole({
        titleId: this.data.titleId,
        userId: userId
      })

      if (result) {
        // 保存角色结果到本地缓存
        setRoleResult(this.data.titleId, userId, result)
        
        // 生成完成动画
        this.setData({
          generating: false,
          progressText: '生成完成！',
          animationClass: 'pulse'
        })

        // 延迟跳转到结果页
        setTimeout(() => {
          wx.redirectTo({
            url: `/pages/result/result?titleId=${this.data.titleId}&data=${encodeURIComponent(JSON.stringify(result))}`
          })
        }, 1000)
      } else {
        throw new Error('获取结果失败')
      }
    } catch (error) {
      console.error('获取角色结果失败:', error)
      this.setData({ 
        generating: false,
        progressText: '生成失败，请重试'
      })
      
      setTimeout(() => {
        this.setData({
          progressText: '点击重新生成'
        })
      }, 2000)
    }
  },

  /**
   * 点击生成角色按钮
   */
  onGenerateRole() {
    // 立即隐藏按钮，显示生成状态
    vibrateShort()
    this.setData({ generating: true })
    
    // 开始生成流程
    this.startGeneration()
  },

  /**
   * 重试生成
   */
  onRetry() {
    this.startGeneration()
  },

  /**
   * 返回首页
   */
  onBackHome() {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  }
})