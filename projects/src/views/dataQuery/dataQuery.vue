<template>
  <div class="dataQueryWapper">
    <div class="content">
      <dpMap></dpMap>
    </div>
  </div>
</template>
<script>
import dpMap from "@/components/modules/dqComponent/dpMap";

export default {
  name: "dataList",
  data() {
    return {};
  },
  components: {
    dpMap
  },
  computed: {},
  methods: {},
  beforeCreate() {},
  beforeMount() {},
  mounted() {},
  watch: {},
  beforeDestroy() {},

  beforeUpdate() {},
  updated() {}
};
</script>
<style lang="less">
.dataQueryWapper {
  overflow-y: hidden;
  .border-secondary {
    border: none !important;
  }
}
</style>
