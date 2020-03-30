<template>
  <div class="dqMapWrapper" id="dqMapWrapper">
    <!-- <div class="headerClass">
      <div>数据查询</div>
    </div> -->
    <div class="mapNav">
      <div class="mapNavSub">
        <div v-show="switchcFlag" class="mapBarFirst">
          <i>行政区：&nbsp;&nbsp;</i>
          <Select
            size="small"
            class="mapBarFirstSelect"
            style="width:6vw"
            :label-in-value="true"
            :clearable="true"
            v-model="insideFormProvince"
            placeholder="省/市"
            @on-change="chooseNext"
          >
            <Option
              v-for="item in insideFormProvinceList"
              :key="item.name"
              :value="item.name"
              >{{ item.name }}</Option
            >
          </Select>
          <Select
            size="small"
            class="mapBarFirstSelect"
            placeholder="地/州"
            style="width:6vw"
            :label-in-value="true"
            :clearable="true"
            v-model="insideFormCity"
            @on-change="chooseNextNext"
          >
            <Option
              v-for="item in insideFormCityList"
              :value="item.name"
              :key="item.name"
              >{{ item.name }}</Option
            >
          </Select>
          <Select
            size="small"
            class="mapBarFirstSelect"
            placeholder="区/县"
            style="width:6vw"
            :label-in-value="true"
            :clearable="true"
            v-model="insideFormArea"
            @on-change="chooseNextNextNext"
          >
            <Option
              v-for="item in insideFormAreaList"
              :value="item.name"
              :key="item.name"
              >{{ item.name }}</Option
            >
          </Select>
        </div>
        <div v-show="switchcFlag" class="mapBarSecond">
          <i>空间范围：&nbsp;&nbsp;</i>
          <div class="mapSelector" @click.stop="roundElection">
            <div
              :class="
                seletorActive == '1'
                  ? 'mapSelectorImg_box seletorActive'
                  : 'mapSelectorImg_box'
              "
            >
              <img
                src="@/assets/images/menu/point_w.png"
                style="width:15px;height:15px;"
                alt
                title="鼠标左键在地图上拖拽画圆"
              />
            </div>
          </div>
          <div class="mapSelector" @click="rectangleChoose">
            <div
              :class="
                seletorActive == '2'
                  ? 'mapSelectorImg_box seletorActive'
                  : 'mapSelectorImg_box'
              "
            >
              <img
                src="@/assets/images/menu/triangle_w.png"
                style="width:15px;height:15px;"
                alt
                title="鼠标左键在地图上拖拽画矩形"
              />
            </div>
          </div>
          <div class="mapSelector" @click="polygonChoose">
            <div
              :class="
                seletorActive == '3'
                  ? 'mapSelectorImg_box seletorActive'
                  : 'mapSelectorImg_box'
              "
            >
              <img
                src="@/assets/images/menu/polygon_w.png"
                style="width:15px;height:15px;"
                alt
                title="鼠标左键在地图上拖拽画多边形"
              />
            </div>
          </div>
        </div>
        <!-- <div class="mapBarThird">
          <transition name="slide-fade2" mode="out-in">
            <div
              title="展开更多查询条件"
              class="more"
              @click="toggleMore"
              v-if="!showData"
              style="position: absolute;width:100px;"
            >
              高级搜索&gt;&gt;
            </div>
          </transition>
          <transition name="slide-fade">
            <div
              v-if="showData"
              class="DataTime"
              style="position: absolute;display: flex;"
            >
              <Poptip placement="top-start">
                <div slot="content" class="popContent">
                  <Tree :data="dataCategory" show-checkbox></Tree>
                </div>
                <Button class="dataCateButton">
                  选择数据目录
                  <Icon type="ios-arrow-down" />
                </Button>
              </Poptip>

              <i class="wordOfTime">时间：&nbsp;&nbsp;</i>
              <DatePicker
                type="daterange"
                placement="bottom-end"
                format="MM-dd"
                class="dateCatePicker"
                style="width:10vw"
              ></DatePicker>
              <div title="收起查询条件" class="more" @click="toggleMore">
                &lt;&lt;收起
              </div>
            </div>
          </transition>
        </div> -->
        <div class="mapBarButtons">
          <Poptip placement="bottom-start" v-model="popTipFlag">
            <div slot="content" class="popContent">
              <vue-scroll>
                <Tree
                  ref="initTreeRef"
                  :data="treeData"
                  show-checkbox
                  check-directly
                  @on-check-change="getCheckedNodes"
                ></Tree>
              </vue-scroll>
            </div>
            <div slot="content" class="popContentButton">
              <div class="popContentExtra">
                <Button
                  size="small"
                  class="popContentExtraAll"
                  @click="choosePopAll"
                  >全选</Button
                >
                <Button size="small" @click="reversePopAll(treeData)"
                  >反选</Button
                >
              </div>
              <Button size="small" class="popCancelButton" @click="cancelPopTip"
                >取消</Button
              >
              <Button
                type="primary"
                class="popContentButtonRight"
                size="small"
                @click="confirmPopTip"
                >确定</Button
              >
            </div>
            <Button type="primary">
              选择数据目录
              <Icon type="ios-arrow-down" />
            </Button>
          </Poptip>
          <Button class="mapBarButtonSub" @click="handleTableFilter">
            二次筛选
          </Button>
        </div>
      </div>

      <div class="mapBarSwitcher" @click="switchContent">
        <p>
          <u> <Icon type="md-sync" />切换到列表</u>
        </p>
      </div>
    </div>

    <!-- <dpMapCollapse></dpMapCollapse> -->
    <dpMapControll
      v-if="switchcFlag"
      ref="dpMapControll"
      @subPage="changeSubPage"
      @subPageSize="changeSubPageSize"
      :subTotal="subTotal"
      :collpseTableData="collpseTableData"
    ></dpMapControll>
    <dpMapTable
      v-else
      ref="dpMapTable"
      @subPage="changeSubPage"
      @subPageSize="changeSubPageSize"
      :subTotal="subTotal"
      :collpseTableData="collpseTableData"
    ></dpMapTable>
    <dataCollectModal
      v-if="modalManage.dataCollectModal"
      modalName="dataCollectModal"
      :showModal="modalManage.dataCollectModal"
      @handleModalClose="handleDataCollectClose"
    />
    <tableFilterModal
      v-if="modalManage.tableFilterModal"
      :showModal="modalManage.tableFilterModal"
      :currFilterset="currFilterset"
      modalName="tableFilterModal"
      @currFiltersetAll="getCurrFiltersetAll"
      @handleModalClose="handleModal"
    />
  </div>
