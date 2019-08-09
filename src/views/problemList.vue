!<!-- 问题列表 -->
<template>
  <div class="problem-list-page">
    <div class="source-tab">
      <div
        class="source-tab-item"
        v-for="(item,index) in sourceType"
        :key="index"
        v-on:click="changeSource(item.name)"
      >
        <div class="tab-icon">
          <img :src="chosenSourceType.includes(item.name)?item.icon.active:item.icon.normal" alt />
        </div>
        <div :class="['tab-name',{'active':chosenSourceType.includes(item.name)}]">{{item.label}}</div>
      </div>
    </div>
    <div class="source-content" v-if="chartData!=''">
      <div ref="listChart" class="problem-list-chart"></div>
      <div :class="['top-arrow_remain',{'top-arrow_solve':seriesItem=='已解决'}]" v-if></div>
      <div class="problem-list">
        <div :class="['state',{'solve-state':seriesItem=='已解决'}]">{{seriesItem}}</div>
        <div class="problem-type-list">
          <div
            class="problem-type-item"
            v-for="(item,index) in problemType"
            :key="index"
            v-on:click="changeProblem(item)"
          >
            <div :class="['item-legend', {'active':chosenProblemType.includes(item)}]"></div>
            <div class="item-name">{{item}}</div>
          </div>
        </div>
        <div class="problem-info-list">
          <div
            class="problem-info-item"
            v-for="(item,index) in problemList"
            :key="index"
            v-on:click="toDetail(item)"
          >
            <div class="info-item-left">
              <div class="left-title">{{item.area}}电网-{{item.resourceType}}</div>
              <div class="left-time">{{item.bugCreateTime}}</div>
            </div>
            <div class="info-item-right">{{item.problemType}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import api from "../api/api.js";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import onlineOn from "../assets/images/icon/online-business-hall_on.png";
import onlineOff from "../assets/images/icon/online-business-hall_off.png";
import handheldAndroidOn from "../assets/images/icon/handheld-android_on.png";
import handheldAndroidOff from "../assets/images/icon/handheld-android_off.png";
import handheldIosOn from "../assets/images/icon/handheld-ios_on.png";
import handheldIosOff from "../assets/images/icon/handheld-ios_off.png";
import subscriptionOn from "../assets/images/icon/subscription_on.png";
import subscriptionOff from "../assets/images/icon/subscription_off.png";
import miniprogramOn from "../assets/images/icon/mini-program_on.png";
import miniprogramOff from "../assets/images/icon/mini-program_off.png";
import alipayOn from "../assets/images/icon/alipay_on.png";
import alipayOff from "../assets/images/icon/alipay_off.png";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      dateStr: "", //日期字符串
      sourceType: [
        {
          name: "网厅",
          label: "网厅",
          icon: {
            active: onlineOn,
            normal: onlineOff
          }
        },
        {
          name: "Android掌厅",
          label: "掌厅",
          icon: {
            active: handheldAndroidOn,
            normal: handheldAndroidOff
          }
        },
        {
          name: "iOS掌厅",
          label: "掌厅",
          icon: {
            active: handheldIosOn,
            normal: handheldIosOff
          }
        },
        {
          name: "公众号",
          label: "公众号",
          icon: {
            active: subscriptionOn,
            normal: subscriptionOff
          }
        },
        {
          name: "小程序",
          label: "小程序",
          icon: {
            active: miniprogramOn,
            normal: miniprogramOff
          }
        },
        {
          name: "生活号",
          label: "生活号",
          icon: {
            active: alipayOn,
            normal: alipayOff
          }
        }
      ],
      problemType: [],
      chartData: "",
      lock: true,
      chosenSourceType: [],
      chosenProblemType: [],
      lastIndex: 0,
      seriesItem: "",
      problemList: ""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    //获取数据
    getData: function(str, resourceType, problemType, isAdd) {
      let self = this;
      const { dateStr } = this;
      const { type } = this.$route.params;
      var params = {
        dateStr: dateStr,
        resourceType: resourceType,
        problemType: problemType
      };
      if (type == 1) {
        params.bugStr = dateStr;
      }
      this.$axios
        .get(api.bugList, {
          params: params
        })
        .then(res => {
          let data = res.data.data;
          let match = false;
          if (!isAdd) {
            match = true;
          }
          if (!match) {
            if (this.problemType.includes(str)) {
              data.bugs.forEach((item, index) => {
                if (item.problemType.indexOf(str) >= 0) {
                  match = true;
                }
              });
            } else {
              data.bugs.forEach((item, index) => {
                if (item.resourceType.indexOf(str) >= 0) {
                  match = true;
                }
              });
            }
          }

          if (match) {
            let mulType = {
              sourceType: resourceType,
              problemType: problemType
            };
            sessionStorage.setItem("mulType", JSON.stringify(mulType));
            if (str==""||isAdd) {
              this.chosenSourceType = resourceType.split(",");
              this.chosenProblemType = problemType.split(",");
            }
            this.problemList = data.bugs;
            this.chartData = [
              {
                value: data.total - data.solveNum,
                name: "未解决"
              },
              {
                value: data.solveNum,
                name: "已解决"
              }
            ];
            this.$nextTick(() => {
              this.initPieChart(this.$refs.listChart);
            });
          }
          self.lock = true;
        })
        .catch(res => {
          self.lock = true;
        });
    },
    //初始化饼图
    initPieChart: function(el) {
      let self = this;
      setTimeout(() => {
        let obj = {
          data: self.chartData
        };
        var myChart = this.$echarts.init(el);
        let minAngle = 30;
        for (let i = 0; i < obj.data.length; i++) {
          if (obj.data[i].value === 0) {
            minAngle = 0;
            break;
          }
        }
        const pieValue = obj.data.map(v => {
          return v.value;
        });
        const sum = pieValue.reduce((prev, cur) => {
          return prev + cur;
        }, 0);

        const sum2 = pieValue.reduce((prev, cur) => {
          if (cur < sum / 12 && cur > 0) {
            return prev + sum / 12;
          }
          return prev + cur;
        }, 0);
        let initPieValue = pieValue[0];
        if (initPieValue < sum / 12 && initPieValue > 0) {
          initPieValue = sum / 12;
        }
        let option = {
          color: ["#ED7D31", "#FAC653"],
          series: [
            {
              name: "问题",
              type: "pie",
              radius: ["50%", "85%"],
              center: ["50%", "52%"],
              clockWise: false,
              startAngle: 0 - ((initPieValue / sum2) * 360) / 2 - 90,
              minAngle: minAngle,
              avoidLabelOverlap: false,
              itemStyle: {
                emphasis: {
                  radius: ["46%", "100%"]
                }
              },
              label: {
                normal: {
                  position: "center",
                  formatter: function(params) {
                    return (
                      "{b|" +
                      option.series[0].data[1].name +
                      option.series[0].data[1].value +
                      "个}\n\n{c|" +
                      option.series[0].data[0].name +
                      option.series[0].data[0].value +
                      "个}"
                    );
                  },
                  borderRadius: 8,
                  rich: {
                    b: {
                      fontSize: 12,
                      backgroundColor: "#FCEFB3",
                      borderRadius: 8,
                      padding: [5, 12],
                      color: "#FAC653"
                    },
                    c: {
                      fontSize: 12,
                      backgroundColor: "#FAD8C2",
                      borderRadius: 8,
                      padding: [5, 12],
                      color: "#ED7D31"
                    }
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: obj.data
            }
          ]
        };
        this.seriesItem = option.series[0].data[0].name;
        myChart.setOption(option);
        if (minAngle === 30) {
          this.lastIndex = 0;
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: 0
          });
        }

        let preDataIndex = 0;
        myChart.on("click", v => {
          if (v.dataIndex === preDataIndex) {
            myChart.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: v.dataIndex
            });
            return;
          }
          if (!v.event.target.style["text"]) {
            this.seriesItem = option.series[0].data[v.dataIndex].name;
          }
          const sum1 = pieValue.reduce((prev, cur, index) => {
            if (index < v.dataIndex) {
              if (cur < sum / 12 && cur > 0) {
                return prev + sum / 12; // 饼图的扇形最小角度设置为30，占圆的1/12
              }
              return prev + cur;
            }
            return prev;
          }, 0);
          // console.log( 'sum', sum1, sum2, v.dataIndex );
          let curPieValue = pieValue[v.dataIndex];
          if (curPieValue < sum / 12 && curPieValue > 0) {
            curPieValue = sum / 12;
          }
          option.series[0].startAngle =
            0 - ((sum1 / sum2) * 360 + ((curPieValue / sum2) * 360) / 2) - 90;
          myChart.setOption(option);
          preDataIndex = v.dataIndex;
          let lastIndex = this.lastIndex;
          myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: lastIndex
          });
          window.setTimeout(() => {
            myChart.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: v.dataIndex
            });
            this.lastIndex = v.dataIndex;
          }, 300);

          this.mrkName = v.data.name;
          this.mrkValue = v.data.value;
        });
      });
    },
    //修改来源
    changeSource: function(str) {
      if (this.lock) {
        this.lock = false;
        if (this.chosenSourceType.includes(str)) {
          this.chosenSourceType.splice(this.chosenSourceType.indexOf(str), 1);
          let resourceType = this.chosenSourceType.join();
          let problemType = this.chosenProblemType.join();
          this.getData(str, resourceType, problemType, false);
        } else {
          let resourceType = this.chosenSourceType.concat(str).join();
          let problemType = this.chosenProblemType.join();
          this.getData(str, resourceType, problemType, true);
        }
      }
    },
    //修改问题
    changeProblem: function(str) {
      if (this.lock) {
        this.lock = false;
        if (this.chosenProblemType.includes(str)) {
          let resourceType = this.chosenSourceType.join();
          this.chosenProblemType.splice(this.chosenProblemType.indexOf(str), 1);
          let problemType = this.chosenProblemType.join();
          this.getData(str, resourceType, problemType, false);
        } else {
          let resourceType = this.chosenSourceType.join();
          let problemType = this.chosenProblemType.concat(str).join();
          this.getData(str, resourceType, problemType, true);
        }
      }
    },
    //选择问题列表项跳转到问题详情
    toDetail: function(item) {
      let { dateStr } = this.$route.params;
      this.$router.push({
        name: "problemDetail",
        params: {
          dateStr: dateStr,
          bugId: item.bugId,
          area: item.area,
          createTime: item.bugCreateTime,
          updateTime: item.bugUpdateTime
        }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    var { dateStr, type } = this.$route.params;
    var { sourceType, problemType } = JSON.parse(
      sessionStorage.getItem("mulType")
    );
    var date = new Date(dateStr);
    if (type == 1) {
      document.title =
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日问题列表";
    } else {
      document.title = "累计问题列表";
    }
    this.dateStr = dateStr;
    this.chosenSourceType = sourceType.split(",");
    this.chosenProblemType = problemType.split(",");
    this.problemType = sessionStorage.getItem("problemType").split(",");
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getData(
      "",
      this.chosenSourceType.join(),
      this.chosenProblemType.join(),
      false
    );
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
.problem-list-page {
  background-color: #6a9df7;
  margin-bottom: 0.3rem;
  .source-tab {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0.3rem 0;
    .source-tab-item {
      font-size: 0;
      .tab-icon {
        width: 0.6rem;
        height: 0.48rem;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .tab-name {
        padding-top: 0.1rem;
        color: #c2d7fb;
        font-size: 0.23rem;
        line-height: 0.36rem;
        height: 0.72rem;
        text-align: center;
      }
      .active {
        color: #ffffff;
      }
    }
  }
  .source-content {
    background-color: #fff;
    border-radius: 0.3rem 0.3rem 0 0;
    padding-bottom: 0.3rem;
    .problem-list-chart {
      height: 5rem;
    }
    .top-arrow_remain {
      width: 0;
      height: 0;
      border-top: 0 solid transparent;
      border-right: 0.42rem solid transparent;
      border-bottom: 0.52rem solid #ed7d31;
      border-left: 0.42rem solid transparent;
      margin: 0 auto;
    }
    .top-arrow_solve {
      border-bottom: 0.52rem solid #fac653;
    }
    .problem-list {
      margin-top: 0.2rem;
      box-shadow: 0 0.02rem 0.16rem 0 rgba(0, 0, 0, 0.09);
      border-radius: 0.3rem 0.3rem 0 0;
      padding-top: 0.12rem;
      .state {
        font-size: 0.3rem;
        font-weight: 600;
        line-height: 0.42rem;
        color: #ed7d31;
        text-align: center;
      }
      .solve-state {
        color: #fac653;
      }
      .problem-type-list {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        .problem-type-item {
          display: flex;
          align-items: center;
          .item-legend {
            width: 0.3rem;
            height: 0.3rem;
            border: 1px solid #979797;
            background-color: #eeeeee;
            box-sizing: border-box;
          }
          .active {
            background-color: #ed7d31;
            border: none;
          }
          .item-name {
            font-size: 0.3rem;
            line-height: 0.42rem;
            color: #666;
            padding-left: 0.1rem;
          }
          & + .problem-type-item {
            padding-left: 0.16rem;
          }
        }
      }
      .problem-info-list {
        padding: 0.24rem 0.2rem 0;
        .problem-info-item {
          display: flex;
          align-items: center;
          padding-right: 0.2rem;
          padding-left: 0.12rem;
          justify-content: space-between;
          height: 1rem;
          box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.08);
          position: relative;
          .info-item-left {
            .left-title {
              font-size: 0.3rem;
              line-height: 0.42rem;
              color: #333;
            }
            .left-time {
              font-size: 0.28rem;
              line-height: 0.42rem;
              color: #999;
            }
          }
          .info-item-right {
            font-size: 0.28rem;
            line-height: 0.4rem;
            color: #ed7d31;
          }
          & + .problem-info-item {
            margin-top: 0.3rem;
          }
          &::before {
            content: "";
            display: block;
            width: 0;
            height: 0.94rem;
            border-top: 0.03rem solid transparent;
            border-right: 0.08rem solid #538aff;
            border-bottom: 0.03rem solid transparent;
            border-left: none;
            position: absolute;
            top: 0;
            left: -0.08rem;
          }
        }
      }
    }
  }
}
</style>