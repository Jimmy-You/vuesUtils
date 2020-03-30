<template>
  <div class="dataPreviewWapper">
    <div>
      <div class="data_name">{{this.$route.query.name || '数据'}}</div>
      <div class="imageList">
        <div v-if="!showList" class="title primary" @click="changeView">数据列表>></div>
        <div v-else class="list">
          <div class="back primary cursor" @click="changeView">收起列表&lt;&lt;</div>
          <div class="list_wrapper">
            <vue-scroll>
              <div
                v-for="(item, index) in dataList"
                :key="index"
                class="list_item cursor"
                :class="{activeItem: activeItem.uuid == item.uuid}"
                @click="handleListItemClick(item)"
              >
                <span style="display:inline-block;width: 28px;">{{item.index}}</span>
                <span>{{item.dataName}}</span>
              </div>
            </vue-scroll>
          </div>
        </div>
      </div>
      <div class="play_menu">
        <div class="pre pointer" @click="showPre">上一个&lt;&lt;</div>
        <div class="current">
          <div>当前第&nbsp;{{activeItem.index || 0}}&nbsp;个</div>
          <div>共&nbsp;{{dataList.length}}&nbsp;个</div>
        </div>
        <div class="next pointer" @click="showNext">下一个>></div>
      </div>
      <div class="more_map">
        <Poptip content="content" placement="left" trigger="click">
          <i class="iconfont icon-map" />
          <div slot="content" class="map_list_container">
            <Row>
              <Col span="6" class="map_item" v-for="(item, index) in mapType" :key="index" :class="{active: item.id == currentStyle}">
                <div @click="changeMapStyle(item.url, item.id)">
                  <div class="pre_img">
                    <img src="../../assets/images/defaultMap.png" />
                  </div>
                  <div class="map_name">
                    {{item.name}}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Poptip>
      </div>
      <div id="map"></div>
    </div>
  </div>
</template>
<script>
import Status from '@/utils/Status.js'

export default {
  name: "dataPreview",
  data() {
    return {
      map: null,
      currentStyle: '1',
      showList: false,
      mapType: [
        { id: '1', name: '基础模板', url: 'http://121.36.21.73:20002/api/pie-cloud/layerData/layerTemplates?id=2c92808c70331f3501703327459b0001', preImg: '' },
        { id: '2', name: '全国河流', url: 'http://121.36.21.73:20002/api/pie-cloud/layerData/layerTemplates?id=2c92808c6f5ab409016f5ad146ee0001', preImg: '' },
      ],
      activeItem: {},
      dataList: []
    };
  },
  components: {
  },
  computed: {
  },
  methods: {
    init() {
      let map = new mapboxgl.Map({
        container: "map", // container id
        // style:
        //   "http://pie-cloud-srv:8181/api/pie-cloud/layerData/layerTemplates?inner=true&id=" +
        //   this.$route.query.id // stylesheet location
        style: 'http://121.36.21.73:20002/api/pie-cloud/layerData/layerTemplates?id=2c92808c70331f3501703327459b0001'
        // zoom: 4,
        // center: [106.46, 39.92]
      });
      if (this.$route.query.tip != "1") {
        map.addControl(new mapboxgl.NavigationControl());
      }
      let state = new Status(map, 0, 0); //显示左下角scale与center
      document.getElementById("map").appendChild(state.dom);
      this.map = map;
    },
    // 修改地图的样式
    changeMapStyle(url, id) {
      if(this.map && id != this.currentStyle) {
        this.currentStyle = id;
        this.map.setStyle(url);
      }
    },
    changeView() {
      this.showList = !this.showList;
    },
    // 点击左侧列表
    handleListItemClick(item) {
      this.activeItem = item;
    },
    /**
     * 上一张
     */
    showPre() {
      if(this.activeItem.index<=1) {
        this.$Message.error('已经是第一张啦!')
        return;
      }
      this.activeItem = this.dataList[this.activeItem.index - 2]
    },
    /**
     * 下一张
     */
    showNext() {
      if(this.activeItem.index>= this.dataList.length) {
        this.$Message.error('已经是最后一张啦!')
        return;
      }
      this.activeItem = this.dataList[this.activeItem.index]
    },
    getPreviewData() {
      this.$http.get(this.$CONST.DATA_LIST.DATA_SET_PREVIEW, {
        userId: this.$route.query.id,
        dirId: this.$route.query.dirId,
        dataSetType: this.$route.query.dataSetType,
        pageNum: 1, // TODO
        pageSize: 10, // TODO
      }).then((res) => {
        const { data = [] }= res.data || {};
        if(data && Array.isArray(data)) {
          this.dataList = data;
          this.activeItem = data[0] || {}
        }
      })
    }
  },
  beforeCreate() {},
  created() {
  },
  beforeMount() {},
  mounted() {
    this.init();
    this.getPreviewData();
  },
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
};
</script>
<style lang="less">
.dataPreviewWapper {
  height: 100%;
  body {
    margin: 0;
    padding: 0;
  }
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .mapboxgl-control-container {
      .mapboxgl-ctrl-top-right {
        top: 60px;
      }
    }
  }
  .data_name {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(0,0,0,0.6);
    color: #fff;
    z-index: 99;
    line-height: 46px;
    text-align: center;
  }
  .imageList {
    position: fixed;
    top: 56px;
    left: 12px;
    z-index: 99;
    .title {
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    }
    .list {
      .back {
        font-size: 16px;
        font-weight: bold;
      }
      .list_wrapper {
        border: 1px solid @theme-primary;
        background: rgba(0,0,0,0.6);
        color: #fff;
        height: 60vh;
        .list_item {
          min-width: 240px;
          padding: 8px;
          border-bottom: 1px solid #cbcbcb;
        }
        .activeItem {
          background: #321fdb33;
        }
      }
    }
  }
  .play_menu {
    position: fixed;
    top: 56px;
    left: 50vw;
    z-index: 99;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    .pre {
      display: flex;
      align-items: center;
      background: @theme-primary;
      padding: 2px;
      border-radius: 4px;
      color: #fff;
      height: 40px;
      padding: 4px;
    }
    .current {
      margin: 0 6px;
      text-align: center;
      background: #fff;
      padding: 0 12px;
      color: #000;
      border-radius: 4px;
    }
    .next {
      display: flex;
      align-items: center;
      background: @theme-primary;
      padding: 2px;
      border-radius: 4px;
      color: #fff;
      height: 40px;
      padding: 4px;
    }
  }
  .more_map {
    cursor: pointer;
    position: fixed;
    right: 10px;
    top: 175px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    // border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    z-index: 99;
    .iconfont {
      font-size: 20px;
    }
  }
  .map_list_container {
    width: 480px;
    .map_item {
      // width: 160px;
      padding: 6px;
      // display: inline-block;
      .pre_img {
        img {
          width: 100%;
          height: auto;
        }
      }
      .map_name {
        text-align: center;
      }
    }
    .active {
      background: #321fdb99;
      border-radius: 4px;
      color:#fff;
    }
  }
}
</style>
