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
    <div>是否发布<strong>{{dataName}}</strong>?</div>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
import { mapGetters } from 'vuex'

export default {
  name: "publishModal",
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
    ...mapGetters('dataList', ['getCurrentTableData']),
  },
  methods: {
    handleModalOk() {
      // 发布数据
      let dataIndexIds  = [], nums = 0;
      this.opsItem.forEach(item => {
        if(item.isPublish <= 0) { // 未发布的数据插入
          dataIndexIds.push(item.uuid)
          nums++
        }
      })
      if(nums == 0) {
        this.$Message.error('数据已经发布!')
        this.handleModalClose();
        return;
      }
      this.$http.post(this.$CONST.DATA_LIST.DATA_PUBLISH, dataIndexIds).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success(res.data.message || '发布任务已提交!')
          // 在本地修改状态  减少列表刷新
          // this.opsItem.forEach(item => {
          //   for(let i=0;i<this.getCurrentTableData.length;i++) {
          //     if(this.getCurrentTableData[i].uuid == item.uuid) {
          //       // 调整发布状态
          //       this.getCurrentTableData[i].isPublish = 1;
          //     }
          //   }
          // }) 
          // this.$store.dispatch('dataList/updateCurrentTableData', this.getCurrentTableData);
        } else {
          this.$Message.error(res.data.message || '发布失败!')
        }
        this.handleModalClose();
      })
    }
  }
};
</script>
<style lang="less">
</style>
</style>