<template>
  <div class="gridDataDetailWrapper">
    <div class="detail_data_name">{{detail['data_name'] || '--'}}</div>
    <table class="m_table">
      <template
        v-for="(item, index) in Object.keys(detail)"
      >
        <tr
        class="m_tr"
        :key="index"
        v-if="objMap[item]"
      >
        <td class="m_td table_title">{{objMap[item]}}</td>
        <td class="m_td table_content">{{detail[item]}}</td>
      </tr>
      </template>
      
    </table>
  </div>  
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return  {
      objMap: { // 字段字典
        'data_name': '数据名称',
        'producetime': '采集时间',
        'satelliteid': '卫星号',
        'sensorid': '传感器',
        'productlevel': '数据级别',
        'earthellipsoid': '坐标系',
        'cloudpercent': '云量',
        'data_size': '数据大小',
        dataType: '数据类型',
        'coordinates': '空间范围',
      },
    }
  },
  methods: {
  },
  watch: {
  }
}
</script>
<style lang="less">
.gridDataDetailWrapper {
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