<template>
  <models
    :modal="showModal"
		:scrollHide="false"
    modalWidth="600"
    modalTitle="预览图片"
    modalClass="convent-modal"
    :modalLoading="true"
    @listenModal="handleModalClose(modalName)"
    :footerHide="true"
  >
    <img :src="imgSrc" style="width:100%;height: auto;" />
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";

export default {
  name: "imgPreviewModal",
  mixins: [modalMixins],
  props: {
    dataDetail: {
			type: Object,
			default: () => {}
		}
  },
  data() {
    return {
      imgSrc: this.$CONST.DATA_LIST.ONLINE_PREVIEW + '/' + this.dataDetail.uuid,
    };
  },
  computed: {
  },
  methods: {
    
  }
};
</script>
<style lang="less">
</style>