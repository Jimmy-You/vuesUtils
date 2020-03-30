<template>
  <router-view class="app"></router-view>
</template>

<script>
export default {
  name: "App",
  mounted() {
  }
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "assets/scss/style";
.ivu-message {
  z-index: 1040 !important;
}
</style>
