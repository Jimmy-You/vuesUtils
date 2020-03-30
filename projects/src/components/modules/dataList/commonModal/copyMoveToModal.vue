<!-- 
  复制和移动公用的弹窗组件
-->
<template>
  <models
    :modal="showModal"
    modalWidth="700"
    modalClass="convent-modal"
    :modalLoading="true"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleComfirm"
    :footerHide="false"
    headerSlot
  >
    <div slot="title">
      <div>{{type == 'copy' ? '复制' : '移动'}}<em>&nbsp;{{'"' + folderName + '"'}}&nbsp;</em>到</div>
    </div>
    <div>
      <mTree :node="folder" />
    </div>
  </models>
</template>
<script>
import { mapGetters } from 'vuex'
import modalMixins from "@/components/modules/mixins/modalMixins.js";
export default {
  name: "copyMoveToModal",
  mixins: [modalMixins],
  props: {
    type: { // 复制或者移动
      type: String,
      default: 'copy'
    },
    opsItems: { // 选中的操做项
      type: Array,
      default: () => []
    }
  },
  provide: function () {
    console.log(this.opsItems);
    return {
      handleNodeSelect: this.handleTreeNodeSelect,
      copyToDataSet: this.opsItems[0].uuid && this.opsItems[0].uuid != ''
    }
  },
  data() {
    return {
      currentSelectNode: undefined,
      folder: {
        dictName: '数据目录',
        dirId: '0',
        isDataset: '0',
        children: []
      },
    };
  },
  computed: {
    ...mapGetters('dataList', ['getBreadList']),
    folderName() {
      let name = '';
      let len = this.opsItems.length;
      if(this.opsItems && len) {
        for(let i=0;i<len;i++) {
          if(i >= 2) {
            name += `等${len}个项目`
            break;
          }
          name += this.opsItems[i].dataName || this.opsItems[i].dictName
          if(i==0 && len > 1) name += '、'
        }
      }
      return name;
    }
  },
  methods: {
    handleComfirm() {
      // 移动目录位置确定
      if(!this.currentSelectNode) return;
      if(this.type == 'copy') {
        this.handleCopy();
      } else {
        this.handleMove();
      }
    },
    handleTreeNodeSelect(node) {
      this.currentSelectNode = node;
    },
    // 复制的方法
    handleCopy() {
      if(!this.currentSelectNode) {
        this.$Message.error('请选择目标目录')
        return;
      }
      let opsType = this.opsItems[0].dirId
      let indexKey = opsType ? 'dirId' : 'uuid'
      let url = opsType ? this.$CONST.DATA_LIST.COPY : this.$CONST.DATA_LIST.COPY_DATA
      let opsIds  = [];
      this.opsItems.forEach(item => {
        opsIds.push(item[indexKey])
      })
      let currentDir = this.getBreadList[this.getBreadList.length - 1] || {};
      let params = opsType ? {
        userId: window.localStorage.getItem('userId'),
        targetDirId: this.currentSelectNode.dirId,
        dirIds: opsIds,
        parentId: currentDir.dirId || '0'
      } : {
        dataIndexIds: opsIds,
        targetDirId: this.currentSelectNode.dirId,
      }
    this.$http.post(url, params).then((res) => {
      if(res.data && res.data.success) {
        this.$Message.success('复制成功!')
        this.$store.dispatch('dataList/updateRefreshfTable')
      }
      this.handleModalClose();
    })
    },
    // 移动方法
    handleMove() {
      if(!this.currentSelectNode) {
        this.$Message.error('请选择目标目录')
        return;
      }
      let opsType = this.opsItems[0].dirId // true 复制目录 false 复制数据
      let indexKey = opsType ? 'dirId' : 'uuid'
      let url = opsType ? this.$CONST.DATA_LIST.MOVE : this.$CONST.DATA_LIST.MOVE_DATA
      let opsIds  = [];
      this.opsItems.forEach(item => {
        opsIds.push(item[indexKey])
      })
      let params = opsType ? {
        userId: window.localStorage.getItem('userId'),
        targetDirId: this.currentSelectNode.dirId,
        dirIds: opsIds,
      } : {
        dataIndexIds: opsIds,
        targetDirId: this.currentSelectNode.dirId,
      }
      this.$http.post(url, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('移动成功!')
          this.$store.dispatch('dataList/updateRefreshfTable')
        }
        this.handleModalClose();
      })
    }
  },
  mounted() {
    
  }
};
</script>
<style lang="less">
</style>