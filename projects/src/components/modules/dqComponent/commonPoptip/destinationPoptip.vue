<template>
  <Poptip
    placement="right"
    width="200"
    class="popTipStyler"
    v-model="popTipFlag"
  >
    <div class="map_btns">
      <img src="@/assets/images/menu/precise.png" alt />
    </div>
    <div class="api" slot="content">
      <Form :model="formItem" :label-width="35" class="theFormStyle">
        <FormItem label="经度">
          <Input size="small" v-model="formItem.longitude"></Input>
        </FormItem>
        <FormItem label="纬度">
          <Input size="small" v-model="formItem.latitude"></Input>
        </FormItem>
        <FormItem class="formButtons">
          <Button size="small" class="theCancelButton" @click="cancelPopTip"
            >取消</Button
          >
          <Button
            style="margin-left: 8px"
            type="primary"
            size="small"
            @click="confirmPopTip"
            >确定</Button
          >
        </FormItem>
      </Form>
    </div>
  </Poptip>
</template>
<script>
export default {
  props: {
    theMapBase: Object
  },
  data() {
    return {
      popTipFlag: false,
      formItem: {
        longitude: "",
        latitude: ""
      }
    };
  },
  methods: {
    confirmPopTip() {
      this.popTipFlag = false;
      this.theMapBase.flyTo({
        center: [this.formItem.longitude, this.formItem.latitude],
        zoom: 2.99998
      });
    },
    cancelPopTip() {
      this.popTipFlag = false;
    }
  }
};
</script>
<style lang="less">
.map_btns {
  width: 18px;
  height: 18px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
.popTipStyler {
  .theCancelButton {
    border: 1px solid white;
  }
  .theFormStyle {
    .ivu-form-item {
      margin-bottom: 0px;
      margin-top: 6px;
    }
    .formButtons {
      float: right;
    }
  }
  .ivu-poptip-popper {
    left: 25px !important;
  }
}
</style>
