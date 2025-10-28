# 开发指南

## 🚀 快速开始

### 环境准备
1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 注册微信小程序账号并获取AppID
3. 准备后端API服务（参考API文档）

### 项目导入
1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目根目录
4. 填入AppID（测试可使用测试号）
5. 点击"导入"

### 配置修改
1. 修改`app.js`中的`baseUrl`为实际API地址
2. 在`project.config.json`中配置正确的AppID
3. 根据需要调整页面路径和组件引用

## 📝 开发规范

### 代码风格
- 使用2空格缩进
- 文件名使用小写字母和连字符
- 组件名使用驼峰命名
- 常量使用大写字母和下划线

### 文件组织
```
页面文件夹/
├── page.js      # 页面逻辑
├── page.wxml    # 页面结构
├── page.wxss    # 页面样式
└── page.json    # 页面配置
```

### 组件开发
```
组件文件夹/
├── component.js      # 组件逻辑
├── component.wxml    # 组件结构
├── component.wxss    # 组件样式
└── component.json    # 组件配置
```

## 🛠 核心功能实现

### 1. 网络请求
使用`utils/request.js`封装的请求方法：
```javascript
const { request } = require('../../utils/request.js')

// GET请求
const data = await request({
  url: '/api/endpoint',
  method: 'GET'
})

// POST请求
const result = await request({
  url: '/api/endpoint',
  method: 'POST',
  data: { key: 'value' }
})
```

### 2. 本地存储
使用`utils/storage.js`提供的方法：
```javascript
const { setStorage, getStorage } = require('../../utils/storage.js')

// 存储数据
setStorage('key', 'value')

// 获取数据
const value = getStorage('key', 'defaultValue')
```

### 3. 工具函数
使用`utils/util.js`中的工具方法：
```javascript
const { showLoading, hideLoading, vibrateShort } = require('../../utils/util.js')

// 显示加载
showLoading('加载中...')

// 隐藏加载
hideLoading()

// 触感反馈
vibrateShort()
```

## 🎨 样式开发

### 全局样式
在`app.wxss`中定义全局样式：
- 使用CSS变量定义主题色
- 定义通用的卡片、按钮样式
- 设置全局动画类

### 响应式设计
使用rpx单位实现响应式：
```css
.container {
  padding: 40rpx; /* 在不同设备上自动缩放 */
}

/* 媒体查询适配小屏设备 */
@media (max-width: 375px) {
  .container {
    padding: 32rpx;
  }
}
```

### 动画效果
定义常用动画类：
```css
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}
```

## 📊 图表组件使用

### 雷达图组件
```xml
<chart 
  chart-data="{{matrixData}}"
  type="radar"
  width="{{280}}"
  height="{{280}}"
/>
```

### 进度条组件
```xml
<progress-bar 
  current="{{currentIndex}}"
  total="{{totalQuestions}}"
  show-text="{{true}}"
/>
```

## 🔧 调试技巧

### 1. 控制台调试
```javascript
console.log('调试信息:', data)
console.error('错误信息:', error)
```

### 2. 网络请求调试
在微信开发者工具中查看Network面板，检查API请求和响应。

### 3. 存储调试
在Storage面板查看本地存储的数据。

### 4. 性能调试
使用Performance面板分析页面性能。

## 📱 测试指南

### 真机测试
1. 在微信开发者工具中点击"预览"
2. 使用微信扫描二维码
3. 在真机上测试各项功能

### 兼容性测试
- 测试不同版本的微信客户端
- 测试不同的手机型号和屏幕尺寸
- 测试网络异常情况

## 🚀 发布流程

### 1. 代码检查
- 检查所有API接口是否正常
- 确保没有调试代码残留
- 验证所有功能正常工作

### 2. 上传代码
1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 上传成功后在微信公众平台查看

### 3. 提交审核
1. 登录微信公众平台
2. 进入版本管理页面
3. 提交审核并等待结果

### 4. 发布上线
审核通过后点击发布即可上线。

## ⚠️ 注意事项

### 域名配置
- 所有API请求必须使用HTTPS
- 在微信公众平台配置合法域名
- 图片资源也需要配置域名白名单

### 用户隐私
- 获取用户信息需要明确告知用途
- 遵守微信小程序用户隐私规范
- 不得收集与功能无关的用户信息

### 性能优化
- 图片使用懒加载
- 避免频繁的setData调用
- 合理使用分包加载

## 🐛 常见问题

### Q: 网络请求失败
A: 检查域名配置和HTTPS证书，确保API服务正常运行。

### Q: 图片显示不出来
A: 检查图片URL是否正确，域名是否在白名单中。

### Q: 分享功能不工作
A: 检查分享参数配置，确保页面路径正确。

### Q: 动画效果卡顿
A: 减少复杂的CSS动画，使用transform代替position变化。

## 📚 参考资料

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信小程序API文档](https://developers.weixin.qq.com/miniprogram/dev/api/)
- [微信小程序组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/)

---

如有问题，请查看项目README.md或提交Issue。