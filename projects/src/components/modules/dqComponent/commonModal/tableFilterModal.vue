<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="400"
    modalTitle="二次筛选"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
  >
    <Form :model="formItem" :label-width="90">
      <FormItem
        v-for="(item, index) in currFilterset"
        :key="index"
        :label="item.name + ':'"
      >
        <Row>
          <Col span="24">
            <Input type="text" v-model="item.value"></Input>
          </Col>
        </Row>
      </FormItem>
      <!-- <FormItem label="数据名称：">
        <Input v-model="dataNameString"></Input>
      </FormItem>
      <FormItem label="中心经度：">
        <Row>
          <Col span="11">
            <Input v-model="formItem.lonMin"></Input>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Input v-model="formItem.lonMax"></Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="中心纬度：">
        <Row>
          <Col span="11">
            <Input v-model="formItem.latMin"></Input>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Input v-model="formItem.latMax"></Input>
          </Col>
        </Row>
      </FormItem> -->
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
    },
    currFilterset: Array
  },
  data() {
    return {
      centerPointString: "",
      dataNameString: "",
      formItem: {
        // lonMin: "-180",
        // lonMax: "180",
        // latMin: "-90",
        // latMax: "90"
      }
    };
  },
  computed: {},
  methods: {
    handleModalOk() {
      console.log(this.currFilterset);
      // this.centerPointString =
      //   "POLYGON ((" +
      //   this.formItem.lonMin +
      //   " " +
      //   this.formItem.latMax +
      //   "," +
      //   this.formItem.lonMax +
      //   " " +
      //   this.formItem.latMax +
      //   "," +
      //   this.formItem.lonMax +
      //   " " +
      //   this.formItem.latMin +
      //   "," +
      //   this.formItem.lonMin +
      //   " " +
      //   this.formItem.latMin +
      //   "," +
      //   this.formItem.lonMin +
      //   " " +
      //   this.formItem.latMax +
      //   "))";

      // this.$emit("centerPointString", this.centerPointString);
      this.$emit("currFiltersetAll", this.currFilterset);
      this.$parent.getQueryGene();
    }
  }
};
</script>
<style lang="less"></style>
