// pages/question/question.js
const { getQuestions, submitAnswer, getRole } = require('../../utils/api.js')
const { getUserId, setQuestionProgress, getQuestionProgress, clearQuestionProgress, setRoleResult } = require('../../utils/storage.js')
const { showLoading, hideLoading, showError, vibrateShort, getPageParams } = require('../../utils/util.js')

Page({
  data: {
    titleId: null,
    questions: [],
    currentIndex: 0,
    totalQuestions: 0,
    currentQuestion: null,
    answers: [],
    showAnswers: false,
    loading: false,
    animationClass: '',
    progressPercent: 0
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
    this.loadQuestions()
  },

  onShow() {
    // 禁用返回按钮（防止用户意外退出）
    wx.hideHomeButton()
  },

  onUnload() {
    // 保存答题进度
    if (this.data.currentIndex > 0 && this.data.currentIndex < this.data.totalQuestions) {
      setQuestionProgress(this.data.titleId, {
        currentIndex: this.data.currentIndex,
        answers: this.data.answers
      })
    }
  },

  /**
   * 加载题目列表
   */
  async loadQuestions() {
    this.setData({ loading: true })
    showLoading('加载题目中...')

    try {
      const questions = await getQuestions(this.data.titleId)
      
      if (Array.isArray(questions) && questions.length > 0) {
        // 检查是否有保存的进度
        const progress = getQuestionProgress(this.data.titleId)
        
        this.setData({
          questions,
          totalQuestions: questions.length,
          currentIndex: progress.currentIndex || 0,
          answers: progress.answers || [],
          currentQuestion: questions[progress.currentIndex || 0],
          loading: false
        })

        this.updateProgress()
        this.animateQuestionIn()
      } else {
        throw new Error('题目数据为空')
      }
    } catch (error) {
      console.error('加载题目失败:', error)
      this.setData({ loading: false })
      
      wx.showModal({
        title: '加载失败',
        content: '题目加载失败，是否重试？',
        success: (res) => {
          if (res.confirm) {
            this.loadQuestions()
          } else {
            wx.navigateBack()
          }
        }
      })
    } finally {
      hideLoading()
    }
  },

  /**
   * 更新进度
   */
  updateProgress() {
    const percent = (this.data.currentIndex / this.data.totalQuestions) * 100
    this.setData({ progressPercent: percent })
  },

  /**
   * 题目入场动画
   */
  animateQuestionIn() {
    this.setData({
      animationClass: 'fade-in',
      showAnswers: false
    })
  },

  /**
   * 点击题目图片显示答案选项
   */
  onQuestionImageTap() {
    if (this.data.showAnswers) return
    
    vibrateShort()
    this.setData({
      showAnswers: true,
      animationClass: 'scale-in'
    })
  },

  /**
   * 选择答案
   */
  async onAnswerSelect(e) {
    const { answerId, answerKey } = e.currentTarget.dataset
    vibrateShort()

    // 高亮选中的答案
    this.highlightAnswer(answerKey)

    // 异步提交答案（不等待结果）
    this.submitCurrentAnswer(parseInt(answerId))

    // 延迟切换到下一题
    setTimeout(() => {
      this.nextQuestion()
    }, 400)
  },

  /**
   * 高亮答案
   */
  highlightAnswer(answerKey) {
    this.setData({
      [`selectedAnswer`]: answerKey
    })
  },

  /**
   * 提交当前答案
   */
  async submitCurrentAnswer(answerId) {
    try {
      const userId = getUserId()
      const submitData = {
        titleId: this.data.titleId,
        userId: userId,
        qid: this.data.currentQuestion.id,
        aid: answerId
      }

      // 异步提交，不等待结果，不处理失败
      submitAnswer(submitData).catch(error => {
        console.error('提交答案失败:', error)
        // 静默失败，不显示错误信息
      })

      // 保存答案到本地
      const newAnswers = [...this.data.answers]
      newAnswers[this.data.currentIndex] = {
        questionId: this.data.currentQuestion.id,
        answerId: answerId
      }

      this.setData({
        answers: newAnswers
      })

    } catch (error) {
      console.error('处理答案失败:', error)
      // 静默处理错误
    }
  },

  /**
   * 下一题
   */
  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1

    if (nextIndex >= this.data.totalQuestions) {
      // 答题完成，直接获取角色结果
      this.completeTest()
      return
    }

    // 切换到下一题
    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      showAnswers: false,
      selectedAnswer: null,
      animationClass: 'slide-left'
    })

    this.updateProgress()

    // 延迟显示新题目
    setTimeout(() => {
      this.animateQuestionIn()
    }, 300)
  },

  /**
   * 上一题（调试用）
   */
  prevQuestion() {
    if (this.data.currentIndex <= 0) return

    const prevIndex = this.data.currentIndex - 1
    this.setData({
      currentIndex: prevIndex,
      currentQuestion: this.data.questions[prevIndex],
      showAnswers: false,
      selectedAnswer: null,
      animationClass: 'slide-right'
    })

    this.updateProgress()

    setTimeout(() => {
      this.animateQuestionIn()
    }, 300)
  },

  /**
   * 退出确认
   */
  onExitConfirm() {
    wx.showModal({
      title: '确认退出',
      content: '退出后当前进度将会保存，下次可以继续答题',
      confirmText: '退出',
      cancelText: '继续答题',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  },

  /**
   * 完成测试，获取角色结果
   */
  async completeTest() {
    try {
      // 清除答题进度
      clearQuestionProgress(this.data.titleId)
      
      // 显示加载提示
      showLoading('正在生成角色...')
      
      // 获取用户ID
      const userId = getUserId()
      if (!userId) {
        hideLoading()
        showError('用户信息异常，请重新登录')
        return
      }
      
      // 调用API获取角色结果
      const result = await getRole({
        titleId: this.data.titleId,
        userId: userId
      })
      
      hideLoading()
      
      if (result) {
        // 保存角色结果到本地缓存
        setRoleResult(this.data.titleId, userId, result)
        
        // 直接跳转到结果页
        wx.redirectTo({
          url: `/pages/result/result?titleId=${this.data.titleId}&data=${encodeURIComponent(JSON.stringify(result))}`
        })
      } else {
        throw new Error('获取结果失败')
      }
    } catch (error) {
      hideLoading()
      console.error('获取角色结果失败:', error)
      showError('生成角色失败，请重试')
      
      // 失败时跳转到生成页面作为备选方案
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/generating/generating?titleId=${this.data.titleId}`
        })
      }, 1500)
    }
  },

  /**
   * 分享当前测试
   */
  onShareAppMessage() {
    return {
      title: `我正在做${this.data.currentQuestion?.q || '人格测试'}，一起来测测吧！`,
      path: `/pages/login/login?titleId=${this.data.titleId}`,
      imageUrl: this.data.currentQuestion?.image
    }
  }
})