// components/loading/loading.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    text: {
      type: String,
      value: '加载中...'
    },
    type: {
      type: String,
      value: 'spinner' // spinner, dots, pulse
    }
  },

  data: {
    
  },

  methods: {
    
  }
})