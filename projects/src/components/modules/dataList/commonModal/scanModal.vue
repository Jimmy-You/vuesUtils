<template>
  <models
    :modal="showModal"
    modalWidth="800"
    modalTitle="扫描数据路径"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalConfirm"
    :footerHide="false"
    :customerStyle="{height: '600px'}"
  >
    <Form :model="scanForm" :label-width="105">
      <FormItem label="数据来源">
        <RadioGroup v-model="scanForm.dataSource" @on-change="dataSourceChange">
          <Radio :disabled="tableLoading" label="plat">平台内部</Radio>
          <Radio :disabled="tableLoading" label="ftp">ftp</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="ftp链接" v-show="scanForm.dataSource == 'ftp'">
        <div class="ftp_line">
          <div style="margin-right: 16px;">
            <span class="label" >IP</span>
            <Input :disabled="ftpLoginSuccess" style="width: 150px;"  v-model="ftpConnect.ip" />
          </div>
          <div>
            <span class="label">端口</span>
            <Input :disabled="ftpLoginSuccess" style="width: 150px;"  v-model="ftpConnect.port"  />
          </div>
        </div>
        <div class="ftp_line">
          <div style="margin-right: 16px;">
            <span class="label">账户名</span>
            <Input :disabled="ftpLoginSuccess" style="width: 150px;"  v-model="ftpConnect.user"  />
          </div>
          <div>
            <span class="label">密码</span>
            <Input :disabled="ftpLoginSuccess" style="width: 150px;"  v-model="ftpConnect.pwd"  />
          </div>
          <Button v-if="!ftpLoginSuccess" :loading="ftpLoging" @click="handleFtpLogin" type="primary" style="margin-left: 6px;">连接</Button>
          <Button v-else @click="handleFtpLogOut" type="primary" style="margin-left: 6px;">断开链接</Button>
        </div>
      </FormItem>
      <FormItem label="数据路径">
        <div style="display: flex;">
          <Select 
          v-show="scanForm.dataSource == 'plat'"
          v-model="scanForm.platRoot"
          @on-select="handlePlatRootSelct"
          style="width: 150px;margin-right: 6px;">
            <Option
              v-for="(item, index) in platRootList"
              :key="index"
              :value="item"
            >{{item}}</Option>
          </Select>
          <Breadcrumb>
            <BreadcrumbItem  v-show="scanForm.dataSource == 'ftp'"><u @click="handleRootClick">根目录</u></BreadcrumbItem>
            <BreadcrumbItem
            v-for="(item, index) in breadList"
            :key="index"
            ><u @click="handleBreadClick(item, breadList.length - index)">{{item.fileName}}</u></BreadcrumbItem>
          </Breadcrumb>
        </div>
      </FormItem>
      <mTable
        :tableCon="tableData"
        :tableHeader="tableHeader"
        :no-data-text="scanForm.dataSource == 'ftp' && !ftpLoginSuccess ? '请先登陆ftp账户' : '暂无数据'"
        style="width: 90%;margin: 20px auto;"
        :max-height="250"
        :loading="tableLoading"
        border
      />
      <FormItem label="数据类型">
        <Select v-model="scanForm.dataType" @on-change="handleDataTypeChange">
          <Option
            v-for="(item, index) in getDataTypeList"
            :key="index"
            :value="item.uuid"
          >{{item.modelDescription}}</Option>
        </Select>
      </FormItem>
      <div v-show="scanForm.dataSource == 'plat'" class="flex" style="padding: 0 35px;justify-content: space-between;margin: 24px 0;align-items: center;">
        <div>
          <span style="margin-right: 6px;">迁移数据</span>
          <i-switch v-model="scanForm.moveData"></i-switch>
        </div>
        <div>
          <span style="margin-right: 6px;">删除数据</span>
          <i-switch @on-change="handleDeleteSwitchChange" v-model="scanForm.deleteData" style="margin-right: 6px;"></i-switch>
          <span style="color: red">将会删除原始存储的数据,谨慎选择!</span>
        </div>
      </div>
      <FormItem label="归档任务名称">
        <Input v-model="scanForm.taskName" />
      </FormItem>
      <FormItem label="自动发布">
        <i-switch v-model="scanForm.autoPublish" />
      </FormItem>
    </Form>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
