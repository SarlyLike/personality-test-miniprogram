// utils/request.js
const app = getApp()

/**
 * 封装微信请求
 */
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          const errorMsg = getErrorMessage(options.url)
          wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          })
          reject(res)
        }
      },
      fail: (err) => {
        const errorMsg = getErrorMessage(options.url)
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        })
        reject(err)
      }
    })
  })
}

/**
 * 根据接口返回不同的错误提示
 */
function getErrorMessage(url) {
  const errorMessages = {
    '/user/login': '登录小精灵偷懒去了，请稍后再试噢~ (｡♥‿♥｡)',
    '/testQuestions/titles': '获取测试主题的小助手在打盹，请稍后再试噢~ zzZ',
    '/testQuestions/problem': '题目管理员去喝茶了，请稍后再试噢~ ☕',
    '/testQuestions/submitAnswer': '负责处理主人提交答案的测试姬忙不过来啦，请稍后再试噢。wink~',
    '/testQuestions/getRole': '角色生成大师在思考人生，请稍后再试噢~ (´･ω･`)'
  }
  
  for (let key in errorMessages) {
    if (url.includes(key)) {
      return errorMessages[key]
    }
  }
  
  return '网络开小差了，请稍后再试噢~ (╯︵╰)'
}

module.exports = {
  request
}