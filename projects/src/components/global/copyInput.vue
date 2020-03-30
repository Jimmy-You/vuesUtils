<template>
	<div class="copyInputWrapper">
		<Input v-model="data" size="small" style="padding:10px 0;" readonly class="copy-suffix">
			<i slot="append" class="iconfont icon-copy copy_map_key2 pointer" :data-clipboard-text="data"	@click="handleCopyKey"></i>
		</Input>
	</div>
</template>
<script>
import ClipboardJS from 'clipboard'

export default {
	name: 'copyInput',
	props: {
		data: {
			type: String,
			default: ''
		}
	},
	methods: {
		handleCopyKey() {
      this.$Message.success('复制成功')
		},
	},
	mounted() {
		const clipboard = new ClipboardJS('.copy_map_key2')
	}
}
</script>
<style lang="less">
.copyInputWrapper {
	.copy-suffix {
		.ivu-input-group-append {
			background: @theme-primary;
			.icon-copy {
				font-size: 18px;
				color: #fff;
			}
		}
	}
}
</style>