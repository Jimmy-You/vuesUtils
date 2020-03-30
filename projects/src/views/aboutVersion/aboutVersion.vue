<template>
  <div class="aboutVersion">
    <div class="aboutBox">
      <CRow>
        <CCol sm="12" md="24">
          <CCard border-color="secondary">
            <CCardHeader>公司介绍</CCardHeader>
            <CCardBody>
              <p>
                航天宏图是一家专业从事卫星（遥感卫星、导航卫星）技术研究与应用和大气海洋信息化服务的国家高新技术企业。
                公司成立于2008年，依托中国航天的雄厚优势，以国产卫星专业服务与行业应用为使命，聚焦遥感、导航等核心技术，
                自主研发PIE（Pixel Information Expert）系列产品，为行业用户提供空间信息应用整体解决方案。
                公司总部坐落于北京，现有员工1000余人，其中技术人员占比80%以上。
                拥有国家级专家头衔、高级职称、博士硕士学位组成的研发团队，技术力量雄厚。
                自主研发的PIE软件是中国政府采购名录中遥感类软件产品，在大气海洋、水利环保、减灾应急、
                国土测绘等10余个行业得到广泛应用。
              </p>
              <!-- <div
                style="width:60%;height:350px;border:#ccc solid 1px;margin-top:15px;"
                id="dituContent"
              ></div> -->
              <div style="width:764px;height:350px;margin-top:15px;">
                <img src="@/assets/images/mapPic.png" alt width="100%" height="100%" />
              </div>
              <h5 style="margin-top: 15px;">当前版本</h5>
              <p style="margin-top:6px;">V6.0.1</p>
              <h5 style="margin-top: 15px;">联系我们</h5>
              <p style="margin-top:6px;">400-890-0662</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>
<script>
import { position } from "./icon";
export default {
  name: "aboutVersion",
  data() {
    return {
      markerArr: [
        {
          title: "北京航天宏图信息技术股份有限公司",
          content: "北京航天宏图信息技术股份有限公司",
          point: "116.241875|39.9598",
          isOpen: 0,
          icon: { w: 23, h: 25, l: 46, t: 21, x: 9, lb: 12 }
        }
      ]
    };
  },
  components: {},
  computed: {
  },
  methods: {
    //创建和初始化地图函数：
    initMap() {
      this.createMap(); //创建地图
      this.setMapEvent(); //设置地图事件
      this.addMapControl(); //向地图添加控件
      this.addMarker(); //向地图中添加marker
    },

    //创建地图函数：
    createMap() {
      var map = new BMap.Map("dituContent"); //在百度地图容器中创建一个地图
      var point = new BMap.Point(116.242571, 39.95933); //定义一个中心点坐标
      map.centerAndZoom(point, 18); //设定地图的中心点和坐标并将地图显示在地图容器中
      window.map = map; //将map变量存储在全局
    },

    //地图事件设置函数：
    setMapEvent() {
      map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
      map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
      map.enableKeyboard(); //启用键盘上下左右键移动地图
    },

    //地图控件添加函数：
    addMapControl() {
      //向地图中添加缩放控件
      var ctrl_nav = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE
      });
      map.addControl(ctrl_nav);
      //向地图中添加缩略图控件
      var ctrl_ove = new BMap.OverviewMapControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen: 1
      });
      map.addControl(ctrl_ove);
      //向地图中添加比例尺控件
      var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
      map.addControl(ctrl_sca);
    },

    //创建marker
    addMarker() {
      for (var i = 0; i < this.markerArr.length; i++) {
        var json = this.markerArr[i];
        var p0 = json.point.split("|")[0];
        var p1 = json.point.split("|")[1];
        var point = new BMap.Point(p0, p1);
        var iconImg = this.createIcon(json.icon);
        var marker = new BMap.Marker(point, { icon: iconImg });
        var iw = this.createInfoWindow(i);
        var label = new BMap.Label(json.title, {
          offset: new BMap.Size(json.icon.lb - json.icon.x + 10, -20)
        });
        marker.setLabel(label);
        map.addOverlay(marker);
        label.setStyle({
          borderColor: "#808080",
          color: "#333",
          cursor: "pointer"
        });
        (() => {
          var index = i;
          var _iw = this.createInfoWindow(i);
          var _marker = marker;
          _marker.addEventListener("click", () => {
            this.openInfoWindow(_iw);
          });
          _iw.addEventListener("open", () => {
            _marker.getLabel().hide();
          });
          _iw.addEventListener("close", () => {
            _marker.getLabel().show();
          });
          label.addEventListener("click", () => {
            _marker.openInfoWindow(_iw);
          });
          if (json.isOpen) {
            label.hide();
            _marker.openInfoWindow(_iw);
          }
        })();
      }
    },
    //创建InfoWindow
    createInfoWindow(i) {
      var json = this.markerArr[i];
      var iw = new BMap.InfoWindow(
        "<b class='iw_poi_title' title='" +
          json.title +
          "'>" +
          json.title +
          "</b><div class='iw_poi_content'>" +
          json.content +
          "</div>"
      );
      return iw;
    },
    //创建一个Icon
    createIcon(json) {
      var icon = new BMap.Icon(position, new BMap.Size(json.w, json.h), {
        imageOffset: new BMap.Size(-json.l, -json.t),
        infoWindowOffset: new BMap.Size(json.lb + 5, 1),
        offset: new BMap.Size(json.x, json.h)
      });
      return icon;
    }
  },
  beforeCreate() {},
  created() {
    this.$store.dispatch("aboutVersion/updateData");
  },
  beforeMount() {},
  mounted() {
    // this.initMap();
  },
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {}
};
</script>
<style lang="less">
.aboutVersion {
  height: 100%;
  padding: 16px 30px 0;
  .aboutBox {
    background: #fff;
    padding: 20px;
    p {
      line-height: 30px;
      font-size: 16px;
      text-indent: 2em;
    }
    h5 {
      color: #535353;
      font-size: 14px;
      font-weight: bold;
    }
    .border-secondary {
      border: none !important;
    }
  }
}
</style>