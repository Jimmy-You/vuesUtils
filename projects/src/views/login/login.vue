<template>
  <CContainer class="d-flex align-items-center min-vh-100 bg">
    <CRow class="justify-content-center" style="width: 60%">
      <CCol md="8">
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <h1>登录</h1>
              <p class="text-muted">登录您的账户</p>
              <Form
                ref="formCustom"
                :model="formCustom"
                :rules="ruleCustom"
                :label-width="0"
                @keyup.enter.native="handleSubmit('formCustom')"
              >
                <FormItem prop="userName">
                  <CInput type="text" v-model="formCustom.userName" placeholder="用户名" />
                </FormItem>
                <FormItem prop="pwd">
                  <CInput type="password" v-model="formCustom.pwd" placeholder="密码" />
                </FormItem>
                <CRow>
                  <CCol col="6">
                    <CButton color="primary" class="px-4" @click="handleSubmit('formCustom')">登录</CButton>
                  </CCol>
                  <CCol col="6" class="text-right">
                    <CButton color="link" class="px-0">忘记密码?</CButton>
                  </CCol>
                </CRow>
              </Form>
            </CCardBody>
          </CCard>
          <CCard
            color="primary"
            text-color="white"
            class="text-center py-5 d-md-down-none"
            style="width:44%"
            body-wrapper
          >
            <h2 style="margin-bottom: 36px;">注册账号</h2>
            <p>提供功能强大的在线地图制作工具</p>
						<p>前所未有的流畅体验</p>
            <CButton
              color="primary"
              class="active mt-3"
            >
              注册!
            </CButton>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Login',
  components: {},
  data() {
    const validatePassCheck = (rule, value, callback) => {
      value = value.toLocaleUpperCase()
      if (value === '') {
        callback(new Error('请输入验证码！'))
      } else {
        if (value != this.code) {
          callback(new Error('验证码不正确！'))
        }
        callback()
      }
    }

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码！'))
      } else {
        var reg = /^[a-z0-9_-]{6,18}$/

        if (!reg.test(this.formCustom.pwd)) {
          callback(new Error('密码格式不正确！'))
        }
        callback()
      }
    }

    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名！'))
      }
      callback()
    }

    return {
      userId: '',
      username: '',
      password: '',
      formCustom: {
        username: '',
        password: ''
      },
      ruleCustom: {
        pwd: [{ validator: validatePass, trigger: 'blur' }],
        userName: [{ validator: validateUsername, trigger: 'blur' }]
      },
      code: '',
      writeCode: '',
      nowDate: '2019年6月24日',
    }
  },
  mounted() {
    this.getNowDate()
  },
  methods: {
    //点击登录
    ...mapActions(['getUsers', 'getToken']),
    handleSubmit(name) {
      let _this = this
      this.$refs[name].validate(valid => {
        if (valid) {
          let path = this.$CONST.LOGIN.LOGIN_IN
          this.$http
            .get(path, {
              username: _this.formCustom.userName,
              password: _this.formCustom.pwd,
              routeid: 'devauth'
            })
            .then(res => {
              if (res.data.success) {
                const roleName = res.data.data.userData.roleName
                if (roleName)
                  var userType = roleName[0]
                localStorage.setItem('roleName', userType)
                localStorage.setItem('userId', res.data.data.userData.userId)
                localStorage.setItem('user', res.data.data.userData.userName)
                localStorage.setItem('PIECloud-Token', res.data.data.token)
                if(this.$uploadUtil && this.$uploadUtil.uploaderInstance) {
                  this.$uploadUtil.uploaderInstance.isLogin = true;
                }
                this.$router.push({ path: '/adminHome' })
              } else {
                this.$Message.error('用户名或密码错误！')
              }
            })
        } else {
          this.$Message.error('请输入完整信息')
        }
      })
    },

    saveUser(ss) {
      this.$store.dispatch('getUsers', ss)
    },
    saveToken(response) {
      this.$store.dispatch('getToken', response)
    },
    getNowDate() {
      //获得当前时间
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + '年' + month + '月' + strDate + '日'
      this.nowDate = currentdate
    }
  }
}
</script>
<style lang="less">
.bg {
  background: url(../../assets/images/login.png) no-repeat;
  max-width: 100vw;
  justify-content: center;
}
</style>