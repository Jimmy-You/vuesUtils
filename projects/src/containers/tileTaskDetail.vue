<template>
	<div class="tileTaskWrapper">
		<div class="task_title">
			<span>正在进行的任务</span>
		</div>
		<div class="list_content" v-if="doingTask.length">
			<div 
				class="list_item"
				v-for="(item, index) in doingTask"
				:key="index"
			>
				<div class="task_info">
					<div class="task_name">{{item.taskName}}</div>
					<div class="task_time">{{item.beginTime}}</div>
				</div>
				<div class="task_progress">
					<Spin fix>
							<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
							<div style="transform: scale(.8);">进行中...</div>
					</Spin>
				</div>
			</div>
		</div>
		<div v-else style="height:64px;display:flex;align-items:center;justify-content:center;">
			暂无进行中任务
		</div>
		<div class="task_footer">
			<span @click="routerToTaskList">查看更多</span>
		</div>
	</div>	
</template>
<script>

export default {
	data() {
		return {
			doingTask: [], // 正在进行的任务
			interval: undefined
		}
	},
	computed: {
	},
	methods: {
		renderListData() {
			// 调整列表数据
		},
		getDoingTask() {
      //获取正在进行的任务
      let _this = this
      let path = this.$CONST.ADMIN_HOME.GET_DOING_TASK
      this.$http.get(path).then(res => {
        if (res.data.code == 0) {
          this.doingTask = res.data.result.doingTask
          if (this.doingTask.length == 0 && this.interval) {
            clearInterval(this.interval);
          } 
        } else {
          this.doingTask = []
        }
      })
		},
		routerToTaskList() {
			this.$router.push('/Monitor/TaskList')
		}
	},
	watch: {
	},
	beforeDestroy() {
		if(this.interval) clearInterval(this.interval);
	},
	mounted() {

		this.interval = setInterval(() => {
			this.getDoingTask()
		}, 500)
	}
}
</script>
<style lang="less">
.tileTaskWrapper {
	width: 15vw;
	border-radius: 8px;
	.task_title{
		background: @theme-primary;
		color: #fff;
		border-radius: 4px 4px 0 0;
		height: 36px;
    font-size: 16px;
    line-height: 36px;
    text-align: center;
	}
	.list_content {
		padding: 10px;
		.list_item {
			display: flex;
			align-items: center;
			.task_info {
				width: 75%;
				.task_name {
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					white-space: nowrap;
					font-weight: bold;
				}
				.task_percent {
					text-align: right;
					font-weight: bold;
				}
			}
			.task_progress {
				width: 25%;
				position: relative;
			}
		}
	}
	.task_footer {
		height: 28px;
    text-align: center;
    line-height: 28px;
    color: #aaa;
    cursor: pointer;
	}
	.demo-spin-icon-load{
			animation: ani-demo-spin 1s linear infinite;
	}
	@keyframes ani-demo-spin {
			from { transform: rotate(0deg);}
			50%  { transform: rotate(180deg);}
			to   { transform: rotate(360deg);}
	}
}
</style>