<template>
    <div v-if="orderInfo">
        <div class="orderCompletion_top" :class="{orderCompletion_top1 : orderInfo.status == 4, orderCompletion_top2:orderInfo.status == 3}">
            <b>
                {{
                    '订单状态'.statusFilter(orderInfo.status)
                }}
            </b>
        </div>
        <dl class="orderCompletion_dl clearfix">
            <dt>
                <img :src="orderInfo.expressMerchant.identityImg" width="100%" v-if="orderInfo.expressMerchant.identityImg">
                <img src="../../assets/images/default.png" width="100%" v-if="!orderInfo.expressMerchant.identityImg || orderInfo.expressMerchant.identityImg === 'null'">
            </dt>
            <dd><b>{{orderInfo.expressMerchant.name}}</b><br />订单号：{{orderInfo.id}}<br />下单时间：{{orderInfo.createTime}}</dd>
        </dl>
        <div class="orderC_list">
            <table border="0" cellspacing="0" cellpadding="0" >
                <tr>
                    <th>支付价格</th>
                    <td>{{orderInfo.price}}元</td>
                </tr>
                <tr>
                    <th>取件时间</th>
                    <td>{{orderInfo.pickUpDate + ' ' + orderInfo.pickUpTime}}</td>
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
                        <p>{{orderInfo.consignerAddress + orderInfo.consignerHouseNumber}}</p>
                    </td>
                </tr>
                <tr>
                    <th>收件地址</th>
                    <td>
                        {{orderInfo.consigneeName}} {{orderInfo.consigneeMobile}}
                        <p>{{orderInfo.consigneeAddress + orderInfo.consigneeHouseNumber}}</p>
                    </td>
                </tr>
            </table>
        </div>
        <div class="order_cost" v-if="orderInfo.status==1">
            <div class="order_costC">
                <span>
                    费用预估<b>{{orderInfo.price}}元</b>
                </span>
                <a class="order_djs" @click="payment">去支付还剩{{minute}}分{{second}}秒</a>
            </div>
        </div>
    </div>
</template>
<script>
  import { Indicator } from 'mint-ui';
  export default {
    name: 'orderOver',
    data () {
      return {
        orderInfo:null,
        minutes: 15,
        seconds: 0
      }
    },
    watch: {
      second: {
        handler (newVal) {
          this.num(newVal)
        }
      },
      minute: {
        handler (newVal) {
          this.num(newVal)
        }
      }
    },
    computed: {
      second: function () {
        return this.num(this.seconds)
      },
      minute: function () {
        return this.num(this.minutes)
      }
    },
    methods:{
      isTime(){
        let times = this.paymentExpireTime;
        times = times.replace(/-/g,':').replace(' ',':');
        times = times.split(':');

        let Time = new Date(times[0],(times[1]-1),times[2],times[3],times[4],times[5]).getTime() - new Date().getTime();
        if(Time > 0) {
          let minutes = parseInt((Time % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = parseInt((Time % (1000 * 60)) / 1000);
          this.minutes = minutes;
          this.seconds = seconds;
        }
        Time = null;
      },
      num: function (n) {
        return n < 10 ? '0' + n : '' + n
      },
      add: function () {
        let _this = this
        let time = window.setInterval(function () {
          _this.isTime();
          if (_this.seconds === 0 && _this.minutes !== 0) {
            _this.seconds = 59
            _this.minutes -= 1
          } else if (_this.minutes === 0 && _this.seconds === 0) {
            _this.seconds = 0
            window.clearInterval(time);
            Indicator.open('订单取消中...');
            setTimeout(()=>{
              window.location.reload();
            },5000)
          } else {
            _this.seconds -= 1
          }
        }, 1000)
      },
      getInit(){//查询订单
        this.axios.post('/express/userClient/findExpressOrderById',addToken({id:this.$router.history.current.params.id})).then((res)=>{//商家列表

          this.orderInfo=res.data.value
          Indicator.close();

          let times = res.data.value.paymentExpireTime
          this.paymentExpireTime = res.data.value.paymentExpireTime

          times = times.replace(/-/g,':').replace(' ',':');
          times = times.split(':');

          let Time = new Date(times[0],(times[1]-1),times[2],times[3],times[4],times[5]).getTime() - new Date().getTime();
          if(Time > 0){
              let minutes = parseInt((Time % (1000 * 60 * 60)) / (1000 * 60));
              let seconds = parseInt((Time % (1000 * 60)) / 1000);
              this.minutes = minutes;
              this.seconds = seconds;
              this.add();
          }else{
            if(res.data.value.status==1){
                Indicator.open('订单取消中...');
                setTimeout(()=>{
                  window.location.reload();
                },5000)
              return false
            }
          }
          /*if(new Date().getTime() > new Date(res.data.value.paymentExpireTime).getTime()){
            this.orderInfo.status = -1
          }*/
        })
      },
      goDetail(id){
        this.$router.push(`/orderCompletion/${id}`);
      },
      payment(){    //付款
        let _this=this
        console.log(this.orderInfo.id)
        YLJsBridge.call('pay',{orderId:_this.orderInfo.id},function(a){
          _this.getInit()
        })
      },
      getToken(){
        setTimeout(()=>{
          if(!sessionStorage.getItem('token')){
            Indicator.open('查询中...');
            this.getToken()
          } else {
            this.getInit()
          }
        },20)
      }
    },
    created(){
      this.getToken()
    }
  }
</script>
<style scoped>
    @import "orderCompletion.css";
</style>