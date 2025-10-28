// components/chart/chart.js
Component({
  properties: {
    chartData: {
      type: Object,
      value: {},
      observer: 'updateChart'
    },
    type: {
      type: String,
      value: 'radar' // radar, bar
    },
    width: {
      type: Number,
      value: 300
    },
    height: {
      type: Number,
      value: 300
    }
  },

  data: {
    
  },

  lifetimes: {
    attached() {
      this.initChart()
    }
  },

  methods: {
    initChart() {
      // 简单的雷达图实现
      this.drawRadarChart()
    },

    updateChart() {
      if (this.data.chartData && Object.keys(this.data.chartData).length > 0) {
        this.drawRadarChart()
      }
    },

    drawRadarChart() {
      const query = this.createSelectorQuery()
      query.select('#chart-canvas').fields({ node: true, size: true }).exec((res) => {
        if (res[0]) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = this.data.width * dpr
          canvas.height = this.data.height * dpr
          ctx.scale(dpr, dpr)

          this.renderRadar(ctx)
        }
      })
    },

    renderRadar(ctx) {
      const data = this.data.chartData
      const centerX = this.data.width / 2
      const centerY = this.data.height / 2
      const radius = Math.min(this.data.width, this.data.height) / 2 - 40

      // 清空画布
      ctx.clearRect(0, 0, this.data.width, this.data.height)

      const keys = Object.keys(data)
      const values = Object.values(data)
      const maxValue = Math.max(...values, 10)
      const angleStep = (Math.PI * 2) / keys.length

      // 绘制背景网格
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)'
      ctx.lineWidth = 1
      
      for (let i = 1; i <= 5; i++) {
        const r = (radius * i) / 5
        ctx.beginPath()
        for (let j = 0; j < keys.length; j++) {
          const angle = j * angleStep - Math.PI / 2
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r
          
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // 绘制轴线
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)'
      for (let i = 0; i < keys.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        )
        ctx.stroke()
      }

      // 绘制数据区域
      ctx.fillStyle = 'rgba(102, 126, 234, 0.3)'
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)'
      ctx.lineWidth = 2
      
      ctx.beginPath()
      for (let i = 0; i < keys.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        const value = values[i] || 0
        const r = (radius * value) / maxValue
        const x = centerX + Math.cos(angle) * r
        const y = centerY + Math.sin(angle) * r
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // 绘制数据点
      ctx.fillStyle = '#667eea'
      for (let i = 0; i < keys.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        const value = values[i] || 0
        const r = (radius * value) / maxValue
        const x = centerX + Math.cos(angle) * r
        const y = centerY + Math.sin(angle) * r
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // 绘制标签
      ctx.fillStyle = '#2d3748'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      for (let i = 0; i < keys.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        const labelRadius = radius + 20
        const x = centerX + Math.cos(angle) * labelRadius
        const y = centerY + Math.sin(angle) * labelRadius
        
        ctx.fillText(keys[i], x, y)
      }
    }
  }
})