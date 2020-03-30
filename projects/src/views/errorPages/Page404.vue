<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="w-100">
        <div class="clearfix">
          <h1 class="float-left display-3 mr-4">404</h1>
          <h4 class="pt-3">苦海无涯 回头是岸~</h4>
          <p class="text-muted"><b class="info">{{time}}s</b>后我们会将您遣返大唐。<router-link to="/adminHome">立即回到大唐</router-link></p>
        </div>
      </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
export default {
  name: 'Page404',
  data() {
    return {
      time: 5,
    }
  },
  mounted() {
    let interval = setInterval(() => {
      if(this.time == 1) {
        this.$router.replace('/adminHome');
        clearInterval(interval);
        return;
      }
      this.time-=1;
    }, 1000)
  }
}
</script>
