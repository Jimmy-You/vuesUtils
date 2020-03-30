<template>
  <div class="taskManageWapper">
    <div>
      <div class="m_header">
        <div>任务监控</div>
        <div>
          <Input
            style="width: 200px;"
            size="small"
            placeholder="搜索任务名称"
            v-model="taskNameValue"
          />
          <Button
            size="small"
            slot="append"
            icon="ios-search"
            @click="getTableList"
          ></Button>
        </div>
      </div>
      <div>
        <taskList
          ref="childOfTaskList"
          @triggerDetailShow="changeDetailShow"
          @jobId="getJobId"
          @mainPage="changeMainPage"
          @mainPageSize="changeMainPageSize"
          :mainTotal="mainTotal"
          :tableDataTL="tableDataTL"
          :showDetail="showDetail"
        />
      </div>
      <taskDetail
        v-if="showDetail"
        @triggerDetailShow="changeDetailShow"
        @subPage="changeSubPage"
        @subPageSize="changeSubPageSize"
        :subTotal="subTotal"
        :tableDataSubTL="tableDataSubTL"
      />
    </div>
  </div>
</template>
<script>
import taskList from "@/components/modules/taskManage/taskList";
import taskDetail from "@/components/modules/taskManage/taskDetail";
import SSE from "@/utils/sse.js";

export default {
  name: "taskManage",
  data() {
    return {
      mainTotal: 0,
      subTotal: 0,
      tableMainPageSize: 10,
      tableMainPage: 1,
      tableSubPageSize: 10,
      tableSubPage: 1,
      tableDataTL: null,
      tableDataSubTL: null,
      showDetail: false,
      detailId: undefined,
      sseMsgTask: null,
      taskNameValue: "",
      jobId: ""
    };
  },
  components: {
    taskList,
    taskDetail
  },
  computed: {},
  methods: {
    changeDetailShow(id) {
      if (id) {
        // 列表弹出的选中显示的id
        if (id != this.detailId) {
          this.detailId = id;
          this.showDetail = true;
        } else {
          this.showDetail = false;
          this.detailId = undefined;
        }
      } else {
        this.showDetail = false;
      }
    },
    getJobId(id) {
      this.jobId = id;
    },
    getMsgTask(e) {
      let jsonData = JSON.parse(e.data);
      console.log(jsonData);
      // alert(jsonData.taskId);
      let newTableData = this.tableDataTL;
      let newSubTableData = this.tableDataSubTL;
      newTableData.map(v => {
        if (v.jobId == jsonData.taskId) {
          if (jsonData.realPushType == "taskCompleteRate") {
            v.completeRate = jsonData.info.substring(
              0,
              jsonData.info.length - 1
            );
          }
          if (jsonData.realPushType == "mainTaskStatus") {
            v.jobStatus = jsonData.info;
          }
          if (jsonData.realPushType == "totalDataSize") {
            v.totalDataSize = jsonData.info;
          }
          if (jsonData.realPushType == "taskList") {
            let subLenght = newSubTableData.length;
            if (subLenght < this.tableSubPageSize) {
              newSubTableData.unshift(jsonData.info);
            } else {
              newSubTableData.unshift(jsonData.info);
              newSubTableData.pop();
            }
          }
        }
      });

      newSubTableData.map(v => {
        if (v.jobId == jsonData.taskId) {
          if (jsonData.realPushType == "subTaskStatus") {
            v.jobStatus = jsonData.info;
          }
          if (jsonData.realPushType == "taskProgress") {
            v.jobProgress = jsonData.info;
          }
        }
      });

      this.tableDataTL = newTableData;
      this.tableDataSubTL = newSubTableData;
      console.log("啦啦啦");
      console.log(this.tableDataSubTL);
    },

    getTableList() {
      let that = this;
      let params = {
        jobType: "",
        jobName: this.taskNameValue,
        jobStatus: "",
        owner: "",
        startTime: "",
        endTime: "",
        pageIndex: this.tableMainPage,
        pageCount: this.tableMainPageSize
      };
      this.$http.get(this.$CONST.TAST_MANAGE.MAIN_LIST, params).then(res => {
        if (res.data && res.data.success) {
          console.log(res.data.data);
          if (!res.data.data) {
            that.tableDataTL = [];
            that.mainTotal = 0;
          } else {
            that.tableDataTL = res.data.data.list;
            that.mainTotal = res.data.data.total;
            that.tableDataTL.map(v => {
              // console.log(Object.keys(v));
              if (v.completeRate != null) {
                v.completeRate = v.completeRate.substring(
                  0,
                  v.completeRate.length - 1
                );
              }
            });
            console.log("22233");
            console.log(this.tableDataTL);
          }
        }
      });
    },
    changeMainPage(page) {
      this.tableMainPage = page;
      this.getTableList();
    },
    changeMainPageSize(pageSize) {
      this.tableMainPageSize = pageSize;
      this.tableMainPage = 1;
      this.getTableList();
    },
    getSubTableList() {
      let params = {
        jobId: this.jobId || "",
        pageIndex: this.tableSubPage,
        pageCount: this.tableSubPageSize
      };
      this.$http.get(this.$CONST.TAST_MANAGE.SUB_LIST, params).then(res => {
        if (res.data && res.data.success) {
          console.log(res.data.data);
          if (!res.data.data) {
            this.tableDataSubTL = [];
            this.subTotal = 0;
          } else {
            this.tableDataSubTL = res.data.data.list;
            this.subTotal = res.data.data.total;
          }
        }
      });
    },
    changeSubPage(page) {
      this.tableSubPage = page;
      this.getSubTableList();
    },
    changeSubPageSize(pageSize) {
      this.tableSubPageSize = pageSize;
      this.tableSubPage = 1;
      this.getSubTableList();
    }
  },
  beforeCreate() {},
  created() {
    this.sseMsgTask = new SSE(
      this.$CONST.TAST_MANAGE.SSE_DATA,
      this.getMsgTask
    );
  },
  beforeMount() {},
  mounted() {
    this.getTableList();
    this.getSubTableList();
    this.sseMsgTask.create();
  },
  watch: {},
  beforeDestroy() {},
  destroyed() {
    this.sseMsgTask.sse.close();
  },
  beforeUpdate() {},
  updated() {}
};
</script>
<style lang="less">
.taskManageWapper {
  padding: 6px;
  height: 100%;
  > div {
    background: #fff;
    height: calc(~"100% - 12px");
    .m_header {
      display: flex;
      line-height: 36px;
      padding: 0 6px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #cbcbcb;
    }
    position: relative;
  }
}
</style>
