<template>
  <div class="models">
    <Modal
      :value="modal"
      :width="modalWidth"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-visible-change="colseChange"
      @on-ok="onOk"
      @on-cancel="onCancel"
      :class-name="`myModels ${modalClass}`"
      :footer-hide="footerHide"
      v-if="modalType=='common'"
    >
      <div slot="header" v-if="headerSlot">
        <slot name="title"></slot>
      </div>
      <div class="models_body_er" v-if="scrollHide" :style="{...customerStyle}">
        <slot></slot>
      </div>
      <div class="models_body" v-else :style="{...customerStyle}">
        <!-- <vue-scroll> -->
        <div class="models_body_box">
          <slot></slot>
        </div>
        <!-- </vue-scroll> -->
      </div>
      <div slot="footer" v-if="footerSlot">
        <slot name="foot"></slot>
      </div>
    </Modal>
    <!--s 删除 s-->
    <Modal
      :value="modal"
      v-if="modalType=='del'"
      :width="modalWidth"
      :loading="modalLoading"
      :mask-closable="false"
      @on-visible-change="colseChange"
      @on-ok="onOk"
      @on-cancel="onCancel"
      :class-name="`myModels ${modalClass}`"
      :footer-hide="footerHide"
    >
      <p slot="header" style>
        <!-- <Icon type="ios-information-circle" class="danger"></Icon> -->
        <span>{{modalTitle}}</span>
      </p>
      <div style="text-align:center;padding:16px 20px;">
        <p>
          不可恢复操作，是否删除
          <b>{{delName}}</b>？
        </p>
      </div>
    </Modal>
    <!--e 删除 e-->
  </div>
</template>
<script>
export default {
  name: "models",
  props: {
    modal: {
      type: Boolean,
      required: true,
      default: false
    },
    modalTitle: {
      type: String,
      required: false
    },
    modalWidth: {
      type: [Number, String],
      default: 540
    },
    footerHide: {
      type: Boolean,
      default: false
    },
    modalLoading: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: "common"
    },
    scrollHide: {
      type: Boolean,
      default: false
    },
    modalClass: {
      type: String,
      default: "primary-modal"
    },
    customerStyle: {
      type: Object,
      default: () => {}
    },
    headerSlot: {
      // 头部是否是slot
      type: Boolean,
      default: false
    },
    delName: {
      type: String,
      default: ""
    },
    footerSlot: {
      // 底部是否是slot
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    colseChange(e) {
      // 鬼知道是用来干嘛的
      // if (!e) {
      //   this.$emit('listenModal', e)
      // }
    },
    onOk() {
      this.$emit("listenModalOk");
    },
    onCancel() {
      this.$emit("listenModal");
    }
  }
};
</script>
<style lang="less">
.myModels {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
    .ivu-modal-header {
      .header-title {
        font-size: 22px;
        margin-bottom: 6px;
        .back {
          cursor: pointer;
          color: @theme-info;
        }
      }
      .header-desc {
        color: @gray-6;
      }
    }
    .ivu-modal-body {
      padding: 0;
      .models_body {
        height: 400px;
        box-sizing: border-box;
        overflow-y: scroll;
        margin-right: 2px;
        .models_body_box {
          padding: 18px;
        }
      }
      .models_body_er {
        box-sizing: border-box;
        padding: 18px;
      }
      /*滚动条样式：谷歌浏览器下*/
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        // border-radius: 10px;
        background-color: rgba(0, 0, 0, 0);
      }
      /*滚动条的轨道*/
      ::-webkit-scrollbar-track {
        /*box-shadow: inset 0 0 5px rgba(0,0,0,.3);*/
        // background-color: rgba(0, 252, 255, 0.4);
        border-radius: 0px;
      }
      /*滚动条的滑块按钮*/
      ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(206, 206, 206, 0.5);
        /*box-shadow: inset 0 0 5px #000;*/
      }
      /*滚动条的上下两端的按钮*/
      ::-webkit-scrollbar-button {
        height: 0px;
        background-color: #b0aeda;
      }
    }
    .ivu-modal-footer {
      .ivu-btn.ivu-btn-large {
        border-radius: 0 !important;
      }
      .ivu-btn.ivu-btn-text.ivu-btn-large {
        border: 1px solid transparent;
        background-color: #fff;
        border-color: #dcdee2;
      }
      .ivu-btn.ivu-btn-text.ivu-btn-large:hover {
        color: @font-color-active;
        border-color: @font-color-active;
      }
    }
  }
  // 公共的样式
  .originalDataWrapper {
    // 原始数据的
    background-color: white;
    .detail-content {
      .relative-num {
        color: @theme-info;
      }
      .cacheList {
        display: flex;
        cursor: pointer;
        padding: 10px 4px;
        &:hover {
          background: @textHover-light-op4;
        }
        .preview-img {
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .item-desc {
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          h6 {
            font-weight: bold;
            font-size: 18px;
          }
          p {
            margin-top: 4px;
          }
        }
      }
    }
    .detail-sidebar {
      margin-left: 40px;
      background-color: white;
      h6 {
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 18px;
      }
      .data-size {
        color: @theme-info;
        margin-bottom: 18px;
      }
    }
  }

  .cacheDataDetailWrapper {
    // 缓存数据的
    background-color: white;
    .detail-content {
      h6 {
        font-weight: bold;
        margin-bottom: 4px;
        font-size: 18px;
      }
      .preview-map {
        width: 100%;
        height: 250px;
        margin-bottom: 10px;
        > div {
          width: 100%;
          height: 100%;
          position: relative;
        }
      }
      .item-desc {
        color: @theme-info;
        margin-bottom: 18px;
      }
    }
    .detail-sider {
      margin-left: 40px;
      background-color: white;
      h6 {
        font-weight: bold;
        margin-bottom: 4px;
        font-size: 18px;
      }
      .item-desc {
        color: @theme-info;
        margin-bottom: 18px;
      }
    }
  }
  .upload-form {
    .ivu-form-item {
      margin-bottom: 0;
    }
  }
  .new-title {
    font-weight: bold;
    margin-right: 10px;
  }
  .foot_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .get-ftp-info {
    cursor: pointer;
    color: @theme-info;
  }
  .ftp-info {
    display: inline-flex;
    margin-left: 10px;
    .item {
      display: flex;
      margin-right: 6px;
      .title {
        margin-right: 2px;
      }
      .info {
        max-width: 120px;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>

