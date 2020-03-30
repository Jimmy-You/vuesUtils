<template>
  <div class="offlineArchiveBodyWrapper">
    <div class="list_header">
      <div>离线归档</div>
      <div class="ops_suffix">
        <Input search placeholder="搜索我的数据" />
        <div>
          <Dropdown>
            <a href="javascript:void(0)">
              <i class="iconfont icon-order_down primary pointer" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>文件名</DropdownItem>
              <DropdownItem>大小</DropdownItem>
              <DropdownItem>修改日期</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="list_body" style="height: calc(100vh - 164px);">
      <mTable
        :tableCon="getCurrentTableData || []"
        :tableHeader="renderTableHeader()"
      />
      <mPage />
    </div>
  </div>
</template>
<script>
import mTable from "@/components/modules/table.vue";
import mPage from "@/components/modules/page.vue";
import { mapGetters } from "vuex";
import tableHeaderRender from "./tableHeaderRender";

export default {
  name: "dataListBody",
  components: {
    mTable,
    mPage
  },
  props: {},
  computed: {
    ...mapGetters([]),
    getTableHeight() {
      let parentHeight = document.getElementsByClassName("list_body")[0]
        ? document.getElementsByClassName("list_body")[0].clientHeight
        : 800;
      return parentHeight - 80;
    }
  },
  data() {
    return {
      modalManage: {},
      getCurrentTableData: [
        {
          data_name: "专题产品TIF数据",
          dataSize: "102M",
          createTime: "2020-01-12 12:00:00",
          updateTime: "2020-01-12 12:00:00",
          medium: "坡度数据1",
          isSpaceData: "0",
          dataNum: "1"
        },
        {
          data_name: "专题产品TIF数据",
          dataSize: "102M",
          createTime: "2020-01-12 12:00:00",
          updateTime: "2020-01-12 12:00:00",
          medium: "坡度数据2",
          isSpaceData: "0",
          dataNum: "1"
        },
        {
          data_name: "专题产品TIF数据",
          dataSize: "102M",
          createTime: "2020-01-12 12:00:00",
          updateTime: "2020-01-12 12:00:00",
          medium: "坡度数据3",
          isSpaceData: "0",
          dataNum: "1"
        }
      ]
    };
  },
  methods: {
    handleModal(name) {
      this.modalManage = {
        ...this.modalManage,
        [name]: !this.modalManage[name]
      };
    },
    // 生成表格头部
    renderTableHeader() {
      return tableHeaderRender.call(this);
    }
  },
  mounted() {},
  watch: {}
};
</script>
<style lang="less">
.offlineArchiveBodyWrapper {
  margin: 6px;
  .list_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px;
    background: #fff;
    .list_bread {
      display: flex;
      justify-content: left;
      align-items: center;
      .split_line {
        width: 2px;
        height: 18px;
        background: #ebebeb;
        margin: 0 6px;
      }
    }
    .ops_suffix {
      display: flex;
      align-items: center;
      margin-right: 18px;
      .iconfont {
        font-size: 24px;
        margin-left: 12px;
      }
    }
  }
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
              align-items: center;
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
