<template>
  <div class="taskDetailWrapper">
    <div class="detail_header">
      <i class="iconfont icon-guanbi1 pointer" @click="handleDetailClose" />
    </div>
    <div class="detail_content">
      <Tabs type="card">
        <TabPane label="数据列表">
          <div class="tableAndLog">
            <div class="table">
              <div>
                <Icon type="md-sync" />
                刷新
              </div>
              <mTable
                highlight-row
                @on-current-change="findCurrentRow"
                :tableCon="tableDataSubTL || []"
                :tableHeader="renderTableHeader"
                :height="204"
              />
              <mPage
                :total="subTotal"
                :pageSize="tablePageSize"
                :current="tablePage"
                @pageChange="handlePageChange"
                @pageSizeChange="handlePageSizeChange"
              />
            </div>
            <div class="log">
              <!-- <div v-for="(item, index) in tableData" :key="index">
                {{ `【${item.time}】【${item.dataName}】${item.status}` }}
              </div> -->
              <p style="marginLeft:16px;" v-html="currRow.jobProgress"></p>
            </div>
          </div>
        </TabPane>
        <TabPane label="任务日志">
          <div class="log" style="height: 100%;">
            <!-- <div v-for="(item, index) in tableData" :key="index">
              {{ `【${item.time}】【${item.dataName}】${item.status}` }}
            </div> -->
            <p v-html="currRow.jobProgress"></p>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import mTable from "@/components/modules/table.vue";
import mPage from "@/components/modules/page.vue";

export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    tableDataSubTL: Array,
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
      currRow: {}
    };
  },
  computed: {
    renderTableHeader() {
      return [
        {
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "数据名称",
          key: "jobName",
          align: "center",
          tooltip: true,
          width: 200
        },
        {
          title: "数据量",
          key: "dataSize",
          align: "center",
          tooltip: true
        },
        {
          title: "归档状态",
          key: "status",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let status = params.row.jobStatus;
            let statusName = "";
            let color = "";
            switch (status) {
              // success failure
              case "success":
                statusName = "成功";
                color = "#321fdb";
                break;
              case "failure":
                statusName = "失败";
                color = "#321fdb";
                break;
              case "running":
                statusName = "进行中";
                color = "#321fdb";
                break;
              case "completed":
                statusName = "完成";
                color = "#2eb85c";
                break;
              case "generated":
                statusName = "等待中";
                color = "#f9b115";
                break;
              default:
                statusName = "";
            }
            return h(
              "div",
              {
                style: {
                  color
                }
              },
              statusName
            );
          }
        }
      ];
    }
  },
  watch: {},
  methods: {
    handleDetailClose() {
      this.$emit("triggerDetailShow");
    },
    handlePageChange(page) {
      this.$emit("subPage", page);
    },
    handlePageSizeChange(pageSize) {
      this.$emit("subPageSize", pageSize);
    },
    // handlePageChange(page) {
    //   this.tablePage = page;
    //   this.getTableList();
    // },
    // handlePageSizeChange(pageSize) {
    //   this.tablePageSize = pageSize;
    //   this.tablePage = 1;
    //   this.getTableList();
    // },
    findCurrentRow(currentRow, oldRow) {
      this.currRow = {};
      this.currRow = JSON.parse(JSON.stringify(currentRow));
    }
  },
  mounted() {}
};
</script>
<style lang="less">
.taskDetailWrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  height: 366px;
  .detail_header {
    background: #ebedef;
    line-height: 32px;
    text-align: right;
    padding: 0 10px;
  }
  .detail_content {
    padding: 6px;
    .tableAndLog {
      display: flex;
      .table {
        width: 50%;
        margin-bottom: 0;
      }
    }
  }
  .log {
    background: #ccffff;
    padding: 6px;
    margin-left: 6px;
    flex: auto;
  }
}
</style>
