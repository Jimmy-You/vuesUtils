<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="400"
    modalTitle="重命名"
    modalClass="convent-modal"
    :modalLoading="true"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
  >
    <Form :model="form" :label-width="85">
      <FormItem label="数据名称">
        <Input v-model="form.name" />
      </FormItem>
    </Form>
  </models>
</template>
<script>
import { mapGetters } from 'vuex'
import modalMixins from "@/components/modules/mixins/modalMixins.js";

export default {
  name: "renameModal",
  mixins: [modalMixins],
  props: {
    dataName: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        name: this.dataName
      }
    };
  },
  computed: {
    ...mapGetters('dataList', ['getCurrentTableData', 'getBreadList']),
  },
  methods: {
    handleModalOk() {
      let currentDir = this.getBreadList[this.getBreadList.length - 1] || {};
      let params = {
        uuid: this.item.uuid,
        dataName: this.form.name,
        dictId: currentDir.dirId
      }
      this.$http.post(this.$CONST.DATA_LIST.UPDATE_DATA, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('修改成功!')
          // 在本地修改状态  减少列表刷新
          for(let i=0;i<this.getCurrentTableData.length;i++) {
            if(this.getCurrentTableData[i].uuid == this.item.uuid) {
              // 调整发布状态
              this.getCurrentTableData[i].dataName = this.form.name;
            }
          }
          this.$store.dispatch('dataList/updateCurrentTableData', this.getCurrentTableData);
        }
        this.handleModalClose();
      })
    }
  }
};
</script>
<style lang="less">
</style>