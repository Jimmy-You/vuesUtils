<!-- 
  数据集详情修改
-->
<template>
  <models
    :modal="showModal"
    modalWidth="600"
    modalTitle="详情修改"
    modalClass="convent-modal"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleModalOk"
    :footerHide="false"
    :scrollHide="dataDetail.isDataset <= 0"
  >
    <Form :model="createForm" :label-width="85">
      <FormItem label="目录名称">
        <Input v-model="createForm.name" />
      </FormItem>
      <template v-if="dataDetail.isDataset > 0">
        <FormItem label="数据集类型">
          <div>{{getDataTypeName || '--'}}</div> 
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
            <Select style="width: 150px;margin-left: 20px;">
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
            <DatePicker v-model="createForm.createTime" :type="dateType" placeholder="选择时间" style="width: 200px"></DatePicker>
            <Select style="width: 90px;margin-left: 20px;" @on-change="handleDateTypeChange" v-model="currentDateType">
              <Option
                v-for="(item, index) in dateTypeList"
                :key="index"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
        </FormItem>
        <FormItem label="分辨率" v-if="createForm.dataSetType == 'gridds' || createForm.dataSetType == 'uavds'">
          <Select style="width: 100px;" v-model="createForm.fbl">
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
            <Input v-model="createForm.detailAddress" :disabled="otherAdd" style="width: 150px;" placeholder="详细地址" />
            
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
      </template>
      
      <FormItem label="目录描述">
        <Input v-model="createForm.desc" type="textarea" />
      </FormItem>
    </Form>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
export default {
  name: "dataDetailModifyModal",
  mixins: [modalMixins],
  props: {
    dataDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let dataTypeList = Object.keys(this.$CONST.DATA_SET_TYPE).map((item) => {
      return {
        label: this.$CONST.DATA_SET_TYPE[item],
        value: item
      }
    })
    // 解析地址开始
    let dataArea = this.dataDetail.dataArea || '';
    let province = '', city = '', country = '', detailAddress = '', otherAddress = '';
    if(dataArea.indexOf('_') == 0) {
      // 国外地址
      otherAddress = dataArea.slice(1)
    } else {
      // 国内省市区
      let dataAreaList = dataArea.split('~')
      province = dataAreaList[0] || ''
      city = dataAreaList[1] || ''
      country = dataAreaList[2] || ''
      detailAddress = dataAreaList[3] || ''
    }
    // 解析地址结束
    // 解析时间开始
    let currentDate = this.dataDetail.dataDate ? new Date(this.dataDetail.dataDate) : ''
    let currentDateType = 'date'
    if(this.dataDetail.dataDate) {
      const dateLength = this.dataDetail.dataDate.length;
      currentDateType = dateLength == '4' ? 'year' : dateLength == '7' ? 'month' : 'date'
    }
    // 解析时间结束
    return {
      dateType: 'date', // 时间选择器的类型
      createForm: {
        name: this.dataDetail.dictName,
        desc: this.dataDetail.dirDesc,
        dataSource: this.dataDetail.dataProvider,
        sampleType: this.dataDetail.sampleType,
        createTime: currentDate,
        fbl: this.dataDetail.dataResolution,
        province: Number(province),
        city: Number(city),
        country: Number(country),
        detailAddress,
        otherAddress,
        dataSetType: this.dataDetail.dataSetType
      },
      dataTypeList,
      currentDateType,
      otherAdd: false, // 选择国外地址
      sampleTypeList: [
        { label: '飞机', value: 'airplane' },
        { label: '大棚', value: 'dapeng' },
        { label: '操场', value: 'caochang' },
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
      countryList: []
    };
  },
  computed: {
    getDataTypeName() {
      return this.$CONST.DATA_SET_TYPE[this.dataDetail.dataSetType] || ''
    }
  },
  methods: {
    // 确认编辑
    handleModalOk() {
      let { province = '', city = '', country = '', detailAddress = '' } = this.createForm;
      let areaAddress = this.otherAdd ? '_' + this.createForm.otherAddress // 其他地址使用下划线开头
      : (province || '') + '~' + (city || '') + '~' + (country || '') + '~' + (detailAddress || '');
      let params = {
        userId: window.localStorage.getItem('userId'),
        isDataset: this.dataDetail.isDataset,
        dictName: this.createForm.name,
        dirDesc: this.createForm.desc,
        dataSetType: this.createForm.dataSetType,
        dataProvider: this.createForm.dataSource,
        sampleType: this.createForm.sampleType,
        dataResolution: this.createForm.fbl,
        dataArea: areaAddress,
        dataDate: this.createForm.createTime,
        dirId: this.dataDetail.dirId
      }
      this.$http.post(this.$CONST.DATA_LIST.UPDATE_DATA_DETAIL, params).then((res) => {
        if(res.data && res.data.success) {
          this.$Message.success('修改成功!')
          this.$store.dispatch('dataList/updateRefreshfTable')
        }
        this.handleModalClose();
      })
    },
    // 日期类型调整
    handleDateTypeChange(type) {
      this.dateType = type;
    },
    getCities(val) {
      this.cityList = [];
      this.countryList = [];
      this.$set(this.createForm, 'city', '')
      this.$set(this.createForm, 'country', '')
      this.getAdministrativeRegion(val, '1')
    },
    getCountries(val) {
      this.countryList = [];
      this.$set(this.createForm, 'country', '')
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
    // 获取数据展示列表
    getDefaullAreaShow() {
      this.getAdministrativeRegion('0', '0') // 获取省
      if(this.createForm.province) {
        this.getAdministrativeRegion(this.createForm.province, '1')
      }
      if(this.createForm.city) {
        this.getAdministrativeRegion(this.createForm.city, '2')
      }
    }
  },
  mounted() {
    this.getDefaullAreaShow();
  }
};
</script>
<style lang="less">
</style>