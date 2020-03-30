<template>
  <div class="dpMapControllWrapper">
    <div id="map" ref="themap">
      <div class="mapNav_left">
        <Tooltip content="恢复初始" placement="right">
          <div class="map_btns" @click="hardInitClick()">
            <img src="@/assets/images/menu/homePage.png" alt />
          </div>
        </Tooltip>
        <Tooltip content="定位" placement="right">
          <destinationPoptip :theMapBase="mapBase"></destinationPoptip>
        </Tooltip>
        <Tooltip content="放大" placement="right">
          <div class="map_btns" @click="hardPlusClick()">
            <img src="@/assets/images/menu/boost.png" alt />
          </div>
        </Tooltip>
        <Tooltip content="缩小" placement="right">
          <div class="map_btns" @click="hardMinusClick()">
            <img src="@/assets/images/menu/narrow.png" alt />
          </div>
        </Tooltip>
        <Tooltip content="清除" placement="right">
          <div class="map_btns" @click="hardClearMap()">
            <img src="@/assets/images/menu/clear.png" alt />
          </div>
        </Tooltip>
      </div>

      <div class="dpMapCollapseTitle" @click="changeDirection" ref="result_btn">
        <span>查</span>
        <span>询</span>
        <span>结</span>
        <span>果</span>
        <div style="width:10px;height:10px;">
          <img :src="direction ? sl : sr" alt />
        </div>
      </div>
      <div class="dpMapCollapseResult" ref="searchResult">
        <div class="header">
          <!--  -->
          <div class="headerButton">
            <!-- <Button
              size="small"
              title="根据数据属性字段,进行二次筛选"
              @click="handleTableFilter"
              >二次筛选</Button
            > -->
            <Button
              size="small"
              class="downloadButton"
              @click="handleCombinDownload()"
              >批量下载</Button
            >
            <div>
              <Button size="small" title="添加选中的数据到购物车"
                >加入购物车</Button
              >
            </div>
          </div>
        </div>
        <div class="body">
          <vue-scroll>
            <div class="body_box">
              <table border="1" class="hiddenTable">
                <tr
                  v-for="(item, index) in collpseTableData"
                  @click="handleRowClick(item.uuid, item)"
                  :class="{
                    checkedRow: selectedRow.find(chiItem => {
                      return chiItem.uuid == item.uuid;
                    })
                  }"
                  :key="index"
                >
                  <td>
                    <div
                      style="width:60px;height:60px;border:1px solid #ddd;margin:0 4px;"
                      @click.stop="handlePicView(item.image_path)"
                    >
                      <img
                        :src="item.thumbimage_path"
                        style="width:100%;height:100%"
                        alt
                      />
                    </div>
                  </td>
                  <td class="outerTd">
                    <table border="0" class="innerTable">
                      <tr>
                        <td>
                          <p class="col_label_width">数据名称：</p>
                        </td>
                        <td colspan="3">
                          <p class="col_width">{{ item.data_name }}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="col_label_width">中心经度：</p>
                        </td>
                        <td>
                          <p class="col_er_width">{{ item.lon_center }}</p>
                        </td>
                        <td>
                          <p class="col_label_width">中心纬度：</p>
                        </td>
                        <td>
                          <p class="col_er_width">{{ item.lat_center }}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="col_label_width">日期：</p>
                        </td>
                        <td colspan="3">
                          <p class="col_width">{{ item.create_time }}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="col_label_width">数据量：</p>
                        </td>
                        <td colspan="3">
                          <p class="col_width">{{ item.data_size }}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="iconContainer outerTd">
                    <div>
                      <div
                        class="iconButton"
                        @click.stop="dataDetailed(item)"
                        title="详细信息"
                      >
                        <img src="@/assets/images/menu/Ndetailed.png" alt />
                      </div>
                      <div class="iconButton" title="加入购物车" @click.stop>
                        <img src="@/assets/images/menu/NshopCart.png" alt />
                      </div>
                      <div
                        class="iconButton"
                        title="显示影像图"
                        @click.stop="addImageToMap(item)"
                      >
                        <!-- <img
                          @click.stop="changeOutLineShow(item)"
                          :src="NviewAble"
                          alt
                        /> -->
                        <img
                          :src="
                            imageSourceIds.find(chiItem => {
                              return chiItem == item.uuid;
                            })
                              ? NviewAble
                              : NunviewAble
                          "
                          alt
                        />
                      </div>
                      <div
                        class="iconButton"
                        title="显示数据范围"
                        @click.stop="changeOutLineShow(item)"
                      >
                        <!-- <img src="@/assets/images/menu/Nchoosen.png" alt /> -->
                        <img
                          :src="
                            outLineIds.find(chiItem => {
                              return chiItem == item.uuid + '_line';
                            })
                              ? Nchoosen
                              : Nunchoosen
                          "
                          alt=""
                        />
                      </div>
                      <div
                        class="iconButton"
                        title="下载数据"
                        @click.stop="downloadData(item.uuid)"
                      >
                        <img src="@/assets/images/menu/Ndownload.png" alt />
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </vue-scroll>
        </div>
        <div class="footer">
          <!-- <Page
            :current="tablePage"
            :total="subTotal"
            :page-size="tablePageSize"
            @on-change="handlePageChange"
            @on-page-size-change="handlePageSizeChange"
            simple
          /> -->
          <mPage
            class="smallPage"
            :total="subTotal"
            :pageSize="tablePageSize"
            :current="tablePage"
            @pageChange="handlePageChange"
            @pageSizeChange="handlePageSizeChange"
          ></mPage>
        </div>
      </div>
    </div>
    <!-- <tableFilterModal
      v-if="modalManage.tableFilterModal"
      :showModal="modalManage.tableFilterModal"
      modalName="tableFilterModal"
      @handleModalClose="handleModal"
    /> -->

    <detailedInfoModal
      v-if="modalManage.detailedInfoModal"
      :showModal="modalManage.detailedInfoModal"
      :rowOfDetail="rowOfDetail"
      :extraRowOfDetail="extraRowOfDetail"
      modalName="detailedInfoModal"
      @handleModalClose="handleModal"
    />

    <picViewModal
      v-if="modalManage.picViewModal"
      :picUrl="picUrl"
      :showModal="modalManage.picViewModal"
      modalName="picViewModal"
      @handleModalClose="handleModal"
    />
    <combineDownloadModal
      v-if="modalManage.combineDownloadModal"
      :showModal="modalManage.combineDownloadModal"
      :selectedRow="selectedRow"
      modalName="combineDownloadModal"
      @handleModalClose="handleModal"
    />
  </div>
