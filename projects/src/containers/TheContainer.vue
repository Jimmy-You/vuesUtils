<template>
  <div class="c-app">
    <TheSidebar @closeHelpDoc="handleCloseHelpDoc" />
    <div class="c-wrapper">
      <TheHeader ref="header" />
      <div class="c-body" style="padding-top: 56px;height:100vh" @click="handleCloseHelpDoc">
        <main class="c-main" style="background: #EBEDEF;padding-top: 0">
          <CContainer fluid style="padding: 0;height: 100%;">
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <!-- <TheFooter/> -->
    </div>
  </div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
import { on, off } from '@/utils/commonUtils.js'

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
    TheHeader,
    TheFooter
  },
  data() {
    return {
      uploadClockId: '', // 上传控制器
    }
  },
  computed: {
  },
  methods: {
    // 关闭帮助文档
    handleCloseHelpDoc() {
      this.$refs.header.closeHelpDoc();
    }
  },
  watch: {
    
  },
  mounted() {
    let userId = localStorage.getItem('userId');
    if(userId && this.$uploadUtil && this.$uploadUtil.uploaderInstance && !this.$uploadUtil.uploaderInstance.isLogin) {
      this.$uploadUtil.uploaderInstance.isLogin = true;
    }
  }
}
</script>

<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.c-wrapper {
  position: relative;
}
.c-body {
  .c-main {
    background: @main-background-color;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    min-width: 0;
  }
}
@keyframes uploading {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes uploading {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.upload-tag {
		cursor: pointer;
		position: absolute;
		bottom: 40px;
		right: 10px;
		width: 140px;
		height: 30px;
		color: #fff;
		background: @font-color-active;
		border-radius: 15px;
		margin-right: -110px;
		transition: margin-right 1s;
		display: flex;
		align-items: center;

		img {
			width: 24px;
			height: 24px;
			margin: 0 10px;
		}
		&:hover {
			margin-right: -20px;
		}
	}

.upload-list {
  z-index: 999;
  position: absolute;
  bottom: 20px;
  right: 10px;
  width: 240px;
  height: 280px;
  color: @font-gray-color;
  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
  .close {
    text-align: right;
    i {
      cursor: pointer;
      font-size: 22px;
    }
  }
  .list-item {
    padding: 10px 10px;
    .ivu-progress-bg {
      background: @font-color-active;
    }
    .task-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
