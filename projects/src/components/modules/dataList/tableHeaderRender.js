import isDataSet from '@/assets/images/icon/sysPass.png'
import noDataSet from '@/assets/images/icon/sysReject.png'
import zhiding from '@/assets/images/icon/zhiding.png'
import folder from '@/assets/images/icon/folder.png'
import gridds from '@/assets/images/icon/gridType.png'
import uavds from '@/assets/images/icon/planeType.png'
import samplelibds from '@/assets/images/icon/sampleType.png'
import vectords from '@/assets/images/icon/vectorType.png'
import flatfileds from '@/assets/images/icon/fileType.png'
import dataSet from '@/assets/images/icon/dataSet.png'
/**
 * 生成数据目录列表表格的方法
 */
export default function() {
  let result = [];
  let _this = this;
  result.push({
    type: 'selection',
    width: 60,
    align: 'center'
  })
  result.push({
      title: "名称",
      key: "name",
      align: "left",
      tooltip: true,
      // width: 600,
      render: (h, params) => {
        let chiFlag = params.row.dirId; // 是否是目录或者数据集
        let nameTag = chiFlag ? 'u' : 'div'
        let dataType = params.row.isDataset > 0 ? params.row.dataSetType : '';
        switch(dataType) {
          case 'gridds':
            dataType = gridds;
            break;
          case 'uavds':
            dataType = uavds;
            break;
          case 'samplelibds':
            dataType = samplelibds;
            break;
          case 'vectords':
            dataType = vectords;
            break;
          case 'flatfileds':
            dataType = flatfileds;
            break;
          default:
            dataType = dataSet
        }
        return h("div",{
          class:'data_name',
          style: {

          }
        }, [
            h(
              nameTag,
            {
              attrs: {
                title: params.row.dirDesc
              },
              class: "data_name_title",
              style: {
                cursor: params.row.dirId ? 'pointer' : 'initial',
              },
              on: {
                click: () => {
                  if(params.row.dirId) {
                    this.handleListGoDown(params.row); // 目录递进
                  }
                }
              }
            },
            [
              h(
                'img',
                {
                  attrs: {
                    src: params.row.isDataset <= 0 ? folder : dataType, 
                  },
                  style: {
                    display: params.row.dirId ? 'initial' : 'none',
                    height: '18px',
                    width: 'auto',
                    'margin-right': '10px',
                  },
                }
              ),
              h('span',{},params.row.dictName || params.row.dataName),
              h(
                'img',
                {
                  attrs: {
                    src: zhiding
                  },
                  style: {
                    display: params.row.stickTime != '2000-01-01 00:00:00' ? 'initial' : 'none',
                    height: '20px',
                    width: 'auto',
                    'margin-left': '10px',
                  },
                }
              )
            ]
          ),
          h(
            "div",
            {
              class: "ops_items",
            },
            [
              // h(
              //   'i',
              //   {
              //     class: 'iconfont icon-ding primary',
              //     style: {
              //       display : chiFlag ? 'initial' : 'none'
              //     },
              //     attrs: {
              //       title: 'ding'
              //     }
              //   }
              // ),
              h(
                'i',
                {
                  class: 'iconfont icon-review2 primary',
                  style: {
                    display : (params.row.dirId && params.row.isDataset <= 0) ? 'none' : 'initial', // 数据集和数据有预览
                    fontSize: '18px'
                  },
                  attrs: {
                    title: '预览'
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      if(params.row.uuid) {
                        // 数据的预览
                        let currentDir = _this.getBreadList[this.getBreadList.length - 1] || {};
                        if(currentDir.dataSetType == 'flatfileds') {
                          // 普通文件的预览
                          let dataSuffix = params.row.dataName ? params.row.dataName.slice(params.row.dataName.lastIndexOf('.') + 1) : '';
                          if(['mp4'].includes(dataSuffix)) { // 视频的预览
                            this.handleModal('videoPlayerModal')
                          }
                          if(['jpg', 'png', 'jpeg', 'tif', 'gif'].includes(dataSuffix)) { // 图片的预览
                            this.handleModal('imgPreviewModal')
                          }
                          if(['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(dataSuffix)) { // 文本预览
                            window.open(this.$CONST.DATA_LIST.ONLINE_PREVIEW + '/' + params.row.uuid, "_blank");
                          }
                          return;
                        }
                        // if((currentDir.dataSetType == 'gridds' || currentDir.dataSetType == 'vectords') && params.row.isPublish <= 0) {
                        //   this.$Message.error('请先进行数据发布!')
                        //   return;
                        // }
                        // if((currentDir.dataSetType == 'gridds' || currentDir.dataSetType == 'vectords') && params.row.isPublish >= 0 && !params.row.publishUrl) {
                        //   this.$Message.error('数据发布未成功 无法预览!')
                        //   return;
                        // }
                        let url = ''
                        if(currentDir.dataSetType == 'gridds' || currentDir.dataSetType == 'vectords') url = params.row.publishUrl; // 矢量栅格
                        const { href } = this.$router.resolve({
                          name: `dataPreview`,
                          query: {
                            id: params.row.uuid,
                            name: params.row.dataName,
                            dataType: currentDir.dataSetType,
                            url
                          }
                        });
                        window.open(href, "_blank");
                      } else {
                        // 数据集的预览  只有栅格数据和无人机影像数据集支持预览  其余的不应该展示预览图标
                        const { href } = this.$router.resolve({
                          name: `dataSetPreview`,
                          query: {
                            dirId: params.row.dirId,
                            name: params.row.dictName,
                            dataSetType: params.row.dataSetType
                          }
                        });
                        window.open(href, "_blank");
                      }
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-xiangqing primary',
                  style: {
                    display : chiFlag && params.row.isDataset > 0  ? 'initial' : 'none'
                  },
                  attrs: {
                    title: '详情'
                  },
                  on: {
                    click: () => {
                      // 查看数据集详情
                      this.currentClickItem = params.row
                      this.handleModal('dataDetailModal')
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-publish primary',
                  style: {
                    display : !chiFlag && params.row.isPublish <= 0 ? 'initial' : 'none'
                  },
                  attrs: {
                    title: '发布'
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      this.handleModal('publishModal')
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-download primary',
                  attrs: {
                    title: '下载'
                  },
                  style: {
                    display : !chiFlag ? 'initial' : 'none'
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      this.handleModal('downloadModal')
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-rename primary',
                  style: {
                    // display : !flag ? 'initial' : 'none'
                  },
                  attrs: {
                    title: '编辑'
                  },
                  on: {
                    click: () => {
                      // TODO 这里可能是数据集的编辑 或者是数据的编辑
                      this.currentClickItem = params.row
                      if(params.row.uuid) {
                        // 数据的编辑
                        this.handleModal('renameModal')
                      } else {
                        // 数据集的编辑
                        this.handleModal('dataDetailModifyModal')
                      }
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-move primary',
                  attrs: {
                    title: '移动到'
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      this.handleModal('moveToModal')
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-copy primary',
                  attrs: {
                    title: '复制'
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      this.handleModal('copyToModal')
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-delete primary',
                  attrs: {
                    title: '删除'
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      this.handleModal('deleteModal')
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-top primary',
                  style: {
                    display : params.row.stickTime != '2000-01-01 00:00:00' ? 'none' : 'initial'
                  },
                  attrs: {
                    title: '置顶',
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      this.handleDirStick();
                    }
                  }
                }
              ),
              h(
                'i',
                {
                  class: 'iconfont icon-bottom primary',
                  style: {
                    display : params.row.stickTime != '2000-01-01 00:00:00' ? 'initial' : 'none'
                  },
                  attrs: {
                    title: '取消置顶',
                  },
                  on: {
                    click: () => {
                      this.currentClickItem = params.row
                      this.handleDirStick();
                    }
                  }
                }
              ),
            ]
          ),
        ]);
      }
    })
    result.push({
      title: "公开/私有",
      key: "isPublic",
      align: "center",
      tooltip: true,
      maxWidth: 100,
      render: (h, params, index) => {
        return h(
          'i-switch',
          {
            props: {
              size: 'large',
              value: params.row.isPublic > 0,
            },
            on: {
              'on-change': () => {
                // 修改并且update 状态
                this.currentClickItem = params.row
                this.handleDirPublicSet(params.row.isPublic > 0 ? 0 : 1);
              }
            }
          },
          [
            h(
              'span',
              {
                slot: 'open'
              },
              '公开'
            ),
            h(
              'span',
              {
                  slot: 'close'
              },
              '私有'
            )
          ]
        )
      }
    })
    if(!this.getShowSearchResult) {
      // 正常的显示目录
      if(this.getCurrentTableData[0] && this.getCurrentTableData[0].dirId) {
        // result.push({
        //   title: "是否数据集",
        //   key: "isDataSet",
        //   align: "center",
        //   tooltip: true,
        //   maxWidth: 115,
        //   render: (h, params) => {
        //     return h("img",{
        //       style: {
        //         width: '20px',
        //         height: '20px'
        //       },
        //       attrs: {
        //         src: params.row.isDataset > 0 ?isDataSet : noDataSet,
        //       }
        //     });
        //   }
        // })
        result.push({
          title: "数据类型",
          key: "dataSetType",
          align: "center",
          tooltip: true,
          maxWidth: 125,
          render: (h, params) => {
            const { dataSetType = '' } = params.row;
  
            return h("div",{
            }, _this.$CONST.DATA_SET_TYPE[dataSetType] || '--');
          }
        })
        result.push({
          title: "数据个数",
          key: "dataNum",
          align: "center",
          tooltip: true,
          maxWidth: 125,
          render: (h, params) => {
            return h('div', {}, params.row.dataNum || '--')
          }
        })
      } else {
        result.push({
          title: "数据类型",
          key: "dataType",
          align: "center",
          maxWidth: 125,
          tooltip: true,
        })
      }
      
      if(this.getCurrentTableData[0] && !this.getCurrentTableData[0].dirId) {
        result.push({
          title: "是否空间数据",
          key: "isSpaceData",
          align: "center",
          tooltip: true,
          maxWidth: 135,
          render: (h, params) => {
            return h("img",{
              style: {
                width: '20px',
                height: '20px'
              },
              attrs: {
                src: params.row.isGeo > 0 ?isDataSet : noDataSet,
              }
            });
          }
        })
        result.push({
          title: "发布状态",
          key: "isPublish",
          align: "center",
          tooltip: true,
          maxWidth: 95,
          render: (h, params) => {
            return h("img",{
              style: {
                width: '20px',
                height: '20px'
              },
              attrs: {
                src: params.row.isPublish > 0 ?isDataSet : noDataSet,
              }
            });
          }
        })
      }
      result.push({
        title: "大小",
        key: "dirSize",
        align: "center",
        tooltip: true,
        maxWidth: 115,
        render: (h, params) => {
          return h('div', {}, params.row.dirSize || params.row.dataSize || '--')
        }
      })
    } else {
      // 显示搜索结果
      result.push({
        title: "类型",
        key: "type",
        align: "center",
        tooltip: true,
        maxWidth: 125,
        render: (h, params) => {
          return h('div', {}, params.row.uuid ? '数据' : '目录')
        }
      })
      result.push({
        title: "路径",
        key: "path",
        align: "center",
        tooltip: true,
        maxWidth: 195,
        render: (h, params) => {
          return h('div', {}, params.row.parentMes || '--')
        }
      })
    }
    
    result.push({
      title: "修改时间",
      key: "updateTime",
      align: "center",
      tooltip: true,
      minWidth: 95,
      maxWidth: 175,
      render: (h, params) => {
        return h('div', {}, params.row.updateTime || '--')
      }
    })
    return result;
}