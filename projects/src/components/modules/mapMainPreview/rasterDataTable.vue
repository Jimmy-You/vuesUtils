<template>
  <!-- 矢量数据的显示 -->
  <div class="rasterDataDetailWrapper">
    <div class="detail_data_name">{{detail['data_name'] || '--'}}</div>
    <div class="ivu_table">
      <mTable
        v-if="tableData && tableData.length"
        :tableCon="tableData"
        :tableHeader="tableColumns"
      />
    </div>
  </div>  
</template>
<script>
import mTable from '@/components/modules/table.vue'

export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
    tableData: {
      type: Array,
      default: () => []
    },
  },
  components: {
    mTable
  },
  data() {
    return  {
      
    }
  },
  computed: {
    tableColumns() {
      let columnObj = this.tableData[0] || {}
      let colomns = [
        { title: '序号', key: '', type: 'index' }
      ]
      Object.keys(columnObj).forEach(item => {
        colomns.push({
          title: item,
          key: item
        })
      })
      return colomns
    }
  },
  methods: {
  },
  watch: {
  }
}
</script>
<style lang="less">
.rasterDataDetailWrapper {
  padding: 35px 50px;
  .detail_data_name {
    font-weight: bold;
    font-size: 16px;
    margin: 10px 0px;
  }
  
}
</style>