const proPrefix = window.DATA_MANAGE_CONFIG.proPrefix;
// const ww82Prefix = 'http://piecloud.piesat.cn/distribution/map'
const ww82Prefix = "http://192.168.1.78:8082"; // 王威的电脑
const ww84Prefix = "http://192.168.1.78:8084"; // 王威的电脑
const ww91Prefix = "http://192.168.1.78:8091"; // 王威的电脑
const fhPrefix = "http://192.168.1.114:8082"; // 奋浩的电脑
const xh91Prefix = "http://192.168.1.40:8091"; // 协辉端口91的电脑
const xh92Prefix = "http://192.168.1.40:8092"; // 协辉端口92的电脑
const qxh95Prefix = "http://192.168.1.58:8095"; // 秦旭辉端口92的电脑
const qxh95SubPrefix = "http://192.168.2.32:8095"; //秦旭辉另一个95
const qxh82SubPrefix = "http://192.168.2.32:8082"; //秦旭辉另一个92
const fh82Prefix = "http://192.168.1.114:8082"; // 奋浩的电脑
const fh95Prefix = "http://192.168.1.114:8095"; // 奋浩的电脑
const xhPrefix = "http://192.168.1.40:8091"; // 协辉的电脑
const qxh87Prefix = "http://192.168.1.58:8087"; // 旭辉的电脑
const qxh82Prefix = "http://192.168.1.58:8082"; // 旭辉的电脑

const flag = process.env.NODE_ENV === "production";

const csPrefix = "http://192.168.2.32:20001"; // 测试环境

//
// 前缀统一换为大写  单词间用下划线分割
//
export default {
  LOGIN: {
    LOGIN_IN: "http://cloud.piesat.cn/dev/account/api/auth/login", // loginin
    LOGIN_OUT: (flag ? proPrefix : ww82Prefix) + "/api/pie-cloud/geo-web/logOut" // loginOut
  },
  DATA_LIST: {
    // 数据目录
    DIRLIST: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/dataDirectory/sub', // 获取目录列表
    QUERY_DATA_BY_FIELD: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/es/queryDataByField', // 搜索目录数据
		ADD_FOLDER: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataDirectory/add', // 创建目录
		GRID_QUERY_INFO: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataInfo/gridQueryInfo', // grid data detail
		COPY: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/dataDirectory/copy', // 复制目录
    MOVE: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/dataDirectory/move', // 移动目录
    COPY_DATA: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/dataIndex/copyData', // 复制数据
		MOVE_DATA: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/dataIndex/moveData', // 移动数据
		DELETE: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataDirectory/delDir', // 删除目录
		SET_DIR: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataDirectory/setDir', // 目录公开私有
		DATA_SET_DETAIL: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataDirectory/dataSetDetails', // 数据集详情
		UPDATE_DATA_DETAIL: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataDirectory/updateDir', // 数据集详情编辑
		FILE_LIST: (flag ? proPrefix : csPrefix) + '/api/v1/receive/filearchive/getFileList', // ftp或平台内部目录
		FTP_CONNECT: (flag ? proPrefix : csPrefix) + '/api/v1/receive/filearchive/ftpConnection', // ftp登陆
    // DATA_PUBLISH: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataIndex/dataPublish', // 数据发布
    DATA_PUBLISH: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/publish/data', // 数据发布
		DATA_TYPE_LIST: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/model/getlist', // 数据类型
		DATA_PUBLIC_TRIGGLE: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataIndex/setDataIsPublic', // 数据公私设置
		DATA_ARCHIVE_ADD: (flag ? proPrefix : csPrefix) + '/api/v1/job/archive/add', // 数据归档 创建上传任务
		DELETE_DATA: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataIndex/delData', // 删除数据
		UPDATE_DATA: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataIndex/updateData', // 编辑数据
    AREA_LIST: (flag ? proPrefix : csPrefix) + '/api/v1/geographic/administrative/getCode', // 省市区查询
    GET_AREANAME_BY_CODE: (flag ? proPrefix : csPrefix) + '/api/v1/geographic/administrative/getNameByCode', // 根据code查询省市区名字
    GET_PLAT_ROOT_DIR: (flag ? proPrefix : csPrefix) + '/api/v1/receive/filearchive/getPlatRootDir', // 平台扫描更目录查询
    VECTOR_PREVIEW: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataInfo/vectorpreview', // 栅格数据预览
    VECTOR_QUERY_INFO: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataInfo/vectorQueryInfo', // 栅格数据详情
    VECTOR_CHART: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataInfo/vectorchart', // 栅格数据图表
    ONLINE_PREVIEW: (flag ? proPrefix : csPrefix) + '/api/v1/data/online/onlinePreview', // 普通文件预览
    DATA_SET_PREVIEW: (flag ? proPrefix : csPrefix) + '/api/v1/catalog/dataDirectory/dataSetPreview', // 数据集预览
    QUERY_DATA_TYPE: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/dataDirectory/queryDataType', // 数据集类型和数据类型联动
    QUERY_UAV_DATA_INFO: (flag ? proPrefix : qxh82Prefix) + '/api/v1/catalog/dataInfo/queryUavDataInfo', // 无人机预览
    SET_DIR_STICK: (flag ? proPrefix : fh82Prefix) + '/api/v1/catalog/dataDirectory/setDirStick', // 置顶
  },
  UPLOAD: {
    UPLOAD_FILE:
      (flag ? proPrefix : csPrefix) +
      "/api/v1/receive/filearchive/uploadFile", // 上传文件
    FINISH_UPLOAD:
      (flag ? proPrefix : csPrefix) +
      "/api/v1/receive/filearchive/finishUpload", // 上传文件夹之后的回掉
    MERGE_CHUNCK:
      (flag ? proPrefix : csPrefix) + "/api/v1/receive/filearchive/mergeChunks" // 合并上传
  },
  DOWNLOAD: {
    DOWNLOADd_DATA:
      (flag ? proPrefix : csPrefix) + "/api/v1/data/dataLoad/download/" // 数据下载
  },
  TAST_MANAGE: {
    MAIN_LIST: (flag ? proPrefix : csPrefix) + "/api/v1/job/main/list", // 表格展示
    SUB_LIST: (flag ? proPrefix : csPrefix) + "/api/v1/job/sub/list", // 子表格展示
    SSE_DATA: (flag ? proPrefix : csPrefix) + "/api/v1/message/task/real/info" // SSE动态接口
  },
  DQ_COMPONENT: {
    GET_AREA_CODE:
      (flag ? proPrefix : qxh95Prefix) +
      "/api/v1/geographic/administrative/getList", // 省市区三级联动接口
    QUERY_GENE:
      (flag ? proPrefix : qxh95Prefix) +
      "/api/v1/geographic/datageom/queryGene", // 查询符合条件的数据接口
    DIR_AND_SET_LIST:
      (flag ? proPrefix : qxh82Prefix) +
      "/api/v1/catalog/dataDirectory/dirandsetlist", // 获取数据目录内tree的数据
    DQ_DOWNLOAD:
      (flag ? proPrefix : qxh87Prefix) + "/api/v1/data/dataLoad/download/", // 获取数据目录内tree的数据
    QUERY_DATA_INFO:
      (flag ? proPrefix : qxh82SubPrefix) + "/api/v1/catalog/dataInfo/queryDataInfo" // 获取详情信息接口
  }
};
