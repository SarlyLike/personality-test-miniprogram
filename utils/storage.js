// utils/storage.js

/**
 * 设置本地存储
 */
function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    console.error('设置本地存储失败:', e)
  }
}

/**
 * 获取本地存储
 */
function getStorage(key, defaultValue = null) {
  try {
    return wx.getStorageSync(key) || defaultValue
  } catch (e) {
    console.error('获取本地存储失败:', e)
    return defaultValue
  }
}

/**
 * 删除本地存储
 */
function removeStorage(key) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.error('删除本地存储失败:', e)
  }
}

/**
 * 清空本地存储
 */
function clearStorage() {
  try {
    wx.clearStorageSync()
  } catch (e) {
    console.error('清空本地存储失败:', e)
  }
}

/**
 * 设置用户ID
 */
function setUserId(userId) {
  setStorage('userId', userId)
  const app = getApp()
  if (app) {
    app.globalData.userId = userId
  }
}

/**
 * 获取用户ID
 */
function getUserId() {
  const app = getApp()
  if (app && app.globalData.userId) {
    return app.globalData.userId
  }
  return getStorage('userId')
}

/**
 * 设置答题进度
 */
function setQuestionProgress(titleId, progress) {
  const key = `progress_${titleId}`
  setStorage(key, progress)
}

/**
 * 获取答题进度
 */
function getQuestionProgress(titleId) {
  const key = `progress_${titleId}`
  return getStorage(key, { currentIndex: 0, answers: [] })
}

/**
 * 清除答题进度
 */
function clearQuestionProgress(titleId) {
  const key = `progress_${titleId}`
  removeStorage(key)
}

/**
 * 设置分享来源
 */
function setShareSource(titleId) {
  setStorage('shareSource', titleId)
}

/**
 * 获取分享来源
 */
function getShareSource() {
  return getStorage('shareSource')
}

/**
 * 清除分享来源
 */
function clearShareSource() {
  removeStorage('shareSource')
}

/**
 * 设置角色结果缓存
 */
function setRoleResult(titleId, userId, roleData) {
  const key = `role_${titleId}_${userId}`
  const cacheData = {
    data: roleData,
    timestamp: Date.now()
  }
  setStorage(key, cacheData)
}

/**
 * 获取角色结果缓存
 */
function getRoleResult(titleId, userId) {
  const key = `role_${titleId}_${userId}`
  const cacheData = getStorage(key)
  if (cacheData && cacheData.data) {
    return cacheData.data
  }
  return null
}

/**
 * 清除角色结果缓存
 */
function clearRoleResult(titleId, userId) {
  const key = `role_${titleId}_${userId}`
  removeStorage(key)
}

/**
 * 检查是否有角色结果缓存
 */
function hasRoleResult(titleId, userId) {
  const key = `role_${titleId}_${userId}`
  const cacheData = getStorage(key)
  return cacheData && cacheData.data
}

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  setUserId,
  getUserId,
  setQuestionProgress,
  getQuestionProgress,
  clearQuestionProgress,
  setShareSource,
  getShareSource,
  clearShareSource,
  setRoleResult,
  getRoleResult,
  clearRoleResult,
  hasRoleResult
}