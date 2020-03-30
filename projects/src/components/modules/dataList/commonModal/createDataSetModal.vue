<!-- 
  创建数据集弹窗
-->
<template>
  <models
    :modal="showModal"
    modalWidth="600"
    modalTitle="新建数据集"
    modalClass="convent-modal"
    :modalLoading="true"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleCreateFolder"
    :footerHide="false"
  >
    <Form :model="createForm" :label-width="85">
      <FormItem label="数据集名称">
        <Input v-model="createForm.name" />
      </FormItem>
      <div>
        <FormItem label="数据集类型">
          <Select v-model="createForm.dataSetType" @on-change="handleDataSetChange">
            <Option
              v-for="(item, index) in dataSetTypeList"
              :key="index"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据类型">
          <Select v-model="createForm.dataType">
            <Option
              v-for="(item, index) in dataTypeList"
              :key="index"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="样本类型" v-if="createForm.dataSetType == 'samplelibds' ">
          <div style="display: flex;">
            <Select style="width: 150px;" v-model="createForm.sampleType">
              <Option
                v-for="(item, index) in sampleTypeList"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
        </FormItem>
        <FormItem label="数据日期" v-if="createForm.dataSetType == 'gridds' || createForm.dataSetType == 'uavds'">
          <div style="display: flex;">
            <DatePicker v-model="createForm.dataTime" :type="dateType" placeholder="选择时间" style="width: 200px"></DatePicker>
            <Select style="width: 90px;margin-left: 20px;" @on-change="handleDateTypeChange" v-model="dateType">
              <Option
                v-for="(item, index) in dateTypeList"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
        </FormItem>
        <FormItem label="分辨率" v-if="createForm.dataSetType == 'gridds' || createForm.dataSetType == 'uavds'">
          <Select style="width: 100px;" v-model="createForm.dataResolution">
              <Option
                v-for="(item, index) in resolutionList"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="数据区域" v-if="createForm.dataSetType == 'gridds' || createForm.dataSetType == 'uavds'">
          <div style="display: flex;">
            <Select @on-change="getCities" :disabled="otherAdd" style="width: 80px;margin-right: 10px;" placeholder="省" v-model="createForm.province">
              <Option
                v-for="(item, index) in proList"
                :key="index"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
            <Select @on-change="getCountries" :disabled="otherAdd" style="width: 80px;margin-right: 10px;" placeholder="地级市州" v-model="createForm.city">
              <Option
                v-for="(item, index) in cityList"
                :key="index"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
            <Select :disabled="otherAdd" style="width: 80px;margin-right: 10px;" placeholder="区县旗" v-model="createForm.country">
              <Option
                v-for="(item, index) in countryList"
                :key="index"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
            <Input :disabled="otherAdd" style="width: 150px;" placeholder="详细地址" v-model="createForm.detailAddress" />
          </div>
          <div>
            <div style="margin-top: 6px;">
              <Checkbox v-model="otherAdd">其他</Checkbox>
              <Input :disabled="!otherAdd" style="width: 250px;" placeholder="详细地址" v-model="createForm.otherAddress" />
            </div>
          </div>
        </FormItem>
        <FormItem label="数据来源">
          <Input v-model="createForm.dataSource" />
        </FormItem>
      </div>
      <FormItem label="数据集描述">
        <Input v-model="createForm.desc" type="textarea" />
      </FormItem>
    </Form>
  </models>
</template>
<script>
import { mapGetters } from 'vuex'
import modalMixins from "@/components/modules/mixins/modalMixins.js";
import dateFormatters from '@/utils/dateFormatter.js'

