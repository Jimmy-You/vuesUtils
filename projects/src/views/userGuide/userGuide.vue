<template>
	<div class="pdf_container">
		<div class="center_container">
			<div
				class="page"
				v-for="(item, index) in pages"
				:key="index"
			>
				用户手册
			</div>
		</div>
	</div>	
</template>
<script>
export default {
	data() {
		return {
			pages: [1,2,3,4,5],
		}
	}
}
</script>
<style lang="less">
.pdf_container {
  width: 100%;
  height: 100vh;
  background: rgb(82, 86, 89);
  overflow: scroll;
  .center_container {
    margin: 0 auto;
    width: 50vw;
    .page {
      height: 98vh;
      background: #fff;
      text-align: center;
      font-size: 50px;
      margin-top: 20px;
    }
  }
}

</style>