<template>
  <div class="dataListHeaderWrapper">
    <Button @click="handleUploadData('file')" type="primary" custom-icon="iconfont icon-upload" style="margin-right: 6px">
      上传数据
    </Button>
    <!-- <Dropdown v-show="!(!this.getBreadList.length || (this.getBreadList.length && this.getBreadList[this.getBreadList.length - 1].isDataset <= 0))" trigger="click">
      <Button type="primary" custom-icon="iconfont icon-upload" style="margin-right: 6px">
        上传数据
      </Button>
      <DropdownMenu slot="list">
          <DropdownItem><div @click="handleUploadData('file')">上传文件</div></DropdownItem>
          <DropdownItem><div @click="handleUploadData('folder')">上传文件夹</div></DropdownItem>
      </DropdownMenu>
    </Dropdown> -->
    <Poptip trigger="hover" v-show="!this.getBreadList.length || (this.getBreadList.length && this.getBreadList[this.getBreadList.length - 1].isDataset <= 0)" title="" placement="top-start">
        <Button type="info" custom-icon="iconfont icon-saomiao" style="margin-right: 6px">扫描数据</Button>
        <div slot="content">
          <i class="iconfont icon-xiangqing danger" />
          当前目录不是数据集,请先进入数据集目录
        </div> 
    </Poptip>
    <Button v-show="!(!this.getBreadList.length || (this.getBreadList.length && this.getBreadList[this.getBreadList.length - 1].isDataset <= 0))" @click="handleScanData()" type="info" custom-icon="iconfont icon-saomiao" style="margin-right: 6px">
      扫描数据
    </Button>
    <Button  style="margin-right: 6px" v-show="!(this.getBreadList.length && this.getBreadList[this.getBreadList.length - 1].isDataset > 0)" type="warning" custom-icon="iconfont icon-newFolder" @click="handleCreateFolder">
      新建目录
    </Button>
    <Button type="success" v-show="!(this.getBreadList.length && this.getBreadList[this.getBreadList.length - 1].isDataset > 0)" custom-icon="iconfont icon-shujuji" @click="handleModal('createDataSet')">
      新建数据集
    </Button>
    <div class="split-line" v-show="getCurrentSelect.length"></div>
    <!-- 当有列表选中项时  显示操做按钮 -->
    <div class="operate-buttons"  v-if="getCurrentSelect.length">
      <span @click="handleModal('downloadModal')" v-if="getCurrentSelect[0].uuid"><i class="iconfont icon-download primary" />下载</span>
      <span @click="handleModal('publishModal')" v-if="getCurrentSelect[0].uuid"><i class="iconfont icon-publish primary" />发布</span>
      <span @click="handleModal('moveToModal')"><i class="iconfont icon-qianwang-xiayibu primary" />移动到</span>
      <span @click="handleModal('copyToModal')"><i class="iconfont icon-copy primary" />复制到</span>
      <span @click="handleModal('deleteModal')"><i class="iconfont icon-delete primary" />删除</span>
    </div>
    <!-- 新建数据集弹出框 -->
    <createDataSetModal
      v-if="modalManage.createDataSet"
      :showModal="modalManage.createDataSet"
      modalName="createDataSet"
      @handleModalClose="handleModal"
      @handleCreateSuccess="handleCreateSuccess"
      :parentDetail="getBreadList[getBreadList.length - 1] || {}"
    />
    <!-- 新建目录弹出框 -->
    <createFolderModal
      v-if="modalManage.createFolder"
      :showModal="modalManage.createFolder"
      modalName="createFolder"
      @handleModalClose="handleModal"
      @handleCreateSuccess="handleCreateSuccess"
      :parentDetail="getBreadList[getBreadList.length - 1] || {}"
    />
    <!-- 复制到弹出框 -->
    <copyMoveToModal
      v-if="modalManage.copyToModal"
      :showModal="modalManage.copyToModal"
      modalName="copyToModal"
      @handleModalClose="handleModal"
      :opsItems="getCurrentSelect"
    />
    <!-- 移动到弹出框 -->
    <copyMoveToModal
      v-if="modalManage.moveToModal"
      type="move"
      :showModal="modalManage.moveToModal"
      modalName="moveToModal"
      @handleModalClose="handleModal"
      :opsItems="getCurrentSelect"
    />
    <!-- 删除弹出框 -->
    <deleteModal
      v-if="modalManage.deleteModal"
      :showModal="modalManage.deleteModal"
      modalName="deleteModal"
      @handleModalClose="handleModal"
      :dataName="getFoldersName"
      :opsItem="getCurrentSelect"
    />
    <!-- 下载弹出框 -->
    <downloadModal
      v-if="modalManage.downloadModal"
      :showModal="modalManage.downloadModal"
      modalName="downloadModal"
      @handleModalClose="handleModal"
      :dataName="getFoldersName"
      :opsItem="getCurrentSelect"
    />
    <!-- 发布弹出框 -->
    <publishModal
      v-if="modalManage.publishModal"
      :showModal="modalManage.publishModal"
      modalName="publishModal"
      @handleModalClose="handleModal"
      :dataName="getFoldersName"
      :opsItem="getCurrentSelect"
    />
    <!-- 上传弹出框 -->
    <uploadModal
      v-if="modalManage.uploadModal"
      :showModal="modalManage.uploadModal"
      modalName="uploadModal"
      @handleModalClose="handleModal"
      :type="uploadType"
    />
    <!-- 扫描数据弹出框 -->
    <scanModal
      v-if="modalManage.scanModal"
      :showModal="modalManage.scanModal"
      modalName="scanModal"
      @handleModalClose="handleModal"
    />
  </div>  
