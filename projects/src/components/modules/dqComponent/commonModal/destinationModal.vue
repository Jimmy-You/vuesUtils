<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="400"
    modalTitle="空间定位"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
  >
    <Form :model="formItem" :label-width="80">
      <FormItem label="经度">
        <Input v-model="formItem.longitude"></Input>
      </FormItem>
      <FormItem label="纬度">
        <Input v-model="formItem.latitude"></Input>
      </FormItem>
    </Form>
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
    }
  },
  data() {
    return {
      formItem: {
        longitude: "",
        latitude: ""
      }
    };
  },
  computed: {},
  methods: {
    handleModalOk() {}
  }
};
</script>
<style lang="less"></style>
