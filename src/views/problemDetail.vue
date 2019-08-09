<!-- 问题详情 -->
<template>
  <div class="problem-detail-page" v-if="bugDetail!=''">
    <div class="video-box" v-if="showMask">
      <div class="mask" v-on:click="showMask=false"></div>
      <div class="close-btn" v-on:click="showMask=false">
        <img :src="closeBtn" alt="">
      </div>
      <video
        :src="videoSrc[videoIndex]"
        controls
        preload="auto"
        x5-playsinline
        webkit-playsinline
        v-if="bugDetail.bugAttachmentVoList[videoIndex].type==2"
      ></video>
      <img
        :src="videoSrc[videoIndex]"
        alt
        v-if="bugDetail.bugAttachmentVoList[videoIndex].type==1"
        v-on:click="showMask=false"
      />
    </div>
    <div class="problem-source">
      <div class="source-item">
        <p class="name">区域</p>
        <p class="value">{{bugDetail.area}}电网</p>
        <p class="time">创建时间 {{bugDetail.createTime.slice(0,10)}}</p>
      </div>
      <div class="source-item">
        <p class="name">渠道</p>
        <p class="value">{{bugDetail.resourceType}}</p>
        <p class="time" v-if="bugDetail['updateTime']">更新时间 {{bugDetail.updateTime.slice(0,10)}}</p>
      </div>
    </div>
    <div class="problem-about">
      <div class="about-item">
        <p class="key">类型</p>
        <p class="value fc_red">{{bugDetail.problemType}}</p>
      </div>
      <div class="about-item">
        <p class="key">优先级</p>
        <p class="value fc_orange">{{bugDetail.prior}}</p>
      </div>
      <div class="about-item">
        <p class="key">程度</p>
        <p class="value fc_orange">{{bugDetail.bugLevel}}</p>
      </div>
      <div class="about-item">
        <p class="key">状态</p>
        <p class="value fc_green">{{bugDetail.state}}</p>
      </div>
    </div>
    <div class="problem-info-item problem-detail">
      <div class="detail-item">
        <p class="font_title title">问题描述</p>
        <p class="content">{{bugDetail.description}}</p>
      </div>
      <div class="detail-item">
        <p class="font_title title">问题定位</p>
        <p class="content">{{bugDetail.location}}</p>
      </div>
      <div class="detail-item">
        <p class="font_title title">解决方案</p>
        <p class="content">{{bugDetail.solve}}</p>
      </div>
    </div>
    <div class="problem-info-item problem-detail">
      <div class="detail-item">
        <p class="font_title title">问题备注</p>
        <div class="content" v-for="(item,index) in bugDetail.bugCommentList" :key="index">
          <p>{{item.bugComment}}</p>
          <p class="time">{{item.createTime.slice(0,10)}}</p>
        </div>
      </div>
    </div>
    <div class="problem-info-item enclosure">
      <div class="enclosure-title">
        <div class="title-icon">
          <img :src="enclosureIcon" alt />
        </div>
        <div class="font_title">附件</div>
      </div>
      <div :class="['enclosure-content',{'mini-box':mini}]">
        <div
          :class="['enclosure-item',{'video-bg':item.type==2}]"
          v-for="(item,index) in bugDetail.bugAttachmentVoList"
          :key="index"
          v-on:click="watchEnclosure(item,index)"
        >
          <div class="play-icon" v-if="item.type==2">
            <img :src="play" alt />
          </div>
          <img :src="item.src" alt v-if="item.type==1" />
        </div>
      </div>
      <div class="show-box" v-on:click="mini=!mini" v-if="bugDetail.bugAttachmentVoList.length>3">
        <div class="show-btn" v-if="mini">
          <p>展开</p>
          <div class="arrow">
            <img :src="bottomArrow" alt />
          </div>
        </div>
        <div class="show-btn" v-else>
          <p>收起</p>
          <div class="arrow">
            <img :src="topArrow" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import api from "../api/api.js";
