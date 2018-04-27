<template>
    <div>
        <ul class="list_menu bgfff">
            <li :class="{on:state}" @click="tabState(true)"><strong>寄快递</strong></li>
            <li :class="{on:!state}" @click="tabState(false)"><strong>查快递</strong></li>
        </ul>
        <div class="list_box" style="display:block" v-show="state">
            <div class="banner"><img src="../assets/images/banner.png" width="100%"></div>
            <div class="addrH bgfff mb20">
                <div class="addrH_line"></div>
                <ul class="addrH_ul">
                    <li class="clearfix">
                        <i></i>
                        <dl>
                            <dt v-if="!params.consignerAddressId">你当前位置?</dt>
                            <dd v-if="params.consignerAddressId">
                                <strong>{{params.consignerName}}&nbsp;&nbsp;{{params.consignerMobile}}</strong>
                                <p>{{params.consignerAddress}}</p>
                            </dd>
                        </dl>
                        <a @click="selectAddress(1)" class="addrH_on">地址薄</a>
                    </li>
                    <li class="clearfix">
                        <i></i>
                        <dl>
                            <dt v-if="!params.consigneeAddressId">你当前位置?</dt>
                            <dd v-if="params.consigneeAddressId">
                                <strong>{{params.consigneeName}}&nbsp;&nbsp;{{params.consigneeMobile}}</strong>
                                <p>{{params.consigneeAddress}}</p>
                            </dd>
                        </dl>
                        <a @click="selectAddress(2)" class="addrH_on">地址薄</a>
                    </li>
                </ul>
            </div>
            <ul class="select_box bgfff mb20">
                <li @click="openopenCourierPop()">
                    <p v-if="!params.merchantName">请选择</p>
                    <p v-if="params.merchantName">{{params.merchantName}}</p>
                    <b>快递公司</b>
                </li>
                <li @click="openDatePop">
                    <p v-if="!params.pickUpTime">请选择</p>
                    <p v-if="params.pickUpTime">{{params.pickUpDate + ' ' + params.pickUpTime}}</p>
                    <b>取件时间</b>
                </li>
            </ul>
            <ul class="select_box bgfff">
                <li @click="openMessagePop">
                    <p v-if="!params.remark">请选择</p>
                    <p v-if="params.remark">{{params.remark}}</p>
                    <b>留言给快递员</b>
                </li>
            </ul>
            <div class='checkbox'>
                <input type='checkbox' id='checkbox1' name='checkboox[]' v-model="checkbox"> <label for='checkbox1'>我已阅读并同意<a href="#">《服务协议》</a></label>
            </div>
            <div class="h200"></div>
            <div class="submit_box">
                <div class="submit_cent">
                    <a class="submit_r" @click="goSend()">我要寄件</a>
                    <p>
                         费用预估<b>12元</b><br> <a href="#">价格计算规则</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="list_box" v-show="!state" >
            <div class="banner"><img src="../assets/images/banner2.jpg" width="100%"></div>
            <div class="search_box">
                <ul>
                    <li>
                        <input type="text" class="search_num" v-model="searchParams.number" placeholder="请输入单号"><a class="search_sm"><img @click="scanning" src="../assets/images/icon3.jpg" width="100%"></a>
                    </li>
                    <li @click="searchCompany">
                        <span v-if="!searchParams.company" class="search_company">快递公司{{searchParams.company}}</span>
                        <span v-if="searchParams.company" class="search_company">{{searchParams.companyName}}</span>
                    </li>
                </ul>
                <div class="search_jg"><input @click="searchExpress()" type="button" value="我要查询"><router-link to="/looked">我查询过的快递单</router-link></div>
            </div>
        </div>
        <div class="mask" v-if="!postage"></div>
        <div class="postage_pop" v-if="!postage">
            <i @click="postageDel()">&nbsp;</i>
            <h4>价格计算规则</h4>
            <div class="postage_msg">
                <p>● 您在下单时需先支付首重费用，根据快递员上门取货称重可能需要您补交部分邮费。</p>
                <p>● 详细邮费计算规则，请点击底部按钮<br /><router-link to="/postage">‘价格计算规则’</router-link></p>
            </div>
            <div class="postage_stn">
                <a @click="postageDel()" class="Iknow">我知道了</a> <a @click="postageDel(true)" class="Not">不再提醒我</a>
            </div>
        </div>
        <mt-popup
            v-model="openDate"
            position="bottom"
            style="width: 100%">
            <div class="openPop">
                <span class="floatL" @click="openDatePop()">取消</span>
                <span class="floatR" @click="openDatePop(1);">确定</span>
            </div>
            <mt-picker
                @change="getTime"
                :slots="dataTime">
            </mt-picker>
        </mt-popup>

        <mt-popup
            v-model="openCourier"
            position="top"
            popup-transition="popup-fade"
            style="width: 100%;">
            <courierList :courier="courierLists" :expressSstate="expressSstate" @popHide="popHides"></courierList>
        </mt-popup>

        <mt-popup
            v-model="openMessage"
            position="bottom"
            style="width: 100%;">
            <div class="openPop">
                <span class="floatL" @click="openMessagePop()">取消</span>
                <span class="floatR" @click="openMessagePop(1);">确定</span>
            </div>
            <div class="openTextarea">
                <textarea placeholder="给快递员留言" v-model="popParams.remark" ></textarea>
            </div>

        </mt-popup>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';
    import courierList from '@/pages/courierList/courierList'
    export default {
        name: 'index',
        components:{
          courierList
        },
        data () {
            return {
                state:JSON.parse(sessionStorage.getItem('state') || true), //true:寄件 , false:查件
                postage:JSON.parse(localStorage.getItem('postage')) || false,//不再提示
                checkbox:false, //同意协议
                openDate:false,//显示时间弹窗
                openCourier:false,//显示快递公司弹窗
                openMessage:false,//显示留言弹窗
                expressSstate:1,//发快递1，寄快递2
                courierLists:[//快递公司
                ],
                dataTimeLength:0,//查询出来的日期长度
                dayTims:{},//日期时间对象{今天:['1-2','2-3']}
                dataTime: [//时间对象
                    {
                      flex: 1,
                      values: [],
                      className: 'slot1',
                      textAlign: 'right'
                    }, {
                      flex: 1,
                      values: [],
                      className: 'slot3',
                      textAlign: 'left'
                    }
                ],
                params:{
                  consignerAddressId:null,
                  consignerAddress:null,
                  consignerHouseNumber:null,
                  consignerName:null,
                  consignerMobile:null,
                  consigneeAddressId:null,
                  consigneeAddress:null,
                  consigneerHouseNumber:null,
                  consigneeName:null,
                  consigneeMobile:null,
                },
                searchParams:{
                  number:null
                },
                popParams:{
                    pickUpTime:null,
                    remark:null,
                }
            }
        },
        methods:{
            getInit(){
                this.axios.post('/userClient/findExpressMerchantList',{agentId:sessionStorage.getItem('agentId')}).then((res)=>{//商家列表
                  this.courierLists=res.data.value
                })
            },
            scanning(){ //扫码
              YLJsBridge.call('scanCode',{codeType:2},function(a){
                alert(a)
              })
            },
            selectAddress(type){//选择地址
              let _this=this
              YLJsBridge.call('selectAddress',{codeType:2},function(string){
                let obj = JSON.parse(string.value)
                if(type == 1){
                  _this.params.consignerAddressId  = obj.id
                  _this.params.consignerAddress = obj.address
                  _this.params.consignerHouseNumber = obj.address
                  _this.params.consignerName = obj.name
                  _this.params.consignerMobile = obj.mobile
                }else if(type==2) {
                  _this.params.consigneeAddressId = obj.id
                  _this.params.consigneeAddress = obj.address
                  _this.params.consigneerHouseNumber = obj.address
                  _this.params.consigneeName = obj.name
                  _this.params.consigneeMobile = obj.mobile
                }
              })

            },
            getTimes(){
              this.params.pickUpDate=null
              this.params.pickUpTime=null
              this.popParams.pickUpDate=null
              this.popParams.pickUpTime=null
                let dayTimes={}
                this.axios.post('/userClient/findExpressTimeList',addToken({merchantId:this.params.merchantId})).then((res)=>{//寄送时间
                //this.dataTime[0].values.push(res.data.value[0].serviceDay)
                this.dataTimeLength=res.data.value.length
                if(res.data.value.length){
                    this.dataTime[0].values=[];
                    this.dataTime[1].values=[];
                    this.dataTime[1].values.push(res.data.value[0].serviceTime)
                    res.data.value.map((item)=>{
                      this.dataTime[0].values.push('哪一天'.filtersDay(item.serviceDay))
                      dayTimes['哪一天'.filtersDay(item.serviceDay)]=item.serviceTime.split(',')
                    })
                    this.dayTims=dayTimes
                }
              })
            },
            tabState(state){//切换
                sessionStorage.setItem('state',state)
                this.state=state
                this.expressSstate=state ? 1 : 2
            },
            postageDel(type){//不再显示
                type && localStorage.setItem('postage', true)
                this.postage=true
            },
            goSend(){//寄快递
              if(!this.params.consignerAddressId){
                alert('选择发货地址！')
                return false
              }else if(!this.params.consigneeAddressId){
                alert('请选择收货地址！')
                return false
              }else if(!this.params.merchantId){
                alert('请选择快递公司！')
                return false
              }else if(!this.params.pickUpTime){
                alert('请选配送择时间段！')
                return false
              }else if(!this.params.remark){
                alert('请给快递员留言！')
                return false
              }else if(!this.checkbox){
                alert('请同意服务协议！')
                return false
              }

              Indicator.open('下单中...');

              /*this.params.consignerAddressId=1
              this.params.consignerAddress=1
              this.params.consignerHouseNumber=1
              this.params.consignerName=1
              this.params.consignerMobile=1
              this.params.consigneeAddressId=1
              this.params.consigneeAddress=1
              this.params.consigneerHouseNumber=1
              this.params.consigneeName=1
              this.params.consigneeMobile=1*/
              this.params.paymentType=1
              this.params.price=1
              this.params.weight=1
              this.params.agentId=206
              this.axios.post('/userClient/createExpressOrder',addToken(this.params)).then((res)=>{//商家列表
                Indicator.close();
                this.$router.push('/order');
              }).catch((error)=>{
                Indicator.close();
                alert(error.response.data.message);
              })
            },
            openDatePop(state) {//寄送时间确认
                if(!this.params.merchantId){
                    alert('请先选择快递公司！');
                    return false
                }else if(!this.dataTimeLength){
                  alert('该快递公司暂时休息中，请换一个快递公司吧！');
                  return false
                }
                this.openDate=!this.openDate
                if(state && state==1){
                  this.params.pickUpTime=this.popParams.pickUpTime
                  this.params.pickUpDate=this.popParams.pickUpDate
                }
            },
            getTime(picker, values) {//选择寄送时间

                picker.setSlotValues(1, this.dayTims[values[0]]);
                this.popParams.pickUpTime=values[1]
                this.popParams.pickUpDate='生成时间'.addDate(new Date(), '转换对应的数字'.filtersDays(values[0]))

            },
            openopenCourierPop() {//选择快递公司
                this.openCourier=true
            },
            popHides(checked, state){//选中的快递公司
              this.openCourier=false
              if(state==1){ // 1寄快递 2查快递
                  this.params.merchantId=checked && checked.id
                  this.params.merchantName=checked && checked.name
                  this.getTimes()
              }else if(state==2){
                this.searchParams.companyName=checked.name
                this.searchParams.company=checked.id
              }

            },
            openMessagePop(state) {//显示留言
              this.openMessage=!this.openMessage
              if(state && state==1){
                this.params.remark=this.popParams.remark
              }
            },
            searchExpress() {//查询快递
              Indicator.open('查询中...');
              this.axios.post('/userClient/findExpressByCompanyAndNumber',addToken(this.searchParams)).then((res)=>{//商家列表
                Indicator.close();
                if(res.data.success){
                  this.$router.push(`/orderDetails/${this.searchParams.number}/${this.searchParams.company}`);
                }
              }).catch((error)=>{
                Indicator.close();
                alert(error.response.data.message)
              })
            },
            searchCompany(){ //查询快递公司
              if(!this.searchParams.number){
                alert('请输入快递单号！')
                return false
              }
              Indicator.open('查询中...');
              this.axios.post('/userClient/findExpressCompanyListByNumber',addToken(this.searchParams)).then((res)=>{//商家列表
                Indicator.close();
                if(res.data.success){
                  this.searchParams={
                    number:this.searchParams.number,
                    companyName:res.data.value[0].name,
                    company:res.data.value[0].code
                  }
                  console.log(this.searchParams)
                }
              }).catch((error)=>{
                Indicator.close();
                alert(error.response.data.message);
              })

            }
        },
      created(){
          this.getInit()
      }
    }
</script>
<style scoped>
    @import "../assets/css/index.css";
</style>