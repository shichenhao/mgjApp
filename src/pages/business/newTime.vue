<template>
    <div class="newTime"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="20"><!--
        <a @click="editState(true)">编辑</a>
        <a @click="editState()">完成</a>-->
        <div :class="{checkboxSelect:edit}">
            <div class="serviceDate" v-for="(item, index) in list">
                <i v-if="edit" class="checkbox" @click="itemSelect(index)" :class="{active:item.select}" :key="index"></i>
                <i @click="deletes(item)">
                    {{
                        item.status === 0 ? '未启用' : '启用'
                    }}
                </i>
                <div @click="goItem(item.id)">
                    <div class="tit">
                        <span>服务日期：</span>
                        <span>{{'服务日期'.filtersDay(item.serviceDay)}}</span>
                    </div>
                    <div class="contentTime">
                        <span v-for="time in item.serviceTime.split(',')">{{time}}</span>
                    </div>
                </div>
            </div>
            <div class="loadingCenter" v-show="loading">
                <mt-spinner type="fading-circle" color="#26a2ff"></mt-spinner> 加载中
            </div>
        </div>
        <div v-show="!edit" class="btn">
            <router-link to="/business/time/add/0">新增</router-link>
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
    name: 'timeList',
    data () {
      return {
        loading:false,
        edit:false,
        selectAlll:false, //全选
        pageIndex:1,
        list:[],
        selectAll:[], //选中的数据
        params:{}
      }
    },
    methods:{
      getInit(){
        let _this = this;
        // 右上角点击方法
        /*window.rightItemClick=function(){
          _this.editState(!_this.edit)
          _this.rightTop();
        }*/
        this.selectAll = [];
        Indicator.open('加载中...');
        this.axios.post('/express/merchantClient/findExpressTimeList',addToken()).then((res)=>{//查询数据
          this.list=res.data.value
          Indicator.close()
        })
      },
      goItem(id){ //跳转到详情
        this.$router.push(`/business/time/add/${id}`);
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
      deletes(item){    //删除
          Indicator.open('修改中...');
          let newItem = JSON.parse(JSON.stringify(item));
          newItem.status= newItem.status === 0 ? 1 : 0;
          //选中的数组转换成字符串
          this.axios.post('/express/merchantClient/createOrMergeExpressTime', addToken(newItem)).then((res) => {
            if(res.data.success){
              Indicator.close();
              alert('修改成功!');
              this.getInit();
            }
          })
      },
      loadMore() { //下拉加载数据
        let start= this.pageIndex
        if(this.list.total/(start*20)>1){
          this.pageIndex=start+1;
          start+1;
          this.loading = true;
          //setTimeout(() => {
            this.axios.post('/express/merchantClient/findExpressTimeList',addToken()).then((res)=>{//寄送时间
              this.list.list=[...this.list.list, ...res.data.value.list]
            })
            this.loading = false;
          //}, 1500);
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
      //this.rightTop();
      this.getInit();
    },
    beforeDestroy(){
      //YLJsBridge.call('showRightItem',{isShow:false,message:''})
    }
  }
</script>
<style scoped>
    @import "css/business.css";
</style>