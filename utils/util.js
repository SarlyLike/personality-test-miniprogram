// utils/util.js

/**
 * 格式化时间
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示成功提示
 */
function showSuccess(title, duration = 2000) {
  wx.showToast({
    title,
    icon: 'success',
    duration
  })
}

/**
 * 显示错误提示
 */
function showError(title, duration = 2000) {
  wx.showToast({
    title,
    icon: 'none',
    duration
  })
}

/**
 * 触感反馈
 */
function vibrateShort() {
  wx.vibrateShort({
    type: 'light'
  })
}

/**
 * 解析JSON字符串
 */
function parseJSON(str, defaultValue = {}) {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.error('JSON解析失败:', e)
    return defaultValue
  }
}

/**
 * 生成随机ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 图片懒加载
 */
function lazyLoadImage(selector, callback) {
  const query = wx.createSelectorQuery()
  query.selectAll(selector).boundingClientRect()
  query.selectViewport().scrollOffset()
  query.exec((res) => {
    const rects = res[0]
    const scrollTop = res[1].scrollTop
    const windowHeight = wx.getSystemInfoSync().windowHeight
    
    rects.forEach((rect, index) => {
      if (rect.top <= windowHeight + scrollTop && rect.bottom >= scrollTop) {
        callback && callback(index, rect)
      }
    })
  })
}

/**
 * 获取页面参数
 */
function getPageParams() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.options || {}
}

module.exports = {
  formatTime,
  debounce,
  throttle,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  vibrateShort,
  parseJSON,
  generateId,
  lazyLoadImage,
  getPageParams
}