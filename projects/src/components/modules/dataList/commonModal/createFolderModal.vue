<!-- 
  创建目录的弹窗
-->
<template>
  <models
    :modal="showModal"
    modalWidth="600"
    modalTitle="新建目录"
		:scrollHide="true"
    modalClass="convent-modal"
    :modalLoading="true"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleCreateFolder"
    :footerHide="false"
  >
    <Form :model="createForm" :label-width="85">
      <FormItem label="目录名称">
        <Input v-model="createForm.name" />
      </FormItem>
      <FormItem label="目录描述">
        <Input v-model="createForm.desc" type="textarea" />
      </FormItem>
    </Form>
  </models>
</template>
<script>
import { mapGetters } from 'vuex'
import modalMixins from "@/components/modules/mixins/modalMixins.js";

export default {
  name: "createFolderModal",
  mixins: [modalMixins],
  props: {
    parentDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      createForm: {
        name: '',
        desc: '',
        dataType: '',
        dataSource: '',
        sampleType: '',
        dataTime: '',
        dataResolution: '',
        province: '',
        city: '',
        country: '',
        detailAddress: '',
        otherAddress: '',
      },
    };
  },
  computed: {
    ...mapGetters('dataList', ['getBreadList']),
  },
  methods: {
    handleCreateFolder() {
      let { dirId = '', dirPath = '' } = this.parentDetail || {};
      let params = {
        parentId: dirId,
        dictName: this.createForm.name,
        isDataset: '0',
        dirDesc: this.createForm.desc,
        dataSetType: '',
        sampleType: '',
        dataArea: '', // 数据区域  省市区或者其他地址 用两种方式存储  拿出来解析的时候用同样的策略
        dataProvider: '',
        dataResolution: '',
        dataDate: '',
        userId: window.localStorage.getItem('userId'),
        parentId: this.parentDetail.dirId || '0',
      }
      this.$http.post(this.$CONST.DATA_LIST.ADD_FOLDER, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('创建成功!')
          this.$emit('handleCreateSuccess')
        }
        this.handleModalClose();
      })
    },
  },
  mounted() {
  }
};
</script>
<style lang="less">
</style>