</template>
<script>
// import tableFilterModal from "./commonModal/tableFilterModal";
import detailedInfoModal from "./commonModal/detailedInfoModal";
import picViewModal from "./commonModal/picViewModal";
import combineDownloadModal from "./commonModal/combineDownloadModal";
import NviewAble from "@/assets/images/menu/NviewAble.png";
import NunviewAble from "@/assets/images/menu/NunviewAble.png";

import Nchoosen from "@/assets/images/menu/Nchoosen.png";
import Nunchoosen from "@/assets/images/menu/Nunchoosen.png";
import destinationPoptip from "./commonPoptip/destinationPoptip";
import sl from "@/assets/images/menu/sl.png";
import sr from "@/assets/images/menu/sr.png";
import mPage from "@/components/modules/simplePage";
import { on, off } from "@/utils/tools.js";
import Status from "@/utils/Status";
import WKTToGeoJson from "@/utils/WKTToGeoJson";
export default {
  name: "dpMapControll",
  props: {
    collpseTableData: Array,
    subTotal: Number
  },
  watch: {},
  components: {
    mPage,
    // tableFilterModal,
    detailedInfoModal,
    picViewModal,
    combineDownloadModal,
    destinationPoptip
  },
  data() {
    return {
      NviewAble,
      NunviewAble,
      Nchoosen,
      Nunchoosen,
      direction: true,
      sl,
      sr,
      outLineIds: [], // 地图上边框的图层id
      imageSourceIds: [], //地图上的图像id
      mapBase: null,
      tablePageSize: 10,
      tablePage: 1,
      picUrl: "",
      selectedRow: [],
      rowOfDetail: {},
      extraRowOfDetail: {},
      modalManage: {
        // tableFilterModal: false,
        detailedInfoModal: false,
        picViewModal: false,
        combineDownloadModal: false
      },
      tableList: [
        {
          dataSign: "GF2-PMS1",
          latitude: "111",
          longitude: "222.23",
          date: "2019/1/1",
          cloud: "0"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "2111",
          longitude: "2222.23",
          date: "2019/2/2",
          cloud: "2"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "3111",
          longitude: "3222.23",
          date: "2019/3/3",
          cloud: "12"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "111",
          longitude: "222.23",
          date: "2019/1/1",
          cloud: "0"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "2111",
          longitude: "2222.23",
          date: "2019/2/2",
          cloud: "2"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "3111",
          longitude: "3222.23",
          date: "2019/3/3",
          cloud: "12"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "111",
          longitude: "222.23",
          date: "2019/1/1",
          cloud: "0"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "2111",
          longitude: "2222.23",
          date: "2019/2/2",
          cloud: "2"
        },
        {
          dataSign: "GF2-PMS1",
          latitude: "3111",
          longitude: "3222.23",
          date: "2019/3/3",
          cloud: "12"
        }
      ]
    };
  },
  methods: {
    handleModal(name) {
      this.modalManage = {
        ...this.modalManage,
        [name]: !this.modalManage[name]
      };
    },
    initMap() {
      let that = this;
      this.mapBase = new mapboxgl.Map({
        container: "map", // container id
        style:
          "http://cloud.piesat.cn:9000/dataservices/map-editor/api/geo-web/layerData/getMapStyle?id=ff8080816e688287016e73621248001c", // stylesheet location
        center: [102, 37.94], // starting position [lng, lat]
        zoom: 3, // starting zoom
        minZoom: 3,
        doubleClickZoom: false
      });
      this.mapBase.on("load", function() {
        setTimeout(() => {
          that.mapBase.resize();
        }, 200);
      });
      // this.mapBase.on(window, "resize", () => {
      //   setTimeout(() => {
      //     this.mapBase.resize();
      //   }, 200);
      // });
      let state = new Status(this.mapBase, 0, 0, false); //显示左下角scale与center
      document.getElementById("map").appendChild(state.dom); //Status模块插入dom树
    },
    clearLayer(layerId) {
      //清除图层
      if (!this.mapBase.getLayer(layerId)) {
      } else {
        this.mapBase.removeLayer(layerId);
      }
      if (!this.mapBase.getSource(layerId)) {
      } else {
        this.mapBase.removeSource(layerId);
      }
    },
    changeDirection() {
      //改变方向
      if (this.direction) {
        this.$refs.result_btn.style.right = "425px";
        this.$refs.searchResult.style.width = "425px";
        console.log(this.$refs);
      } else {
        this.$refs.result_btn.style.right = "0";
        this.$refs.searchResult.style.width = "0";
        console.log(this.$refs);
      }
      this.direction = !this.direction;
    },
    hardInitClick() {
      //恢复初始状态
      this.mapBase.flyTo({
        center: [102, 37.94],
        zoom: 2.99998
      });
    },
    hardPlusClick() {
      //放大
      this.mapBase.zoomIn();
    },
    hardMinusClick() {
      //缩小
      this.mapBase.zoomOut();
    },
    hardClearMap() {
      this.clearLayer("buffer");
      this.clearLayer("lineK");
      this.clearLayer("overlay");
      this.clearLayer("uploadLayerId");
      this.outLineIds.forEach(item => {
        this.clearLayer(item);
      });
      this.imageSourceIds.forEach(item => {
        this.clearLayer(item);
      });
      this.imageSourceIds = [];
      this.outLineIds = [];
      this.selectedRow = [];
      this.$parent.clearQueryGene();
    },
    dataRange() {
      console.log("1111");
    },
    handleRowClick(uuid, row) {
      // this.selectedRow 选中的行
      console.log("这是行的row");
      console.log(row);
      let findIndex = -1;
      this.selectedRow.forEach((item, index) => {
        if (item.uuid == uuid) {
          // 如果有对的上的话  把index
          findIndex = index;
        }
      });
      if (findIndex > -1) {
        // 如果已经选中
        this.selectedRow.splice(findIndex, 1);
        // if (row.model_id == 5 || row.model_id == 6 || row.model_id == 7) {
        //   this.changeOutPointShow(row, "changeColor", false);
        // } else {
        //   this.changeOutLineShow(row, "changeColor", false);
        // }
        this.changeOutLineShow(row, "changeColor", false);
        // 点击已选中的  把对应的source删掉
      } else {
        // this.selectedRow = []
        this.selectedRow.push(row);
        // if (row.model_id == 5 || row.model_id == 6 || row.model_id == 7) {
        //   this.changeOutPointShow(row, "changeColor", false);
        // } else {
        //   this.changeOutLineShow(row, "changeColor", false);
        // }
        this.changeOutLineShow(row, "changeColor", false);
        // 点击未选中的  添加对应的source
      }
    },
    dataDetailed(item) {
      const { href } = this.$router.resolve({
        name: `dataPreview`,
        query: {
          id: item.dict_id,
          name: item.data_name
        }
      });
      window.open(href, "_blank");
      // this.rowOfDetail = item;
      // this.extraRowOfDetail = item.uuid;
      // this.handleModal("detailedInfoModal"); 详细信息旧版代码
    },
    // handleTableFilter() {
    //   this.handleModal("tableFilterModal");
    // },
    handlePicView(pic) {
      this.picUrl = pic;
      this.handleModal("picViewModal");
    },
    downloadData(id) {
      var divE = document.createElement("a"); //创建div
      divE.href = this.$CONST.DQ_COMPONENT.DQ_DOWNLOAD + id;
      divE.target = "_self";
      divE.click();
    },
    handlePageChange(page) {
      this.$emit("subPage", page);
    },
    handlePageSizeChange(pageSize) {
      this.$emit("subPageSize", pageSize);
    },
    removeLayerById(layerId) {
      if (this.mapBase.getLayer(layerId)) {
        this.mapBase.removeLayer(layerId);
        if (this.mapBase.getSource(layerId)) this.mapBase.removeSource(layerId);
        let findIndex = -1;
        this.imageSourceIds.forEach((item, index) => {
          if (item == layerId) {
            // 如果有对的上的话  把index
            findIndex = index;
          }
        });
        if (findIndex > 0) {
          // 删除图层id
          this.imageSourceIds.splice(findIndex, 1);
        }
      }
    },

    changeOutLineRemover() {
      this.imageSourceIds.forEach(item => {
        this.clearLayer(item);
      });
      this.outLineIds.forEach(item => {
        this.clearLayer(item);
      });
      this.imageSourceIds = [];
      this.outLineIds = [];
    },
    changeOutLineShow(row, changeColor, rowSelected) {
      const id = String(row.uuid) + "_line";
      let newCoordinates = WKTToGeoJson(row.geom);
      // alert(newCoordinates.type)

      let numCoordinate = [];
      console.log(newCoordinates);
      if (newCoordinates.type == "Polygon") {
        numCoordinate = newCoordinates.coordinates[0];
        numCoordinate.map(v => {
          if (v) {
            v[0] = Number(v[0]);
            v[1] = Number(v[1]);
          }
        });
      } else if (newCoordinates.type == "point") {
        numCoordinate[0] = Number(newCoordinates.coordinates[0]);
        numCoordinate[1] = Number(newCoordinates.coordinates[1]);
      }
      console.log("1这个");
      console.log(numCoordinate);
      let findIndex = -1;
      this.outLineIds.forEach((item, index) => {
        if (item == id) {
          // 如果有对的上的话  把index
          findIndex = index;
        }
      });
      if (changeColor && findIndex < 0) {
        // 改变颜色而没找到这个边框的时候  直接return
        return;
      }
      if (findIndex >= 0) {
        this.removeLayerById(id);
        this.outLineIds.splice(findIndex, 1);
        if (!changeColor) return;
      }
      const isSelectRow = this.selectedRow.find(item => item.uuid == row.uuid);
      let lineColor = "#000";
      let pointColor = "#000";
      if (rowSelected || isSelectRow) {
        lineColor = "#FF0000";
        pointColor = "#FF0000";
      }
      console.log("zheshi geom");
      console.log(row.geom);
      // if (newCoordinates.type == "Polygon") {
      let paint =
        newCoordinates.type == "Polygon"
          ? {
              "line-color": lineColor,
              "line-width": 2
            }
          : {
              "circle-opacity": 1,
              "circle-color": pointColor,
              "circle-radius": 10
            };
      this.mapBase.addLayer({
        id: `${row.uuid}_line`,
        type: newCoordinates.type == "Polygon" ? "line" : "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type:
                    newCoordinates.type == "Polygon" ? "LineString" : "Point",
                  coordinates: numCoordinate
                }
              }
            ]
          }
        },
        layout: {},
        paint
      });
      // }

      this.outLineIds.push(row.uuid + "_line");
    },
    addImageToMap(row) {
      // 如果已经存在贴图  则移除贴图并return
      if (row.model_id == 5 || row.model_id == 6 || row.model_id == 7) {
        const id = String(row.uuid);
        let findIndex = -1;
        this.imageSourceIds.forEach((item, index) => {
          if (item == id) {
            // 如果有对的上的话  把index
            findIndex = index;
          }
        });
        if (findIndex >= 0) {
          this.removeLayerById(id);
          this.imageSourceIds.splice(findIndex, 1);
          return;
        }
        this.imageSourceIds.push(id);
        this.mapBase.flyTo({
          center: [row.lon_center, row.lat_center],
          zoom: 10
        });
      } else {
        const id = String(row.uuid);
        let newCoordinates = WKTToGeoJson(row.geom);
        console.log("1这个");

        let numCoordinate = newCoordinates.coordinates[0].slice(0, 4);
        numCoordinate.map(v => {
          if (v) {
            v[0] = Number(v[0]);
            v[1] = Number(v[1]);
          }
        });
        console.log(numCoordinate);
        // let theGeom = newCoordinates.coordinates;
        // console.log(newCoordinates.coordinates)
        let findIndex = -1;
        this.imageSourceIds.forEach((item, index) => {
          if (item == id) {
            // 如果有对的上的话  把index
            findIndex = index;
          }
        });
        if (findIndex >= 0) {
          this.removeLayerById(id);
          this.imageSourceIds.splice(findIndex, 1);
          return;
        }
        this.mapBase.addLayer({
          id,
          source: {
            type: "image",
            url: row.thumbimage_path,
            coordinates: numCoordinate
          },
          type: "raster",
          paint: { "raster-opacity": 0.85 }
        });
        this.imageSourceIds.push(id);
        this.mapBase.flyTo({
          center: [row.lon_center, row.lat_center],
          zoom: 10
        });
      }
    },
    handleCombinDownload() {
      this.handleModal("combineDownloadModal");
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>
<style lang="less">
#map {
  width: 100% !important;
  height: calc(100vh - 15px);
  position: relative;
  border: 1px solid #ddd;
  border-top: none;
}

