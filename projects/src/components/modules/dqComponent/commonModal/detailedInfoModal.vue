<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="1000"
    modalTitle="详情"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
  >
    <Row>
      <Col span="12">
        <img style="width:100%" :src="rowOfDetail.thumbimage_path || ''" alt=""
      /></Col>

      <Col span="11" offset="1">
        <Form :label-width="110" label-position="left">
          <FormItem label="数据名称：">
            <p>
              {{ rowOfDetail.data_name }}
            </p>
          </FormItem>
          <FormItem label="日期：">
            <p>{{ lister.producetime || "暂无" }}</p>
          </FormItem>
          <FormItem label="中心位置：">
            <p>
              {{
                rowOfDetail.lon_center.toString().slice(0, 6) +
                  "E" +
                  " " +
                  rowOfDetail.lat_center.toString().slice(0, 6) +
                  "N"
              }}
            </p>
          </FormItem>
          <FormItem label="左上角：">
            <p>
              {{
                this.lister.coordinates[0][0] +
                  "E" +
                  " " +
                  this.lister.coordinates[0][1] +
                  "N"
              }}
            </p>
          </FormItem>
          <FormItem label="右上角：">
            <p>
              {{
                this.lister.coordinates[1][0] +
                  "E" +
                  " " +
                  this.lister.coordinates[1][1] +
                  "N"
              }}
            </p>
          </FormItem>
          <FormItem label="右下角：">
            <p>
              {{
                this.lister.coordinates[2][0] +
                  "E" +
                  " " +
                  this.lister.coordinates[2][1] +
                  "N"
              }}
            </p>
          </FormItem>
          <FormItem label="左下角：">
            <p>
              {{
                this.lister.coordinates[3][0] +
                  "E" +
                  " " +
                  this.lister.coordinates[3][1] +
                  "N"
              }}
            </p>
            <!-- <p>
              {{
                rowOfDetail.lon_center.toString().slice(0, 6) +
                  "E" +
                  " " +
                  rowOfDetail.lat_center.toString().slice(0, 6) +
                  "N"
              }}
            </p> -->
          </FormItem>
          <!-- <FormItem label="数据量：">
            <p>
              {{ rowOfDetail.data_size }}
            </p>
          </FormItem> -->
          <!-- <FormItem label="左上角：">
            <p>
              110.638E 41.089N
            </p>
          </FormItem>
          <FormItem label="右上角：">
            <p>
              110.915E 41.042N
            </p>
          </FormItem>
          <FormItem label="右下角：">
            <p>
              110.853E 40.835N
            </p>
          </FormItem>
          <FormItem label="左下角：">
            <p>
              110.853E 40.835N
            </p>
          </FormItem> -->
        </Form></Col
      >
    </Row>
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
    rowOfDetail: Object,
    extraRowOfDetail: String
  },
  data() {
    return {
      lister: {}
    };
  },
  computed: {},
  methods: {
    getList() {
      let params = {
        id: this.extraRowOfDetail
      };
      this.$http
        .get(this.$CONST.DQ_COMPONENT.QUERY_DATA_INFO, params)
        .then(res => {
          if (res.data && res.data.success) {
            console.log("详情");
            console.log(res.data.data);
            this.lister = res.data.data;
          }
        });
    },
    handleModalOk() {}
  },
  mounted() {
    this.getList();
  }
};
</script>
<style lang="less"></style>
