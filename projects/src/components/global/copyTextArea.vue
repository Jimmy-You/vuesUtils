<template>
	<div class="copyTextAreaWrapper">
     <Input v-model="data" type="textarea" :autosize="{minRows: 12}" class="copy-suffix" style="padding:10px 0;" readonly />
			<i slot="append" class="iconfont icon-copy copy_map_key2 pointer" :data-clipboard-text="data"	@click="handleCopyKey"></i>
		</Input>
	</div>
</template>
<script>
import ClipboardJS from 'clipboard'

export default {
	name: 'copyTextArea',
	data(){
		return{
			data:'1111'
		}
	},
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
.copyTextAreaWrapper {
  position: relative;
  .iconfont {
    position: absolute;
    right: 0;
    top: 10px;
    background:  @theme-primary;
    color: #fff;
    padding:0 8px;
  }
}
</style>