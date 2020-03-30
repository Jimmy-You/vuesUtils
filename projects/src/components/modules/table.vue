<template>
  <div class="tableContent">
    <Table
      :loading="loading"
      ref="tablesMain"
      :data="tableCon"
      :columns="tableHeader"
      :disabled-hover="false"
      v-bind="$attrs"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    ></Table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "tableContent",
  props: {
    tableCon: {
      type: Array,
      required: true
    },
    tableHeader: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentExpandIndex: undefined
    };
  },
  computed: {
    ...mapGetters("myData", ["getCurrentExpandIndex"])
  },
  mounted() {},
  methods: {
    ...mapActions("myData", ["setCurrentExpandIndex"]),
    expandRow(row, index) {
      // 展开某一行 供ref使用
      if (this.getCurrentExpandIndex != undefined) {
        if (this.getCurrentExpandIndex != index) {
          // 已有展开的行  而且不是当前点击行
          this.$refs.tablesMain.toggleExpand(this.getCurrentExpandIndex);
          this.$store.dispatch("myData/setCurrentExpandIndex", index);
          // this.currentExpandIndex = index;
          this.$refs.tablesMain.toggleExpand(index);
        } else {
          // 点击的是已经展开的行
          this.$refs.tablesMain.toggleExpand(index);
          // this.currentExpandIndex = undefined;
          this.$store.dispatch("myData/setCurrentExpandIndex", undefined);
        }
      } else {
        // 还没有展开的行
        // this.currentExpandIndex = index;
        this.$store.dispatch("myData/setCurrentExpandIndex", index);
        this.$refs.tablesMain.toggleExpand(index);
      }
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("on-current-change", currentRow, oldCurrentRow);
    },
    onSelect(selection, row) {
      this.$emit("on-select", selection, row);
    },
    onSelectCancel(selection, row) {
      this.$emit("on-select-cancel", selection, row);
    },
    onSelectAll(selection) {
      this.$emit("on-select-all", selection);
    },
    onSelectionChange(selection) {
      this.$emit("on-selection-change", selection);
    },
    onSortChange(column, key, order) {
      this.$emit("on-sort-change", column, key, order);
    },
    onFilterChange(row) {
      this.$emit("on-filter-change", row);
    },
    onRowClick(row, index) {
      this.$emit("on-row-click", row, index);
    },
    onRowDblclick(row, index) {
      this.$emit("on-row-dblclick", row, index);
    },
    onExpand(row, status) {
      this.$emit("on-expand", row, status);
    }
  }
};
</script>
<style lang="less">
.tableContent {
  .ivu-table-wrapper {
    // border: 1px solid #ddd;
    // border-right: 0;
    // border-bottom: 0;
    // .ivu-table th {
    //   background: #f5f6fa;
    //   span {
    //     font-size: @font-12;
    //     color: #999999;
    //     font-weight: normal;
    //   }
    // }
    .ivu-table-tbody {
      .ivu-table-expanded-cell {
        padding: 13px 13px;
        background: #daddde;
        // .tableContent {
        //   .ivu-table-header {
        //     tr {
        //       th {
        //         background: rgba(0,0,0,0.2);
        //       }
        //     }
        //   }
        //   .ivu-table-body {
        //     .ivu-table-row td {
        //       background: rgba(0,0,0,0.4);
        //     }
        //   }
        // }
      }
      .ivu-table-cell-with-expand {
        visibility: hidden;
      }
      // .ivu-table-row td {
      //   .ivu-table-cell {
      //     font-size: @font-12;
      //     color: @font-gray-color;
      //   }
      // }
    }
    .ivu-checkbox-checked .ivu-checkbox-inner {
      // border-color: #5bc0be;
      // background-color: #5bc0be;
    }
    .ivu-table-body {
      .ivu-table-tbody {
        .ivu-table-row {
          .icon {
            .ivu-table-cell {
              overflow: initial;
            }
          }
          .ivu-table-cell {
            .gridData {
              width: 32px;
              position: relative;
              .icon-gridData {
                width: 32px;
                height: 32px;
                &::before {
                  display: none;
                }
              }
              .dixing {
                background: url(../../assets/images/icon/dixing.png) no-repeat;
              }
              .thirdD {
                background: url(../../assets/images/icon/threeD.png) no-repeat;
              }
              .gridData {
                background: url(../../assets/images/icon/gridData.png) no-repeat;
              }
              .vectorData {
                background: url(../../assets/images/icon/vectorData.png)
                  no-repeat;
              }
              .dot {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 4px;
                right: -4px;
                bottom: -4px;
              }
            }
            .op-item {
              text-align: center;
              cursor: pointer;
              padding: 2px 7px;
              margin-right: 4px;
              color: #fff;
              display: inline-block;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}
</style>

