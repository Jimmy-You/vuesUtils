<template>
  <div class="taskListWrapper">
    <mTable
      :tableCon="tableDataTL || []"
      :tableHeader="renderTableHeader"
      :max-height="showDetail ? getTableHeight : ''"
    />
    <mPage
      :total="mainTotal"
      :pageSize="tablePageSize"
      :current="tablePage"
      @pageChange="handlePageChange"
      @pageSizeChange="handlePageSizeChange"
    />
  </div>
</template>
<script>
import mTable from "@/components/modules/table.vue";
import mPage from "@/components/modules/page.vue";
import taskSucess from "@/assets/images/icon/sysPass.png";
import taskProcess from "@/assets/images/icon/sysProcess.png";
import taskReject from "@/assets/images/icon/sysReject.png";
import taskWait from "@/assets/images/icon/sysWaitcheck.png";

export default {
  props: {
    showDetail: {
      type: Boolean,
      default: false
    },
    taskNameValue: String,
    tableDataTL: Array,
    mainTotal: Number
  },
  components: {
    mTable,
    mPage
  },
  data() {
    return {
      // tableData: [],
      tablePageSize: 10,
      tablePage: 1
    };
  },
  computed: {
    renderTableHeader() {
      return [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "jobName",
          align: "left",
          tooltip: true,
          width: 200
        },
        {
          title: "归档目录",
          key: "filePath",
          align: "center",
          tooltip: true,
          width: 200
        },
        {
          title: "数据量",
          key: "totalDataSize",
          align: "center",
          tooltip: true,
          width: 200
        },
        {
          title: "执行进度",
          key: "completeRate",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h("Progress", {
              props: {
                percent: Number(params.row.completeRate) || 0,
                "stroke-width": 20,
                "text-inside": true
              }
            });
          }
        },
        // {
        //   title: "任务类型",
        //   key: "jobType",
        //   align: "center",
        //   tooltip: true
        // },
        {
          title: "开始时间",
          key: "startTime",
          align: "center",
          tooltip: true
        },
        {
          title: "任务状态",
          key: "jobStatus",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let status = params.row.jobStatus || "";
            let src = "";
            switch (status) {
              // case "-1":
              //   src = taskReject;
              //   break;
              case "running":
                src = taskProcess;
                break;
              case "completed":
                src = taskSucess;
                break;
              case "generated":
                src = taskWait;
                break;
              default:
                src = "";
            }
            return h("img", {
              attrs: {
                src
              }
            });
          }
        },
        {
          title: "操作",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h(
              "u",
              {
                on: {
                  click: () => {
                    this.handleDetail(params.row.jobId);
                  }
                }
              },
              "查看详情"
            );
          }
        }
      ];
    },
    getTableHeight() {
      let parentHeight = document.getElementsByClassName("taskManageWapper")[0]
        ? document.getElementsByClassName("taskManageWapper")[0].clientHeight
        : 800;
      return parentHeight - 366 - 37 - 88;
    }
  },
  methods: {
    handleDetail(id) {
      this.$emit("triggerDetailShow", id);
      this.$emit("jobId", id);
      this.$parent.getSubTableList();
    },
    handlePageChange(page) {
      this.$emit("mainPage", page);
      // this.tablePage = page;
    },
    handlePageSizeChange(pageSize) {
      this.$emit("mainPageSize", pageSize);
      // this.tablePageSize = pageSize;
      // this.tablePage = 1;
    }
    // getTableList() {
    //   this.tableData = this.tableDataTL;
    // }
    // getTableList() {
    //   let that = this
    //   let params = {
    //     jobType: "",
    //     jobName: this.taskNameValue,
    //     jobStatus: "",
    //     owner: "",
    //     startTime: "",
    //     endTime: "",
    //     pageIndex: this.tablePage,
    //     pageCount: this.tablePageSize
    //   };
    //   this.$http.get(this.$CONST.TAST_MANAGE.MAIN_LIST, params).then(res => {
    //     if (res.data && res.data.success) {
    //       console.log(res.data.data);
    //       if (!res.data.data) {
    //         that.tableData = [];
    //         that.total = 0;
    //       } else {
    //         that.tableData = res.data.data.list;
    //         that.total = res.data.data.total;
    //         that.$emit("tableData", );
    //       }
    //     }
    //   });
    // }
  },
  mounted() {
    // 获取数据
  }
};
</script>
<style lang="less">
.taskListWrapper {
  padding: 10px;
}
</style>
