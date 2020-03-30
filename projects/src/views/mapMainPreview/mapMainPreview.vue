<template>
  <div class="mapMainPreviewWapper">
    <div v-show="showType == 'map'">
      <div class="data_name">{{this.dataDetail['data_name'] || '数据'}}</div>
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
    <gridDataDetail
      :detail="dataDetail"
      v-show="showType == 'xiangqing' && dataType == 'gridds'" />
      <rasterDataDetail
        :detail="dataDetail"
        v-show="showType == 'xiangqing' && dataType == 'vectords'"
      />
    <div v-show="showType == 'table'">
      <div>
        <rasterDataTable
          :detail="dataDetail"
          :tableData="vectorTableData"
        />
      </div>
    </div>
    <div class="viwer_switch">
      <ButtonGroup>
        <Button 
          @click="changeView('map')"
          :class="{active: showType == 'map'}"
          custom-icon="iconfont icon-map"></Button>
        <Button
        @click="changeView('xiangqing')"
        :class="{active: showType == 'xiangqing'}"
        custom-icon="iconfont icon-xiangqing"></Button>
        <Button
        @click="changeView('table')"
        :class="{active: showType == 'table'}"
        v-if="dataType == 'vectords'" custom-icon="iconfont icon-map"></Button>
      </ButtonGroup>
    </div>
  </div>
</template>
<script>
import Status from '@/utils/Status.js'
import gridDataDetail from '@/components/modules/mapMainPreview/gridDataDetail'
import rasterDataDetail from '@/components/modules/mapMainPreview/rasterDataDetail'
import rasterDataTable from '@/components/modules/mapMainPreview/rasterDataTable'
import WKTUtils from '@/utils/WKTToGeoJson'

