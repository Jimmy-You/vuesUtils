import isDataSet from "@/assets/images/icon/sysPass.png";
import noDataSet from "@/assets/images/icon/sysReject.png";
import zhiding from "@/assets/images/icon/zhiding.png";
import folder from "@/assets/images/icon/folder.png";
import dataSet from "@/assets/images/icon/dataSet.png";
/**
 * 生成数据目录列表表格的方法
 */
export default function() {
  let result = [];
  let _this = this;
  result.push({
    type: "selection",
    width: 60,
    align: "center"
  });
  result.push({
    title: "名称",
    key: "data_name",
    align: "left",
    tooltip: true,
    width: 400,
    render: (h, params) => {
      let chiFlag = params.row.dirId; // 是否是目录或者数据集
      return h(
        "div",
        {
          class: "data_name",
          style: {}
        },
        [
          h(
            "div",
            {
              class: "data_name_title",
              style: {
                cursor: params.row.dirId ? "pointer" : "initial"
              },
              on: {
                click: () => {}
              }
            },
            [
              h("span", {}, params.row.data_name),
              h("i", {
                class: "iconfont icon-zhiding",
                style: {
                  display: params.row.isStick > 0 ? "initial" : "none"
                }
              })
            ]
          ),
          h(
            "div",
            {
              class: "ops_items"
            },
            [
              h("i", {
                class: "iconfont icon-ding primary",
                style: {
                  display: chiFlag ? "initial" : "none"
                },
                attrs: {
                  title: "ding"
                }
              }),
              h("i", {
                class: "iconfont icon-review2 primary",
                style: {
                  display:
                    params.row.dirId && params.row.dataset <= 0
                      ? "none"
                      : "initial", // 数据集和数据有预览
                  fontSize: "18px"
                },
                attrs: {
                  title: "预览"
                },
                on: {
                  click: () => {
                    if (params.row.uuid) {
                      // 数据的预览
                      const { href } = this.$router.resolve({
                        name: `dataPreview`,
                        query: {
                          id: params.row.uuid,
                          name: params.row.dataName,
                          dataType: params.row.dataType
                        }
                      });
                      window.open(href, "_blank");
                    } else {
                      // 数据集的预览  只有栅格数据和无人机影像数据集支持预览  其余的不应该展示预览图标
                      const { href } = this.$router.resolve({
                        name: `dataSetPreview`,
                        query: {
                          id: params.row.dirId,
                          name: params.row.dictName
                        }
                      });
                      window.open(href, "_blank");
                    }
                  }
                }
              }),
              h("i", {
                class: "iconfont icon-xiangqing primary",
                style: {
                  display:
                    chiFlag && params.row.dataset > 0 ? "initial" : "none"
                },
                attrs: {
                  title: "详情"
                },
                on: {
                  click: () => {
                    // 查看数据集详情
                    this.currentClickItem = params.row;
                    this.handleModal("dataDetailModal");
                  }
                }
              }),
              h("i", {
                class: "iconfont icon-download primary",
                attrs: {
                  title: "下载"
                },
                on: {
                  click: () => {
                    this.currentClickItem = params.row;
                    this.handleModal("downloadModal");
                  }
                }
              }),
              h("i", {
                class: "iconfont icon-gouwuche primary",
                attrs: {
                  title: "购物车"
                },
                on: {
                  click: () => {
                    this.currentClickItem = params.row;
                    this.handleModal("moveToModal");
                  }
                }
              })
            ]
          )
        ]
      );
    }
  });
  result.push({
    title: "介质类型",
    key: "medium",
    align: "center",
    tooltip: true,
    minWidth: 95,
    render: (h, params) => {
      return h("div", {}, params.row.medium || "--");
    }
  });
  result.push({
    title: "文件数量",
    key: "dataNum",
    align: "center",
    tooltip: true,
    minWidth: 95,
    render: (h, params) => {
      return h("div", {}, params.row.dataNum || "--");
    }
  });
  result.push({
    title: "文件大小",
    key: "dataSize",
    align: "center",
    tooltip: true,
    minWidth: 95,
    render: (h, params) => {
      return h("div", {}, params.row.dataSize || "--");
    }
  });

  result.push({
    title: "修改时间",
    key: "updateTime",
    align: "center",
    tooltip: true,
    minWidth: 95,
    render: (h, params) => {
      return h("div", {}, params.row.updateTime || "--");
    }
  });
  
  return result;
}
