<template>
  <div class="dataListBodyWrapper">
    <div class="list_header">
      <div v-if="!getBreadList.length">{{ getShowSearchResult ? `"${searchKey}" 的搜索结果` : '数据目录'}}</div>
      <div v-else class="list_bread">
        <div @click="handleListGoUp" class="pointer hover_primary">返回上一级</div>
        <div class="split_line"></div>
        <div class="m_bread_list">
          <Breadcrumb>
            <BreadcrumbItem><span @click="handleRootClick">{{getShowSearchResult ? `"${searchKey}" 的搜索结果` : '根目录'}}</span></BreadcrumbItem>
            <BreadcrumbItem
            v-for="(item, index) in getBreadList"
            :key="index"
            ><span @click="handleBreadClick(item, getBreadList.length - index)">{{item.dictName || item.dataName}}</span></BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      <div class="ops_suffix">
        <Input search placeholder="搜索我的数据" @on-change="handleSearchChange" v-model="searchKey" />
        <div>
          <Dropdown>
            <a href="javascript:void(0)">
                <i class="iconfont icon-order_down primary pointer" />
            </a>
            <DropdownMenu slot="list">
                <DropdownItem
                v-for="item in sortTypeList"
                :key="item.key"
                :selected="sortType == item.key"
                :name="item.key"
                ><div @click="handleSortChange(item.key)">{{ item.name }}</div></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="list_body" style="height: calc(100vh - 164px);">
      <mTable
        :tableCon="getCurrentTableData"
        :tableHeader="renderTableHeader()"
        @on-selection-change="handleTableSelect"
        :loading="tableLoading"
        :max-height="getTableHeight"
      />
      <mPage
        :total="getShowSearchResult ? searchTotal : tableTotal"
        :pageSize="getShowSearchResult ? searchPageSize : tablePageSize"
        :current="getShowSearchResult ? searchPage : tablePage"
        @pageChange="handlePageChange"
        @pageSizeChange="handlePageSizeChange"
      />
    </div>
    <!-- 复制到弹出框 -->
    <copyMoveToModal
      v-if="modalManage.copyToModal"
      :showModal="modalManage.copyToModal"
      modalName="copyToModal"
      @handleModalClose="handleModal"
      :opsItems="[currentClickItem]"
    />
    <!-- 移动到弹出框 -->
    <copyMoveToModal
      v-if="modalManage.moveToModal"
      type="move"
      :showModal="modalManage.moveToModal"
      modalName="moveToModal"
      @handleModalClose="handleModal"
      :opsItems="[currentClickItem]"
    />
    <!-- 删除弹出框 -->
    <deleteModal
      v-if="modalManage.deleteModal"
      :showModal="modalManage.deleteModal"
      modalName="deleteModal"
      @handleModalClose="handleModal"
      :dataName="currentClickItem.dictName || currentClickItem.dataName"
      :opsItem="[currentClickItem]"
    />
    <!-- 下载弹出框 -->
    <downloadModal
      v-if="modalManage.downloadModal"
      :showModal="modalManage.downloadModal"
      modalName="downloadModal"
      @handleModalClose="handleModal"
      :dataName="currentClickItem.dictName || currentClickItem.dataName"
      :opsItem="[currentClickItem]"
    />
    <!-- 发布弹出框 -->
    <publishModal
      v-if="modalManage.publishModal"
      :showModal="modalManage.publishModal"
      modalName="publishModal"
      @handleModalClose="handleModal"
      :dataName="currentClickItem.dictName || currentClickItem.dataName"
      :opsItem="[currentClickItem]"
    />
    <!-- 重命名弹出框 -->
    <renameModal
      v-if="modalManage.renameModal"
      :showModal="modalManage.renameModal"
      modalName="renameModal"
      @handleModalClose="handleModal"
      :dataName="currentClickItem.dictName || currentClickItem.dataName"
      :item="currentClickItem"
    />
    <!-- 数据集详情弹出框 -->
    <dataDetailModal
      v-if="modalManage.dataDetailModal"
      :showModal="modalManage.dataDetailModal"
      modalName="dataDetailModal"
      @handleModalClose="handleModal"
      :item="currentClickItem"
    />
    <!-- 编辑数据集详情弹出框 -->
    <dataDetailModifyModal
      v-if="modalManage.dataDetailModifyModal"
      :showModal="modalManage.dataDetailModifyModal"
      modalName="dataDetailModifyModal"
      @handleModalClose="handleModal"
      :dataDetail="currentClickItem"
    />
    <!-- 视频播放弹出框 -->
    <videoPlayerModal
      v-if="modalManage.videoPlayerModal"
      :showModal="modalManage.videoPlayerModal"
      modalName="videoPlayerModal"
      @handleModalClose="handleModal"
      :dataDetail="currentClickItem"
    />
    <!-- 图片预览弹出框 -->
    <imgPreviewModal
      v-if="modalManage.imgPreviewModal"
      :showModal="modalManage.imgPreviewModal"
      modalName="imgPreviewModal"
      @handleModalClose="handleModal"
      :dataDetail="currentClickItem"
    />
  </div>  
