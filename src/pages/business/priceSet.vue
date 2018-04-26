<template>
    <div class="priceSet"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="20">
        <a @click="editState(true)">编辑</a>
        <a @click="editState()">完成</a>
        <div :class="{checkboxSelect:edit}">
            <dl v-for="(item, index) in list.list">
                <i v-if="edit" class="checkbox" @click="itemSelect(index)" :class="{active:item.select}" :key="index"></i>
                <dt @click="goItem(item.id)">
                    <span>{{item.consignerProvinceName}} —</span>
                    <span class="address">
                        <i>{{item.consigneeProvinceName}}</i>
                    </span>
                </dt>
                <dd @click="goItem(item.id)">
                    <span class="price">
                        基础价格：
                        <span class="money">{{item.price}}</span>
                        <span>元</span>
                    </span>
                    <span class="price">
                        基础重量：
                        <span class="money">{{item.weight}}</span>
                        <span>kg</span>
                    </span>
                </dd>
                <dd>
                    <span>
                        超出每公斤加价：
                        <span class="money">{{item.addPrice}}</span>
                        <span>元</span>
                    </span>
                </dd>
            </dl>
            <div class="loadingCenter" v-show="loading">
                <mt-spinner type="fading-circle" color="#26a2ff"></mt-spinner> 加载中
            </div>
        </div>
        <div v-show="!edit" class="btn">
            <router-link to="/business/price/add/0">新增</router-link>
        </div>
        <div v-show="edit" class="btn btn-del">
            <span>
                <i @click="handleSelectAll" class="checkbox" :class="{active:selectAlll}"></i>全选
            </span>
            <a @click="deletes(selectAll.length)" :class="{none:!selectAll.length}">删除</a>
        </div>
    </div>
</template>
<script>
  import { Indicator } from 'mint-ui';
  export default {
    name: 'priceList',
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
        this.axios.post('/merchantClient/findExpressPriceList',addToken()).then((res)=>{//查询数据
          this.list=res.data.value
          Indicator.close()
        })
      },
      goItem(id){ //跳转到详情
        this.$router.push(`/business/price/add/${id}`);
      },
      editState(type){ //编辑 显示复选框
        this.edit=type || false
      },
      itemSelect(id, type){ //选中的数据
        let newVal = this.list.list[id]
        if(type){
          newVal.select=this.selectAlll
          if(this.selectAlll){
            this.selectAll.push(newVal)
          }else{
            this.selectAll=[]
          }
        }else{
          newVal.select=!this.list.list[id].select
          // 选择添加到选中的列表中 否则从列表中删除
          if(this.list.list[id].select){
            this.selectAll.push(this.list.list[id])
          }else{
            this.selectAll=this.selectAll.filter((item)=>{
              return item.select
            })
          }
          // 如果都选择则全选按钮选中
          if(this.list.list.every((item)=>{
              return item.select==true
            })){
            this.selectAlll=true
          }else{
            this.selectAlll=false
          }

        }
        this.$set(this.list.list, id, newVal)

      },
      handleSelectAll(){ //全选
        this.selectAll=[]
        this.selectAlll=!this.selectAlll
        this.list.list.map((item,index)=>{
          this.itemSelect(index, true)
        })
      },
      deletes(state){    //删除
        if(state >= 1){
            console.log(this.selectAll)
        }
      },
      loadMore() { //下拉加载数据
        let start= this.pageIndex
        if(this.list.total/(start*20)>1){
            this.pageIndex=start+1;
            start+1;
            this.loading = true;
            setTimeout(() => {
                this.axios.post('/merchantClient/findExpressPriceList',addToken({start})).then((res)=>{//寄送时间
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