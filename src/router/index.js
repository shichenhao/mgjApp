import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import looked from '@/pages/looked/looked'
import order from '@/pages/order/order'
import courierList from '@/pages/courierList/courierList'
import orderDetails from '@/pages/orderDetails/orderDetails'
import orderCompletion from '@/pages/orderCompletion/orderCompletion'
import orderPayment from '@/pages/orderPayment/orderPayment'
import orderTake from '@/pages/orderTake/orderTake'
import postage from '@/pages/postage/postage'
import price from '@/pages/price/price'
//商家
import business from '@/pages/business/'
import priceSet from '@/pages/business/priceSet'
import priceAdd from '@/pages/business/priceAdd'
import orderManage from '@/pages/business/orderManage'
import time from '@/pages/business/newTime'
import timeAdd from '@/pages/business/timeAdd'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/looked',
      name: 'looked',
      component: looked
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    {
      path: '/courierList',
      name: 'courierList',
      component: courierList
    },
    {
      path: '/orderDetails/:number/:company',
      name: 'orderDetails',
      component: orderDetails
    },
    {
      path: '/orderCompletion/:id',
      name: 'orderCompletion',
      component: orderCompletion
    },
    {
      path: '/postage',
      name: 'postage',
      component: postage
    },
    {
      path: '/price',
      name: 'price',
      component: price
    },
    // 商家
    {
      path: '/business',
      name: 'business',
      component: business
    },
    {
      path: '/business/order',
      name: 'orderManage',
      component: orderManage
    },
    {
      path: '/business/price',
      name: 'priceSet',
      component: priceSet
    },
    {
      path: '/business/price/add/:id',
      name: 'priceAdd',
      component: priceAdd
    },
    {
      path: '/business/time',
      name: 'time',
      component: time
    },
    {
      path: '/business/time/add/:id',
      name: 'timeAdd',
      component: timeAdd
    },
  ]
})
