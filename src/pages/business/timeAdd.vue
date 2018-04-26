<template>
    <div>
        <div class="serviceTime">
            <ul>
                <li @click="openDatePop()">
                    服务日期
                    <span v-if="addParams.serviceDay || addParams.serviceDay == 0" class="dateChange">
                        {{ typeof addParams.serviceDay == 'number' ? '服务日期'.filtersDay(addParams.serviceDay) : addParams.serviceDay}}
                    </span>
                </li>
                <li>
                    服务时间
                    <span class="timeChange">
                        <span v-show="timeList.length==1 || !timeList.length"><i @click="openTime(0,'first')">{{timeList.length ? timeList[0].first : ''}}</i>—<i @click="openTime(0,'last')">{{timeList.length ? timeList[0].last : ''}}</i></span>
                        <span v-show="timeList.length>1" v-for="(item, index) in timeList"><i @click="openTime(index,'first')">{{item.first}}</i>—<i @click="openTime(index,'last')">{{item.last}}</i><b @click="delteTime(index)" v-show="index>=1">✖</b></span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="timeBoxAdd" @click="timeBoxAdd">
            <i>+</i>新增服务时间
        </div>

        <div class="btnFiexd">
            <span class="button" @click="$router.push('/business/time/')">取消</span>
            <span class="button button-primary" @click="Add">保存</span>
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


        <template>
            <mt-datetime-picker
                    ref="picker"
                    type="time"
                    v-model="pickerValue"
                    @confirm="changeTime">
            </mt-datetime-picker>
        </template>


        <!--<mt-popup
                v-model="openTime"
                position="bottom"
                style="width: 100%">
            <div class="openPop">
                <span class="floatL" @click="openTimePop()">取消</span>
                <span class="floatR" @click="openTimePop(1);">确定</span>
            </div>
            <div class="openTiem">
                <span class="active">10:00 - 12:00</span>
                <span>10:00 - 12:00</span>
                <span>10:00 - 12:00</span>
                <span>10:00 - 12:00</span>
                <span>10:00 - 12:00</span>
            </div>
        </mt-popup>-->

    </div>
</template>
<script>
  import { MessageBox, Indicator } from 'mint-ui';
  export default {
    name: 'timeAdd',
    data () {
      return {
        state:true,
        openDate:false,//显示日期
        //openTime:false,//显示时间弹窗
        pickerValue:null,//选择的时间段
        dataTime: [//日期对象
          {
            flex: 1,
            values: ['今天', '明天', '后天', '第三天', '第四天', '第五天', '第六天', '第七天'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        timeObj:{//选择时间对象
          index:0,
          position:'first'
        },
        timeVal:{},
        timeList:[//时间对象
        ],
        addParams:{
          status:0
        }
      }
    },
    methods:{
      getInit(){    //初始化数据
        let id = this.$router.history.current.params.id
        if(id !=0){ //查询详情
          Indicator.open('加载中...');
          this.axios.post('/merchantClient/findExpressTime',addToken({id})).then((res)=>{
            Indicator.close();
            this.addParams=res.data.value
            this.addParams.id=id
            this.addParams.serviceDays='日期转换汉字'.filtersDay(this.addParams.serviceDay)
            if(res.data.value.serviceTime){
                this.timeList =  res.data.value.serviceTime.split(',').map((item)=>{
                  return {
                    first:item.split('-')[0],
                    last:item.split('-')[1]
                  }
                })
            }
          })

        }
      },
      changeTime(){ //确定时间段
        if(!this.pickerValue){
          this.pickerValue='00:00'
        }

        this.timeVal = this.timeList[this.timeObj.index] ? this.timeList[this.timeObj.index] : {}
        this.timeVal[this.timeObj.position]=this.pickerValue
        this.$set(this.timeList, this.timeObj.index, this.timeVal)
        if(this.timeVal.last && this.timeVal.first){
          this.timeVal={}
        }
      },
      openTime(index, position){ //操作那一列时间对象
        this.$refs.picker.open()
        this.timeObj={
          index,
          position
        }
        console.log(this.timeObj)
      },
      delteTime(index){  //删除当前时间段
        this.timeList.splice(index,1);
      },
      timeBoxAdd(){ //新增时间参数
        this.timeList.push({
          first:null,
          last:null
        })
      },
      getTimes(values) {//选择服务时间
        this.addParams.serviceTimes=values
      },
      openDatePop(state) {//服务日期确认
        console.log(this.addParams)
        //this.getTimes()
        this.openDate=!this.openDate
        if(state && state==1){
          this.addParams.serviceDay=this.addParams.serviceDays
        }
      },
      getTime(picker, values) {//选择寄送时间
        console.log(values)
        this.addParams.serviceDays=values[0]
      },
      Add(){    //创建
        Indicator.open('加载中...');
        this.addParams.serviceDay=this.addParams.serviceDays
        this.addParams.serviceTime=this.timeList.map((item)=>{
          item.times=item.first+'-'+item.last
          return item.times
        })

        this.addParams.serviceDay = '日期转数字'.filtersDays(this.addParams.serviceDay)

        this.axios.post('/merchantClient/createOrMergeExpressTime',addToken(this.addParams)).then((res)=>{
          Indicator.close();
          if(res.data.success){
            this.$router.push(`/business/time`);
            MessageBox('提示', '操作成功！');
          }
        }).catch((error)=>{
          Indicator.close();
          MessageBox('提示', error.response.data.message);
        })
      },
      /*getTimes(){
        this.axios.post('/userClient/findExpressTimeList',{merchantId:this.params.merchantId}).then((res)=>{//寄送时间
          this.dataTime=res.data.value
        })
      },
      openTimePop(state) {//服务时间确认
        console.log(this.addParams)
        //this.getTimes()
        this.openTime=!this.openTime
        if(state && state==1){
          this.addParams.serviceTime=this.addParams.serviceTimes
        }
      },*/
    },
    created(){
      this.getInit()
    }
  }
</script>
<style scoped>
    @import "css/business.css";
</style>