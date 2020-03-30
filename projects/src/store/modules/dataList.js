export default {
  namespaced:true,
  state: {
      currentSelect: [], // 当前选中的操作项
      currentTableData: [], // 当前目录的列表数据
      searchResult: [], // 目录内的搜索结果
      serachBreadList: [], // 搜索结果的面包屑
      showSearchResult: false,
      breadList: [], // 目录面包屑
      oldPageNums: [], // 保存上一级的页码和单页大小标识  方便进行返回切换
      dataTypeList: [], // 数据类型列表
      refreshTable: '0', // 刷新目录的标识
  },
  getters: {
      getCurrentSelect(state){
          return state.currentSelect
      },
      getCurrentTableData(state) {
        // 当前目录展现的是搜索结果还是正常目录
        return state.showSearchResult ? state.searchResult : state.currentTableData
      },
      getShowSearchResult(state) {
        return state.showSearchResult
      },
      getBreadList(state) {
        // 搜索结果的话 展示的是搜索的面包屑
        return state.showSearchResult ? state.serachBreadList : state.breadList
      },
      getNormalBreadList(state) {
        // 搜索时需要使用的父目录的信息
        return state.breadList
      },
      getOldPageNums(state) {
        return state.oldPageNums;
      },
      getDataTypeList(state) {
        return state.dataTypeList
      },
      getRefreshfTable(state) {
        return state.refreshTable;
      }
  },
  mutations: {
      SET_CURRENT_SELECT(state,data){
        state.currentSelect=data
      },
      SET_TABLE_DATA(state,data) {
        state.currentTableData = data;
      },
      SET_SEARCH_DATA(state,data) {
        state.searchResult = data;
      },
      SET_SEARCH_STATUS(state,data) {
        state.showSearchResult = data;
      },
      SET_BREAD_LIST(state,data){
        state.breadList=data
      },
      SET_SEARCH_BREAD_LIST(state,data){
        state.serachBreadList=data
      },
      OLD_PAGE_NUMS(state, data) {
        state.oldPageNums = data;
      },
      SET_DATA_TYPE_LIST(state,data){
        state.dataTypeList=data
      },
      SET_REFRESH_TABLE(state, data) {
        state.refreshTable = state.refreshTable == '0' ? '1' : '0'
      }
  },
  actions: {
      updateCurrentSelect({commit}, data){
        commit('SET_CURRENT_SELECT', data)
      },
      updateCurrentTableData({commit}, data){
        commit('SET_TABLE_DATA', data)
      },
      updateSearchResult({commit}, data){
        commit('SET_SEARCH_DATA', data)
      },
      updateSerachStatus({commit}, data){
        commit('SET_SEARCH_STATUS', data)
      },
      updateBreadList({ commit, state }, data) {
        commit('SET_CURRENT_SELECT', [])
        let mutationName = state.showSearchResult ? 'SET_SEARCH_BREAD_LIST' : 'SET_BREAD_LIST'
        commit(mutationName, data)
      },
      updateOldPageNums({ commit }, data) {
        commit('OLD_PAGE_NUMS', data)
      },
      updateDataTypeList({ commit }, data) {
        commit('SET_DATA_TYPE_LIST', data)
      },
      updateRefreshfTable({ commit }) {
        commit('SET_REFRESH_TABLE')
      },
      resetDataListStore({ commit, state }) {
        state.currentSelect = []; // 当前选中的操作项
        state.currentTableData = []; // 当前目录的列表数据
        state.searchResult = []; // 目录内的搜索结果
        state.serachBreadList = []; // 搜索结果的面包屑
        state.showSearchResult = false;
        state.breadList = []; // 目录面包屑
        state.dataTypeList = []; // 数据类型列表
        state.refreshTable = '0'; // 刷新目录的标识
        state.oldPageNums = []; // 清空历史页码数据 
      }
  }
}