export default {
  name: "createDataSetModal",
  mixins: [modalMixins],
  props: {
    parentDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dateType: 'date', // 时间选择器的类型
      createForm: {
        name: '',
        desc: '',
        dataSetType: 'flatfileds',
        dataType: '',
        dataSource: '',
        sampleType: '',
        dataTime: '',
        dataResolution: '',
        province: '',
        city: '',
        country: '',
        detailAddress: '',
        otherAddress: '',

      },
      dataSetTypeList: [], // 数据集类型
      dataTypeList: [], //数据类型
      dataTypeObj: {}, // 数据类型对象
      otherAdd: false, // 选择国外地址
      sampleTypeList: [
        { label: '飞机', value: 'aircraft' },
        { label: '舰船', value: 'vessel' },
        { label: '操场', value: 'playground' },
        { label: '电塔', value: 'pylon' },
        { label: '大棚', value: 'greenhouse' },
        { label: '其他', value: 'others' },
      ],
      dateTypeList: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
        { label: '日', value: 'date' },
      ],
      resolutionList: [
        { label: '0.3m', value: '0.3' },
        { label: '1m', value: '1' },
        { label: '10m', value: '10' },
      ],
      proList: [],
      cityList: [],
      countryList: [],
      areaParentCode: '', // 查询省市区的时候使用的上一级的code
    };
  },
  computed: {
    ...mapGetters('dataList', ['getBreadList']),
  },
  methods: {
    handleCreateFolder() {
      let { dirId = '', dirPath = '' } = this.parentDetail || {};
      let { province = '', city = '', country = '', detailAddress = '' } = this.createForm;
      let provinceRes = '', cityRes = '', countryRes = '';
      let areaAddress = this.otherAdd ? '_' + this.createForm.otherAddress // 其他地址使用下划线开头
      : (province || '') + '~' + (city || '') + '~' + (country || '') + '~' + (detailAddress || '');
      let dateResult = '';
      if(this.createForm.dataTime) {
        dateResult = this.dateType == 'year' ? dateFormatters('yyyy', this.createForm.dataTime) :
         this.dateType == 'month' ? dateFormatters('yyyy--MM', this.createForm.dataTime) :
          dateFormatters('yyyy-MM-dd', this.createForm.dataTime)
      }
      let params = {
        parentId: dirId,
        dictName: this.createForm.name,
        isDataset: '1',
        dirDesc: this.createForm.desc,
        dataSetType: this.createForm.dataSetType,
        sampleType: this.createForm.sampleType,
        dataArea: areaAddress, // 数据区域  省市区或者其他地址 用两种方式存储  拿出来解析的时候用同样的策略
        dataProvider: this.createForm.dataSource,
        dataResolution: this.createForm.dataResolution,
        dataDate: dateResult,
        userId: window.localStorage.getItem('userId'),
        // parentMes: this.parentDetail.parentMes || '', //父目录的绝对路劲
        parentId: this.parentDetail.dirId || '0',
      }
      this.$http.post(this.$CONST.DATA_LIST.ADD_FOLDER, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('创建成功!')
          this.$emit('handleCreateSuccess')
        }
        this.handleModalClose();
      })
    },
    handleDateTypeChange(type) {
      this.dateType = type;
    },
    getCities(val) {
      this.cityList = [];
      this.countryList = [];
      this.getAdministrativeRegion(val, '1')
    },
    getCountries(val) {
      this.countryList = [];
      this.getAdministrativeRegion(val, '2')
    },
    // 查询省市区
    getAdministrativeRegion(areaParentCode, status) {
      let _this = this
      this.$http
        .get(this.$CONST.DATA_LIST.AREA_LIST, {
          parentCode: areaParentCode || status
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              let data = res.data.data || []
              if (status == '0') {
                _this.proList = data;
              } else if (status == '1') {
                _this.cityList = data;
              } else {
                _this.countryList = data;
              }
            }
          }
        })
    },
     // 查询数据类型和数据集类型
    getDataTypeList() {
      this.$http
      .get(this.$CONST.DATA_LIST.QUERY_DATA_TYPE)
      .then(res => {
        if (res.data.success) {
          const { data = [] } = res.data || {};
          let dataSetTypeList = [];
          let dataTypeObj = {};
          data.forEach(i => {
            dataSetTypeList.push({ label: i.dataValue, value: i.dataKey });
            if(i.children) {
              dataTypeObj[i.dataKey] = i.children.map(v => {
                return { label: v.dataValue, value: v.dataKey };
              })
            }
          })
          this.dataSetTypeList = dataSetTypeList
          this.dataTypeObj = dataTypeObj
          this.dataTypeList = this.dataTypeObj[this.createForm.dataSetType] || []
          if(this.dataTypeList[0]) this.$set(this.createForm, 'dataType', this.dataTypeList[0].value)
        }
      })
    },
    // 选择数据集类型 带出数据类型
    handleDataSetChange(value) {
      this.dataTypeList = this.dataTypeObj[value] || []
      if(this.dataTypeList[0]){
        this.$set(this.createForm, 'dataType', this.dataTypeList[0].value)
      } else {
        this.$set(this.createForm, 'dataType', '')
      }
    }
  },
  mounted() {
    this.getAdministrativeRegion('0', '0');
    this.getDataTypeList();
  }
};
</script>
<style lang="less">
</style>