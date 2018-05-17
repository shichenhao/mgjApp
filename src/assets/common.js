//sessionStorage.setItem("token",'b7dd6865e6d244979ddc2f10c80a5782')//babcb87a9a014bc2a01cef0572566e1e,用户b7dd6865e6d244979ddc2f10c80a5782,管理78c8001ccbdc40fb9370b66a35304b9e

//if(window.YLJsBridge){
  setTimeout(()=>{
    if(window.YLJsBridge) {
      YLJsBridge.call('getToken', '', function (a) {
        //alert(a.value)
        sessionStorage.setItem("token", a.value)
        //sessionStorage.setItem("token",'85937ecbd73940f6bf13f4bd9749df00')
        //sessionStorage.setItem("token",'78c8001ccbdc40fb9370b66a35304b9e')
        YLJsBridge.call('getAgentId', '', function (b) {
          //alert(b.value)
          sessionStorage.setItem("agentId", b.value)
        })
      })
    }
  },500)
/*}else{
  sessionStorage.setItem("token",'78c8001ccbdc40fb9370b66a35304b9e')//9e14fa2051b641ebbbfc6c805908cd2a//fe68053943334df98310ad4488241b36

}*/

window.alertApp = function(msg){
  if(window.YLJsBridge) {
    YLJsBridge.call('alert',
      {
        title: '提示',
        button: '确定',
        message: msg,
      }
    )
  }else{
    console.log(msg)
  }
}

window.addToken=function(obj){
  let token = sessionStorage.getItem("token");
  let newObj=obj || {}
  newObj.token = token;
  return newObj

}

String.prototype.filtersDay=function(state){
  let text=''
  switch (state){
    case 0:
      text='今天'
      break
    case 1:
      text='明天'
      break
    case 2:
      text='后天'
      break
    case 3:
      text='第三天'
      break
    case 4:
      text='第四天'
      break
    case 5:
      text='第五天'
      break
    case 6:
      text='第六天'
      break
    case 7:
      text='第七天'
      break
    default:
      text = ''
      break
  }
  return text
}


String.prototype.addDate = function(date, days) {
  console.log(date, days)
  if (days == undefined || days == '') {
    days = null;
  }
  let dates = new Date(date);
  dates.setDate(dates.getDate() + days);
  let month = date.getMonth() + 1;
  let day = dates.getDate();
  return (dates.getFullYear() + '-' + '1'.getFormatDate(month) + '-' + '1'.getFormatDate(day)).toString();
}

String.prototype.toJson = function(string) {
  return JSON.parse(JSON.stringify(string))
}

// 日期月份/天的显示，如果是1位数，则在前面加上'0'
String.prototype.getFormatDate = function(arg) {
  if (arg == undefined || arg == '') {
    return '';
  }

  var re = arg + '';
  if (re.length < 2) {
    re = '0' + re;
  }
  return re;
}

String.prototype.filtersDays=function(state){
  let text=''
  switch (state){
    case '今天':
      text=0
      break
    case '明天':
      text=1
      break
    case '后天':
      text=2
      break
    case '第三天':
      text=3
      break
    case '第四天':
      text=4
      break
    case '第五天':
      text=5
      break
    case '第六天':
      text=6
      break
    case '第七天':
      text=7
      break
    default:
      text = ''
      break
  }
  return text
}

String.prototype.statusFilter=function(state){
  let text=''
  switch (state){
    case -1:
      text='已取消'
      break
    case 0:
      text='创建订单'
      break
    case 1:
      text='待付款'
      break
    case 2:
      text='待确认'
      break
    case 3:
      text='待取件'
      break
    case 4:
      text='已完成'
      break
    default:
      text = ''
      break
  }
  return text
}
String.prototype.takeFilter=function(state){
  let text=''
  switch (state){
    case 0:
      text='已取件'
      break
    case 1:
      text='待取件'
      break
    default:
      text = ''
      break
  }
  return text
}
String.prototype.expressName = function (cody) {
  let obj = JSON.parse(localStorage.getItem("express")) || {}
  console.log(obj)
  return obj[cody] || cody
}

window.expressName = JSON.parse(localStorage.getItem("express")) || {};


String.prototype.timestampToTime = function (timestamp) {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  Y = date.getFullYear() + '-';
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  D = date.getDate();
  h = date.getHours() + ':';
  m = date.getMinutes() + ':';
  s = date.getSeconds();
  return Y+M+D;
}

window.getToken =function (){
    if(!sessionStorage.getItem('token')){
      YLJsBridge.call('getToken', '', function (a) {
        sessionStorage.setItem("token", a.value)
      })
      window.getToken();
    } else {
      return true
    }
}
window.login = function(){
  YLJsBridge.call('login','',function(a){
    if(a.value != '登录失败'){
      sessionStorage.setItem("token", a.value);
    }else{
      return false
    }
  })
}