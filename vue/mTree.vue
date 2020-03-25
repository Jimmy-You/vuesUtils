<template>
  <div class="mTree">
    <div class="tree_node">
      <img v-if="!isOpen && isFolder" src="../../assets/images/icon/add.png" class="triggle_open" @click="changeOpen" />
      <img v-if="isOpen && isFolder" src="../../assets/images/icon/plus.png" class="triggle_open" @click="changeOpen" />
      <img v-if="!isOpen && isFolder" src="../../assets/images/icon/folder-close.png" />
      <img v-if="isOpen && isFolder" src="../../assets/images/icon/folder-open.png" />
      <img v-if="!isFolder" src="../../assets/images/icon/gridData.png" class="item" />
      <div class="node_name" @click="handleNodeClick" :id="nodeId">
        <span>
          {{node.dictName || '--'}}
        </span>
      </div>
    </div>
    <div v-if="isOpen && isFolder && childrenNodes.length">
      <template
        v-for="(item, index) in childrenNodes"
      >
        <mTree
          v-if="item.isDataset <= 0"
          style="padding-left:12px;"
          :node="item"
          :key="index"
        />
      </template>
    </div>
    <template v-if="isOpen && isFolder && childrenNodes.length == 0">
      <div style="text-align: center;color: #ccc;">目录为空</div>
    </template>
  </div>
</template>
<script>

export default {
  name: 'mTree',
  props: {
    node: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['handleNodeSelect'],
  computed: {
    isFolder() {
      return this.node.dirId;
    }
  },
  data() {
    return {
      isOpen: false,
      nodeId: this.node.dirId,
      childrenNodes: [], // 将子目录保存在data里 进行树形展开时的更新
    }
  },
  methods: {
    changeOpen() {
      this.isOpen = !this.isOpen;
      if(this.isOpen && !this.childrenNodes.length) {
        // 查找远程数据
        let params = {
          dirId: this.nodeId || '0',
          isDataSet: this.node.isDataset > 0 ? '1' : '0',
          userId: window.localStorage.getItem('userId'),
          pageNum: 1,
          pageSize: 9999,
        }
        this.$http.get(this.$CONST.DATA_LIST.DIRLIST, params).then((res) => {
          if(res.data && res.data.success) {
            const { list = [], total = 0 } = res.data.data || {};
            this.childrenNodes = list;
          }
        }).catch(err => {
        })
      }
    },
    handleNodeClick() {
      const currentActive = $('.activeTreeNode') || [];
      for(let i=0;i<currentActive.length;i++) {
        currentActive[i].classList.remove('activeTreeNode')
      }
      $(`#${this.nodeId}`).addClass('activeTreeNode')
      this.handleNodeSelect(this.nodeId)
    }
  }
}
</script>
<style lang="less" scoped>
.mTree {
  .tree_node {
    display: flex;
    justify-content: left;
    align-items: center;
    padding-left: 12px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 2px;
    }
    .triggle_open {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .item {
      width: 16px;
      height: 16px;
    }
    .node_name {
      cursor: pointer;
    }
  }
  .activeTreeNode {
    background: rgba(98,163,255, 0.2);
  }
}

</style>