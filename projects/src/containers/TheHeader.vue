<template>
    <CHeader fixed with-subheader light class="my-header" style="position: absolute;margin: 0;">
      <div @click="closeHelpDoc" class="header">

      <CToggler
        in-header
        class="ml-3 d-lg-none"
        v-c-emit-root-event:toggle-sidebar-mobile
      />
      <CToggler
        in-header
        class="ml-3 d-md-down-none"
        v-c-emit-root-event:toggle-sidebar
      />
      <CHeaderBrand
        class="mx-auto d-lg-none" 
        src="img/brand/leftLogo1.png"
        width="190"
        height="46"
        alt="数据发布"
      />
        <CHeaderNav class="d-md-down-none mr-auto leftHeader">
        </CHeaderNav>
        <CHeaderNav class="mr-4 rightHeader">
     
          <CHeaderNavItem class="d-md-down-none mx-2">
            <CHeaderNavLink>
              <!-- <Poptip trigger="hover" title="消息">
                <div style="cursor:pointer;">
                  <Badge dot :count="getMsgDatas.length">
                     <i class="iconfont icon-lingdang" style="font-size: 22px;" />
                  </Badge>
                </div>
                <div slot="content" style="background:#F5F5F5;margin-top:10px;min-width:200px;">
                  <div style="height:150px;">
                    <vue-scroll>
                      <div style="padding:0 15px 0 0;" class="mssageBox">
                        <p
                          class="mssageItem"
                          v-for="(temp,index) in getMsgDatas"
                          :key="index"
                        >{{temp.msg}}</p>
                      </div>
                    </vue-scroll>
                  </div>
                </div>
              </Poptip> -->
            </CHeaderNavLink>
          </CHeaderNavItem>
          <CHeaderNavItem class="d-md-down-none mx-2">
            <CHeaderNavLink>
              <Poptip class="m_task_poptip" trigger="click" title="" placement="bottom">
                <template slot="content">
                  <tileTaskDetail v-if="taskShow" />
                </template>
                <i class="iconfont icon-weibiaoti12" title="切片进度" style="font-size: 20px;" @click="triggleTaskShow" />
              </Poptip>
            </CHeaderNavLink>
          </CHeaderNavItem>
          <TheHeaderDropdownAccnt/>
          <CHeaderNavItem class="d-md-down-none mx-2">
            <CHeaderNavLink>
              <div @click.stop>
              <div @click="helpDocument">
                <i class="iconfont icon-icon_bangzhuwendang" title="帮助文档" style="font-size: 22px;" />
              </div>
              <transition name="slide-fade">
                <div class="helpBox" v-if="showDoc" >
                  <h5>帮助文档 <i class="iconfont icon-guanbi" style="font-size:18px;float:right" @click="closeDoc"/></h5>
                  <div class="listBox">
                    <ul class="list" v-if="showMain">
                      <li v-for="(list,index) in lists" :key="index" @click="toggleDetails(list)">
                        {{list.text}}
                      </li>
                    </ul>
                    <div v-else>
                      <helpDocDetails @showDetailBox="showDetailBox" />
                    </div>
                  </div>
                  <div class="helpFooter" >
                    <a href="javascript:void(0)">完整用户手册</a>
                    <a href="javascript:void(0)">二次开发手册</a>                
                  </div>
                </div>
              </transition>
              </div>
            </CHeaderNavLink>
          </CHeaderNavItem>
        </CHeaderNav>
      <!-- <CSubheader class="px-3">
        <CBreadcrumbRouter class="border-0"/>
      </CSubheader> -->
      </div>

    </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import helpDocDetails from './helpDocDetails'
import tileTaskDetail from './tileTaskDetail';

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt,
    helpDocDetails,
    tileTaskDetail
  },
  data() {
    return {
      msgDatas: [{ msg: '12121' }],
      showDoc: false,
      showMain:true,
      taskShow: false,
      lists:[
        {
          text:'矢量数据发布&使用'
        }, {
          text:'栅格数据发布&使用'
        }, {
          text:'在线配图工具使用'
        }, {
          text:'Token获取及使用方法'
        }, {
          text:'FTP获取及使用方法'
        }, {
          text:'二次开发接口使用'
        }, {
          text:'注册&登录'
        }
      ]
    }
  },
  computed: {
    
  },
  watch:{
    
  },
  methods: {
    triggleTaskShow() {
      this.taskShow = !this.taskShow;
    },
    showNotice() {
      this.$Message.info('消息提醒暂未上线,敬请期待!')
    },
    closeDoc(){//关闭文档
      this.showDoc =false
    },
    // 显影帮助文档
    helpDocument(){
      this.showDoc = !this.showDoc
    },
    // 关闭帮助文档
    closeHelpDoc() {
      if(this.showDoc) this.showDoc = false;
    },
    toggleDetails(){
      this.showMain=false
    },
    showDetailBox(){
      this.showMain=true
    }
  },
  mounted() {
  }
}
</script>
<style lang="less">
.my-header {
  height: 56px!important;
  .header{
    width: 100%;
    
    .c-header-toggler{
      height: 56px;
    }
      .rightHeader{
        float: right;
      }
      .leftHeader{
        float: left;
        
      }
  }
  .support-pop {
    .ivu-poptip-title {
      text-align: center;
      &::after {
        display: none;
      }
    }
    .ivu-poptip-body {
      background: @main-background-color;
    }
  }
  .helpBox{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 360px;
    z-index: 999;
    background: #fff;
    border-left: 1px solid #CED2D8;
    h5{
      color: #333;
      padding: 0 25px;
      text-align: left;
      line-height: 56px;
      font-weight: 550;
      background: #eee;
      em{
        float: right;
        font-size: 16px;
        font-weight: normal;
      }
    }
    .listBox{
      width: 100%;
      .list {
        padding:0 25px;
        li{
          color: #333;
          list-style: none;
          line-height:46px;
          border-bottom: 1px solid #ddd;
        }
      }
    }
    .helpFooter{
      position: absolute;
      bottom: 20px;
      left: 25px;
      right: 25px;
      height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      a{
        color:#321fdb;
        text-decoration: underline;
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  .m_task_poptip {
    .ivu-poptip-popper {
      .ivu-poptip-content {
        .ivu-poptip-arrow {
          &::after {
            border-bottom-color: @theme-primary;
          }
        }
        .ivu-poptip-inner {
          .ivu-poptip-body {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>