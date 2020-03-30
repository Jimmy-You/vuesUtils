<template>
  <div class="offlineArchiveHeaderWrapper">
    <Button type="warning" custom-icon="iconfont icon-newFolder">
      添加存储
    </Button>
    <div class="split-line"></div>
    <div class="operate-buttons">
      <span><i class="iconfont icon-delete primary" />删除</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "dataListHeader",
  components: {},
  props: {},
  watch: {},
  computed: {
    ...mapGetters("dataList", ["getCurrentSelect", "getBreadList"])
  },
  data() {
    return {
      modalManage: {}
    };
  },
  methods: {
    handleModal(name) {
      this.modalManage = {
        ...this.modalManage,
        [name]: !this.modalManage[name]
      };
    }
  }
};
</script>
<style lang="less">
.offlineArchiveHeaderWrapper {
  height: 48px;
  background: #fff;
  align-items: center;
  padding: 0 20px;
  display: flex;
  .split-line {
    width: 1px;
    height: 26px;
    background: @gray-3;
    margin: 0 6px;
  }
  .operate-buttons {
    > span {
      margin: 0 4px;
      cursor: pointer;
    }
  }
}
</style>
