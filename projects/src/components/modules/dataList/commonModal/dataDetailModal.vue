<!-- 数据详情 -->
<template>
  <models
    :modal="showModal"
    modalWidth="600"
    modalTitle="数据源详情"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    :footerHide="true"
  >
    <Form :label-width="85">
      <FormItem label="数据集名称">
        <div>{{dataDetail.dictName || '--'}}</div> 
      </FormItem>
      <FormItem label="数据集类型">
        <div>{{getDataTypeName || '--'}}</div> 
      </FormItem>
      <FormItem label="样本类型" v-if="dataDetail.dataSetType == 'samplelibds'">
        <div>{{dataDetail.sampleType || '--'}}</div> 
      </FormItem>
      <FormItem label="数据日期" v-if="dataDetail.dataSetType == 'gridds' || dataDetail.dataSetType == 'uavds'">
        <div>{{getDataTime || '--'}}</div> 
      </FormItem>
      <FormItem label="分辨率" v-if="dataDetail.dataSetType == 'gridds' || dataDetail.dataSetType == 'uavds'">
        <div>{{dataDetail.dataResolution || '--'}}</div> 
      </FormItem>
      <FormItem label="数据区域" v-if="dataDetail.dataSetType == 'gridds' || dataDetail.dataSetType == 'uavds'">
        <div>{{dataDetail.dataArea || '--'}}</div> 
      </FormItem>
      <FormItem label="数据来源">
        <div>{{dataDetail.dataProvider || '--'}}</div> 
      </FormItem>
      <FormItem label="目录描述">
        <div>{{dataDetail.dirDesc || '--'}}</div> 
      </FormItem>
    </Form>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
import dateFormatter from "@/utils/dateFormatter.js"

export default {
  name: "dataDetailModal",
  mixins: [modalMixins],
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dataDetail: {

      }
    };
  },
  computed: {
    getDataTypeName() {
      return this.$CONST.DATA_SET_TYPE[this.dataDetail.dataSetType] || ''
    },
    getDataTime() {
      if(this.dataDetail.dataDate) {
        return dateFormatter('yyyy-MM-dd', new Date(this.dataDetail.dataDate))
      } else {
        return ''
      }
    }
  },
  methods: {
    getDataDetail() {
      this.$http.get(this.$CONST.DATA_LIST.DATA_SET_DETAIL, {
        dirId: this.item.dirId
      }).then((res) => {
        if(res.data && res.data.success) {
          this.dataDetail = res.data.data || {}
          if(this.dataDetail.dataArea && this.dataDetail.dataArea.indexOf('_') == 0) {
            this.$set(this.dataDetail, 'dataArea', this.dataDetail.dataArea.slice(1));
            return;
          }
          if(this.dataDetail.dataArea && this.dataDetail.dataArea.indexOf('_') != 0) {
            // 省市区地址
            this.getAreaName()
          }
        }
      })
    },
    // 获取详细的省市区地址
    getAreaName() {
      const dataAreaList = this.dataDetail.dataArea.split('~');
      let province = '', city = '', country = '', detailAddress = '';
      province = dataAreaList[0] || ''
      city = dataAreaList[1] || ''
      country = dataAreaList[2] || ''
      detailAddress = dataAreaList[3] || ''
      const params = [];
      for(let i=0;i<3;i++) {
        if(dataAreaList[i]) params.push(dataAreaList[i])
      }
      if(params.length) {
        // 有省市区的code
        this.$http.post(this.$CONST.DATA_LIST.GET_AREANAME_BY_CODE, params).then((res) => {
          if(res.data && res.data.success) {
            const data = res.data.data || []
            const add = data.join('-')
            this.$set(this.dataDetail, 'dataArea', add + (detailAddress ? '-' + detailAddress : ''));
          }
        })
      } else {
        // 单纯的其他地址
        this.$set(this.dataDetail, 'dataArea', detailAddress);
      }
      
    },
  },
  mounted() {
    this.getDataDetail();
  }
};
</script>
<style lang="less">
</style>