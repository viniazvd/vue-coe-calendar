import Vue from 'vue'
import App from './App.vue'

// directive
import outside from './outside.js'

Vue.config.productionTip = false

Vue.directive('outside', outside)

new Vue({
  render: h => h(App)
}).$mount('#app')