</template>

<script>
// import dpMapCollapse from "@/components/modules/dqComponent/dpMapContainer/dpMapSub/dpMapCollapse";
import dpMapTable from "@/components/modules/dqComponent/dpMapTable";
import dpMapControll from "@/components/modules/dqComponent/dpMapControll";
import dataCollectModal from "./commonModal/dataCollectModal";
import tableFilterModal from "./commonModal/tableFilterModal";
import flightData from "@/assets/images/defaultPic/flightData.png";

export default {
  name: "dpMap",
  components: {
    dpMapTable,
    dataCollectModal,
    dpMapControll,
    tableFilterModal
  },
  data() {
    return {
      tableSubPage: 1,
      tableSubPageSize: 10,
      subTotal: 0,
      showData: true,
      switchcFlag: true,
      popTipFlag: false,
      pointDataStr: "",
      currWkt: "",
      // filterSetCenterPoint: "",
      // filterSetDataName: "",
      currFiltersetAll: [],
      seletorActive: "",
      qTypeFlag: -1,
      areaCode: "",
      areaName: "",
      insideFormProvince: "",
      insideFormCity: "",
      insideFormArea: "",
      insideFormProvinceList: [],
      insideFormCityList: [],
      insideFormAreaList: [],
      collpseTableData: [],
      treeData: [],
      treeDataBack: [],
      treeSelectedArr: [],
      customDataSet: [],
      currFilterset: [],
      modalManage: {
        dataCollectModal: false,
        tableFilterModal: false
      },
      dataCategory: [
        {
          title: "DOM成果数据",
          expand: true,
          children: [
            {
              title: "1:5万标准分幅",
              expand: true,
              children: [
                {
                  title: "北京市"
                },
                {
                  title: "陕西省"
                }
              ]
            }
          ]
        },
        {
          title: "高分一号",
          expand: true,
          children: [
            {
              title: "2M全色"
            },
            {
              title: "8M多光谱"
            }
          ]
        },
        {
          title: "无人机航拍影像",
          expand: true
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
    switchContent() {
      this.tableSubPage = 1;
      this.tableSubPageSize = 10;
      this.getQueryGene();
      this.switchcFlag = !this.switchcFlag;
    },

    clearLayer(layerId) {
      //清除图层
      if (!this.$refs["dpMapControll"].mapBase.getLayer(layerId)) {
      } else {
        this.$refs["dpMapControll"].mapBase.removeLayer(layerId);
      }
      if (!this.$refs["dpMapControll"].mapBase.getSource(layerId)) {
      } else {
        this.$refs["dpMapControll"].mapBase.removeSource(layerId);
      }
    },
    toggleMore() {
      //点击更多显示数据集以及时间
      this.showData = !this.showData;
      if (this.showData) {
        this.moreTxt = "<<展开";
      } else {
        this.moreTxt = "更多>>";
      }
    },
    roundElection() {
      //圆选
      this.switchQTypeToSpace();
      console.log("圆选");
      let _this = this;
      this.seletorActive = "1";
      this.clearLayer("buffer");
      this.clearLayer("lineK");
      this.clearLayer("overlay");
      this.clearLayer("uploadLayerId");
      var startPoint, endPoint, buffered, distance;
      var canvas = this.$refs["dpMapControll"].mapBase.getCanvasContainer();
      function onMove(e) {
        canvas.style.cursor = "crosshair";
        endPoint = turf.point(e.lngLat.toArray());
        distance = turf.distance(startPoint, endPoint, { units: "kilometers" });
        buffered = turf.circle(startPoint, distance, { units: "kilometers" });
        _this.$refs["dpMapControll"].mapBase
          .getSource("buffer")
          .setData(buffered);
      }
      function onUp(e) {
        canvas.style.cursor = "";
        // Unbind mouse/touch events
        _this.$refs["dpMapControll"].mapBase.off("mousemove", onMove);
        _this.$refs["dpMapControll"].mapBase.off("mousedown", onDown);
        _this.seletorActive = "";
        endPoint = turf.point(e.lngLat.toArray());
        distance = turf.distance(startPoint, endPoint, { units: "kilometers" });
        buffered = turf.circle(startPoint, distance, { units: "kilometers" });
        //获取区域经纬度拼接
        _this.pointDataStr = "";
        buffered.geometry.coordinates[0].map((v, i) => {
          if (i < buffered.geometry.coordinates[0].length - 1) {
            _this.pointDataStr += v[0] + " " + v[1] + ",";
          } else {
            _this.pointDataStr += v[0] + " " + v[1];
          }
        });
        // if (_this.pointDataStr != "") {
        _this.qTypeFlag = 1;
        _this.tranferWkt();
        // }

        //调取空间查询接口
      }
      function onDown(e) {
        this.collpseTableData = [];
        canvas.style.cursor = "crosshair";
        e.preventDefault();
        startPoint = turf.point(e.lngLat.toArray());
        buffered = turf.circle(startPoint, 0.1, { units: "kilometers" });
        if (!_this.$refs["dpMapControll"].mapBase.getLayer("buffer")) {
          _this.$refs["dpMapControll"].mapBase.addLayer({
            id: "buffer",
            type: "fill",
            source: {
              type: "geojson",
              data: buffered
            },
            layout: {},
            paint: {
              "fill-color": "rgba(248,231,28,0.1)",
              "fill-outline-color": "#f8e71c"
            }
          });
        } else {
          _this.$refs["dpMapControll"].mapBase
            .getSource("buffer")
            .setData(buffered);
        }
        _this.$refs["dpMapControll"].mapBase.on("mousemove", onMove);
        _this.$refs["dpMapControll"].mapBase.once("mouseup", onUp);
      }
      this.$refs["dpMapControll"].mapBase.on("mousedown", onDown);
      canvas.style.cursor = "crosshair";
    },
    rectangleChoose() {
      //空间查询框选
      this.switchQTypeToSpace();
      let _this = this;
      this.seletorActive = "2";
      this.clearLayer("buffer");
      this.clearLayer("lineK");
      this.clearLayer("uploadLayerId");
      this.clearLayer("overlay");
      var startRec, leftBottom, rightTop, endRec, rectangle;
      var canvas = this.$refs["dpMapControll"].mapBase.getCanvasContainer();
      function onMove(e) {
        canvas.style.cursor = "crosshair";
        endRec = turf.point(e.lngLat.toArray()).geometry.coordinates;
        leftBottom = [startRec[0], endRec[1]];
        rightTop = [endRec[0], startRec[1]];
        rectangle = turf.polygon([
          [startRec, rightTop, endRec, leftBottom, startRec]
        ]);
        _this.$refs["dpMapControll"].mapBase
          .getSource("buffer")
          .setData(rectangle);
      }
      function onUp(e) {
        canvas.style.cursor = "";
        _this.$refs["dpMapControll"].mapBase.off("mousemove", onMove);
        _this.$refs["dpMapControll"].mapBase.off("mousedown", onDown);
        _this.seletorActive = "";
        _this.pointDataStr = "";
        //获取区域经纬度拼接
        rectangle.geometry.coordinates[0].map((v, i) => {
          if (i < rectangle.geometry.coordinates[0].length - 1) {
            _this.pointDataStr += v[0] + " " + v[1] + ",";
          } else {
            _this.pointDataStr += v[0] + " " + v[1];
          }
        });

        _this.qTypeFlag = 1;
        _this.tranferWkt();
        //调取空间查询接口
      }
      function onDown(e) {
        this.collpseTableData = [];
        canvas.style.cursor = "crosshair";
        e.preventDefault();
        startRec = turf.point(e.lngLat.toArray()).geometry.coordinates;
        endRec = turf.point(e.lngLat.toArray()).geometry.coordinates;
        leftBottom = [startRec[0], endRec[1]];
        rightTop = [endRec[0], startRec[1]];
        rectangle = turf.polygon([
          [startRec, rightTop, endRec, leftBottom, startRec]
        ]);
        if (!_this.$refs["dpMapControll"].mapBase.getLayer("buffer")) {
          _this.$refs["dpMapControll"].mapBase.addLayer({
            id: "buffer",
            type: "fill",
            source: {
              type: "geojson",
              data: rectangle
            },
            layout: {},
            paint: {
              "fill-color": "rgba(248,231,28,0.1)",
              "fill-outline-color": "#f8e71c"
              // 'fill-outline-color': '#37C637'
            }
          });
        } else {
          _this.$refs["dpMapControll"].mapBase
            .getSource("buffer")
            .setData(rectangle);
        }
        _this.$refs["dpMapControll"].mapBase.on("mousemove", onMove);
        _this.$refs["dpMapControll"].mapBase.once("mouseup", onUp);
      }
      this.$refs["dpMapControll"].mapBase.on("mousedown", onDown);
      canvas.style.cursor = "crosshair";
    },
    polygonChoose() {
      //多边形空间选择
      this.switchQTypeToSpace();
      let _this = this;
      this.seletorActive = "3";
      this.clearLayer("buffer");
      this.clearLayer("lineK");
      this.clearLayer("overlay");
      this.clearLayer("uploadLayerId");
      var line, polygon;
      var theArr = [];
      var canvas = this.$refs["dpMapControll"].mapBase.getCanvasContainer();
      function ondblclick(e) {
        _this.$refs["dpMapControll"].mapBase.removeLayer("polygonLine");
        _this.$refs["dpMapControll"].mapBase.removeSource("polygonLine");
        _this.$refs["dpMapControll"].mapBase.off("mousemove", onMove);
        _this.$refs["dpMapControll"].mapBase.off("click", onDown);
        canvas.style.cursor = "";
        _this.seletorActive = "";
        theArr = [];
        _this.pointDataStr = "";
        //获取区域经纬度拼接
        const coordinatesData = polygon.geometry.coordinates[0] || [];
        let beforeCoordinate = [];
        let dataLength = coordinatesData.length || 0;
        for (let i = 0; i < dataLength; i++) {
          let data = coordinatesData[i];
          if (
            data[0] == beforeCoordinate[0] &&
            data[1] == beforeCoordinate[1]
          ) {
            // 去重
            continue;
          } else {
            beforeCoordinate = data;
            if (i < dataLength - 1) {
              _this.pointDataStr += data[0] + " " + data[1] + ",";
            } else {
              _this.pointDataStr += data[0] + " " + data[1];
            }
          }
        }
        //调取空间查询接口
        _this.qTypeFlag = 1;
        _this.tranferWkt();
      }
      function onMove(e) {
        canvas.style.cursor = "crosshair";
        theArr[theArr.length - 1] = e.lngLat.toArray();
        line = turf.lineString(theArr);
        _this.$refs["dpMapControll"].mapBase
          .getSource("polygonLine")
          .setData(line);
      }
      function onDown(e) {
        //生成面的坐标
        if (theArr.length >= 2) {
          theArr.splice(theArr.length - 1, 0, e.lngLat.toArray());
        } else {
          theArr.push(e.lngLat.toArray());
          theArr.push(e.lngLat.toArray());
        }
        line = turf.lineString(theArr);
        //绘制线
        if (!_this.$refs["dpMapControll"].mapBase.getLayer("polygonLine")) {
          _this.$refs["dpMapControll"].mapBase.addLayer({
            id: "polygonLine",
            type: "line",
            source: {
              type: "geojson",
              data: line
            },
            layout: {},
            paint: {
              "line-color": "#f8e71c",
              "line-width": 2
            }
          });
        } else {
          _this.$refs["dpMapControll"].mapBase
            .getSource("polygonLine")
            .setData(line);
        }
        //绘制面
        if (theArr.length > 3) {
          polygon = turf.lineToPolygon(line);
          if (!_this.$refs["dpMapControll"].mapBase.getLayer("buffer")) {
            _this.$refs["dpMapControll"].mapBase.addLayer({
              id: "buffer",
              type: "fill",
              source: {
                type: "geojson",
                data: polygon
              },
              layout: {},
              paint: {
                "fill-color": "rgba(248,231,28,0.1)",
                "fill-outline-color": "#f8e71c"
                // 'fill-outline-color': '#37C637'
              }
            });
          } else {
            _this.$refs["dpMapControll"].mapBase
              .getSource("buffer")
              .setData(polygon);
          }
        }
        _this.$refs["dpMapControll"].mapBase.on("mousemove", onMove);
        _this.$refs["dpMapControll"].mapBase.once("dblclick", ondblclick);
      }
      this.$refs["dpMapControll"].mapBase.on("click", onDown);
      canvas.style.cursor = "crosshair";
    },
    tranferWkt() {
      if (this.pointDataStr != "") {
        this.currWkt = "POLYGON ((" + this.pointDataStr + "))";
        this.getQueryGene();
      }
    },
    dataCollect() {
      this.handleModal("dataCollectModal");
    },
    handleDataCollectClose() {
      this.modalManage.dataCollectModal = false;
    },
    handleTableFilter() {
      this.handleModal("tableFilterModal");
    },
    getAreaList() {
      let params = {};
      this.$http
        .get(this.$CONST.DQ_COMPONENT.GET_AREA_CODE, params)
        .then(res => {
          if (res.data && res.data.success) {
            console.log(res.data);
            if (!res.data.data) {
            } else {
              this.insideFormProvinceList = res.data.data;
              this.insideFormProvinceList.map(v => {
                if (v.name == this.insideFormProvince) {
                  this.insideFormCityList = v.children;
                  this.areaCode = v.code;
                  this.areaName = v.name;
                }
              });
            }
          }
        });
    },
    chooseNext() {
      this.switchQTypeToArea();
      this.insideFormCity = "";
      this.insideFormCityList = "";
      this.insideFormArea = "";
      this.insideFormAreaList = "";
      this.insideFormProvinceList.map(v => {
        if (v.name == this.insideFormProvince) {
          this.insideFormCityList = v.children;
          this.areaCode = v.code;
          this.areaName = v.name;
          this.getAdminSearchData();
        }
      });
      if (this.qTypeFlag == 0 && this.areaCode != "") {
        this.getQueryGene();
      }
    },
    chooseNextNext() {
      this.switchQTypeToArea();
      this.insideFormArea = "";
      this.insideFormAreaList = "";
      if (this.insideFormCityList != []) {
        this.insideFormCityList.map(v => {
          if (v.name == this.insideFormCity) {
            this.insideFormAreaList = v.children;
            this.areaCode = v.code;
            this.areaName = v.name;
            this.getAdminSearchData();
          }
        });
      }
      if (this.qTypeFlag == 0 && this.areaCode != "") {
        this.getQueryGene();
      }
    },
    chooseNextNextNext() {
      this.switchQTypeToArea();
      if (this.insideFormAreaList != []) {
        this.insideFormAreaList.map(v => {
          if (v.name == this.insideFormArea) {
            this.areaCode = v.code;
            this.areaName = v.name;
            this.getAdminSearchData();
          }
        });
      }
      if (this.qTypeFlag == 0 && this.areaCode != "") {
        this.getQueryGene();
      }
    },
    switchQTypeToArea() {
      this.qTypeFlag = 0;
      this.pointDataStr = "";
      this.currWkt = "POLYGON ((" + this.pointDataStr + "))";
      this.clearLayer("buffer");
      this.clearLayer("lineK");
      this.clearLayer("overlay");
      this.clearLayer("uploadLayerId");
    },
    switchQTypeToSpace() {
      this.qTypeFlag = 1;
      this.currWkt = "POLYGON ((" + this.pointDataStr + "))";
      this.areaCode = "";
      this.areaName = "";
      this.insideFormProvince = "";
      this.insideFormCity = "";
      this.insideFormArea = "";
      this.insideFormCityList = [];
      this.insideFormAreaList = [];
    },
    drawAdminPolygon(sourceId, sourceLayer, selAdminSearchName, prop) {
      //添加行政区图层
      this.$refs["dpMapControll"].mapBase.addLayer({
        id: "buffer",
        type: "fill",
        source: sourceId,
        "source-layer": sourceLayer,
        layout: {},
        paint: {
          "fill-color": "#679055",
          "fill-opacity": 0.6
        },
        filter: ["in", prop, selAdminSearchName]
      });
    },
    getAdminSearchData() {
      //绘制行政区范围
      let len = this.getBLen(this.areaCode.toString());
      this.clearLayer("buffer");
      this.clearLayer("lineK");
      this.clearLayer("overlay");
      switch (len) {
        case 2:
          this.drawAdminPolygon(
            "中国省界-N2O8",
            "5beb84c06dab4083a46baf9826d23a87",
            this.areaName,
            "NAME"
          );
          break;
        case 4:
          this.drawAdminPolygon(
            "中国市界-1O4R",
            "ec1c41d4534a4cb98f396b8cddbe553a",
            this.areaName,
            "name"
          );
          break;
        case 6:
          this.drawAdminPolygon(
            "中国县界-TPDF",
            "60f9d7298ebe4043a84d2b1873aa3eec",
            this.areaName,
            "NAME"
          );
          break;
      }
    },
    getBLen(str) {
      //获得字符串长度
      if (str == null) return 0;
      if (typeof str != "string") {
        str += "";
      }
      return str.replace(/[^\x00-\xff]/g, "01").length;
    },
    clearQueryGene() {
      this.currFilterset = [];
      this.collpseTableData = [];
    },
    getQueryGene() {
      let that = this;
      if (this.$refs["dpMapControll"]) {
        this.$refs["dpMapControll"].changeOutLineRemover();
      }

      if (this.currFilterset != []) {
        // this.currFilterset.map(v => {
        //   if (v.id == "data_name") {
        //     v.value = this.filterSetDataName;
        //   } else if (v.id == "center_point") {
        //     v.value = this.filterSetCenterPoint;
        //   }
        // });
        this.currFilterset = this.currFiltersetAll;
      }

      let params = {
        datasets: this.customDataSet,
        commonData: {
          edate: "",
          sdate: "",
          months: "",
          qtype: that.qTypeFlag,
          wkt: that.currWkt,
          state: that.areaCode
        },
        filterSet: this.currFilterset,
        pageNum: this.tableSubPage,
        pageSize: this.tableSubPageSize
      };
      this.$http.post(this.$CONST.DQ_COMPONENT.QUERY_GENE, params).then(res => {
        if (res.data && res.data.success) {
          if (!res.data.data) {
            this.collpseTableData = [];
            this.subTotal = 0;
          } else {
            this.collpseTableData = res.data.data.data;
            this.subTotal = res.data.data.totalCount;
            this.currFilterset = res.data.data.filterset;
            console.log("传递过去的");
            this.collpseTableData.map(v => {
              if (v.model_id == 5) {
                v.thumbimage_path = "/images/vectorData.png";
                v.image_path = "/images/vectorData.png";
              } else if (v.model_id == 6) {
                v.thumbimage_path = "/images/flightData.png";
                v.image_path = "/images/flightData.png";
              } else if (v.model_id == 7) {
                v.thumbimage_path = "/images/normalData.png";
                v.image_path = "/images/normalData.png";
              }
            });
            console.log(this.collpseTableData);
            this.collpseTableData.forEach(v => {
              if (that.$refs["dpMapControll"]) {
                that.$refs["dpMapControll"].changeOutLineShow(v);
              }
              // this.changeOutLineShow(v);
            });
          }
        }
      });
      console.log("找filSet");
      console.log(this.currFilterset);
    },
    changeSubPage(page) {
      this.tableSubPage = page;
      this.getQueryGene();
    },
    changeSubPageSize(pageSize) {
      this.tableSubPageSize = pageSize;
      this.tableSubPage = 1;
      this.getQueryGene();
    },
    theGetTreeData() {
      let that = this;
      let params = {};
      this.$http
        .get(this.$CONST.DQ_COMPONENT.DIR_AND_SET_LIST, params)
        .then(res => {
          if (res.data && res.data.success) {
            if (!res.data.data) {
            } else {
              that.treeData = res.data.data;
              that.treeDataBack = res.data.data;
              console.log("这是tree");
              console.log(that.treeData);
              // that.treeData.map(v => {
              //   v["title"] = v.dicName;
              //   if (v.children != null) {
              //     v.children.map(vv => {
              //       vv["title"] = vv.dicName;
              //       if (vv.children != null) {
              //         vv.children.map(vvv => {
              //           vvv["title"] = vvv.dicName;
              //         });
              //       }
              //     });
              //   }
              // });
            }
          }
        });
    },
    getCurrFiltersetAll(theSet) {
      this.currFiltersetAll = theSet;
    },

    // getCenterPointString(centerPoint) {
    //   console.log(centerPoint);
    //   this.filterSetCenterPoint = centerPoint;
    // },
    // getDataNameString(dataName) {
    //   console.log(dataName);
    //   this.filterSetDataName = dataName;
    // },
    confirmPopTip() {
      let that = this;
      this.customDataSet = [];
      this.popTipFlag = false;
      let theIndex;
      this.treeSelectedArr.map(v => {
        if (!v.children) {
          that.customDataSet.push({
            index: v.index,
            type: v.isDataset
          });
        }
      });
      this.getQueryGene();
      console.log(this.customDataSet);
    },
    cancelPopTip() {
      this.popTipFlag = false;
    },
    getCheckedNodes(arr, row) {
      this.treeSelectedArr = arr;
      console.log(this.treeSelectedArr);
    },
    choosePopAll() {
      let theTreeData = this.treeData;
      this.treeData = theTreeData.map(v => {
        return {
          ...v,
          checked: true
        };
      });
    },
    reversePopAll(arr) {
      let that = this;
      arr.map(v => {
        if (v.children != null) {
          v.checked = false;
          that.reversePopAll(v.children);
        } else {
          v.checked = false;
          return;
        }
      });
    }
  },

  created() {},
  mounted() {
    this.getAreaList();
    this.theGetTreeData();
  }
};
</script>

<style lang="less">
.dqMapWrapper {
  margin: 6px;
  .headerClass {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px;
    background-color: #fff;
    height: 48px;
    font-weight: normal;
    border-bottom: 0px;
  }
  .mapBarFirstSelect {
    margin-right: 3px;
    .ivu-select-item {
      // width: 6vw;
    }
  }
  .mapNav {
    height: 48px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    position: relative;
    padding: 0 10px;
    .mapBarSwitcher {
      position: absolute;
      right: 20px;
      color: @theme-primary;
      cursor: pointer;
    }
    .mapNavSub {
      display: flex;
      height: 32px;
      .mapBarFirst {
        align-self: center;
        padding: 0 5px;
      }
      .mapBarButtons /deep/ {
        .popContent {
          height: 310px;
        }
        .mapBarButtonSub {
          background-color: @theme-primary;
          color: white;
          margin-left: 10px;
        }
        .ivu-poptip-popper {
          width: 300px !important;
          .ivu-poptip-body {
            padding-right: 4px !important;
          }
        }
        .popContentButton /deep/ {
          float: right;
          padding-top: 8px;
          .popContentExtra {
            position: absolute;
            left: 10px;
            .popContentExtraAll {
              margin-right: 5px;
            }
          }
          .popCancelButton {
            border: 1px solid white !important;
          }
          .popContentButtonRight {
            margin-left: 5px;
          }
        }
      }
      .mapBarSecond {
        padding: 0 10px;
        display: flex;
        align-items: center;
        .mapSelector {
          align-self: center;
          margin-right: 3px;
          .mapSelectorImg_box {
            cursor: pointer;
            padding: 5px;
            width: 25px;
            height: 25px;
            border-radius: 5px;
            background: @theme-primary;
          }
          .seletorActive {
            background: @theme-info-hover;
          }
        }
      }
      .mapBarThird /deep/ {
        padding: 0 5px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ivu-input {
          height: 22px !important;
        }
        .ivu-icon {
          line-height: 21px;
        }
        .more {
          margin-right: 20px;
          color: @theme-primary;
          align-self: center;
          cursor: pointer;
        }
        .DataTime {
          padding-right: 0;
          align-self: center;
          float: left;
          width: 40vw;
          .ivu-poptip-content /deep/ {
            width: 284px;
          }
          .dataCateButton {
            background-color: @theme-primary;
            color: white;
            border-radius: 6px;
            height: 28px;
            margin-top: 1px;
          }
          .wordOfTime {
            margin-left: 5px;
            margin-top: 4px;
          }
          .dateCatePicker {
            margin-top: 4px;
          }
        }
        .slide-fade-enter-active {
          transition: all 0.6s ease;
        }
        .slide-fade-leave-active {
          transition: all 0.6s;
        }
        .slide-fade-enter,
        .slide-fade-leave-to {
          transform: translateX(-50px);
          opacity: 0;
        }
        .slide-fade2-enter-active {
          transition: all 0.8s ease;
        }
        .slide-fade2-enter {
          transform: translateX(50px);
          opacity: 0;
        }
      }
    }
  }
}
</style>
