<template>
    <div>
        <div class="looked_list"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="20">
            <dl v-if="courierList.length" class="clearfix" v-for="item in courierList" @click="goDetail(item.number,item.company)">
                <dt><img src="../../assets/images/icon4.jpg" width="100%"></dt>
                <dd><h4>韵达快递：8879234310499146803</h4>[南昌市]南昌转运中心 已发出</dd>
            </dl>
            <div class="loadingCenter" v-show="loading">
                <mt-spinner type="fading-circle" color="#26a2ff"></mt-spinner> 加载中
            </div>
            <div class="noneMore" v-if="total==0">
                你还没有查询过快递哦！
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        loading:false,
        courierList:[],
        pageIndex:1,
        total:20
      }
    },
    methods:{
      goDetail(number, company){
        this.$router.push(`/orderDetails/${number}/${company}`);
      },
      loadMore() { //下拉加载数据
        let start= this.pageIndex
        if(this.total==20){
          this.pageIndex=start+1;
          start+1;
          this.loading = true;
          setTimeout(() => {
            this.total=0
            this.axios.post('/userClient/findExpressQueryListByUserId',addToken({start})).then((res)=>{//寄送时间
              if(res.data.value.length){
                this.total=res.data.value.length
              }else{
                this.total=0
              }
              this.courierList=[...this.courierList, ...res.data.value]
            })
            this.loading = false;
          }, 1500);
        }
      }
    }
  }
</script>
<style scoped>
    @import "looked.css";
</style>
