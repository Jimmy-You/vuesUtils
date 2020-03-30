<template>
  <div class="tehSupport">
    <div class="supportBox">
      <CRow>
        <CCol sm="12" md="24">
          <CCard border-color="secondary">
            <CCardHeader>技术支持</CCardHeader>
            <CCardBody>
              <div class="content">
                <h5><i></i>电话支持</h5> 
                <p>用户在使用软件产品的过程中，可以通过热线电话从我们售后技术支持部门得到及时的技术支持</p> 
                <p>服务时间：星期一-星期五8:30-12:00；13:30-17:50（公共假期除外）</p> 
                <p>售后技术支持热线：400-890-0662</p>
              </div>
              <div class="content">
                <h5><i></i>E-mail支持</h5> 
                <p>用户在使用软件产品的过程中，可以通过E-mail与我们售后技术支持部门联系并获取技术支持</p> 
                <p>服务时间：星期一-星期五8:30-12:00；13:30-17:50（公共假期除外）</p> 
                <p>售后技术支持邮箱：pie-support@piesat.cn</p>
              </div>
              <div class="content">
                <h5><i></i>QQ交流群</h5> 
                <p>用户在使用软件产品的过程中，可以加入售后技术支持QQ交流群获取技术支持</p> 
                <p>服务时间：星期一-星期五8:30-12:00；13:30-17:50（公共假期除外）</p> 
                <p>售后技术支持QQ：604179645</p>
              </div>
              <div class="content">
                <h5><i></i>自主服务</h5> 
                <p>
                  用户可以登陆公司网站<a href="http://www.piesat.cn/" target="_blank">http://www.piesat.cn/</a>自助获取技术资料。
                </p>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  }
}
</script>
<style lang="less">
.tehSupport{
  height: 100%;
  padding: 16px 30px 0;
  .supportBox{
    background: #fff;
    padding: 20px;
    background: #fff;
    padding: 20px;
    .content{
      margin-top:15px;
      h5{
        font-size: 16px !important;
        color: #535353;
        line-height: 46px;
        font-size: 20px;
        font-weight: bold;
        i{
          float: left;
          width: 10px;
          height: 10px;
          margin-top: 18px;
          border-radius: 50%;
          margin-right: 8px;
          background: #535353;
        }
      }
      p{
        line-height: 30px;
        font-size: 16px;
        text-indent: 1em;
      }
    }
    .border-secondary{
      border: none!important;
    }
  }
}
</style>