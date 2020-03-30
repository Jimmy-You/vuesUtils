<template>
  <div class="dpMapTableWrapper">
    <div class="list_body" style="height: calc(100vh - 124px);">
      <mTable
        :tableCon="collpseTableData || []"
        :tableHeader="renderTableHeader()"
      />
      <mPage
        :total="subTotal"
        :pageSize="tablePageSize"
        :current="tablePage"
        @pageChange="handlePageChange"
        @pageSizeChange="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script>
import mTable from "@/components/modules/table.vue";
import mPage from "@/components/modules/page.vue";
import tableHeaderRender from "./tableHeaderRender";

export default {
  props: {
    collpseTableData: Array,
    subTotal: Number
  },
  components: {
    mTable,
    mPage
  },
  data() {
    return {
      tablePageSize: 10,
      tablePage: 1,
      getCurrentTableData: [
        {
          dataType: "专题产品TIF数据",
          size: "102M",
          createTime: "2020-01-12 12:00:00",
          updateTime: "2020-01-12 12:00:00",
          dictName: "坡度数据1",
          isSpaceData: "0",
          isPublish: "1"
        },
        {
          dataType: "专题产品TIF数据",
          size: "102M",
          createTime: "2020-01-12 12:00:00",
          updateTime: "2020-01-12 12:00:00",
          dictName: "坡度数据2",
          isSpaceData: "0",
          isPublish: "1"
        },
        {
          dataType: "专题产品TIF数据",
          size: "102M",
          createTime: "2020-01-12 12:00:00",
          updateTime: "2020-01-12 12:00:00",
          dictName: "坡度数据3",
          isSpaceData: "0",
          isPublish: "1"
        }
      ]
    };
  },

  methods: {
    renderTableHeader() {
      return tableHeaderRender.call(this);
    },
    logTheData() {
      console.log("这是传递到子的data");
    },
    handlePageChange(page) {
      this.$emit("subPage", page);
    },
    handlePageSizeChange(pageSize) {
      this.$emit("subPageSize", pageSize);
    }
  },

  created() {},
  mounted() {}
};
</script>

<style lang="less">
.dpMapTableWrapper {
  .list_body {
    padding: 0 6px;
    background: #fff;
    // height: calc(100vh - 56px - 48px - 48px - 12px);
    // height: calc(100vh - 164px);
    .ivu-table {
      .ivu-table-body {
        .ivu-table-tbody {
          .ivu-table-row {
            .data_name {
              display: flex;
              justify-content: space-between;
              .ops_items {
                display: none;
                .iconfont {
                  margin: 0 3px;
                  cursor: pointer;
                }
              }
              .data_name_title {
                &:hover {
                  color: @theme-primary;
                }
              }
            }
            .isDataSet {
              background: url(../../../assets/images/icon/sysPass.png) no-repeat;
            }
            .noDataSet {
              background: url(../../../assets/images/icon/sysReject.png)
                no-repeat;
            }
          }
          .ivu-table-row-hover {
            .ops_items {
              display: block !important;
            }
          }
        }
      }
    }
  }
}
</style>
