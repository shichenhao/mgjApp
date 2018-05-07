<template>
    <div>
        <dl class="orderDetails_top clearfix">
            <dt><img src="../../assets/images/default.png" width="100%"></dt>
            <dd>{{ name && name +":"+ detail.number}}</dd>
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
  import { Indicator } from 'mint-ui';
  export default {
    name: 'orderDetail',
    data () {
      return {
        detail:{},
        name:null,
        state:null
      }
    },
    methods:{
      getInit(){//查询订单详情
        let { number,company } = this.$router.history.current.params;
        let param={
          number,
          company,
          name:sessionStorage.getItem('expressName')
        }
        Indicator.open('查询中...');
        this.axios.post('/express/userClient/findExpressByCompanyAndNumber',addToken(param)).then((res)=>{//商家列表
          Indicator.close();
          this.detail = JSON.parse(res.data.value.result)
          this.name = res.data.value.name
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