const testGrid = {

}
const testRaster = {

}
export default {
  name: "mapMainPreview",
  data() {
    let dataType = this.$route.query.dataType;
    return {
      map: null,
      showType: 'map',
      currentStyle: '1',
      dataType,
      dataDetail: {},
      vectorTableData: [],
      mapType: [
        { id: '1', name: '基础模板', url: 'http://cloud.piesat.cn:9000/dataservices/map-editor/api/geo-web/layerData/getMapStyle?id=ff8080816e688287016e73621248001c', preImg: '' },
        { id: '2', name: '全国河流', url: 'http://121.36.21.73:20002/api/pie-cloud/layerData/layerTemplates?id=2c92808c6f5ab409016f5ad146ee0001', preImg: '' },
      ]
    };
  },
  components: {
    gridDataDetail,
    rasterDataDetail,
    rasterDataTable
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
        style: 'http://cloud.piesat.cn:9000/dataservices/map-editor/api/geo-web/layerData/getMapStyle?id=ff8080816e688287016e73621248001c'
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
    changeMapStyle(url, id) {
      if(this.map && id != this.currentStyle) {
        this.currentStyle = id;
        this.map.setStyle(url);
        this.showPreview();
      }
    },
    changeView(type) {
      this.showType = type;
    },
    showPreview(data) {
      if(!this.map.isStyleLoaded()) {
        let updateInterval = window.setInterval(() => {
        if(this.map.isStyleLoaded()) {
          window.clearInterval(updateInterval);
          if(this.$route.query.dataType == 'gridds') {
            // 栅格数据
            if(this.$route.query.url){
              this.addGridData()
            } else {
              this.loadImage();
            }
          } else if(this.$route.query.dataType == 'vectords') {
            if(this.$route.query.url){
              this.addVectorData()
            } else {
              this.loadVectorData(data)
            }
          } else if(this.$route.query.dataType == 'uavds') {
            this.loadUavdsData(data);
          }
        }
      }, 200)
      }
    },
    addGridData() {
      const { 'center_point': centerPoint = '' } = this.dataDetail || {}
      if(centerPoint) {
        const centers = centerPoint.slice(centerPoint.indexOf('(') + 1, centerPoint.indexOf(')')).split(' ');
        centers.map(item => {
          return item.trim();
        })
        this.map.flyTo({
          center: [centers[0], centers[1]],
          zoom: 10,
        });
      }
      this.map.addLayer({
          "id":"raster-layer",
          "type": "raster",
          'source': {
              'type': 'raster',
              'tiles': [
                // 'http://192.168.1.188:20002/pie-cloud/tiles/publish/grid/node/tif_fe8d6095011b4dd5a0e208862ab2d3ad/{z}/{x}/{y}'
                  this.$route.query.url + '/{z}/{x}/{y}'
              ]
          }
      });
    },
    addVectorData() {
      this.$http.get(this.$route.query.url).then((res) => {
        const { data = {}} = res || {};
        const { tilestats = {} } = data;
        const { layers = [] } = tilestats;
        this.map.addSource('vector-source', {
          type: 'vector',
          url: this.$route.query.url
        });
        layers.forEach(item => {
          const { layer = '' } = item;
          let type = (item.geometry == 'Polygon' || item.geometry == 'MultiPolygon') ? 'fill' : item.geometry == 'Line' ? 'line' : 'circle'
          let paint = {};
          switch(type) {
            case 'fill':
              paint = {
                'fill-color': '#088',
                'fill-opacity': 0.5,
              };
              break;
            case 'line':
              paint = {
                'line-color': '#000000'
              };
              break;
            case 'circle':
              paint = {
                'circle-color': '#000000',
                'circle-opacity': 0.5
              };
              break;
            default: 
              paint = {}
          }
          this.map.addLayer({
            id: layer,
            type,
            source: 'vector-source',
            'source-layer': layer,
            paint
          })
        })
      })
    },
    loadImage() {
      const { 'image_path': imagePath = '', coordinates = '', 'center_point': centerPoint = '' } = this.dataDetail || {}
      if(imagePath && coordinates) {
        if(centerPoint) {
          const centers = centerPoint.slice(centerPoint.indexOf('(') + 1, centerPoint.indexOf(')')).split(' ');
          centers.map(item => {
            return item.trim();
          })
          this.map.flyTo({
            center: [centers[0], centers[1]],
            zoom: 10,
          });
        }
        const coordinateForm = coordinates.slice(coordinates.indexOf('[') + 2, coordinates.lastIndexOf(']') - 1).split('],[')
        const finalCoord = [];
        for(let i=0;i<coordinateForm.length - 1;i++) {
          let currentItem = coordinateForm[i]; // 123,321
          const chiCoor = currentItem.split(',')
          let chiCoorFor = chiCoor.map(item => {
            let res = Number(item.trim())
            return res
          })
          finalCoord.push(chiCoorFor)
        }
        this.map.addLayer({
          id: 'overlay',
          source: {
            type: 'image',
            url: imagePath,
            coordinates: finalCoord
          },
          type: 'raster',
          paint: { 'raster-opacity': 0.85 }
        })
      }
    },
    // 加载无人机数据
    loadUavdsData(data) {
      const { imagePath = '', centerPoint = '' } = data || {};
      if(!imagePath) {
        this.$Message.error('无可预览资源!')
        return;
      }
      let pointArr = centerPoint.slice(centerPoint.indexOf('(') + 1, centerPoint.indexOf(')')).split(' ') || [];
      const _this = this;
      this.map.loadImage(
        imagePath,
        function(error, image) {
        if (error) throw error;
        _this.map.addImage('cat', image);
        _this.map.addSource('point', {
        'type': 'geojson',
        'data': {
        'type': 'FeatureCollection',
        'features': [
        {
        'type': 'Feature',
        'geometry': {
        'type': 'Point',
        'coordinates': [Number(pointArr[0]), Number(pointArr[1])]
        }
        }
        ]
        }
        });
        _this.map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'point',
        'layout': {
        'icon-image': 'cat',
        'icon-size': 0.25
        }
        });
        }
      );
    },
    // 获取数据的方法
    getAllData() {
      if(this.$route.query.dataType == 'gridds') {
        // 栅格数据
        this.getDetailData();
      } else if (this.$route.query.dataType == 'vectords') {
        // 矢量数据
        this.getVectorDetail();
        if(!this.$route.query.url) {
          this.getVectorPreData();
        }
        this.getVectorTableData();
      } else if(this.$route.query.dataType == 'uavds') {
        this.getUavdsDetail();
      }
    },
    // get detail data
    getDetailData() {
      this.$http.get(this.$CONST.DATA_LIST.GRID_QUERY_INFO, {
        id: this.$route.query.id
      }).then((res) => {
        const { data = {}} = res.data || {};
        this.dataDetail = data || {};
        if(!this.$route.query.url) {
          this.showPreview()
        }
      })
    },
    // 获取矢量数据详情
    getVectorDetail() {
      this.$http.get(this.$CONST.DATA_LIST.VECTOR_QUERY_INFO, {
        id: this.$route.query.id
      }).then((res) => {
        const { data = {}} = res.data || {};
        this.dataDetail = data || {};
      })
    },
    // 获取矢量数据预览数据
    getVectorPreData() {
      this.$http.get(this.$CONST.DATA_LIST.VECTOR_PREVIEW, {
        id: this.$route.query.id
      }).then((res) => {
        const { data = [] }= res.data || {};
        if(data && Array.isArray(data)) {
          if(!this.$route.query.url) {
            this.showPreview()
          }
        }
      })
    },
    // 获取矢量数据图表数据
    getVectorTableData() {
      this.$http.get(this.$CONST.DATA_LIST.VECTOR_CHART, {
        id: this.$route.query.id
      }).then((res) => {
        const { data = [] } = res.data || {};
        this.vectorTableData = data;
      })
    },
    // 加载矢量数据
    loadVectorData(data) {
      data.forEach((item) => {
        const { name = '', wkt = "" } = item;
        const { coordinates: polygonArr = [] } = WKTUtils(wkt) // 使用工具生成GEOJson数据
        polygonArr.forEach((item, index) => {
          this.map.addLayer({
            id: 'uploadLayerId' + index,
            type: 'fill',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: item
                }
              }
            },
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.5
            }
          })
        })
      })
    },
    // 获取无人机影像数据
    getUavdsDetail() {
      this.$http.get(this.$CONST.DATA_LIST.QUERY_UAV_DATA_INFO, {
        indexId: this.$route.query.id,
        // userId: window.localStorage.getItem('userId')
      }).then((res) => {
        const { data = {} } = res.data || {};
        this.showPreview(data)
      })
    }
  },
  beforeCreate() {},
  created() {
  },
  beforeMount() {},
  mounted() {
    this.init();
    this.getAllData();
    if(this.$route.query.url) this.showPreview();
  },
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
};
</script>
<style lang="less">
.mapMainPreviewWapper {
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

  .viwer_switch {
    position: fixed;
    bottom: 20px;
    right: 40px;
    .active {
      background: @theme-primary;
      color: #fff;
    }
  }
}
</style>
