<template>
  <div class="mpage">
    <Page
      :total="total"
      :show-sizer="showSizer"
      show-total
      :current="managePageInner ? chiPaging : current"
      :page-size="managePageInner ? chiPagSize : pageSize"
      :page-size-opts="showSize"
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
    >
      <span v-if="showSizer">共{{ total }}条，每页显示：</span>
      <span v-else>共{{ total }}条&nbsp;&nbsp;&nbsp;</span>
    </Page>
  </div>
</template>
<script>
export default {
  name: 'page',
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    current: {
      type: Number,
      default: 1
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    managePageInner: {
      // 是否内部管理page
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSize: [5, 10, 15, 20],
      chiPaging: 1,
      chiPagSize: 10
    }
  },
  methods: {
    pageChange(current) {
      this.chiPaging = current
      this.$emit('pageChange', current)
      this.$emit('pageChangeNew', {
        paging: current,
        pageSize: this.chiPagSize
      })
    },
    pageSizeChange(pageSize) {
      this.chiPagSize = pageSize
      this.chiPaging = 1
      this.$emit('pageSizeChange', pageSize)
      this.$emit('pageSizeChangeNew', {
        paging: 1,
        pageSize: this.chiPagSize
      })
    }
  }
}
</script>
<style lang="less">
.mpage {
  height: 55px;
  line-height: 55px;
  .ivu-page {
    float: right;
    .ivu-page-item-active {
      border: 1px solid #5bc0be;
      background: #5bc0be;
      a {
        color: #fff;
      }
    }
    .ivu-page-item {
      border-radius: 0;
    }
    .ivu-page-item:hover {
      border: 1px solid #5bc0be;
      background: #5bc0be;
      a {
        color: #fff;
      }
    }
    .ivu-page-total {
      float: left;
      margin-right: 0;
      line-height: 55px;
      span {
        font-size: @font-12;
        color: #888888;
      }
    }
    .ivu-page-options {
      float: left;
      margin-left: 4px;
    }
  }
}
</style>
