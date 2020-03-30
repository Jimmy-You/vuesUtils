<template>
	<i
		class="iconfont icon-question primary"
		v-c-tooltip.hover="{
			content,
			placement
		}"
	/>
</template>
<script>
export default {
	name: 'tips',
	props: {
		content: {
			type: String,
			default: ''
		},
		placement: {
			type: String,
			default: 'top-start'
		}
	},

}
</script>
<style lang="less">

</style>