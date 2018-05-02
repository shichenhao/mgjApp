<template>
    <div>
        <dl class="orderDetails_top clearfix">
            <dt><img src="../../assets/images/icon4.jpg" width="100%"></dt>
            <dd>韵达快递：{{detail.number}}</dd>
        </dl>
        <div class="orderDetails_tit">快递信息</div>
        <div class="orderDetails_list">
            <dl :class="{on:index==0}" v-for="(item,index) in detail.expressTrackings" :key="index">
                <dt><p><span>{{item.formatTime.slice(5,10)}}</span><br>{{item.formatTime.slice(10,19)}}</p></dt>
                <dd><p>{{item.context}}</p>
                    <i></i>
                </dd>
            </dl>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'orderDetail',
    data () {
      return {
        detail:{},
        state:null
      }
    },
    methods:{
      getInit(){//查询订单详情
        this.axios.post('/express/userClient/findExpressByCompanyAndNumber',addToken(this.$router.history.current.params)).then((res)=>{//商家列表
          this.detail=JSON.parse(res.data.value.result)
          console.log(JSON.parse(res.data.value.result))
        })
      }
    },
    created(){
      this.getInit()
    }
  }
</script>
<style scoped>
    @import "orderDetails.css";
</style>