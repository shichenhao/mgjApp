<template>
    <div class="priceSet"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="20">
        <div :class="{checkboxSelect:edit}">
            <!--<a @click="editState(true)">编辑</a>
            <a @click="editState()">完成</a>-->
            <dl v-for="(item, index) in list" @click="goItem(item.id)">
                <i v-if="edit" class="checkbox" @click="itemSelect(index)" :class="{active:item.select}"
                   :key="index"></i>
                <dt>
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
                <mt-spinner type="fading-circle" color="#26a2ff"></mt-spinner>
                加载中
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
  import {Indicator} from 'mint-ui';
  export default {
    name: 'priceList',
    data () {
      return {
        loading: false,
        edit: false,
        selectAlll: false, //全选
        pageIndex: 0,
        list: [],
        total: 20,
        selectAll: [], //选中的数据
        params: {}
      }
    },
    methods: {
      getInit(type){
        let _this = this;
        // 右上角点击方法
        window.rightItemClick=function(){
          _this.editState(!_this.edit)
          _this.rightTop();
        }
        this.selectAll = [];
        if(type){
            YLJsBridge.call('showRightItem',{isShow:true,message:'编辑'})
            Indicator.open('加载中...');
            this.axios.post('/express/merchantClient/findExpressPriceList', addToken()).then((res) => {//查询数据
              this.list = res.data.value.list
              Indicator.close()
              this.editState(!this.edit)
            })
        }
      },
      goItem(id){ //跳转到详情
        if(!this.edit){
            this.$router.push(`/business/price/add/${id}`);
        }
      },
      editState(type){ //编辑 显示复选框
        this.edit = type || false
      },
      itemSelect(id, type){ //选中的数据
        let newVal = this.list[id]
        if (type) {
          newVal.select = this.selectAlll
          if (this.selectAlll) {
            this.selectAll.push(newVal)
          } else {
            this.selectAll = []
          }
        } else {
          newVal.select = !this.list[id].select
          // 选择添加到选中的列表中 否则从列表中删除
          if (this.list[id].select) {
            this.selectAll.push(this.list[id])
          } else {
            this.selectAll = this.selectAll.filter((item) => {
              return item.select
            })
          }
          // 如果都选择则全选按钮选中
          if (this.list.every((item) => {
              return item.select == true
            })) {
            this.selectAlll = true
          } else {
            this.selectAlll = false
          }

        }
        this.$set(this.list, id, newVal)

      },
      handleSelectAll(){ //全选
        this.selectAll = []
        this.selectAlll = !this.selectAlll
        this.list.map((item, index) => {
          this.itemSelect(index, true)
        })
      },
      deletes(state){    //删除
        if (state >= 1) {
          Indicator.open('删除中...');
          //选中的数组转换成字符串
          let ids = this.selectAll.map(item=>{
            return item.id
          }).toString();
          this.axios.post('/express/merchantClient/batchRemoveExpressPrice', addToken({ids})).then((res) => {
            if (res.data.success) {
              Indicator.close();
              alert('删除成功!');
              this.getInit(true);
            }
          })
        }
      },
      loadMore() { //下拉加载数据
        if (this.total === 20) {
          let newStart = this.pageIndex;
          let start= (this.pageIndex*20);
          this.pageIndex=newStart+1;
          this.loading = true;
          this.total=0
          //setTimeout(() => {
            this.axios.post('/express/merchantClient/findExpressPriceList', addToken({start})).then((res) => {//寄送时间
              this.list = [...this.list, ...res.data.value.list];
              this.total=res.data.value.list.length
            })
            this.loading = false;
          //}, 500);
        }
      },
      rightTop(){ // 右上角显示文字
        let _this=this;
        if(window.YLJsBridge){
            YLJsBridge.call('showRightItem',{isShow:true,message:!_this.edit ? '编辑' : '完成'})
        }
      }
    },
    created(){
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