<template>
    <div>
        <div class="postage_msg">您在下单时需先支付首重费用，根据快递员上门取货称重可能需要您补交部分邮费。</div>
        <div class="postage_tit">邮费计算规则</div>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="postage_tab">
            <tr>
                <th>发货地址</th>
                <th>收货地址</th>
                <th>基础费用</th>
                <th>基础重量</th>
                <th width="29%">超重每公斤加价</th>
            </tr>
            <tr :class="{colore0e: index%2==1}" v-for="(item, index) in list">
                <td>
                    {{ item.consignerProvinceName }}
                </td>
                <td>
                    {{ item.consigneeProvinceName }}
                </td>
                <td>
                    {{ item.price }}元
                </td>
                <td>
                    {{ item.weight }}kg
                </td>
                <td>
                    {{ item.addPrice }}元
                </td>
            </tr>
        </table>

    </div>
</template>
<script>
  export default {
    name: 'price',
    data(){
      return {
        list:[]
      }
    },
    methods:{
      getPrice(){
        let merchantId = window.merchantIdFirst;// || sessionStorage.getItem('merchantIdFirst')
        alert(merchantId)
        this.axios.post('/express/userClient/findExpressPriceList',addToken({merchantId})).then((res)=>{//商家列表
          this.list = res.data.value
        }).catch((error) => {
          alert(error.response.data.message);
        })
      }
    },
    created(){
      this.getPrice()
    }
  }
</script>
<style scoped>
    @import "price.css";
</style>