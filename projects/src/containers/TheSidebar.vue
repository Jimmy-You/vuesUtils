<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show.sync="show"
  >
    <!-- <CSidebarBrand 
      :imgFull="{ width: 118, height: 46, alt: 'Logo', src: 'img/brand/leftLogo1.png'}"
      :imgMinimized="{ width: 118, height: 46, alt: 'Logo', src: 'img/brand/leftLogo1.png'}"
      :wrappedInLink="{ href: 'https://coreui.io/', target: '_blank'}"
    /> -->
    <!-- <div @click="handleColseHelpDoc"> -->
      <div class="brand">
        <img class="logo" src="img/brand/leftLogo1.png" />
        <div class="title">云数管平台</div>
      </div>
      <div class="mini-brand">
        <img class="mini-logo" src="img/brand/mini-logo.png" />
      </div>
      <CRenderFunction flat :content-to-render="nav"/>
      <CSidebarMinimizer
        class="d-md-down-none"
        :class="{'d-md-down-none-minimize': minimize}"
        @click.native="minimize = !minimize"
      />
    <!-- </div> -->
  </CSidebar>
</template>

<script>
import nav from './_nav'

export default {
  name: 'TheSidebar',
  data () {
    return {
      minimize: false,
      nav,
      show: 'responsive'
    }
  },
  methods: {
    handleColseHelpDoc() {
      this.$emit('closeHelpDoc')
    }
  },
  mounted () {
    this.$root.$on('toggle-sidebar', () => {
      const sidebarOpened = this.show === true || this.show === 'responsive'
      this.show = sidebarOpened ? false : 'responsive'
    })
    this.$root.$on('toggle-sidebar-mobile', () => {
      const sidebarClosed = this.show === 'responsive' || this.show === false
      this.show = sidebarClosed ? true : 'responsive'
    })
  }
}
</script>
<style lang="less">
.brand {
  background: @brand-bg;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 10px;
  .logo {
    width: 40%;
    float: left;
    margin-right: 5px;
  }
  .title {
    font-size: 20px;
    font-weight: 550;
  }
}
.mini-brand {
  display: none;
  height: 56px;
  align-items: center;
  justify-content: center;
  .mini-logo {
    width: 60%;
    height: auto;
  }
}
.c-sidebar-minimized {
  .brand {
    display: none;
  }
  .mini-brand {
    display: flex;
  }
}
.c-sidebar{
  .c-sidebar-nav-link {
    .c-sidebar-nav-icon {
      line-height: 1.2rem;
      font-size: 1.09375rem;
    }
  }
  .d-md-down-none {
    position: fixed;
    bottom: 0;
    width: 256px;
  }
  .d-md-down-none-minimize {
    width: 56px;
  }
} 

</style>