import Vue from 'vue'
import MintUI from 'mint-ui'
import MuseUI from 'muse-ui'
import router from './router';
import 'muse-ui/dist/muse-ui.css'
import 'mint-ui/lib/style.css'
import App from './App.vue'
import axios from 'axios';
import '@/assets/css/common.css'
import './assets/common'

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
Vue.use(MuseUI)
Vue.prototype.axios=axios;

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})