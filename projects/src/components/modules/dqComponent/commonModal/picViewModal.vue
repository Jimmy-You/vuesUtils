<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="500"
    modalTitle="预览"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
  >
    <div style="picContainer">
      <img class="imgContrnt" :src="picUrl" alt="" />
    </div>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
export default {
  name: "Modal",
  mixins: [modalMixins],
  props: {
    dataName: {
      type: String,
      default: ""
    },
    picUrl: String
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleModalOk() {}
  }
};
</script>
<style lang="less">
.convent-modal {
  .imgContrnt {
    width: 100% !important;
  }
}
</style>
