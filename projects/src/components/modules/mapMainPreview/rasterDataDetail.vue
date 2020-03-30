<template>
  <div class="rasterDataDetailWrapper">
    <div class="detail_data_name">{{detail['data_name'] || '--'}}</div>
    <table class="m_table">
      <tr
        class="m_tr"
        v-for="(item, index) in Object.keys(objMap)"
        :key="index"
      >
        <td class="m_td table_title">{{objMap[item]}}</td>
        <td class="m_td table_content">{{detail[item]}}</td>
      </tr>
    </table>
    <div class="detail_data_name">字段描述</div>
    <div class="ivu_table">
      <mTable
        :tableCon="getTableData"
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
    }
  },
  components: {
    mTable
  },
  data() {
    return  {
      objMap: { // 字段字典
        'data_name': '数据名称',
        'create_time': '采集时间',
        'data_size': '数据大小',
        'data_type': '数据类型',
        'envelope': '空间范围',
      },
    }
  },
  computed: {
    getTableData() {
      const tableField = this.detail.fields || "[]";
      const tableDataParse = JSON.parse(tableField) || [];
      if(tableDataParse && Array.isArray(tableDataParse)) {
        return tableDataParse
      }
      return []
    },
    tableColumns() {
      return [
        {
          title: '字段名称',
          key: 'fieldmame'
        },
        {
          title: '字段类型',
          key: 'fieldtype'
        },
        {
          title: '别名',
          key: 'oName'
        },
        {
          title: '单位',
          key: 'unit'
        },
        {
          title: '描述',
          key: 'desc'
        },
      ]
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
  .m_table {
    width: 100%;
    .m_tr {
      width: 100%;
      border-top: 2px solid #cbcbcb;
      &:last-child {
        border-bottom: 2px solid #cbcbcb;
      }
      .m_td {
        text-align: left;
        padding: 8px;
        border-right: 2px solid #cbcbcb;
        &:last-child {
        border-right: none;
      }
      }
      .table_title {
        width: 15%;
      }
      .table_content {
        width: 85%;
      }
    }
  }
}
</style>