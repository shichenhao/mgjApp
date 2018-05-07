<template>
    <div>
        <div class="looked_list"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="20">
            <dl v-if="courierList.length" class="clearfix" v-for="item in courierList" @click="goDetail(item.number,item.company,item.name)">
                <dt><img src="../../assets/images/default.png" width="100%"></dt>
                <dd>
                    <h4>
                        {{
                            item.name
                        }}
                        ：{{ item.number }}</h4>
                        {{
                            JSON.parse(item.result).expressTrackings[0].context
                        }}
                </dd>
            </dl>
            <div class="loadingCenter" v-show="loading">
                <mt-spinner type="fading-circle" color="#26a2ff"></mt-spinner> 加载中
            </div>
            <div class="noneMore" v-if="!loading && total==0">
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
        pageIndex:0,
        total:20
      }
    },
    methods:{
      goDetail(number, company, name){
        this.$router.push(`/orderDetails/${number}/${company}`);
      },
      loadMore() { //下拉加载数据
        if(this.total==20){
          let newStart = this.pageIndex;
          let start= (this.pageIndex*20);
          this.pageIndex=newStart+1;
          this.loading = true;
          //setTimeout(() => {
          this.total=0
            this.axios.post('/express/userClient/findExpressQueryListByUserId',addToken({start})).then((res)=>{//寄送时间
              if(res.data.value.length){
                this.total=res.data.value.length
              }else{
                this.total=0
              }
              this.courierList=[...this.courierList, ...res.data.value]
              this.loading = false;
            })
          //}, 1500);
        }
      }
    }
  }
</script>
<style scoped>
    @import "looked.css";
</style>
