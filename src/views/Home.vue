<!-- 首页 -->
<template>
  <div class="index-page">
    <div class="index-title">
      <p>互联网统一服务平台第三方测试日报</p>
      <p>{{date[0]}}年{{date[1]}}月{{date[2]}}日</p>
    </div>
    <div class="index-content">
      <div class="index-content-item overall-situation">
        <p class="item-title overall-title">测试总体情况</p>
        <div class="checkpoint" v-if="bugStatistics!=''">
          <div class="checkpoint-item today-checkpoint">
            <p class="checkpoint-num">{{bugStatistics.dayPoint}}</p>
            <p class="checkpoint-text">当日检测点</p>
          </div>
          <div class="checkpoint-item tomonth-checkpoint">
            <p class="checkpoint-num">{{bugStatistics.monthPoint}}</p>
            <p class="checkpoint-text">{{new Date(dateStr).getMonth()+1}}月检测点</p>
          </div>
        </div>
        <div class="checkpoint-detail" v-if="bugStatistics!=''">
          <div class="checkpoint-source">
            <div class="source-item" v-for="(ele,index) in sourceList" :key="index">
              <div class="source-icon">
                <div class="icon-img">
                  <img :src="ele.img" alt />
                </div>
              </div>
              <div class="source-name">{{ele.name}}</div>
              <div class="source-data source-data-1">{{ele.today}}</div>
              <div
                class="source-data source-data-2"
              >{{(ele.tomonth/10000)>1?(ele.tomonth/10000)+'万':ele.tomonth}}</div>
            </div>
          </div>
          <div class="source-data-type">
            <div class="data-type-item" v-for="(ele,index) in dataType" :key="index">
              <div class="data-type-icon">
                <img :src="ele.img" alt />
              </div>
              <div class="data-type-name">{{ele.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="index-content-item today-problem">
        <div class="item-title">
          <p>当日问题发现处理情况</p>
          <div v-on:click="toList(1)" class="link-to">详情</div>
        </div>
        <div class="problem-state-list">
          <div class="problem-state-item" v-for="(ele,index) in todayPromblemState" :key="index">
            <div class="state-item-name">{{ele.name}}</div>
            <div class="state-item-num">{{ele.num}}</div>
          </div>
        </div>
        <div class="chart-item">
          <span class="chart-item-title">各渠道当日发现问题</span>
          <div ref="todayChart1" class="today-chart-1"></div>
        </div>
        <div class="chart-item">
          <span class="chart-item-title">各渠道当日发现问题类型</span>
          <div ref="todayChart2" class="today-chart-2"></div>
        </div>
      </div>
      <div class="index-content-item cumulative-problem">
        <div class="item-title">
          <p>累计问题发现处理情况</p>
          <div v-on:click="toList(2)" class="link-to">详情</div>
        </div>
        <div class="problem-state-list">
          <div
            class="problem-state-item"
            v-for="(ele,index) in cumulativePromblemState"
            :key="index"
          >
            <div class="state-item-name">{{ele.name}}</div>
            <div class="state-item-num">{{ele.num}}</div>
          </div>
        </div>
        <div class="chart-item">
          <span class="chart-item-title">各渠道累计未解决问题</span>
          <div ref="cumulativeChart1" class="cumulative-chart-1"></div>
        </div>
        <div class="chart-item">
          <span class="chart-item-title">各渠道累计未解决问题类型</span>
          <div ref="cumulativeChart2" class="today-chart-2 cumulative-chart-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import online from "../assets/images/icon/online-business-hall.png";
import handheld from "../assets/images/icon/handheld.png";
import subscription from "../assets/images/icon/subscription.png";
import miniprogram from "../assets/images/icon/mini-program.png";
import alipay from "../assets/images/icon/alipay.png";
import todayIcon from "../assets/images/icon/today.png";
import tomonthIcon from "../assets/images/icon/tomonth.png";
import api from "../api/api.js";
import { setTimeout } from "timers";
import { futimes } from "fs";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      dateStr: "",
      date: "",
      bugStatistics: "",
      sourceList: "",
      dataType: [
        {
          img: todayIcon,
          name: "当日检测点"
        },
        {
          img: tomonthIcon,
          name: ""
        }
      ],
      todayPromblemState: "", //当日问题处理情况
      cumulativePromblemState: "", //累计问题处理情况
      barChart1Data: "", //横向柱状图数据
      barChart2Data1: "", //当日纵向柱状图数据
      barChart2Data2: "", //累计纵向柱状图数据
      pieChartData: "", //饼图数据
      resourceTypeTodayList: "", //当日来源类型
      resourceTypeTotalList: "" //累计来源类型
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    //初始化横向柱状图
    initBarChart1: function(el, series) {
      setTimeout(() => {
        let myChart = this.$echarts.init(el);
        myChart.setOption({
          legend: {
            bottom: 0,
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            textStyle: {
              color: "#333333",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 14
            },
            icon: "stack"
          },
          tooltip: {
            axisPointer: {
              type: "shadow"
            },
            confine: true,
            formatter: function(params) {
              console.log(params);
              return (
                params.seriesName +
                "<br>" +
                params.marker.replace(
                  'style="',
                  'style="border: 1px solid #FDFFFF;'
                ) +
                params.value +
                "个"
              );
            }
          },
          grid: {
            show: true,
            borderColor: "#F0F3FF",
            top: 0,
            left: "13.6%",
            opacity: 0.25079999999999997
          },
          xAxis: {
            type: "value",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            minInterval: 1
          },
          yAxis: {
            type: "category",
            data: [""],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          tooltip: {
            axisPointer: {
              type: "shadow"
            },
            confine: true,
            formatter: function(params) {
              return (
                params.seriesName +
                "<br>" +
                params.marker.replace(
                  'style="',
                  'style="border: 1px solid #FDFFFF;'
                ) +
                params.value +
                "个"
              );
            }
          },
          itemStyle: {
            barBorderRadius: 20
          },
          barWidth: 10,
          series: series
        });
      });
    },
    //初始化纵向柱状图
    initBarChart2: function(el, type) {
      let data = "";
      if (type == 1) {
        data = this.barChart2Data1;
      } else {
        data = this.barChart2Data2;
      }
      let myChart = this.$echarts.init(el);
      let option = {
        legend: {
          bottom: 0,
          itemWidth: 14,
          itemHeight: 14,
          borderRadius: 0,
          textStyle: {
            color: "#333333",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: 14
          },
          icon: "stack"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          confine: true,
          formatter: function(params) {
            //提示框自定义
            var tip = params[0].name + "<br />";
            for (let i = 0; i < params.length; i++) {
              if (params[i].value[params[i].seriesName]) {
                tip =
                  tip +
                  params[i].marker.replace(
                    'style="',
                    'style="border: 1px solid #FDFFFF;'
                  ) +
                  params[i].seriesName +
                  ":" +
                  "&nbsp;" +
                  params[i].value[params[i].seriesName] +
                  "个";
                if (i < params.length - 1) {
                  tip += "<br />";
                }
              }
            }
            return tip;
          }
        },
        dataset: {
          dimensions: data.dimensions,
          source: data.source
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          minInterval: 1
        },
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            startValue: 0,
            endValue: 2
          }
        ],
        grid: {
          show: true,
          backgroundColor: new this.$echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              { offset: 1, color: "rgba(61,218,254,0.34)" },
              { offset: 0, color: "rgba(255,255,255,0)" }
            ]
          ),
          opacity: 0.25079999999999997,
          // "linear-gradient(180deg,rgba(61,218,254,0.34) 0%,rgba(255,255,255,0) 100%)",
          borderColor: "#F0F3FF"
        },
        itemStyle: {
          barBorderRadius: 20
        },
        barWidth: 10,
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: data.series
      };
      myChart.setOption(option);
    },
    //初始化饼图
    initPieChart: function(el, data) {
      let myChart = this.$echarts.init(el);
      let { pieChartData } = this;
      let option = {
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            var tip = params.name + params.seriesName + "<br />";
            tip +=
              params.marker.replace(
                'style="',
                'style="border: 1px solid #FDFFFF;'
              ) +
              "数量:&nbsp" +
              params.value +
              "个";
            return tip;
          }
        },
        legend: {
          bottom: 0,
          itemWidth: 14,
          itemHeight: 14,
          borderRadius: 0,
          textStyle: {
            color: "#333333",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: 14
          },
          icon: "stack"
        },
        series: [
          {
            name: "累计未解决问题",
            type: "pie",
            radius: ["40%", "63%"],
            center: ["50%", "44.5%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                formatter: "{a|{b}:{c}个}\n{b|{d}%}",
                padding: [0, -70],
                rich: {
                  a: {
                    align: "left",
                    padding: [3, 0, 0, 0]
                  },
                  b: {
                    align: "left",
                    padding: [0, 0, 3, 0]
                  }
                }
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 20,
                length2: 70
              },
              emphasis: {
                show: false
              }
            },
            data: pieChartData
          }
        ]
      };
      myChart.setOption(option);
    },
    //跳转到问题列表
    toList: function(type) {
      const {
        dateStr,
        sourceList,
        barChart2Data1,
        barChart2Data2,
        resourceTypeTodayList,
        resourceTypeTotalList
      } = this;
      let sourceType = [],
        problemType = [],
        problem = "";
      if (type == 1) {
        resourceTypeTodayList.forEach((item, index) => {
          sourceType.push(item.resourceType);
        });
        problem = barChart2Data1.source;
      } else {
        resourceTypeTotalList.forEach((item, index) => {
          sourceType.push(item.resourceType);
        });
        problem = barChart2Data2.source;
      }
      problem.forEach(item => {
        if (!problemType.includes(item.problemType)) {
          problemType.push(item.problemType);
        }
      });
      sessionStorage.setItem("problemType", problemType.join());

      var mulType = {
        sourceType: sourceType.join(),
        problemType: problemType.join()
      };
      sessionStorage.setItem("mulType", JSON.stringify(mulType));
      this.$router.push({
        name: "problemList",
        params: {
          dateStr: dateStr,
          type: type
        }
      });
    },
    //处理部分ajax数据
    dealData: function(data) {
      let sourceList = [
        {
          img: online,
          name: "网厅",
          today: 0,
          tomonth: 0,
          color: "#A383FF"
        },
        {
          img: handheld,
          name: "掌厅",
          today: 0,
          tomonth: 0,
          color: "#3883FB"
        },
        {
          img: subscription,
          name: "公众号",
          today: 0,
          tomonth: 0,
          color: "#FFD13A"
        },
        {
          img: miniprogram,
          name: "小程序",
          today: 0,
          tomonth: 0,
          color: "#8BC34A"
        },
        {
          img: alipay,
          name: "生活号",
          today: 0,
          tomonth: 0,
          color: "#FC9909"
        }
      ];
      let barChart1Data = [],
        barChart1DataName = [],
        barChart2Data1 = {
          dimensions: [],
          source: [],
          series: []
        },
        barChart2Data1Name = [],
        barChart2Data2 = {
          dimensions: [],
          source: [],
          series: []
        },
        barChart2Data2Name = [],
        pieChartData = [],
        pieChartDataName = [];
      sourceList.forEach((item, index) => {
        for (let key in data.checkSonMap) {
          if (key.indexOf(item.name) >= 0) {
            item.tomonth += data.checkSonMap[key].month;
            item.today += data.checkSonMap[key].today;
          }
        }
        //累计处理情况及饼图data
        data.resourceTypeTotalList.forEach((totalItem, totalIndex) => {
          if (totalItem.resourceType.indexOf(item.name) >= 0) {
            //饼图data
            if (!pieChartDataName.includes(item.name)) {
              let dataItem = {
                value: totalItem.num,
                name: item.name,
                itemStyle: {
                  color: item.color
                }
              };
              pieChartData.push(dataItem);
              pieChartDataName.push(item.name);
            } else {
              pieChartData.forEach((ele, i) => {
                if (ele.name == item.name) {
                  ele.value += totalItem.num;
                }
              });
            }
          }
        });
        //横向柱状图series
        data.resourceTypeTotals.forEach((totalsItem, totalsIndex) => {
          if (totalsItem.resourceType.indexOf(item.name) >= 0) {
            if (!barChart1DataName.includes(item.name)) {
              let dataItem = {
                name: item.name,
                value: totalsItem.num,
                color: item.color
              };
              barChart1Data.push(dataItem);
              barChart1DataName.push(item.name);
            } else {
              barChart1Data.forEach((ele, i) => {
                if (ele.name == item.name) {
                  ele.value += totalsItem.num;
                }
              });
            }
          }
        });
        //纵向柱状图dimensions,series
        for (let key in data.problemTypeTotalList) {
          for (let i in data.problemTypeTotalList[key]) {
            if (i.indexOf(item.name) >= 0) {
              if (!barChart2Data2Name.includes(item.name)) {
                let seriesItem = {
                  type: "bar",
                  label: {
                    normal: {
                      show: true,
                      position: "top",
                      color: "#333333"
                    }
                  },
                  itemStyle: {
                    color: item.color
                  }
                };
                barChart2Data2.series.push(seriesItem);
                barChart2Data2Name.push(item.name);
              }
            }
          }
        }
        //纵向柱状图dimensions,series
        for (let key in data.problemTypeTodayList) {
          for (let i in data.problemTypeTodayList[key]) {
            if (i.indexOf(item.name) >= 0) {
              if (!barChart2Data1Name.includes(item.name)) {
                let seriesItem = {
                  type: "bar",
                  label: {
                    normal: {
                      show: true,
                      position: "top",
                      color: "#333333"
                    }
                  },
                  itemStyle: {
                    color: item.color
                  }
                };
                barChart2Data1.series.push(seriesItem);
                barChart2Data1Name.push(item.name);
              }
            }
          }
        }
      });
      //纵向柱状图dataset
      for (let key in data.problemTypeTotalList) {
        let datasetItem = { problemType: key },
          sourceName = [];
        for (let i in data.problemTypeTotalList[key]) {
          sourceList.forEach((item, index) => {
            if (i.indexOf(item.name) >= 0) {
              if (!sourceName.includes(item.name)) {
                datasetItem[item.name] = data.problemTypeTotalList[key][i];
                sourceName.push(item.name);
              } else {
                datasetItem[item.name] += data.problemTypeTotalList[key][i];
              }
            }
          });
        }
        barChart2Data2.source.push(datasetItem);
      }
      //纵向柱状图dataset
      for (let key in data.problemTypeTodayList) {
        let datasetItem = { problemType: key },
          sourceName = [];
        for (let i in data.problemTypeTodayList[key]) {
          sourceList.forEach((item, index) => {
            if (i.indexOf(item.name) >= 0) {
              if (!sourceName.includes(item.name)) {
                datasetItem[item.name] = data.problemTypeTodayList[key][i];
                sourceName.push(item.name);
              } else {
                datasetItem[item.name] += data.problemTypeTodayList[key][i];
              }
            }
          });
        }
        barChart2Data1.source.push(datasetItem);
      }
      barChart2Data1Name.unshift("problemType");
      barChart2Data1.dimensions = barChart2Data1Name;
      barChart2Data2Name.unshift("problemType");
      barChart2Data2.dimensions = barChart2Data2Name;
      this.barChart1Data = barChart1Data;
      this.pieChartData = pieChartData;
      this.barChart2Data1 = barChart2Data1;
      this.barChart2Data2 = barChart2Data2;
      this.sourceList = sourceList;
    },
    //设置横向柱状图series
    setBarChart2Series: function(arr) {
      let series = [];
      arr.forEach((item, index) => {
        let seriesItem = {
          type: "bar",
          data: [
            {
              value: item.value
            },
            {
              value: 0,
              label: {
                normal: {
                  show: true,
                  position: "left",
                  formatter: "{a}",
                  color: "#999999"
                }
              }
            }
          ],
          label: {
            normal: {
              show: true,
              position: "right",
              formatter: "{c}",
              color: "#333333"
            }
          },
          name: item.name,
          itemStyle: {
            color: item.color
          },
          barGap: "121%"
        };
        series.push(seriesItem);
      });
      this.$nextTick(() => {
        this.initBarChart1(this.$refs.todayChart1, series);
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    var { dateStr } = this.$route.query;
    if (!dateStr) {
      var date = new Date();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + (day - 1);
      }
      dateStr = date.getFullYear() + "-" + month + "-" + day;
    }
    var date = dateStr.split("-");
    document.title =
      date[0] + "年" + date[1] + "月" + date[2] + "日第三方测试日报";
    this.dateStr = dateStr;
    this.date = date;
    this.$set(this.dataType[1], "name", date[1] + "月检测点");
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    var { dateStr } = this;
    this.$axios
      .get(api.index, {
        params: {
          dateStr: dateStr
        }
      })
      .then(res => {
        let data = res.data.data;
        let bugStatistics = data.bugStatistics;
        this.bugStatistics = bugStatistics;
        this.resourceTypeTodayList = data.resourceTypeTodayList;
        this.resourceTypeTotalList = data.resourceTypeTotalList;
        this.todayPromblemState = [
          {
            name: "问题",
            num: bugStatistics.dayBug
          },
          {
            name: "已解决",
            num: bugStatistics.daySolve
          },
          {
            name: "未解决",
            num: bugStatistics.dayRemain
          }
        ];
        this.cumulativePromblemState = [
          {
            name: "问题",
            num: bugStatistics.totalBug
          },
          {
            name: "已解决",
            num: bugStatistics.totalSolve
          },
          {
            name: "未解决",
            num: bugStatistics.totalRemain
          }
        ];
        //合并并处理数据
        this.dealData(data);
        //初始化横向柱状图数据
        this.setBarChart2Series(this.barChart1Data);
        this.$nextTick(() => {
          this.initBarChart2(this.$refs.todayChart2, 1);
          this.initPieChart(this.$refs.cumulativeChart1);
          this.initBarChart2(this.$refs.cumulativeChart2, 2);
        });
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
.index-page {
  width: 100%;
  background: url(./../assets/images/banner.png) no-repeat 0 -4px/100%;
  .index-title {
    color: #fff;
    font-size: 0.4rem;
    text-align: center;
    line-height: 0.56rem;
    padding-top: 0.65rem;
    p + p {
      margin-top: 0.2rem;
    }
  }
  .index-content {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    width: 100%;
    box-sizing: border-box;
    .index-content-item {
      box-shadow: 0px 0.02rem 0.16rem 0px rgba(0, 0, 0, 0.09);
      border-radius: 0.1rem;
      background-color: #fff;
      padding: 0.3rem 0;
      margin-bottom: 0.2rem;
      .item-title {
        font-size: 0.44rem;
        font-weight: 600;
        color: #333;
        height: 0.62rem;
        text-align: center;
        line-height: 0.62rem;
        position: relative;
        .link-to {
          float: right;
          font-size: 0.3rem;
          line-height: 0.42rem;
          font-weight: 400;
          color: #5c99fb;
          position: absolute;
          top: 50%;
          right: 0.4rem;
          transform: translateY(-50%);
          width: 0.61rem;
          white-space: nowrap;
          &::before {
            content: "";
            display: block;
            width: 0.12rem;
            height: 0.12rem;
            border-top: 1px solid #5c99fb;
            border-right: 1px solid #5c99fb;
            border-bottom: 1px solid transparent;
            border-left: 1px solid transparent;
            position: absolute;
            right: -0.12rem;
            top: 50%;
            transform: translateY(-50%) rotate(45deg);
            z-index: 1;
          }
          &::after {
            content: "";
            display: block;
            width: 0.12rem;
            height: 0.12rem;
            border-top: 1px solid #5c99fb;
            border-right: 1px solid #5c99fb;
            border-bottom: 1px solid transparent;
            border-left: 1px solid transparent;
            position: absolute;
            right: -0.22rem;
            top: 50%;
            transform: translateY(-50%) rotate(45deg);
          }
        }
      }
      .problem-state-list {
        padding: 0.3rem 0.9rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        .problem-state-item {
          width: 1.6rem;
          border: 0.03rem solid #6a9df7;
          box-sizing: border-box;
          .state-item-name {
            font-size: 0.28rem;
            height: 0.45rem;
            line-height: 0.45rem;
            background-color: #6a9df7;
            color: #fff;
            text-align: center;
            font-weight: 500;
          }
          .state-item-num {
            color: #6a9df7;
            font-size: 0.38rem;
            height: 0.5rem;
            line-height: 0.5rem;
            text-align: center;
            font-weight: 500;
          }
        }
        .problem-state-item:last-of-type {
          border: 0.03rem solid #ff7f7f;
          .state-item-name {
            background-color: #ff7f7f;
          }
          .state-item-num {
            color: #ff7f7f;
          }
        }
      }
      .chart-item {
        padding: 0 0.3rem;
        box-sizing: border-box;
        .chart-item-title {
          font-size: 0.38rem;
          font-weight: 600;
          color: #333;
          height: 0.53rem;
          padding-right: 0.03rem;
          line-height: 0.53rem;
          position: relative;
          &::after {
            content: "";
            display: block;
            width: 100%;
            height: 50%;
            background: linear-gradient(
              90deg,
              rgba(51, 146, 247, 0) 0%,
              rgba(23, 89, 236, 0.3) 100%
            );
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
        .today-chart-2 {
          width: 100%;
          height: 4.5rem;
          overflow-x: auto;
        }
      }
      .chart-item + .chart-item {
        margin-top: 0.3rem;
      }
    }
    .overall-situation {
      margin-top: 0.9rem;
      padding-top: 0.48rem;
      .overall-title {
      }
      .checkpoint {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 0.2rem;
        box-sizing: border-box;
        .checkpoint-item {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid #eee;
          & > p {
            width: 100%;
          }
          .checkpoint-num {
            font-size: 0.48rem;
            color: #666;
            line-height: 0.42rem;
            text-align: center;
          }
          .checkpoint-text {
            font-size: 0.26rem;
            color: #999;
            line-height: 0.32rem;
            text-align: center;
            padding-top: 0.16rem;
          }
        }
      }
      .checkpoint-detail {
        padding-top: 0.2rem;
        .checkpoint-source {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-left: 0.3rem;
          padding-right: 0.3rem;
          box-sizing: border-box;
          .source-item {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            text-align: center;
            & > div {
              width: 100%;
            }
            .source-icon {
              padding-bottom: 0.02rem;
              .icon-img {
                width: 0.6rem;
                height: 0.44rem;
                margin: 0 auto;
                font-size: 0;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .source-name {
              font-size: 0.26rem;
              color: #333;
              line-height: 0.32rem;
              padding-bottom: 0.2rem;
            }
            .source-data {
              font-size: 0.3rem;
              height: 0.5rem;
              line-height: 0.5rem;
              margin-bottom: 0.2rem;
            }
            .source-data-1 {
              color: #ff6f51;
              background-color: #fff1ee;
            }
            .source-data-2 {
              color: #8aa9fe;
              background-color: #f2f5ff;
            }
          }
          .source-item:first-of-type {
            .source-data-1 {
              border-left: 0.05rem solid #ff6f51;
            }
            .source-data-2 {
              border-left: 0.05rem solid #8aa9fe;
            }
          }
        }
        .source-data-type {
          display: flex;
          align-items: center;
          padding: 0 0.2rem;
          box-sizing: border-box;
          .data-type-item {
            display: flex;
            align-items: center;
            & + .data-type-item {
              margin-left: 0.16rem;
            }
            .data-type-icon {
              width: 0.38rem;
              height: 0.38rem;
              font-size: 0;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .data-type-name {
              font-size: 0.28rem;
              line-height: 0.4rem;
              color: #666;
              padding-left: 0.06rem;
            }
          }
        }
      }
    }
    .today-problem {
      .chart-item {
        .today-chart-1 {
          width: 100%;
          height: 3.6rem;
        }
      }
    }
    .cumulative-problem {
      .chart-item {
        .cumulative-chart-1 {
          width: 100%;
          height: 4.6rem;
        }
      }
    }
  }
}
</style>
