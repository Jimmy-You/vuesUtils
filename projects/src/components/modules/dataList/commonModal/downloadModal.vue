<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="400"
    modalTitle="提示"
    modalClass="convent-modal"
    :modalLoading="true"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
  >
    <div style="overflow: hidden;text-overflow: ellipsis;">是否下载<strong>{{dataName}}</strong>?</div>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
export default {
  name: "downloadModal",
  mixins: [modalMixins],
  props: {
    dataName: {
      type: String,
      default: ''
    },
    opsItem: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      
    };
  },
  computed: {
  },
  methods: {
    handleModalOk() {
      function downloadByIframe(url) {
        var elemIF = document.createElement('iframe')
        elemIF.src = url
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
      this.opsItem.forEach(item => {
        downloadByIframe(this.$CONST.DOWNLOAD.DOWNLOADd_DATA + item.uuid)
      })
      this.handleModalClose();
    }
  }
};
</script>
<style lang="less">
</style>
</style>