import enclosureIcon from "../assets/images/icon/enclosure.png";
import closeBtn from "../assets/images/icon/close.png";
import play from "../assets/images/icon/play.png";
import topArrow from "../assets/images/icon/top-arrow.png";
import bottomArrow from "../assets/images/icon/bottom-arrow.png";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      enclosureIcon: enclosureIcon,
      bugDetail: "",
      mini: true,
      topArrow: topArrow,
      bottomArrow: bottomArrow,
      play: play,
      videoSrc: [],
      showMask: false,
      videoIndex: "",
      closeBtn: closeBtn
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    //查看附件
    watchEnclosure: function(item, index) {
      //判断文件类型
      if (this.videoIndex !== index) {
        let fileType = "";
        let ext = item.fileName.substr(item.fileName.lastIndexOf(".") + 1);
        let img = [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff"
        ];
        let video = [
          "wmv",
          "asf",
          "asx",
          "rm",
          "rmvb",
          "mp4",
          "3gp",
          "mov",
          "m4v",
          "avi",
          "dat",
          "mkv",
          "flv",
          "vob"
        ];
        if (img.indexOf(ext.toLowerCase()) !== -1) {
          fileType = "img";
        }
        if (video.indexOf(ext.toLowerCase()) !== -1) {
          fileType = "video";
          this.watchVideo(item, index);
        }
        if (item.type == 1 && fileType == "img") {
        } else if (item.type == 2 && fileType == "video") {
        } else {
          if (fileType == "img") {
          } else if (fileType == video) {
          } else {
          }
        }
      }
      this.$nextTick(() => {
        this.videoIndex = index;
        this.showMask = true;
      });
    },
    //查看视频
    watchVideo: function(item, index) {
      // var player = new Aliplayer({
      //   id: "J_prismPlayer",
      //   autoplay: true,
      //   isLive: true,
      //   playsinline: true,
      //   controlBarVisibility: "always",
      //   source: "",
      //   useH5Prism: true,
      //   x5_fullscreen: true, //全屏播放
      //   skinLayout: [
      //     { name: "bigPlayButton", align: "blabs", x: "70", y: "150" },
      //     { name: "H5Loading", align: "cc" }
      //   ]
      // });
      this.$axios
        .get(api.getAttach, {
          responseType: "blob",
          params: {
            attachId: item.id
          }
        })
        .then(res => {
          console.log(res);
          var videoSrc = URL.createObjectURL(res.data);
          this.$set(this.videoSrc, index, videoSrc);
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    document.title = "问题详情";
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const { dateStr, bugId, area, createTime, updateTime } = this.$route.params;
    this.$axios
      .get(api.bugDetail, {
        params: {
          bugId: bugId,
          dateStr: dateStr,
          area: area
        }
      })
      .then(res => {
        let data = res.data.data;
        if (data) {
          data.createTime = createTime;
          data.updateTime = updateTime;
          data.bugCommentList.sort((a, b) => {
            return a.sort - b.sort;
          });
          data.bugAttachmentVoList.forEach(item => {
            if (item.type == 2) {
              this.videoSrc.push("");
            } else if (item.type == 1) {
              this.videoSrc.push(api.getAttach + "?attachId=" + item.id);
              item.src = api.getAttach + "?attachId=" + item.id;
            }
          });
          this.bugDetail = data;
        }
      });
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.problem-detail-page {
  video {
    height: 100%;
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    object-fit: contain !important;
  }
  .video-box {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    .mask {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
    }
    .close-btn{
      width: 0.48rem;
      height: 0.48rem;
      font-size: 0;
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      z-index: 999;
      img{
        width: 100%;
        height: 100%;
      }
    }
    img {
      object-fit: contain;
      height: 100%;
      width: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  padding: 0 0.2rem;
  .problem-source {
    padding: 0.3rem 0;
    background-color: #6a9df7;
    border-radius: 0.04rem;
    display: flex;
    justify-content: space-around;
    .source-item {
      text-align: center;
      .name {
        font-size: 0.38rem;
        color: #fff;
        line-height: 0.53rem;
        padding: 0.1rem 0;
        font-weight: 600;
      }
      .value {
        font-size: 0.32rem;
        line-height: 0.45rem;
        color: #dfebff;
        font-weight: 500;
        text-align: left;
      }
      .time {
        font-size: 0.22rem;
        line-height: 0.3rem;
        color: #bcd5ff;
        font-weight: 400;
        text-align: left;
      }
    }
  }
  .problem-about {
    margin: 0.4rem 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .about-item {
      width: 100%;
      text-align: center;
      .key {
        color: #333;
        font-size: 0.3rem;
        line-height: 0.42rem;
        font-weight: 500;
      }
      .value {
        font-size: 0.26rem;
        line-height: 0.37rem;
        padding-top: 0.12rem;
        font-weight: 600;
      }
      .fc_red {
        color: #e51c23;
      }
      .fc_orange {
        color: #ff9800;
      }
      .fc_green {
        color: #8bc34a;
      }
      & + .about-item {
        border-left: 1px solid #ededed;
      }
    }
  }
  .problem-info-item {
    box-shadow: 0 0.02rem 0.15rem 0.01rem rgba(0, 0, 0, 0.06);
    border-radius: 0.04rem;
    padding-left: 0.3rem;
    margin-bottom: 0.2rem;
    .font_title {
      font-size: 0.3rem;
      line-height: 0.42rem;
      color: #181818;
      font-weight: 600;
    }
  }
  .problem-detail {
    padding-right: 0.64rem;
    .detail-item {
      padding-bottom: 0.2rem;
      .title {
        padding: 0.1rem 0;
      }
      .content {
        font-size: 0.24rem;
        line-height: 0.33rem;
        color: #666666;
        word-wrap: break-word;
        position: relative;
        .time {
          font-size: 0.22rem;
          line-height: 0.3rem;
          color: #999;
          text-align: right;
          position: relative;
          bottom: 0;
          right: 0;
        }
        & + .content {
          padding-top: 0.2rem;
          margin-top: 0.2rem;
          border-top: 1px solid #ededed;
        }
      }
      & + .detail-item {
        padding-top: 0.1rem;
        border-top: 1px solid #ededed;
      }
    }
  }
  .enclosure {
    padding-top: 0.12rem;
    padding-bottom: 0.34rem;
    .enclosure-title {
      height: 0.42rem;
      display: flex;
      align-items: center;
      margin-bottom: 0.18rem;
      .title-icon {
        width: 0.4rem;
        height: 0.4rem;
        font-size: 0;
        padding-right: 0.1rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .enclosure-content {
      padding-left: 0.3rem;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .enclosure-item {
        width: 1.88rem;
        height: 1.3rem;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        font-size: 0;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .play-icon {
          width: 0.39rem;
          height: 0.39rem;
          font-size: 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
        & + .enclosure-item {
        }
      }
      .video-bg {
        background-color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .mini-box {
      height: 1.5rem;
      overflow: hidden;
    }
    .show-box {
      .show-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          font-size: 0.28rem;
          line-height: 0.4rem;
          color: #1e60f2;
        }
        .arrow {
          width: 0.34rem;
          height: 0.2rem;
          font-size: 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>