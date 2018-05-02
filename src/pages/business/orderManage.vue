<template>
    <div>
        <div class="orderManage" v-for="item in list.list">
            <div class="tit">
                <div class="code">{{ item.id }}</div>
                <div class="state">{{ '状态'.takeFilter(item.status) }}</div>
            </div>
            <div class="address">
                <div class="send">
                    <div class="left sendAddress">寄件地址：</div>
                    <div class="right message">
                        <span class="name">{{ item.consignerName }}</span>
                        <span class="phone">{{ item.consignerMobile }}</span>
                        <div class="detail">{{ item.consignerAddress }}</div>
                    </div>
                </div>
                <div class="take">
                    <div class="left takeAddress">取件地址：</div>
                    <div class="right message">
                        <span class="name">{{ item.consigneeName }}</span>
                        <span class="phone">{{ item.consigneeMobile }}</span>
                        <div class="detail">{{ item.consigneeAddress }}</div>
                    </div>
                </div>
            </div>
            <div class="price">
                <div class="pay">
                    <div class="left payL">支付价格：</div>
                    <div class="right message"><span>{{ item.price }}</span><span>元</span></div>
                </div>
                <div class="payTime">
                    <div class="left payTimeL">支付时间：</div>
                    <div class="right message"><span class="date">{{ item.paymentExpireTime}}</span></div>
                </div>
                <div class="takeTime" v-if="item.pickUpTime && item.pickUpTime!= 'undefined'">
                    <div class="left takeTimeL">取件时间：</div>
                    <div class="right message"><span class="date">{{ item.pickUpTime}}</span></div>
                </div>
            </div>
            <div class="btns">
                <div @click="take(item.id)" class="takeBtn">取件</div>
            </div>
        </div>
    </div>
</template>


<script>
  import { Indicator, MessageBox } from 'mint-ui';
  export default {
    name: 'orderList',
    data () {
      return {
        loading:false,
        edit:false,
        selectAlll:false, //全选
        pageIndex:1,
        list:[],
        selectAll:[], //选中的数据
        params:{
        }
      }
    },
    methods:{
      getInit(){
        Indicator.open('加载中...');
        this.axios.post('/express/merchantClient/findExpressOrderList',addToken()).then((res)=>{//查询数据
          this.list=res.data.value
          Indicator.close()
        })
      },
      take(id){    //取件
        this.axios.post('/express/merchantClient/batchDoneExpressOrder',addToken({ids:id})).then((res)=>{//查询数据
          Indicator.close()
          MessageBox('提示', '操作成功！');
        })
      },
      loadMore() { //下拉加载数据
        let start= this.pageIndex
        if(this.list.total/(start*20)>1){
          this.pageIndex=start+1;
          start+1;
          this.loading = true;
          setTimeout(() => {
            this.axios.post('/express/merchantClient/findExpressOrderList',addToken({start})).then((res)=>{//寄送时间
              this.list.list=[...this.list.list, ...res.data.value.list]
            })
            this.loading = false;
          }, 1500);
        }
      }
    },
    created(){
      this.getInit()
    }
  }
</script>
<style scoped>
    @import "css/business.css";
</style>