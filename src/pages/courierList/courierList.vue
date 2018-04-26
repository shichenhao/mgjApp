<template>
    <div>
        <!--<mt-header title="选择快递公司">
            <a @click="hide()" slot="left">
                <mt-button icon="back"></mt-button>
            </a>
        </mt-header>-->
        <div class="courierList clearfix">
            <dl @click="hide(item, expressSstate)" class="clearfix" v-for="item in courier">
                <dt v-if="!item.identityImg"><img src="../../assets/images/icon4.jpg" width="100%"></dt>
                <dt v-if="item.identityImg"><img :src="item.identityImg" width="100%" ></dt>
                <dd>{{item.name}}</dd>
            </dl>
        </div>
    </div>
</template>
<script>
  export default {
    props:['openCourier','courier','expressSstate'],
    methods:{
      hide(item, state){
        this.$emit('popHide',item || false ,state); //popHide，'item'为向父组件传递的数据
      }
    },
    created(){
    }
  }
</script>
<style scoped>
    @import "courierList.css";
</style>