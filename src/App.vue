<template>
    <div class="wrapper">
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

  function pgScale(){
    let deviceWidth = document.documentElement.clientWidth;
    if(deviceWidth > 750) deviceWidth = 750;
      document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
  }
  pgScale();
  window.onresize=function(){pgScale();};
 </script>