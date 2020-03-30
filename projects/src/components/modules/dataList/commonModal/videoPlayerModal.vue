<template>
  <models
    :modal="showModal"
    :scrollHide="true"
    modalWidth="600"
    modalTitle="视频播放"
    modalClass="convent-modal"
    @listenModal="handleModalClose()"
    :footerHide="true"
    :customerStyle="{'height': '500px'}"
  >
    <video-player 
			class="video-player-box"
			ref="videoPlayer"
			:options="playerOptions"
			:playsinline="true"
		>
  	</video-player>
  </models>
</template>
<script>
import modalMixins from "@/components/modules/mixins/modalMixins.js";
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'


export default {
  name: "videoPlayerModal",
  mixins: [modalMixins],
  props: {
    dataDetail: {
			type: Object,
			default: () => {}
		}
	},
	components: {
    videoPlayer
	},
  data() {
    return {
      playerOptions: {
				muted: true,
				language: 'en',
				playbackRates: [0.7, 1.0, 1.5, 2.0],
				sources: [{
					type: "video/mp4",
					src: this.$CONST.DATA_LIST.ONLINE_PREVIEW + '/' + this.dataDetail.uuid,
				}],
			}
    };
  },
  computed: {
  },
  methods: {
    
  }
};
</script>
<style lang="less">
.video-player-box {
  height: 100%;
	.video-js {
    width: 100%;
    height: 100%;
	}
	.vjs-big-play-button {
		top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
	}
}
</style>