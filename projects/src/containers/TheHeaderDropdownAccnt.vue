<template>
  <div>
    <CDropdown
      inNav
      class="c-header-nav-items"
      placement="bottom-end"
      add-menu-classes="pt-0"
    >
      <template #toggler>
        <CHeaderNavLink>
          <div class="c-avatar">
            <img
              src="../assets/images/touxiang.png"
              class="c-avatar-img "
            />
          </div>
        </CHeaderNavLink>
      </template>
    <!-- <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-bell"/> Updates
      <CBadge color="info" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-envelope-open" /> Messages
      <CBadge color="success" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tasks
      <CBadge color="danger" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-comment-square" /> Comments
      <CBadge color="warning" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-dollar" /> Payments
      <CBadge color="secondary" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownDivider/> -->
      <CDropdownItem>
        <div @click="changePassword" style="width:100%;padding:0.5rem 1.25rem">
          <i class="iconfont icon-xiugaimima"></i> 修改密码
        </div>
      </CDropdownItem>
      <CDropdownItem>
        <div @click="loginoutClick" style="width:100%;padding:0.5rem 1.25rem">
           <i class="iconfont icon-tuichu"></i> 退出账号
        </div>
      </CDropdownItem>
    </CDropdown>
    <Modal
        v-model="changePasswordModal"
        title="修改个人密码"
        @on-ok="changePasswordModalOk"
        @on-cancel="changePasswordCancel"
      >
        <CForm>
          <CInput
            type="email"
            description="请输入原密码"
            autocomplete="email"
            label="原密码"
            v-model="oldPsd"
            horizontal
          />
           <CInput
            type="email"
            description="请输入新密码"
            autocomplete="email"
            label="新密码"
            v-model="newPsd"
            horizontal
          />
          <CInput
            type="email"
            description="请再次输入新密码"
            autocomplete="email"
            label="密码确认"
            v-model="newPsdConfirm"
            horizontal
          />
        </CForm>
    </Modal>
    <Modal
      v-model="exitModal"
      title="退出系统确认"
      @on-ok="exitCancelOk"
      @on-cancel="exitCancel">
      <p>确定要退出系统么?</p>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      itemsCount: 42,
      changePasswordModal:false,
      exitModal:false,
      oldPsd: '',
      newPsd: '',
      newPsdConfirm: '',
    }
  },
  methods: {
    //退出登录时触发
    loginoutClick() {
      this.exitModal=true
    },
    exitCancelOk(){
      //退出登陆成功后移除token和用户
      window.localStorage.removeItem('userId')
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('PIECloud-Token')
      if(this.$uploadUtil && this.$uploadUtil.uploaderInstance) {
        // 清除上传列表的一些功能
        if(this.$uploadUtil.uploadInterval) {
          window.clearInterval(this.$uploadUtil.uploadInterval)
          this.$uploadUtil.uploadInterval = '';
        }
        this.$uploadUtil.uploadListObj = {};
        this.$uploadUtil.uploaderInstance.handleLoginLogingout()
      }
      // 清空数据目录store的内容
      this.$store.dispatch('dataList/resetDataListStore');
      const { href } = this.$router.resolve({
        name: `Login`,
      });
      location.replace(href);
    },
    exitCancel(){},
    changePassword(){
      this.changePasswordModal=true
    },
    changePasswordModalOk(){
      if(!this.oldPsd || !this.newPsd || !this.newPsdConfirm) {
        this.$Message.error('请补全信息!')
        return;
      }
      if(this.newPsdConfirm != this.newPsd) {
        this.$Message.error('两次输入的新密码不一致!')
        return;
      }
    },
    changePasswordCancel(){

    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
  .dropdown-item{
    padding: 0;
  }
</style>