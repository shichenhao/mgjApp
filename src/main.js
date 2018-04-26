import Vue from 'vue'
import MintUI from 'mint-ui'
import router from './router';
import 'mint-ui/lib/style.css'
import App from './App.vue'
import axios from 'axios';
import '@/assets/css/common.css'

axios.defaults.transformRequest = [function (data) {
  let newData = ''
  for (let k in data) {
    newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
  }
  return newData
}]

axios.interceptors.request.use(function (config) {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return config
})

Vue.use(MintUI)
Vue.prototype.axios=axios;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})