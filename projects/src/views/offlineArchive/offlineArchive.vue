<template>
  <div class="offlineArchiveWapper">
    <offlineArchiveHeader />
    <offlineArchiveBody />
  </div>
</template>
<script>
import offlineArchiveHeader from "@/components/modules/offlineArchive/offlineArchiveHeader.vue";
import offlineArchiveBody from "@/components/modules/offlineArchive/offlineArchiveBody.vue";

export default {
  name: "offlineArchive",
  data() {
    return {};
  },
  components: {
    offlineArchiveHeader,
    offlineArchiveBody
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
.offlineArchiveWapper {
}
</style>
