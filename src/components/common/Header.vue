<template>
    <mt-header :title="title">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
</template>
<script>
    export default {
        props:[
          'title'
        ],
        data() {
            return {
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>
<style>

    .mint-header{
        background:#fff;
        color:#000;
        border-bottom: 2px solid #f1f1f1;
    }
</style>
