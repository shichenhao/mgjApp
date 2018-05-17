<template>
    <div class="heightOver"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="20">
        <div class="orderManage" v-for="item in list" v-if="list">
            <div class="tit">
                <div class="code">{{ item.id }}</div>
                <div class="state">{{ '状态'.statusFilter(item.status) }}</div>
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
                    <div class="left payL">备注：</div>
                    <div class="right message"><span>{{ item.remark }}</span></div>
                </div>
                <div class="payTime">
                    <div class="left payL">支付价格：</div>
                    <div class="right message"><span>{{ item.price }}</span><span>元</span></div>
                </div>
                <div class="payTime">
                    <div class="left payTimeL">支付时间：</div>
                    <div class="right message"><span class="date">{{ item.paymentExpireTime}}</span></div>
                </div>
                <div class="takeTime" v-if="item.pickUpTime && item.pickUpTime!= 'undefined'">
                    <div class="left takeTimeL">取件时间：</div>
                    <div class="right message"><span class="date">{{ item.pickUpDate + ' ' + item.pickUpTime}}</span></div>
                </div>
            </div>
            <div class="btns" v-if="item.status==-1">
                <span> 取消原因：<i>{{item.cancelReason}} </i></span>
            </div>
            <div class="btns" v-if="item.status==3">
                <div @click="open('bottom',item.id)" class="takeBtn">取消订单</div>
                <div @click="take(item.id)" class="takeBtn">取件</div>
            </div>
            <div class="btns" v-if="item.status==2">
                <div @click="open('bottom',item.id)" class="takeBtn">取消订单</div>
                <div @click="takeOk(item.id)" class="takeBtn">确认订单</div>
            </div>
        </div>
        <div class="noneExpress" v-if="total == 0">没有订单信息</div>
        <div>
            <mu-date-picker v-model="dateDay"/>
        </div>

        <mu-popup position="bottom" popupClass="demo-popup-bottom" :open="bottomPopup" @close="close('bottom')">
            <mu-appbar title="取消订单">
                <mu-flat-button slot="right" label="关闭" color="white" @click="close('bottom')"/>
            </mu-appbar>
            <mu-content-block>
                <p>
                    <textarea placeholder="请填写取消原因" v-model="popParams.cancelReason" ></textarea>
                </p>
                <p>
                    <mu-raised-button label="确定" @click="clearOk()" class="demo-raised-button" primary/>
                </p>
            </mu-content-block>
        </mu-popup>

    </div>
</template>


<script>
  import { Indicator, MessageBox } from 'mint-ui';
  export default {
    name: 'orderList',
    data () {
      return {
        id:null,
        bottomPopup: false,
        loading:false,
        edit:false,
        selectAlll:false, //全选
        dateDay:null,
        pageIndex:0,
        list:[],
        total:20,
        selectAll:[], //选中的数据
        params:{
        },
        popParams:{
          id:null,
        },
        phone:null
      }
    },
    watch:{
      dateDay:{
        handler:function(val,oldval){
          this.search()
        },
      },
    },
    methods:{
      open (position,id) {
        this.popParams.id = id
        this[position + 'Popup'] = true
      },
      close (position) {
        this[position + 'Popup'] = false
      },
      getInit(){
        let _this = this;
        // 右上角点击方法
        window.rightItemClick=function(){
          _this.handleClick();
          //_this.rightTop();
        }
        window.callbackId=function(phone){
          _this.call(phone)
          //_this.rightTop();
        }
        /*
        Indicator.open('加载中...');
        this.axios.post('/express/merchantClient/findExpressOrderList',addToken()).then((res)=>{//查询数据
          this.list=res.data.value
          Indicator.close()
        })*/
      },
      take(id){    //取件
        Indicator.open('操作中...');
        this.axios.post('/express/merchantClient/batchDoneExpressOrder',addToken({ids:id})).then((res)=>{//查询数据
          Indicator.close()
          MessageBox('提示', '取件成功！');
          this.search();
        }).catch((error) => {
          Indicator.close();
          alert(error.response.data.message);
        })
      },
      clearOk(){    //取消订单
        if(!this.popParams.cancelReason){
          alert('请填写取消原因！');
          return false;
        }


        Indicator.open('操作中...');
        this.axios.post('/express/merchantClient/cancelExpressOrder',addToken(this.popParams)).then((res)=>{//查询数据
          Indicator.close()
          this.bottomPopup=false;
          this.popParams.cancelReason=null;
          MessageBox('提示', '取消成功！');
          this.search();
        }).catch((error) => {
          Indicator.close();
          alert(error.response.data.message);
        })
      },
      takeOk(id){    //确认
        Indicator.open('操作中...');
        this.axios.post('/express/merchantClient/confirmExpressOrder',addToken({id})).then((res)=>{//查询数据
          Indicator.close()
          MessageBox('提示', '操作成功！');
          this.search();
        }).catch((error) => {
          Indicator.close();
          alert(error.response.data.message);
        })
      },
      search(){
        YLJsBridge.call('showRightItem',{isShow:true,message:this.dateDay.substr(5,12)})
        Indicator.open('加载中...');
        //this.list=[];
        this.total = 20
        let startTime = this.dateDay;
        let endTime = this.dateDay;
        let start= 0;
        let param ={
          start,
          startTime,
          endTime
        }
        this.axios.post('/express/merchantClient/findExpressOrderList',addToken(param)).then((res)=>{//寄送时间
          //alert(1)
          Indicator.close()
          this.list = res.data.value.list;
          this.total = res.data.value.total
        })
      },
      loadMore() { //下拉加载数据
        if (this.total === 20) {
          let startTime = '2018-05-11'.timestampToTime(new Date().getTime());
          let endTime = '2018-05-12'.timestampToTime(new Date().getTime());
          let newStart = this.pageIndex;
          let start= (this.pageIndex*20);
          this.pageIndex=newStart+1;
          this.loading = true;
          let param ={
            start,
            startTime,
            endTime
          }
          //setTimeout(() => {
            this.axios.post('/express/merchantClient/findExpressOrderList',addToken(param)).then((res)=>{//寄送时间
              this.list=[...this.list, ...res.data.value.list]
              this.total=res.data.value.list.length
            })
            this.loading = false;
          //}, 1500);
        }
      },
      handleClick(){
        document.querySelector('.mu-text-field-content').click()
      },
      rightTop(){ // 右上角显示文字
        let _this = this;
        if(window.YLJsBridge) {
          YLJsBridge.call('showRightItem',{isShow:true,message:'时间'.timestampToTime(new Date().getTime()).substr(5,12)})
        }
      },
    },
    created(){
      //this.call(15911020491)
      this.rightTop();
      this.getInit();
    },
    beforeDestroy(){
      YLJsBridge.call('showRightItem',{isShow:false,message:''})
    }
  }
</script>
<style scoped>
    @import "css/business.css";
</style>