<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="500"
    modalTitle="数据集"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
    :modalLoading="true"
  >
    <Tree :data="data1"></Tree>
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
    }
  },
  data() {
    return {
      data1: [
        {
          title: "GF1测试数据源1",
          expand: true,
          children: [
            {
              title: "GF1测试数据集"
            }
          ]
        },
        {
          title: "演示数据源",
          expand: true,
          children: [
            {
              title: "扫描数据集"
            }
          ]
        },
        {
          title: "GF2数据源",
          expand: true,
          children: [
            {
              title: "GF2数据集"
            }
          ]
        }
      ]
    };
  },
  computed: {},
  methods: {
    handleModalOk() {
      this.handleModalClose();
    }
  }
};
</script>
<style lang="less"></style>