import mTable from '../../table'
import { mapGetters } from 'vuex';

export default {
  name: "scanModal",
  mixins: [modalMixins],
  components: {
    mTable
  },
  props: {
    
  },
  data() {
    return {
      scanForm: {
        dataSource: 'plat',
        path: '',
        dataType: '',
        moveData: false,
        deleteData: false,
        taskName: '',
        autoPublish: false,
        platRoot: '',
      },
      tableData: [],
      tableLoading: false,
      breadList: [],
      platRootList: [], // 平台根目录选项
      ftpLoginSuccess: false, // ftp账号是否已经登陆
      ftpLoging: false, // 是否正在登陆ftp
      ftpConnect: {
        ip: '',
        port: '',
        user: '',
        pwd: ''
      }
    };
  },
  computed: {
    ...mapGetters('dataList',['getDataTypeList', 'getBreadList']),
    tableHeader() {
      return [
        {
          title: '名称',
          key: 'fileName',
          width: 250,
          align: 'center',
          tooltip: true,
          render: (h, params) => {
            let tagName = params.row.isDirectory > 0 ? 'u' :'div'
            return h(tagName,
              {
                style: {
                  cursor: params.row.isDirectory > 0 ? 'pointer' :'initial'
                },
                on: {
                  click: () => {
                    // 目录层级的递进
                    if(params.row.isDirectory > 0) this.handleListGoDown(params.row)
                  }
                }
              },
              params.row.fileName
            )
          }
        },
        {
          title: '是否目录',
          key: 'isDirectory',
          width: 120,
          align: 'center',
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              {},
              params.row.isDirectory > 0 ? '是' : '否'
            )
          }
        },
        {
          title: '最后修改',
          key: 'updateTime',
          width: 200,
          align: 'center',
          tooltip: true,
        },
        {
          title: '大小',
          key: 'fileSize',
          align: 'center',
          tooltip: true,
        },
      ]
    }
  },
  methods: {
    // 数据源改变
    dataSourceChange(value) {
      this.breadList = [];
      this.tableData = [];
      if(value == 'plat' || (value == 'ftp' && this.ftpLoginSuccess)) {
        this.getTableList();
      }
      // this.ftpConnect = {
      //   ip: '',
      //   port: '',
      //   user: '',
      //   pwd: ''
      // }
    },
    handleModalConfirm() {
      let currentDir = this.breadList[this.breadList.length - 1] || {};
      let flag = process.env.NODE_ENV === 'production'
      let params = {
        ftpHost: this.ftpConnect.ip,
        ftpUsername: this.ftpConnect.user,
        ftpPassword: this.ftpConnect.pwd,
        ftpPort: this.ftpConnect.port,
        dataSource:this.scanForm.dataSource == 'plat' ? 'LOCAL' : 'FTP',
        filePath: currentDir.fileAbsolutePath ? currentDir.fileAbsolutePath : !flag && this.scanForm.dataSource == 'plat' ?  'D:\\\\' : '/',
        deleteAfterArchive: this.scanForm.deleteData,
        moveFile: this.scanForm.dataSource == 'ftp' ? true : this.scanForm.moveData, // ftp默认迁移
        dataType: '',
        taskName: this.scanForm.taskName,
        dirId: this.getBreadList[this.getBreadList.length - 1] ? this.getBreadList[this.getBreadList.length - 1].dirId : '0',
        modelId: this.scanForm.dataType,
        autoPublish: this.scanForm.autoPublish,
      }
      this.$http.post(this.$CONST.DATA_LIST.DATA_ARCHIVE_ADD, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('任务提交成功!')
        }
        this.handleModalClose();
      }).catch(err => {
      })
    },
    handleDeleteSwitchChange(status) {
      if(status) {
        this.scanForm = {...this.scanForm, moveData: true }
      }
    },
    handleDataTypeChange(dataType) {
      if(!this.scanForm.taskName) {
        this.$set(this.scanForm, 'taskName', dataType + '1');
      }
    },
    getTableList() {
      // 获取目录列表
      let currentDir = this.breadList[this.breadList.length - 1] || {};
      let params = {
        ftpHost: this.ftpConnect.ip,
        ftpUsername: this.ftpConnect.user,
        ftpPassword: this.ftpConnect.pwd,
        ftpPort: this.ftpConnect.port,
        dataSource:this.scanForm.dataSource == 'plat' ? 'LOCAL' : 'FTP',
        filePath: currentDir.fileAbsolutePath ? currentDir.fileAbsolutePath : this.scanForm.dataSource == 'plat' ?  this.scanForm.platRoot : '/data/ftp',
        deleteAfterArchive:'',
        moveFile:'',
        dataType: '',
        taskName: '',
        dirId: '',
        modelId: ''
      }
      this.tableLoading = true;
      this.tableData = [];
      this.$http.post(this.$CONST.DATA_LIST.FILE_LIST, params).then((res) => {
        if(res.data && res.data.success) {
          this.tableData = res.data.data || []
        } else {
          this.tableData = [];
        }
        this.tableLoading = false;
      }).catch(err => {
        this.tableData = [];
        this.tableLoading = false;
      })
    },
    // 目录递进
    handleListGoDown(item) {
      this.breadList = [...this.breadList, item]
      this.getTableList();
    },
    // 目录层级的跳跃选择
    handleBreadClick(item, times) {
      if(item.fileAbsolutePath == this.breadList[this.breadList.length - 1].fileAbsolutePath) return; // 当前目录 不动
      for(let i=0;i<times - 1;i++) {
        this.breadList.pop();
      }
      this.getTableList();
    },
    // 点击根目录
    handleRootClick() {
      this.breadList=[];
      this.getTableList();
    },
    // ftp登陆
    handleFtpLogin() {
      if(!this.ftpConnect.ip ||
        !this.ftpConnect.port ||
        !this.ftpConnect.user ||
        !this.ftpConnect.pwd
      ) {
        this.$Message.error('请补全ftp账号信息!')
        return;
      }
      this.ftpLoging = true;
      this.$http.post(this.$CONST.DATA_LIST.FTP_CONNECT, {
        ftpHost: this.ftpConnect.ip,
        ftpUsername: this.ftpConnect.user,
        ftpPassword: this.ftpConnect.pwd,
        ftpPort: this.ftpConnect.port,
        dataSource:'',
        filePath: '',
        deleteAfterArchive:'',
        moveFile:'',
        dataType: '',
        taskName: '',
        dirId: '',
        modelId: ''
      }).then((res) => {
          if(res.data && res.data.success) {
            this.$Message.success('ftp链接成功!')
            this.ftpLoginSuccess = true;
            this.getTableList();
          }
          this.ftpLoging = false;
      }).catch(err => {
        this.ftpLoging = false;
      })
    },
    // ftp退出登录
    handleFtpLogOut() {
      this.ftpLoginSuccess = false;
      this.breadList = [];
      this.tableData = [];
    },
    // 平台根目录列表查询
    getPlatRootList() {
      this.$http.get(this.$CONST.DATA_LIST.GET_PLAT_ROOT_DIR).then((res) => {
        if(res.data && res.data.success) {
          this.platRootList = res.data.data || []
          this.$set(this.scanForm, 'platRoot', this.platRootList[0])
          this.getTableList();
        }
      }).catch(err => {
        
      })
    },
    // 平台根目录选择点击
    handlePlatRootSelct(val) {
      if(val != this.scanForm.platRoot) {
        this.breadList = [];
      }
      this.getTableList();
    }
  },
  mounted() {
    this.getPlatRootList();
    this.scanForm = { ...this.scanForm, dataType: this.getDataTypeList[0] ? this.getDataTypeList[0].uuid : '' };
  }
};
</script>
<style lang="less" scoped>
.ftp_line {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .label {
      margin-right: 4px;
      width: 50px;
      display: inline-block;
    }
}
</style>