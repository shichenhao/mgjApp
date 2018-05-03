<template>
    <div>
        <div>{{ priceNum }}</div>
        <ul class="list_menu bgfff">
            <li :class="{on:state}" @click="tabState(true)">
                <strong>寄快递</strong>
            </li>
            <li :class="{on:!state}" @click="tabState(false)">
                <strong>查快递</strong>
            </li>
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
                <input type='checkbox' id='checkbox1' name='checkboox[]' v-model="checkbox">
                <label for='checkbox1'>我已阅读并同意<a>《服务协议》</a></label>
            </div>
            <div class="h200"></div>
            <div class="submit_box">
                <div class="submit_cent">
                    <a class="submit_r" @click="goSend()">我要寄件</a>
                    <p>
                        费用预估<b>{{ price }}元</b><br> <router-link to="/postage">价格计算规则</router-link>
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
                        <span v-if="!searchParams.company" class="search_company">
                            快递公司{{searchParams.company}}
                        </span>
                        <span v-if="searchParams.company" class="search_company">
                            {{searchParams.name}}
                        </span>
                    </li>
                </ul>
                <div class="search_jg"><input @click="searchExpress()" type="button" value="我要查询">
                    <router-link to="/looked">我查询过的快递单</router-link>
                </div>
            </div>
        </div>
        <div class="mask" v-if="!postage"></div>
        <div class="postage_pop" v-if="!postage">
            <i @click="postageDel()">&nbsp;</i>
            <h4>价格计算规则</h4>
            <div class="postage_msg">
                <p>
                    ● 您在下单时需先支付首重费用，根据快递员上门取货称重可能需要您补交部分邮费。
                </p>
                <p>
                    ● 详细邮费计算规则，请点击底部按钮<br />
                    <router-link to="/postage">‘价格计算规则’</router-link>
                </p>
            </div>
            <div class="postage_stn">
                <a @click="postageDel()" class="Iknow">我知道了</a>
                <a @click="postageDel(true)" class="Not">不再提醒我</a>
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
                <span class="floatL">{{ popParams.remark ? popParams.remark.length : 0 }} | 20</span>
                <span class="floatR" @click="openMessagePop(1);">确定</span>
            </div>
            <div class="openTextarea">
                <div class="openTextareaBox">
                    <textarea placeholder="请留言给快递员" v-model="popParams.remark" ></textarea>
                </div>
                <div class="openTextareaList">
                    <span @click="openSelect('缺包装袋')">缺包装袋</span>
                    <span @click="openSelect('缺文件袋')">缺文件袋</span>
                    <span @click="openSelect('体积大')">体积大</span>
                    <span @click="openSelect('要爬楼')">要爬楼</span>
                    <span @click="openSelect('易碎品')">易碎品</span>
                    <span @click="openSelect('不要打电话')">不要打电话</span>
                </div>
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
                courierLists:[],//快递公司
                dataTimeLength:0,//查询出来的日期长度
                dayTims:{},//日期时间对象{今天:['1-2','2-3']}
                dataTime: [//时间对象
                    {
                      flex: 1,
                      values: [],
                      className: 'slot1',
                      textAlign: 'center'
                    }, {
                      flex: 1,
                      values: [],
                      className: 'slot3',
                      textAlign: 'center'
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
                priceParam:{//查询价格参数
                    merchantId:null,
                    consignerProvinceName:null,
                    consigneeProvinceName:null,
                },
                searchParams:{//查询快递参数
                    number:null
                },
                popParams:{
                    pickUpTime:null,
                    remark:null,
                },
                price:0
            }
        },
        computed: {
            priceNum() {
                if (this.priceParam.merchantId && this.priceParam.consignerProvinceName && this.priceParam.consigneeProvinceName) {
                    this.getPrice()
                } else {
                  return null
                }
            }
        },
        methods:{
            getInit(){
              let _this = this;
              setTimeout(()=>{
                if(window.YLJsBridge){
                    YLJsBridge.call('getAgentId','',function(a){
                      sessionStorage.setItem("agentId",a.value)
                      //alert(a.value)
                      _this.axios.post('/express/userClient/findExpressMerchantList',{agentId: a.value}).then((res)=>{//商家列表
                        _this.courierLists=res.data.value
                      })
                    })
                }else{
                  this.axios.post('/express/userClient/findExpressMerchantList',{agentId: 3}).then((res)=>{//商家列表
                    this.courierLists=res.data.value
                  })
                }
              },1000)
            },
            scanning(){//扫码
                let _this=this
                YLJsBridge.call('scanCode',{codeType:2},function(a){
                  if(a.value === '扫描失败'){
                    return false;
                  }else{
                    /*for(i in a.value){
                        alert(i)
                    }*/
                    _this.searchParams.number = a.value['codeStr']
                  }
                })
            },
            selectAddress(type){//选择地址
                let myGeo = new BMap.Geocoder();

                let _this=this
                YLJsBridge.call('selectAddress',{codeType:2},function(string){
                      // 根据坐标得到地址描述
                     let obj = JSON.parse(string.value)
                      myGeo.getLocation(new BMap.Point(obj.longitude, obj.latitude), function(result){
                        if (result){
                          if(type == 1){
                            _this.priceParam.consignerProvinceName = result.addressComponents.city
                          } else if(type == 2){
                            _this.priceParam.consigneeProvinceName = result.addressComponents.city
                          }
                        }
                      });
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
                this.params.pickUpDate=null;
                this.params.pickUpTime=null;
                this.popParams.pickUpDate=null;
                this.popParams.pickUpTime=null;
                let dayTimes={};
                this.axios.post('/express/userClient/findExpressTimeList',addToken({merchantId:this.params.merchantId})).then((res)=>{//寄送时间
                    //this.dataTime[0].values.push(res.data.value[0].serviceDay)
                    this.dataTimeLength=res.data.value.length
                    if(res.data.value.length){
                        this.dataTime[0].values=[];
                        this.dataTime[1].values=[];
                        this.dataTime[1].values.push(res.data.value[0].serviceTime)
                        res.data.value.map((item)=>{
                            this.dataTime[0].values.push('哪一天'.filtersDay(item.serviceDay));
                            dayTimes['哪一天'.filtersDay(item.serviceDay)]=item.serviceTime.split(',')
                        })
                        this.dayTims=dayTimes
                    }
                })
            },
            tabState(state){//切换
                /*if(!state){
                    document.title='查快递'
                } else {
                    document.title='寄快递'
                }*/
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
                } else if (!this.params.consigneeAddressId){
                    alert('请选择收货地址！')
                    return false
                } else if (!this.params.merchantId){
                    alert('请选择快递公司！')
                    return false
                } else if (!this.params.pickUpTime){
                    alert('请选配送择时间段！')
                    return false
                } else if (!this.params.remark) {
                  alert('请给快递员留言！')
                  return false
                } else if (!this.checkbox){
                    alert('请同意服务协议！')
                    return false
                } else if (!this.params.price || this.params.price === 0){
                    alert('快递价格不能为0，请重新选择快递公司')
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
                this.params.consigneeMobile=1
                this.params.price=1
                this.params.weight = 1;*/
                this.params.paymentType = 1;
                this.params.agentId = sessionStorage.getItem('agentId') || 206;
                this.axios.post('/express/userClient/createExpressOrder',addToken(this.params)).then((res)=>{//商家列表
                    Indicator.close();
                    //alert(res.data.value.id)
                    this.$router.push(`/orderCompletion/${res.data.value.id}`);
                }).catch((error) => {
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
                this.openDate=!this.openDate;
                if(state && state == 1){
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
                let _this = this;
                window.rightItemClick=function(){
                  _this.openCourier=false;
                  YLJsBridge.call('showRightItem',{isShow:true,message:'订单'})
                  window.rightItemClick=function(){
                    _this.$router.push('/order');
                  }
                }
                YLJsBridge.call('showRightItem',{isShow:true,message:'取消'})
                this.openCourier=true;
                document.title='快递公司';
            },
            popHides(checked, state){//选中的快递公司
                this.openCourier=false;
                this.rightTop();
                YLJsBridge.call('showRightItem',{isShow:true,message:'订单'})
                document.title='快递';
                if(state==1){ // 1寄快递 2查快递
                    this.params.merchantId=checked && checked.id
                    this.priceParam.merchantId=checked && checked.id
                    this.params.merchantName=checked && checked.name
                    this.getTimes()
                } else if(state==2){
                    this.searchParams.name=checked.name
                    this.searchParams.company=checked.id
                }
            },
            openMessagePop(state) {//显示留言
                this.openMessage=!this.openMessage
                if(state && state==1){
                    if(this.popParams.remark.length > 20){
                      alert('留言最多20位，请修改');
                      this.openMessage=!this.openMessage
                      return false;
                    }
                    this.params.remark=this.popParams.remark
                }
            },
            openSelect(txt){
              this.popParams.remark = txt

            },
            searchExpress() {//查询快递
                if(!this.searchParams.number){
                    alert('请输入快递单号！');
                    return false;
                }else if(!this.searchParams.company){
                    alert('请选择快递公司！');
                    return false;
                }
                Indicator.open('查询中...');
                this.axios.post('/express/userClient/findExpressByCompanyAndNumber',addToken(this.searchParams)).then((res)=>{//商家列表
                    Indicator.close();
                    if(res.data.success){
                      this.$router.push(`/orderDetails/${this.searchParams.number}/${this.searchParams.company}/${this.searchParams.name}`);
                    }
                }).catch((error)=>{
                    Indicator.close();
                    alert(error.response.data.message)
                })
            },
            searchCompany(){ //查询快递公司
                if(!this.searchParams.number){
                    alert('请输入快递单号！');
                    return false;
                }
                Indicator.open('查询中...');
                this.axios.post('/express/userClient/findExpressCompanyListByNumber',addToken(this.searchParams)).then((res)=>{//商家列表
                    Indicator.close();
                    if(res.data.success){
                      if(res.data.value) {
                        window.expressName[res.data.value[0].code] = res.data.value[0].name
                        localStorage.setItem('express', JSON.stringify(window.expressName))
                        this.searchParams = {
                          number: this.searchParams.number,
                          name: res.data.value[0].name,
                          company: res.data.value[0].code,
                        }
                      }else{
                        alert('请输入正确的快递单号！')
                      }
                        console.log(this.searchParams)
                    }
                }).catch((error)=>{
                    Indicator.close();
                    alert(error.response.data.message);
                })
            },
            getPrice(){ //获取价格费用
                this.axios.post('/express/userClient/findExpressPrice',this.priceParam).then((res)=>{
                    this.params.price=res.data.value.price;
                    this.params.weight=res.data.value.weight;
                    this.price=res.data.value.price;
                    //return res.data.value.price
                })
            },
            rightTop(){ // 右上角显示文字
              if(window.YLJsBridge) {
                YLJsBridge.call('showRightItem', {isShow: true, message: '订单'});
              }else{
                setTimeout(()=>{
                  this.rightTop()
                },800)
              }
            }
        },
        created(){
            this.getInit();
        },
        mounted(){
            this.rightTop();
            let _this=this;
            // 右上角点击方法
            window.rightItemClick=function(){
              _this.$router.push('/order');
            }
        },
        beforeDestroy(){
            YLJsBridge.call('showRightItem',{isShow:false,message:''})
        }
    }
</script>
<style scoped>
    @import "../assets/css/index.css";
</style>