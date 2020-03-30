import isDataSet from "@/assets/images/icon/sysPass.png";
import noDataSet from "@/assets/images/icon/sysReject.png";
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
              // h("i", {
              //   class: "iconfont icon-download primary",
              //   attrs: {
              //     title: "下载"
              //   },
              //   on: {
              //     click: () => {
              //       this.currentClickItem = params.row;
              //       this.handleModal("downloadModal");
              //     }
              //   }
              // }),
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
    title: "数据类型",
    key: "model_id",
    align: "center",
    tooltip: true,
    minWidth: 95
  });
  result.push({
    title: "公开/私有",
    key: "isPublic",
    align: "center",
    tooltip: true,
    render: (h, params, index) => {
      return h(
        "i-switch",
        {
          props: {
            size: "large",
            value: params.row.is_public > 0
          },
          on: {
            click: () => {
              // 修改并且update 状态
              this.handleDirPublicSet(params.row.is_public > 0 ? 0 : 1);
            }
          }
        },
        [
          h(
            "span",
            {
              slot: "open"
            },
            "公开"
          ),
          h(
            "span",
            {
              slot: "close"
            },
            "私有"
          )
        ]
      );
    }
  });
  result.push({
    title: "是否空间数据",
    key: "is_geo",
    align: "center",
    tooltip: true,
    minWidth: 65,
    render: (h, params) => {
      return h("img", {
        style: {
          width: "20px",
          height: "20px"
        },
        attrs: {
          src: params.row.is_geo > 0 ? isDataSet : noDataSet
        }
      });
    }
  });
  result.push({
    title: "发布状态",
    key: "is_publish",
    align: "center",
    tooltip: true,
    render: (h, params) => {
      return h("img", {
        style: {
          width: "20px",
          height: "20px"
        },
        attrs: {
          src: params.row.is_publish > 0 ? isDataSet : noDataSet
        }
      });
    }
  });
  result.push({
    title: "大小",
    key: "data_size",
    align: "center",
    tooltip: true,
    minWidth: 95
  });
  result.push({
    title: "修改时间",
    key: "create_time",
    align: "center",
    tooltip: true,
    minWidth: 95
  });
  return result;
}
