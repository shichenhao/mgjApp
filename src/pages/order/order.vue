<template>
    <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="20">
        <div class="order" @click="goDetail(item.id)" v-for="item in orderList">
            <div class="order_top clearfix">
                <a class="order_xq">详情</a>
                <dl>
                    <dt><img src="../../assets/images/default.png" width="100%"></dt>
                    <dd>{{item.expressMerchantName}}<br>订单号：{{item.id}}</dd>
                </dl>
            </div>
            <div class="order_bot">
                <h4>{{item.consigneeName}} {{item.consigneeMobile}}</h4>
                {{item.consigneeAddress}}
            </div>
        </div>
        <div class="loadingCenter" v-show="loading">
            <mt-spinner type="fading-circle" color="#26a2ff"></mt-spinner> 加载中
        </div>
    </div>
</template>

<script>
  export default {
    name: 'order',
    data () {
      return {
        loading:false,
        orderList:[],
        pageIndex:1,
        total:20
      }
    },
    methods:{
      goDetail(id){
        this.$router.push(`/orderCompletion/${id}`);
      },
      loadMore() { //下拉加载数据
        let start= this.pageIndex
        if(this.total==20){
          this.pageIndex=start+1;
          start+1;
          this.loading = true;
          //setTimeout(() => {
            this.total=0
            this.axios.post('/express/userClient/findExpressOrderListByUserId',addToken({start})).then((res)=>{//寄送时间
              this.total=res.data.value.length
              this.orderList=[...this.orderList, ...res.data.value]
            })
            this.loading = false;
          //}, 1500);
        }
      }
    }
  }
</script>
<style scoped>
    @import "order.css";
</style>