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
      component: index,
      meta: {
        title: '快递'
      }
    },
    {
      path: '/looked',
      name: 'looked',
      component: looked,
      meta: {
        title: '查询过的快递'
      }
    },
    {
      path: '/order',
      name: 'order',
      component: order,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/courierList',
      name: 'courierList',
      component: courierList
    },
    {
      path: '/orderDetails/:number/:company',
      name: 'orderDetails',
      component: orderDetails,
      meta: {
        title: '跟踪订单'
      }
    },
    {
      path: '/orderCompletion/:id',
      name: 'orderCompletion',
      component: orderCompletion,
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/postage',
      name: 'postage',
      component: postage,
      meta: {
        title: '邮费计算规则'
      }
    },
    {
      path: '/price',
      name: 'price',
      component: price,
      meta: {
        title: '价格计算规则'
      }
    },
    // 商家
    {
      path: '/business',
      name: 'business',
      component: business,
      meta: {
        title: '商家管理'
      }
    },
    {
      path: '/business/order',
      name: 'orderManage',
      component: orderManage,
      meta: {
        title: '订单管理'
      }
    },
    {
      path: '/business/price',
      name: 'priceSet',
      component: priceSet,
      meta: {
        title: '价格管理'
      }
    },
    {
      path: '/business/price/add/:id',
      name: 'priceAdd',
      component: priceAdd,
      meta: {
        title: '价格设置'
      }
    },
    {
      path: '/business/time',
      name: 'time',
      component: time,
      meta: {
        title: '时间管理'
      }
    },
    {
      path: '/business/time/add/:id',
      name: 'timeAdd',
      component: timeAdd,
      meta: {
        title: '时间设置'
      }
    },
  ]
})
