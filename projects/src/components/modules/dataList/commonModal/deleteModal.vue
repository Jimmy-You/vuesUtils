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
    <div>是否删除<strong>{{dataName}}</strong>?</div>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
export default {
  name: "deleteModal",
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
      let isDir = this.opsItem[0].dirId ? true : false;
      let keyParam = isDir ? 'dirId' : 'uuid'
      let dirIds = this.opsItem.map(item => {
        return item[keyParam];
      })
      let url = isDir ? this.$CONST.DATA_LIST.DELETE : this.$CONST.DATA_LIST.DELETE_DATA
      let params = {
        dirIds,
        userId: window.localStorage.getItem('userId'),
      }
      this.$http.post(url, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('删除成功!');
          this.$store.dispatch('dataList/updateRefreshfTable')
        } else {
          this.$Message.error(res.data.message || '删除失败!')
        }
        this.handleModalClose()
      })
    }
  }
};
</script>
<style lang="less">
</style>
</style>