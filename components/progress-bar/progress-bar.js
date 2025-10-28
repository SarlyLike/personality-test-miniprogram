// components/progress-bar/progress-bar.js
Component({
  properties: {
    current: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 100
    },
    showText: {
      type: Boolean,
      value: true
    },
    color: {
      type: String,
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    height: {
      type: String,
      value: '12rpx'
    }
  },

  data: {
    
  },

  computed: {
    percentage() {
      if (this.data.total === 0) return 0
      return Math.min(100, (this.data.current / this.data.total) * 100)
    }
  },

  methods: {
    
  }
})