<template>
    <div class="priceSet">
        <div class="priceBox">
            <div class="priceItem">
                <b>发货地址</b>
                <i v-show="params.consignerProvinceName">{{params.consignerProvinceName}}</i>
                <i v-for="item in consignerName">{{item.name}}</i>
                <i class="btn-add" @click="adressAdd(0)">选择</i>
            </div>
            <div class="priceItem">
                <b>收货地址</b>
                <i v-show="params.consigneeProvinceName">{{params.consigneeProvinceName}}</i>
                <i v-for="item in consigneeName">{{item.name}}</i>
                <i class="btn-add" @click="adressAdd(1)">选择</i>
            </div>
            <div class="priceItem">
                <b>基础价格</b>
                <input v-model="params.price" type="number" placeholder="请填写基础价格">
                <span>元</span>
            </div>
            <div class="priceItem">
                <b>基础重量</b>
                <input v-model="params.weight" type="number" placeholder="请填写基础重量">
                <span>kg</span>
            </div>
            <div class="priceItem">
                <b>超出每公斤加价</b>
                <input v-model="params.addPrice" type="number" placeholder="请填写每公斤加价">
                <span>元</span>
            </div>
        </div>
        <div class="btnFiexd">
            <span class="button button-primary" @click="Add">保存</span>
        </div>
        <div class="addPop" v-show="addPop">
            <div class="addBox">
                <div class="addCont">
                    <span @click="selectChange(index)" :key="item.id" :class="{active:item.select}" v-for="(item,index) in provinceList">{{item.name}}</span>
                </div>
                <div class="addFiexd">
                    <a @click="handleSelect">确定</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Indicator, MessageBox } from 'mint-ui';
  export default {
    name: 'priceAdd',
    data () {
      return {
        addPop:false,//选择地区弹层显示
        type:null,//选择地区类型 0发货 1收货
        provinceList:[],//地区列表
        consignerName:[],//选中发货的地区
        consigneeName:[],//选中收获的地区
        params:{
          consignerProvinceName:null,
          consigneeProvinceName:null,
        }
      }
    },
    methods:{
      getInit(){    //初始化数据
        Indicator.open('加载中...');
        let id = this.$router.history.current.params.id
        this.axios.post('/express/public/findRegionDataDTOList').then((res)=>{
          this.provinceList=res.data.value
          Indicator.close();
          if(id !=0){ //查询详情
            Indicator.open('加载中...');
            this.axios.post('/express/merchantClient/findExpressPrice',addToken({id})).then((res)=>{
              Indicator.close();
              this.params=res.data.value
              this.params.id=id
              this.provinceList=this.provinceList.map((item)=>{
                if(item.id==res.data.value.consigneeProvince){
                  item.select=true
                }
                return item
              })
            })
          }else{
          }
        })
      },
      adressAdd(type){//选择地区
        this.addPop = true
        this.type=type
      },
      Add(){    //创建

        if(!this.consignerName.length && !this.params.consignerProvinceName){
          alert('请选择发货地址！');
          return false
        } else if(!this.consigneeName.length && !this.params.consigneeProvinceName){
          alert('请选择收货地址！');
          return false
        } else if (!this.params.price){
          alert('请填写基础价格！');
          return false
        } else if (!this.params.weight){
          alert('请填写基础重量！');
          return false
        } else if (!this.params.addPrice){
          alert('请填写超出每公斤加价！');
          return false
        }

        Indicator.open('加载中...');
        console.log(this.params)

        if(!this.params.consignerProvinceName){
            this.consignerName ? this.params.consignerProvince=this.consignerName.map((i)=>{
                return i.id
            }).toString() : ''
            this.consigneeName ? this.params.consigneeProvince=this.consigneeName.map((i)=>{
              return i.id
            }).toString() : ''
        }


        this.axios.post('/express/merchantClient/createOrMergeExpressPrice',addToken(this.params)).then((res)=>{
          Indicator.close();
          alert('操作成功！');
          this.$router.push(`/business/price`);
        }).catch((error)=>{
          Indicator.close();
          alert(error.response.data.message);
        })
      },
      selectChange(id){   //选择地区
        //单选
        let newArr = this.provinceList.map((item, index)=>{
          if(id==index){
            item.select=true
          }else{
            item.select=false
          }
          return item
        })
        this.provinceList=newArr

        //多选
        /*let newVal = this.provinceList[id]
        newVal.select=!this.provinceList[id].select
        this.$set(this.provinceList, newArr)*/
      },
      handleSelect() {   //获取选择的地区
        this.addPop = false
        if (this.type == 0) {
            this.params.consignerProvinceName = null
            this.consignerName = this.provinceList.filter((i) => {
              return i.select
            })
        }else{
            this.params.consigneeProvinceName=null
            this.consigneeName = this.provinceList.filter((i)=>{
                return i.select
            })
        }
      },
    },
    created(){
      this.getInit()
    }
  }
</script>
<style scoped>
    @import "css/business.css";
</style>