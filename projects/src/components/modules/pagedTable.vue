<template>
  <div class="tableContent">
    <Table
      ref="tablesMain"
      :data="tableCon"
      :columns="tableHeader"
      :disabled-hover="true"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
      v-bind="$attrs"
    ></Table>
		<div class="mpage">
			<Page
				:total="total"
				:show-sizer="showSizer"
				show-total
				:current="managePageInner ? chiPaging : current"
				:page-size="managePageInner ? chiPagSize : pageSize"
				:page-size-opts="showSize"
				@on-change="pageChange"
				@on-page-size-change="pageSizeChange"
			>
				<span v-if="showSizer">共{{ total }}条，每页显示：</span>
				<span v-else>共{{ total }}条&nbsp;&nbsp;&nbsp;</span>
			</Page>
		</div>
  </div>
</template>
<script>
export default {
  name: 'pagedTable',
  props: {
    tableCon: {
      type: Array,
      required: true
    },
    tableHeader: {
      type: Array,
      required: true
		},
		total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    current: {
      type: Number,
      default: 1
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    managePageInner: {
      // 是否内部管理page
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
			showSize: [5, 10, 15, 20],
      chiPaging: 1,
      chiPagSize: 10
		}
  },
  mounted() {},
  methods: {
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
		},
		pageChange(current) {
      this.chiPaging = current
      this.$emit('pageChange', current)
      this.$emit('pageChangeNew', {
        paging: current,
        pageSize: this.chiPagSize
      })
    },
    pageSizeChange(pageSize) {
      this.chiPagSize = pageSize
      this.chiPaging = 1
      this.$emit('pageSizeChange', pageSize)
      this.$emit('pageSizeChangeNew', {
        paging: 1,
        pageSize: this.chiPagSize
      })
    }
  }
}
</script>
<style lang="less">

</style>

