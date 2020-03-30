<template>
  <div class="dataListWapper">
    <dataListHeader />
    <dataListBody />
  </div>
</template>
<script>
import dataListHeader from '@/components/modules/dataList/dataListHeader.vue'
import dataListBody from '@/components/modules/dataList/dataListBody.vue'

export default {
  name: 'dataList',
  data() {
    return {
      
    }
  },
  components: {
    dataListHeader,
    dataListBody
  },
  computed: {
    
  },
  methods: {
    getDataTypeList() { // 首次加载数据目录模块的时候 要加载数据类型
      this.$http.get(this.$CONST.DATA_LIST.DATA_TYPE_LIST).then((res) => {
        if(res.data && res.data.success) {
          this.$store.dispatch('dataList/updateDataTypeList', res.data.data ? res.data.data.list || [] : [])
        }
      })
    }
  },
  beforeCreate() {},
  beforeMount() {},
  mounted() {
   this.getDataTypeList();
  },
  watch: {},
  beforeDestroy() {
  },

  beforeUpdate() {},
  updated() {}
}
</script>
<style lang="less">
.dataListWapper {
  
}
</style>