</template>
<script>
import mTable from '@/components/modules/table.vue'
import mPage from '@/components/modules/page.vue'
import { mapGetters } from 'vuex'
import copyMoveToModal from './commonModal/copyMoveToModal'
import deleteModal from './commonModal/deleteModal'
import downloadModal from './commonModal/downloadModal'
import publishModal from './commonModal/publishModal'
import renameModal from './commonModal/renameModal'
import dataDetailModal from './commonModal/dataDetailModal'
import dataDetailModifyModal from './commonModal/dataDetailModifyModal'
import videoPlayerModal from './commonModal/videoPlayerModal'
import imgPreviewModal from './commonModal/imgPreviewModal';
import tableHeaderRender from './tableHeaderRender';
import { debounce } from '@/utils/tools'

export default {
  name: 'dataListBody',
  components: {
    mTable,
    mPage,
    copyMoveToModal,
    publishModal,
    deleteModal,
    downloadModal,
    renameModal,
    dataDetailModal,
    dataDetailModifyModal,
    videoPlayerModal,
    imgPreviewModal,
  },
  props: {
    
  },
  computed: {
    ...mapGetters('dataList', ['getBreadList', 'getCurrentTableData', 'getShowSearchResult', 'getRefreshfTable', 'getOldPageNums', 'getNormalBreadList']),
    getTableHeight() { // 根据用户的屏幕尺寸生成合适的表格固定高度
      let parentHeight = document.getElementsByClassName("list_body")[0]
        ? document.getElementsByClassName("list_body")[0].clientHeight
        : 800;
      return parentHeight - 80;
    }
  },
  data() {
    return  {
      modalManage: {
        copyToModal: false,
        moveToModal: false,
        deleteModal: false,
        downloadModal: false,
        publishModal: false,
        renameModal: false,
        dataDetailModal: false,
        dataDetailModifyModal: false,
        videoPlayerModal: false,
        imgPreviewModal: false,
      },
      currentClickItem : {}, // 当前点击的行
      tableTotal: 0,
      tablePageSize: 10,
      tablePage: 1,
      searchTotal: 0,
      searchPageSize: 10,
      searchPage: 1,
      tableLoading: false,
      searchKey: '', //搜索关键字
      sortType: '', // 排序方式
      sortTypeList: [
        { name: '默认', key: '' },
        { name: '按文件名升序', key: 'esDataName-asc' },
        { name: '按文件名降序', key: 'esDataName-desc' },
        { name: '按大小升序', key: 'size-asc' },
        { name: '按大小降序', key: 'size-desc' },
        { name: '按日期升序', key: 'updateTime-asc' },
        { name: '按日期降序', key: 'updateTime-desc' },
      ]
    }
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
      return tableHeaderRender.call(this)
    },
    // 列表项选择
    handleTableSelect(selected) {
      this.$store.dispatch('dataList/updateCurrentSelect', selected);
    },
    // 目录层级递进
    handleListGoDown(item) {
      const newBreaList = [...this.getBreadList, item];
      const newPageList = [...this.getOldPageNums, { page: this.tablePage, pageSize: this.tablePageSize }]
      // 保存新的面包屑
      this.$store.dispatch('dataList/updateBreadList', newBreaList);
      // 保存上级目录的页码等信息
      this.$store.dispatch('dataList/updateOldPageNums', newPageList);
      this.tablePage = 1,
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    },
    // 目录回退一级
    handleListGoUp() {
      const newBreaList = this.getBreadList.slice(0, this.getBreadList.length - 1);
      // 首先改pageSize
      let pageObj = this.getOldPageNums[this.getOldPageNums.length - 1]
      const newPageList = this.getOldPageNums.slice(0, this.getOldPageNums.length - 1);
      this.$store.dispatch('dataList/updateBreadList', newBreaList);
      this.$store.dispatch('dataList/updateOldPageNums', newPageList);
      this.tablePage = pageObj.page || 1,
      this.tablePageSize = pageObj.pageSize || this.tablePageSize
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    },
    // 目录层级的跳跃选择
    handleBreadClick(item, times) {
      if(item.dirId == this.getBreadList[this.getBreadList.length - 1].dirId) return; // 当前目录 不动
      let oldBreadList = this.getBreadList;
      let oldPageList = this.getOldPageNums;
      for(let i=0;i<times - 1;i++) {
        oldBreadList.pop();
        if(i == times - 2) {
          this.tablePage = oldBreadList[oldBreadList.length - 1].page || 1,
          this.tablePageSize = oldBreadList[oldBreadList.length - 1].pageSize || this.tablePageSize
        }
        oldPageList.pop();
      }
      this.$store.dispatch('dataList/updateBreadList', oldBreadList);
      this.$store.dispatch('dataList/updateOldPageNums', oldPageList);
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    },
    // 点击根目录
    handleRootClick() {
      this.$store.dispatch('dataList/updateBreadList', []);
      this.tablePage = this.getOldPageNums[0].page || 1,
      this.tablePageSize = this.getOldPageNums[0].pageSize || this.tablePageSize
      this.$store.dispatch('dataList/updateOldPageNums', []);
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    },
    // 搜索字段的变化
    handleSearchChange() {
      if(this.searchKey == '') {
        window.setTimeout(() => {
          this.$store.dispatch('dataList/updateSearchResult', []);
          this.$store.dispatch('dataList/updateSerachStatus', false);
          this.$store.dispatch('dataList/updateCurrentSelect', []);
        }, 500)
      } else {
        debounce(this.handleSearchData, 500)()
      }
    },
    // 排序方式的改变
    handleSortChange(key) {
      this.sortType = key;
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    },
    // 用户进行搜索操作 搜索根目录调用的接口和搜索结果层级递进不同  所以进行了判断 【应该有更好的方式？】
    handleSearchData() {
      this.$store.dispatch('dataList/updateSerachStatus', true);
      let currentDir = this.getBreadList[this.getBreadList.length - 1] || {};
      if(currentDir.dirId) {
        // 并非是根目录
        this.getDirList();
      } else {
        let path = '';
        this.getNormalBreadList.forEach(item => {
          path += `/${item.dictName}`
        })
        let params = {
          esDataName: this.searchKey,
          parentMes: path,
          pageNum: this.searchPage,
          pageSize: this.searchPageSize,
          sortType: this.sortType || '',
        }
        this.tableLoading = true;
        this.$http.get(this.$CONST.DATA_LIST.QUERY_DATA_BY_FIELD, params).then((res) => {
          if(res.data && res.data.success) {
            const { list = [], total = 0 } = res.data.data || {}; 
            this.searchTotal = total;
            // const listFormatter = list.map(item => {
            //   return { ...item, isDataset: item.type == '1' ? '1' : '0' }
            // })
            this.$store.dispatch('dataList/updateSearchResult', list);
          }
          this.tableLoading = false;
        }).catch(err => {
          this.tableLoading = false;
        })
      }
      
    },
    // 获取目录列表
    getDirList() {
      let currentDir = this.getBreadList[this.getBreadList.length - 1] || {};
      let params = {
        dirId: currentDir.dirId || '0',
        isDataSet: currentDir.isDataset > 0 ? '1' : '0',
        userId: window.localStorage.getItem('userId'),
        pageNum: this.getShowSearchResult ? this.searchPage : this.tablePage,
        pageSize: this.getShowSearchResult ? this.searchPageSize : this.tablePageSize,
        sortType: this.sortType || '',
      }
      this.tableLoading = true;
      let actionName = this.getShowSearchResult ? 'dataList/updateSearchResult' : 'dataList/updateCurrentTableData'
      this.$store.dispatch(actionName, []);
      this.$http.get(this.$CONST.DATA_LIST.DIRLIST, params).then((res) => {
        if(res.data && res.data.success) {
          const { list = [], total = 0 } = res.data.data || {};
          let totalKey = this.getShowSearchResult ? 'searchTotal' : 'tableTotal'
          this[totalKey] = total;
          this.$store.dispatch(actionName, list);
        }
        this.tableLoading = false;
      }).catch(err => {
        this.tableLoading = false;
      })
    },
    // 页码改变
    handlePageChange(page) {
      let key = this.getShowSearchResult ? 'searchPage' : 'tablePage';
      this[key] = page;
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    },
    // 页面尺寸改变
    handlePageSizeChange(pageSize) {
      let key = this.getShowSearchResult ? 'searchPageSize' : 'tablePageSize';
      let pageKey = this.getShowSearchResult ? 'searchPage' : 'tablePage';
      this[key] = pageSize;
      this[pageKey] = 1;
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    },
    // 设置为公开或者私有 包括目录 数据集 数据的设置
    handleDirPublicSet(status) {
      let isDir = this.currentClickItem.dirId ? true : false;
      let keyParam = isDir ? 'dirId' : 'uuid'
      let url = isDir ? this.$CONST.DATA_LIST.SET_DIR : this.$CONST.DATA_LIST.DATA_PUBLIC_TRIGGLE
      let params = {
        isPublic: status,
        [keyParam]: this.currentClickItem[keyParam],
        userId: localStorage.getItem('userId'),
      }
      if(!isDir) {
        let currentDir = this.getBreadList[this.getBreadList.length - 1] || {};
        params.dictId = currentDir.dirId || '0';
      } else {
        params.isDataset = this.currentClickItem.isDataset
      }
      this.$http.post(`${url}?isPublic=${status}&${keyParam}=${this.currentClickItem[keyParam]}`, params).then((res) => {
        if(res.data && res.data.success) {
          // 修改本地store里存储的数据
          this.$Message.success('设置成功!')
          for(let i=0;i<this.getCurrentTableData.length;i++) {
            if(this.getCurrentTableData[i][keyParam] == this.currentClickItem[keyParam]) {
              // 是当前目录 进行调整
              this.getCurrentTableData[i].isPublic = status;
              break;
            }
          }
          this.$store.dispatch('dataList/updateCurrentTableData', this.getCurrentTableData);
        } else {
          this.$Message.success('设置失败!')
        }
      })
    },
    // 数据置顶 isStick 1置顶  0取消置顶
    handleDirStick() {
      let isStick = this.currentClickItem.stickTime != '2000-01-01 00:00:00' ? '0' : '1';
      let params = {
        dirId: this.currentClickItem.dirId,
        isStick,
      }
      this.$http.post(this.$CONST.DATA_LIST.SET_DIR_STICK, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('操做成功!')
          this.getDirList();
        }
      }).catch(err => {
      })
    }
  },
  mounted() {
    this.getDirList() // 初始化根目录列表
  },
  beforeDestroy() {
    // 切换页面之前 清除搜索的效果
    this.$store.dispatch('dataList/updateSearchResult', []);
    this.$store.dispatch('dataList/updateSerachStatus', false);
    this.$store.dispatch('dataList/updateCurrentSelect', []);
  },
  watch: {
     // 数据目录刷新的方法
    getRefreshfTable() {
      this.getShowSearchResult ? this.handleSearchData() : this.getDirList()
    }
  }
}
</script>
<style lang="less">
.dataListBodyWrapper {
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
                  margin: 0  3px;
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
              background: url(../../../assets/images/icon/sysPass.png) no-repeat
            }
            .noDataSet {
              background: url(../../../assets/images/icon/sysReject.png) no-repeat
            }
          }
          .ivu-table-row-hover {
            .ops_items {
                display: block!important;
              }
          }
        }
      }
    }
    
  }
}
</style>