<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="600"
    modalTitle="选择数据类型"
    modalClass="convent-modal"
    :modalLoading="true"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalConfirm"
  >
    <Form :model="uploadForm" :label-width="115" :rules="formRules">
      <FormItem label="数据类型">
        <Select v-if="!getDataType" v-model="uploadForm.dataType" @on-change="handleDataTypeChange">
          <Option
            v-for="(item, index) in getDataTypeList"
            :key="index"
            :value="item.uuid"
          >{{item.modelDescription}}</Option>
        </Select>
        <div v-else>
          {{ getDataTypeList.find((i) => i.datasetType == getDataType ).modelDescription }}
        </div>
      </FormItem>
      <FormItem label="归档任务名称" prop="taskName">
        <Input v-model="uploadForm.taskName" />
      </FormItem>
      <FormItem label="自动发布">
        <i-switch v-model="uploadForm.autoPublish" />
      </FormItem>
    </Form>
    <Upload
      v-if="type != 'folder'"
      :before-upload="handleUpload"
      action="//jsonplaceholder.typicode.com/posts/">
      <Button style="margin-left: 105px;" icon="ios-cloud-upload-outline">选择文件</Button>
    </Upload>
    <Button v-else style="margin-left: 105px;" icon="ios-cloud-upload-outline" @click="handleChooseFolder">选择文件夹</Button>
    <input webkitdirectory  style="display: none;" id="chooseFolder" type="file" @change="handleUpload" />
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
import { mapGetters } from 'vuex'
import dateFormatter from '@/utils/dateFormatter.js'

export default {
  name: "uploadModal",
  mixins: [modalMixins],
  props: {
    type: {
      type: String,
      default: 'folder'
    }
  },
  computed: {
    ...mapGetters('dataList', ['getBreadList', 'getDataTypeList', 'getNormalBreadList']),
    getDataType() {
      let current = this.getNormalBreadList[this.getNormalBreadList.length - 1] || {};
      return current.dataSetType || ''
    }
  },
  data() {
    return {
      uploadForm: {
        dataType: '',
        taskName: '',
        autoPublish: false
      },
      file: undefined,
      formRules: {
        taskName: [
          { required: true, message: '名称不能为空' }
        ]
      }
    };
  },
  watch: {
    
  },
  methods: {
    handleModalConfirm() {
      // 校验必填
      if(!this.file) {
        this.$Message.error('请选择要上传的文件!')
        return;
      }
      // 表单校验
      if(!this.uploadForm.taskName) {
        this.$Message.error('归档任务名称必填!')
        return;
      }
      // 首先生成任务id  任务id生成之后进行上传操做
      this.handleTaskRender();
    },
    handleTaskRender() {
       // 生成上传任务
      let currentDir = this.getBreadList[this.getBreadList.length - 1] || this.getNormalBreadList[this.getNormalBreadList.length - 1] || {};
      let params = {
        "dataSource": "ONLINE",
        "filePath": "",
        "ftpHost": "",
        "ftpUsername": "",
        "ftpPassword": "",
        "ftpPort":21,
        "deleteAfterArchive": true,
        "moveFile": true,
        "dataType": "",
        "taskName": this.uploadForm.taskName,
        "dirId": currentDir.dirId || '0',
        "modelId":this.uploadForm.dataType,
        "autoPublish": this.uploadForm.autoPublish,
      }
      this.$http.post(this.$CONST.DATA_LIST.DATA_ARCHIVE_ADD, params).then((res) => {
        if(res.data && res.data.success) {
          const targetId = res.data.data || ''
          if(targetId) {
            if(this.file.length) { // 多文件上传或者文件夹上传
              if(this.$uploadUtil.addFolderUploadManage(targetId, this.file.length)) {
                for(let i=0;i<this.file.length;i++) {
                  this.$uploadUtil.addTask({
                    name: this.uploadForm.taskName,
                    file: this.file[i],
                    targetId,
                    filePath: this.file[i].webkitRelativePath,
                  })
                }
              }
            } else {
              if(this.$uploadUtil.addFolderUploadManage(targetId, 1)) {
                this.$uploadUtil.addTask({
                  name: this.uploadForm.taskName,
                  file: this.file,
                  targetId
                })
              }
            }
          } else {
            this.$Message.error('创建任务失败!')
          }
        } else {
          this.$Message.error('创建任务失败!')
        }
        this.handleModalClose();
      })
    },
    // 数据类型改变的
    handleDataTypeChange(type) {
      let dataTypeName = '';
      for(let i=0;i<this.getDataTypeList.length;i++) {
        if(type == this.getDataTypeList[i].uuid) {
          dataTypeName = this.getDataTypeList[i].modelDescription + '_上传入库_' + dateFormatter("yyyy-MM-dd HH:mm", new Date());
          break;
        }
      }
      this.uploadForm = {...this.uploadForm, taskName: dataTypeName }
    },
    // 上传任务
    handleUpload(file) {
      if(this.type != 'folder') {
        this.file = file;
			  return false;
      } else {
        this.file = file.target.files;
      }
    },
    handleChooseFolder() {
      $('#chooseFolder').click();
    }
  },
  mounted() {
    let dataType = '', taskName = '';
    if(this.getNormalBreadList[this.getNormalBreadList.length - 1] && this.getNormalBreadList[this.getNormalBreadList.length - 1].dataSetType) {
      // 类型已经知道
      let targetObj = this.$store.state.dataList.dataTypeList.find((i) => i.datasetType == this.getNormalBreadList[this.getNormalBreadList.length - 1].dataSetType) || {};
      dataType = targetObj.uuid;
      taskName = targetObj.modelDescription  + '_上传入库_' + dateFormatter("yyyy-MM-dd HH:mm", new Date());
    } else {
      // 选择类型的默认值
      dataType = this.$store.state.dataList.dataTypeList[0] ? this.$store.state.dataList.dataTypeList[0].uuid : '';
      taskName = this.$store.state.dataList.dataTypeList[0] ? this.$store.state.dataList.dataTypeList[0].modelDescription  + '_上传入库_' + dateFormatter("yyyy-MM-dd HH:mm", new Date()) : '';
    }
    this.$set(this.uploadForm, 'dataType', dataType);
    this.$set(this.uploadForm, 'taskName', taskName);
  }
};
</script>
<style lang="less" scoped>
.m_footer {
  text-align: right;
  padding: 0 16px;
}
</style>