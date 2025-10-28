// pages/login/login.js
const { login } = require('../../utils/api.js')
const { setUserId, getUserId, getShareSource, clearShareSource } = require('../../utils/storage.js')
const { showLoading, hideLoading, showError, vibrateShort } = require('../../utils/util.js')

Page({
  data: {
    loading: false,
    animationClass: ''
  },

  onLoad(options) {
    // 检查是否已经登录
    const userId = getUserId()
    if (userId) {
      this.redirectToHome()
      return
    }

    // 启动动画
    setTimeout(() => {
      this.setData({
        animationClass: 'fade-in'
      })
    }, 100)

    // 检查分享参数
    if (options.titleId) {
      const { setShareSource } = require('../../utils/storage.js')
      setShareSource(options.titleId)
    }
  },

  onShow() {
    // 页面显示时的动画
    this.setData({
      animationClass: 'slide-up'
    })
  },

  /**
   * 获取用户信息并登录
   */
  getUserProfile() {
    vibrateShort()
    
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo
        this.performLogin(userInfo.nickName)
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        showError('需要授权才能使用哦~')
      }
    })
  },

  /**
   * 执行登录
   */
  async performLogin(nickName) {
    this.setData({ loading: true })
    showLoading('登录中...')

    try {
      const result = await login(nickName)
      
      if (result && result.id) {
        // 保存用户信息
        setUserId(result.id)
        const app = getApp()
        app.globalData.userInfo = {
          id: result.id,
          name: result.name
        }

        hideLoading()
        
        // 登录成功动画
        this.setData({
          animationClass: 'scale-in'
        })

        setTimeout(() => {
          this.redirectToHome()
        }, 500)
      } else {
        throw new Error('登录返回数据异常')
      }
    } catch (error) {
      console.error('登录失败:', error)
      hideLoading()
      this.setData({ loading: false })
    }
  },

  /**
   * 跳转到首页或指定页面
   */
  redirectToHome() {
    const shareSource = getShareSource()
    
    if (shareSource) {
      // 来自分享，直接跳转到对应测试
      clearShareSource()
      wx.redirectTo({
        url: `/pages/question/question?titleId=${shareSource}`
      })
    } else {
      // 正常跳转到首页
      wx.redirectTo({
        url: '/pages/home/home'
      })
    }
  },

  /**
   * 一键登录（使用默认昵称）
   */
  quickLogin() {
    vibrateShort()
    const defaultName = `用户${Date.now().toString().slice(-6)}`
    this.performLogin(defaultName)
  }
})