.ivu-modal-mask /deep/ {
  z-index: 2000 !important;
}
.ivu-modal-wrap /deep/ {
  z-index: 2000 !important;
}
.dpMapCollapseTitle {
  position: absolute;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  right: 0;
  top: calc((100% / 2) - 20px);
  width: 35px;
  height: 120px;
  background: url("../../../assets/images/menu/result.png") no-repeat;
  background-size: 100% 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-size: @font-12;
    color: @font-gray-color;
  }
}
.dpMapCollapseResult {
  position: absolute;
  right: 0;
  top: 0;
  height: calc(100vh - 15px);
  width: 0;
  z-index: 500;
  overflow: hidden;
  background: #fff;
  transition: all 0.2s ease-in-out;
  .header {
    font-size: @font-12;
    color: @font-gray-color;
    border-top: 1px solid lightgray;
    padding: 4px;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    .headerButton {
      display: flex;
      justify-content: space-between;
      .downloadButton {
        margin-right: 5px;
      }
    }
  }
  .body {
    box-sizing: border-box;
    height: calc(~"100% - 87px");
    .body_box {
      .body_box_table_col {
        .ivu-table-cell {
          padding: 0;
        }
      }
      .hiddenTable {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid lightgray;
        > tr {
          cursor: pointer;
        }
        .checkedRow {
          > td {
            background: rgba(197, 212, 195, 0.5);
          }
        }
        .outerTd {
          border: 1px solid lightgray;
        }
        .iconContainer {
          padding: 0 0 0 16px;
          .iconButton {
            display: inline-block;
            width: 21px;
            height: 21px;
            padding: 2px;
            cursor: pointer;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .innerTable {
          margin-left: 8px;
          font-size: 12px;
          width: 250px !important;
          .col_label_width {
            width: 70px;
            overflow: hidden;
          }
          .col_width {
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
            font-size: 12px;
          }
          .col_er_width {
            width: 55px;
            overflow: hidden;
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
            font-size: 12px;
          }
        }
      }
    }
  }
  .footer {
    font-size: @font-14;
    font-weight: bold;
    color: @font-gray-color;
    position: absolute;
    bottom: 0;
    width: 100%;
    .smallPage {
      .ivu-page {
        display: block;
        margin-right: 4px;
        > li {
          min-width: 24px;
          height: 24px;
          width: 24px;
          line-height: 24px;
        }
        .ivu-page-options {
          .ivu-page-options-sizer {
            .ivu-select {
              height: 24px;
              line-height: 24px;
              .ivu-select-selection {
                height: 24px;
              }
              .ivu-select-selected-value {
                height: 24px;
                line-height: 24px;
                font-size: 12px !important;
              }
            }
          }
        }
      }
    }
  }
}
.mapNav_left /deep/ {
  position: absolute;
  top: 34px;
  left: 20px;
  padding: 15px 10px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  z-index: 99;
  .ivu-tooltip {
    margin-bottom: 15px;
    display: block;
  }
  .ivu-tooltip:last-child {
    margin-bottom: 0;
  }
  .map_btns {
    width: 18px;
    height: 18px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
