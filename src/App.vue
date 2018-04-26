<template>
    <div class="wrapper">
        <v-head title="快递"></v-head>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

  import vHead from './components/common/Header.vue';
  import './assets/common'
  export default {
      components:{
          vHead
      }
  }
  function pgScale(){
    var deviceWidth = document.documentElement.clientWidth;
    if(deviceWidth > 750) deviceWidth = 750;
      document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
  }
  pgScale();
  window.onresize=function(){pgScale();};
 </script>