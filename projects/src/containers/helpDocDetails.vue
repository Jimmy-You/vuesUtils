<template>
  <div class="helpDocDetails">
    <div class="breadTitle">
      <span>
        <a href="#/" target="_self" style="color:#321fdb" @click="backHome">首页</a> 
        <span class="ivu-breadcrumb-item-separator">/</span>
      </span>
      <span>
        <a href="#/" target="_self">正文</a> 
      </span>
    </div>
    <h6>矢量数据发布&使用</h6>
    <p style="color:#666">2019年12月25日 13:22:58</p>
    <p>矢量数据发布&使用矢量数据发布&使用矢量数据发布&使用矢量数据发布&使用矢量数据发布&使用</p>
   
  </div>
</template>
<script>
export default {
  data(){
    return{
    }
  },
  methods:{
    backHome(){
      this.$emit('showDetailBox',false)
    }
  }
}
</script>
<style lang="less">
.helpDocDetails{
   padding:15px 25px;
   .breadTitle{
      span{
        a{
          color: #515a6e;
          transition: color .2s ease-in-out;
        }
      }
      span.ivu-breadcrumb-item-separator{
        margin: 0 8px;
        color: #dcdee2;
      }
    }
   h6{
     text-align: left;
     font-size: 14px;
     color: #333;
     font-weight: bold;
     line-height: 40px;
   }
   p{
     float: left;
     line-height: 36px;
   }
}
</style>