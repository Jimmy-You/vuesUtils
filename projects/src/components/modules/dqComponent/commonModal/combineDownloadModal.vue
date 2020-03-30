<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="500"
    modalTitle="批量下载"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
    :modalLoading="true"
  >
    <p>是否确定批量下载</p>
    <!-- {{ selectedRow }} -->
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
export default {
  name: "dataCollectModal",
  mixins: [modalMixins],
  props: {
    dataName: {
      type: String,
      default: ""
    },
    selectedRow: Array
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleModalOk() {
      function downloadByIframe(url) {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
      }
      this.selectedRow.forEach(item => {
        downloadByIframe(this.$CONST.DQ_COMPONENT.DQ_DOWNLOAD + item.uuid);
      });

      // let that = this;
      // this.selectedRow.map(v => {
      //   that.$parent.downloadData(v.uuid);
      // });
      this.handleModalClose();
    }
  }
};
</script>
<style lang="less"></style>
