<template>
    <div>
        <div class="orderCompletion_top" :class="{orderCompletion_top1 : orderInfo.status==3, orderCompletion_top2:orderInfo.status==2}">
            <b>
                {{
                    '订单状态'.statusFilter(orderInfo.status)
                }}
            </b>
        </div>
        <dl class="orderCompletion_dl clearfix">
            <dt><img src="../../assets/images/icon4.jpg" width="100%"></dt>
            <dd><b>{{orderInfo.expressMerchantName}}</b><br />订单号：{{orderInfo.id}}<br />下单时间：{{orderInfo.createTime}}</dd>
        </dl>
        <div class="orderC_list">
            <table border="0" cellspacing="0" cellpadding="0" >
                <tr>
                    <th>支付价格</th>
                    <td>{{orderInfo.price}}元</td>
                </tr>
                <tr>
                    <th>取件时间</th>
                    <td>{{orderInfo.pickUpTime}}</td>
                </tr>
                <tr>
                    <th>备注</th>
                    <td>{{orderInfo.remark}}</td>
                </tr>
            </table>
        </div>
        <div class="orderC_list">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" >
                <tr>
                    <th>寄件地址</th>
                    <td>
                        {{orderInfo.consignerName}} {{orderInfo.consignerMobile}}
                        <p>{{orderInfo.consignerAddress}}</p>
                    </td>
                </tr>
                <tr>
                    <th>收件地址</th>
                    <td>
                        {{orderInfo.consigneeName}} {{orderInfo.consigneeMobile}}
                        <p>{{orderInfo.consigneeAddress}}</p>
                    </td>
                </tr>
            </table>
        </div>
        <div class="order_cost" v-if="orderInfo.status==1">
            <div class="order_costC">
                费用预估<b>{{orderInfo.price}}元</b><a @click="payment">付款</a>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'orderOver',
    data () {
      return {
        orderInfo:{}
      }
    },
    methods:{
      getInit(){//查询订单
        this.axios.post('/express/userClient/findExpressOrderById',addToken({id:this.$router.history.current.params.id})).then((res)=>{//商家列表
          this.orderInfo=res.data.value
          if(new Date().getTime() > new Date(res.data.value.paymentExpireTime).getTime()){
            this.orderInfo.status = -1
          }
        })
      },
      goDetail(id){
        this.$router.push(`/orderCompletion/${id}`);
      },
      payment(){    //付款
        let _this=this
        YLJsBridge.call('pay',{orderId:_this.orderInfo.id},function(a){
          alert(a)
        })
      }
    },
    created(){
      this.getInit()
    }
  }
</script>
<style scoped>
    @import "orderCompletion.css";
</style>