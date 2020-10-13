import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'

import toast from 'components/common/toast/index'

import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

Vue.use(toast)

Vue.use(VueLazyload,{
  loading: require('./assets/img/common/placeholder.png')
})

//解决移动端300ms的延迟
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store,
  toast
}).$mount('#app')