</template>
<script>
import { mapGetters } from 'vuex'
import createDataSetModal from './commonModal/createDataSetModal'
import createFolderModal from './commonModal/createFolderModal'
import copyMoveToModal from './commonModal/copyMoveToModal'
import deleteModal from './commonModal/deleteModal'
import downloadModal from './commonModal/downloadModal'
import publishModal from './commonModal/publishModal'
import uploadModal from './commonModal/uploadModal';
import scanModal from './commonModal/scanModal'

export default {
  name: 'dataListHeader',
  components: {
    createDataSetModal,
    createFolderModal,
    copyMoveToModal,
    publishModal,
    deleteModal,
    downloadModal,
    uploadModal,
    scanModal
  },
  props: {
    currentDir: {
      type: String,
      default: '',
    }
  },
  watch: {
    
  },
  computed: {
    ...mapGetters('dataList', ['getCurrentSelect', 'getBreadList']),
    getFoldersName() { // 生成弹框中名字要素的方法  当大于两个的时候 显示XX,XX等。。
      let name = '';
      let len = this.getCurrentSelect.length;
      if(this.getCurrentSelect && len) {
        for(let i=0;i<len;i++) {
          if(i >= 2) {
            name += `等${len}个项目`
            break;
          }
          name += this.getCurrentSelect[i].dataName || this.getCurrentSelect[i].dictName
          if(i==0 && len > 1) name += '、'
        }
      }
      return name;
    }
  },
  data() {
    return  {
      modalManage: {
        createDataSet: false,
        createFolder: false,
        copyToModal: false,
        moveToModal: false,
        deleteModal: false,
        downloadModal: false,
        publishModal: false,
        uploadModal: false,
        scanModal: false
      },
      uploadType: '',
    }
  },
  methods: {
    handleModal(name) {
      this.modalManage = {
        ...this.modalManage,
        [name]: !this.modalManage[name]
      };
    },
    // 新建目录
    handleCreateFolder() {
      if(this.getBreadList.length && this.getBreadList[this.getBreadList.length - 1].isDataset > 0) {
        // 当前目录不是数据集
        this.$Message.error('数据集下无法新建目录!')
        return;
      }
      this.handleModal('createFolder')
    },
    // 上传数据
    handleUploadData(type) {
      this.uploadType = type;
      this.handleModal('uploadModal')
    },
    // 扫描
    handleScanData() {
      if(!this.getBreadList.length || (this.getBreadList.length && this.getBreadList[this.getBreadList.length - 1].isDataset <= 0)) {
        // 当前目录不是数据集
        this.$Message.error('当前目录不是数据集,请先进入数据集目录')
        return;
      }
      this.handleModal('scanModal')
    },
    handleCreateSuccess() {
      // 创建成功的回调  刷新列表什么的
      this.$store.dispatch('dataList/updateRefreshfTable')
    }
  }
}
</script>
<style lang="less">
.dataListHeaderWrapper {
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
    >span {
      margin: 0 4px;
      cursor: pointer;
    }
  }
}
</style>