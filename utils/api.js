// utils/api.js
const { request } = require('./request.js')

/**
 * 用户登录
 */
function login(name) {
  return request({
    url: '/user/login',
    method: 'POST',
    data: { name }
  })
}

/**
 * 获取测试主题列表
 */
function getTestTitles() {
  return request({
    url: '/testQuestions/titles',
    method: 'GET'
  })
}

/**
 * 获取题目列表
 */
function getQuestions(titleId) {
  return request({
    url: `/testQuestions/problem/${titleId}`,
    method: 'GET'
  })
}

/**
 * 提交答案
 */
function submitAnswer(data) {
  return request({
    url: '/testQuestions/submitAnswer',
    method: 'POST',
    data
  })
}

/**
 * 获取角色结果
 */
function getRole(data) {
  return request({
    url: '/testQuestions/getRole',
    method: 'POST',
    data
  })
}

module.exports = {
  login,
  getTestTitles,
  getQuestions,
  submitAnswer,
  getRole
}