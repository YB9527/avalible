<template>
  <div  >
    <div v-show="showavalibleproject">
      <!--项目查找-->
      <div v-show="projectshowsearch" style="height: 40px; ">
        <div class="form-group row">
          <label class="col-sm-1" style="text-align: right">项目名称: </label>
          <div class="col-sm-2">
            <input type="text" class="form-control" v-model="searchproject.projectname"/>
          </div>
          <label style="text-align: left">项目编号: </label>
          <div class="col-sm-1">
            <input type="text" class="form-control" v-model="searchproject.projectid"/>
          </div>
          <label style="text-align: left">合同编号: </label>
          <div class="col-sm-1">
            <input type="text" class="form-control" v-model="searchproject.projectcantractid"/>
          </div>
          <label style="text-align: left">提交报告时间: </label>
          <div class="col-sm-1.5">
            <input type="month" class="form-control" v-model="searchproject.starttime">
          </div>
          <label style="text-align: left">至 </label>
          <div class="col-sm-1.5">
            <input type="month" class="form-control" v-model="searchproject.endtime">
          </div>

          <div class="btn-group " style="margin-left: 20px">
            <button type="button" class="btn btn-outline-dark" @click="searchProjectByPo(searchproject)">
              查询 <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <div class="clear"></div>
      </div>
      <!--项目显示-->
      <div style="margin-left: 5px" v-show="projectsshow"><!--数据显示地方 :summary-method="getSummaries" show-summary-->
        <el-table
          :data="projects"
          :max-height="height"
          :header-cell-style="{
          'background-color': '#e2e3e5',
          'font-weight': 'bold',
          'border-bottom': '1px #e2e3e5 solid'
        }"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50px"

          >
            <template slot-scope="scope" v-if="scope.$index !== 0"> {{ (searchproject.pageindex-1)*searchproject.limit + (scope.$index) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="projectname"
            label="项目名称"
            width="300px">
          </el-table-column>
          <el-table-column
            prop="projectid"
            label="项目编号"

            width="200px">
          </el-table-column>
          <el-table-column
            prop="projectcantractid"
            label="合同编号"

          >
          </el-table-column>
          <el-table-column
            label="合同总价"
            prop="contrafacevalue"
          >
            <template slot-scope="scope">{{ scope.row.contrafacevalue | formatMoney }}</template>
            >
          </el-table-column>
          <el-table-column
            prop="amountcollectedtotal"
            label="项目总收款">
            <template slot-scope="scope">{{ scope.row.amountcollectedtotal | formatMoney }}</template>
            >
          </el-table-column>
          <el-table-column
            label="项目总提成"
            prop="percentagetotal"
          >
            <template slot-scope="scope">{{ scope.row.percentagetotal | formatMoney }}</template>
          </el-table-column>
          <el-table-column
            label="已发放提成"
            prop="percentagepaysum"
          >
            <template slot-scope="scope">{{ scope.row.percentagepaysum | formatMoney }}</template>
          </el-table-column>
          <el-table-column
            prop="percentagenotpaysum"
            label="未发放提成"
          >
            <template slot-scope="scope">{{ scope.row.percentagenotpaysum | formatMoney }}</template>
          </el-table-column>
          <el-table-column
            prop="fundpay"
            label="项目总分红"
          >
            <template slot-scope="scope">{{ scope.row.fundpay | formatMoney }}</template>
          </el-table-column>
          <el-table-column
            prop="fundpaysum"
            label="已发放分红"
          >
            <template slot-scope="scope">{{ scope.row.fundpaysum | formatMoney }}</template>
          </el-table-column>
          <el-table-column
            prop="fundnotpaysum"
            label="未发放分红"
          >
            <template slot-scope="scope">{{ scope.row.fundnotpaysum | formatMoney }}</template>
          </el-table-column>
          <el-table-column
            label="项目创建者"
          >
            <template slot-scope="scope">{{ scope.row.user?scope.row.user.alias:"/" }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope" v-if="scope.$index !== 0">
              <button type="button" class="btn btn-outline-dark btn-sm" @click="lookXT(scope.row.xietongproject)">协同
              </button>
              <button type="button" class="btn btn-outline-dark btn-sm" @click="editProject(scope.row)">
                编辑
              </button>
              <button type="button" class="btn btn-outline-dark btn-sm" @click="deleteproject(scope.row,scope.$index)"
                      v-show="levelnum == 0 || scope.row.user._id === user._id">
                删除
              </button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div id="bottom" style="text-align: center;">
        <Pageination :searchcustom="searchproject"></Pageination>
      </div>
    </div>
     <div>
       <CreateProject @editpofunction_back="editpofunction_back" :editpo="editpo"
                      v-if="showcreateproject"></CreateProject>
     </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import tool from '@/public/js/tool.js'
  import CreateProject from "./CreateProject";
  import Pageination from "../public/Pageination";
  import $ from 'jquery'
  export default {
    name: "AvalibleProject",
    components: {CreateProject, Pageination},
    data() {
      return {
        height: 100,
        levelnum: "-1",
        user: "",
        showcreateproject: false,
        showavalibleproject: true,
        historyreports: [],//历史项目
        historyreporttitleisshow: false,//完整 历史 项目标题
        projectreportscurrent: {},
        selectprojectreport: {},
        editpo: {},
        oldpercentage: "",//项目中 提成方案，
        searchproject: {
          //搜索对象 栏 使用
          projectname: "",//项目名称
          projectid: "",//项目id
          projectcantractid: "",//合同id
          starttime: null,
          endtime: null,
          pageindex: 1,
          limit: 20,
          total: 0,
        },
        projects: [],

        projectshowsearch: true,//搜索框
        projectsshow: true,//显示项目

        selectitemisshow: false,

      }
    },
    /* 局部过滤器 */
    filters: {
      formatMoney(value) {
        return tool.number_format(value, 2, '.', ',');
      },
      //统计主合同金额
      projectSum(list, method) {
        let sum = 0;
        for (let po of list) {
          sum = sum + po[method] * 1;
        }
        return tool.number_format(sum, 2, '.', ',');
      },
      //得到本次收款
      getAmountCollectedTotal(value, lastmonthreport) {
        if (!lastmonthreport) {
          return value;
        }
        let sum = value - lastmonthreport.project.amountcollectedtotal;
        return sum.toFixed(2);
      },
      //得到提成明细
      getPercentageValue(lastmonthreport, i) {
        if (!lastmonthreport) {
          return 0;
        }
        let percentage = lastmonthreport.project.percentages[i];
        let collectionrecords = lastmonthreport.project.collectionrecords;
        let sum = 0;
        for (let collectionrecord of collectionrecords) {
          if (collectionrecord.percentagepayispay) {
            //提成是发放状态
            sum = sum * 1 + collectionrecord.percentagepayvalueArray[i].value * 1;
          }
        }
        sum = sum.toFixed(2);
        return sum;
      },
      //得到提成明细
      getCurrentPercentageValue(lastmonthreport, i, monthreport) {
        let sum = 0;
        if (lastmonthreport) {
          let percentage = lastmonthreport.project.percentages[i];
          let collectionrecords = lastmonthreport.project.collectionrecords;

          for (let collectionrecord of collectionrecords) {
            if (collectionrecord.percentagepayispay) {
              //提成是发放状态
              sum = sum * 1 + collectionrecord.percentagepayvalueArray[i].value * 1;
            }
          }
          sum = sum.toFixed(2);
        }
        let currentsum = 0;
        {
          let percentage = monthreport.project.percentages[i];
          let collectionrecords = monthreport.project.collectionrecords;

          for (let collectionrecord of collectionrecords) {
            if (collectionrecord.percentagepayispay) {
              //提成是发放状态
              currentsum = currentsum * 1 + collectionrecord.percentagepayvalueArray[i].value * 1;
            }
          }
          currentsum = currentsum.toFixed(2);
        }

        return (currentsum - sum).toFixed(2);
      },
      getTotal(lastmonthproject, monthproject) {
        let lathsum = 0;
        let sum = 0;
        if (lastmonthproject) {
          lathsum = lastmonthproject.percentagepaysum * 1 + lastmonthproject.fundpaysum * 1
        }
        sum = monthproject.percentagepaysum * 1 + monthproject.fundpaysum * 1;
        let result = (sum - lathsum).toFixed(2);
        ;
        return result;
      },
      getCurrentPercentagepay(lastmonthCollectionrecords, monthCollectionrecords) {
        let lathsum = 0;
        let sum = 0;
        if (lastmonthCollectionrecords) {
          for (let collectionrecord of lastmonthCollectionrecords) {
            if (collectionrecord.percentagepayispay) {
              lathsum = lathsum * 1 + collectionrecord.percentagevalue * 1;
            }
          }
        }
        for (let collectionrecord of monthCollectionrecords) {
          if (collectionrecord.percentagepayispay) {
            sum = sum * 1 + collectionrecord.percentagevalue * 1;
          }
        }
        let result = (sum - lathsum).toFixed(2);
        return result;
      },
      getCurrentFundpay(lastmonthCollectionrecords, monthCollectionrecords) {
        let lathsum = 0;
        let sum = 0;
        if (lastmonthCollectionrecords) {
          for (let collectionrecord of lastmonthCollectionrecords) {
            if (collectionrecord.fundispay) {
              lathsum = lathsum * 1 + collectionrecord.fundvalue * 1;
            }
          }
        }
        for (let collectionrecord of monthCollectionrecords) {
          if (collectionrecord.fundispay) {
            sum = sum * 1 + collectionrecord.fundvalue * 1;
          }
        }
        let result = (sum - lathsum).toFixed(2);
        return result;
      },
      //yu shang
      fund1(lastmonthispay, monthispay, value) {
        if (lastmonthispay) {
          return 0;
        }
        if (monthispay) {
          return value;
        }
        return 0;
      },
      //已支付的 提成
      getPercentageTotal(collectionrecords) {
        if (collectionrecords === 0) {
          return 0;
        }
        let sum = 0;
        for (let collectionrecord of collectionrecords) {
          if (collectionrecord.percentagepayispay) {
            sum = sum + collectionrecord.percentagevalue * 1;
          }
        }
        return sum.toFixed(2);
      },
      //已支付的 分红
      getFundTotal(collectionrecords) {
        if (collectionrecords === 0) {
          return 0;
        }
        let sum = 0;
        for (let collectionrecord of collectionrecords) {
          if (collectionrecord.fundispay) {
            sum = sum + collectionrecord.fundvalue * 1;
          }
        }
        return sum.toFixed(2);
      },
      //金额是否已经支付
      payvalue(value, project, ispay) {
        if (ispay) {

          return value;
        }
        return 0;
      },
      flag(historyreporttitleisshow, issubmitreport) {

        return historyreporttitleisshow || issubmitreport;
      },
      lockCollectionrecordDate(historyreporttitleisshow, percentagecollectionlock, fundcollectionlock) {
        return historyreporttitleisshow || percentagecollectionlock || fundcollectionlock
      },
      lockCollectionrecordPercentage(historyreporttitleisshow, percentagecollectionlock) {
        return historyreporttitleisshow || percentagecollectionlock;
      },
      //如果是数字 就 保留两位，如果不是 就 返回原值
      foramtToFixed(value) {
        return tool.number_format(value, 2, '.', ',')

      },
      //提交日期
      FormateSubmitdate(date) {
        if (date) {
          return date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月 ";
        }
        return null;

      },
    },
    computed: {
      /* input:function () {
        return 0;
      }*/
    },
    watch: {
      'searchproject.pageindex'(val, oldVal) {
        this.searchProjectByPo(this.searchproject)
      },
      'searchproject.limit'(val, oldVal) {
        this.searchProjectByPo(this.searchproject)
      },
    },
    mounted() {
      //document.getElementById("bottom").style.top="95.8%";
      //console.log(window.screen.height,window.screen.availHeight,window.screenTop,document.body.scrollTop,document.body.offsetHeight,document.body.clientHeight);
    },
    created() {
      //this.height = window.screen.availHeight - 226;
      this.height = this.$store.state.height -130;
      this.searchProjectByPo(this.searchproject);
      //查询提交报告日期
      this.submitdate = this.$store.getters.submitdatecustom;
      this.levelnum = this.$store.getters.levelnum;
      this.user = this.$store.getters.getUser;
    },
    methods: {
      // 合并合计第一行
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          if (columnIndex === 0) {
            return [0, 0];
          } else if (columnIndex === 1) {
            return [1, 2];
          }
        }
      },
      getSummaries(param) {
        console.log(1)
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = tool.number_format(sums[index], 2, '.', ',');
            ;
          } else {
            sums[index] = '/';
          }
        });
        sums.splice(sums.length - 1, 1);
        return sums;
      },
      //下一页
      nextpage(pageindex, pagecount) {
        console.log(pageindex, pagecount);
      },
      moneyformat(value) {
        return tool.number_format(value, 2, '.', ',');
      },
      //project 是数据库中重新获取
      editpofunction_back(project) {
        for (let i in this.projects) {
          if (this.projects[i]._id === project._id) {
            this.projects[i] = project;
            break;
          }
        }
        this.showcreateproject = false;
        this.showavalibleproject = true;
      },
      //打开协同详情页面
      lookXT(project) {
        this.$store.commit("openXTprojectHtml", project)
      },
      //删除项目
      deleteproject(project, index) {
       /* this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });*/
        this.$store.commit("confirm", {
          message: "是否要删除项目", callback: flag => {
            if (flag) {
              let url = this.$store.state.host + 'avalibleprojects/deleteproject?_id=' + project._id.toString();
              axios.get(url)
                .then((res) => {
                  if (res.data.status === 0) {
                    console.log(index)
                    this.projects.splice(index, 1);
                    this.searchproject.total -=1;
                    this.$store.commit("notify",{message:"删除成功",type:"success"} );
                  }
                });
            }
          }
        });

      },
      lookReportPercentages2(percentages, monthreport, lastmonthreport) {
        let sum = 0;
        if (lastmonthreport) {
          sum = lastmonthreport.project.amountcollectedtotal;
        }
        let avaliblepo = monthreport.project;
        sum = sum.toFixed(2);
        this.baseicpercentages = [];
        for (let percentage of percentages) {
          percentage.input = sum;
          percentage.validrate = avaliblepo.validrate;
          percentage.percentagerate = avaliblepo.percentagepaysteptworate;
          this.caculate(percentage);
          this.baseicpercentages.push(percentage);
        }

        this.switchPage("edititem");
        this.lookpercentageisshow = true;
      },
      //弹出报告中的明细
      lookReportPercentages(percentages, monthreport, lastmonthreport) {

        let sum = 0;
        if (lastmonthreport) {
          sum = monthreport.project.amountcollectedtotal - lastmonthreport.project.amountcollectedtotal;
        } else {
          sum = monthreport.project.amountcollectedtotal;
        }
        sum = sum.toFixed(2);
        this.baseicpercentages = [];
        for (let p of percentages) {
          p.input = sum;
          p.validrate = monthreport.project.validrate;
          p.percentagerate = monthreport.project.percentagepaysteptworate;
          this.caculate(p);
          this.baseicpercentages.push(p);
        }
        this.switchPage("edititem");
        this.lookpercentageisshow = true;
      },
      //锁定项目控件
      lockproject(project) {
        if (project.percentagepaysteponeispay) {
          project.percentagepaysteponelock = true;
        } else {
          project.percentagepaysteponelock = false
        }
        if (project.percentagepaystepthreeispay) {
          project.percentagepaystepthreelock = true;
        } else {
          project.percentagepaystepthreelock = false;
        }
        if (project.fundpaysteponeispay) {
          project.fundpaysteponelock = true;
        } else {
          project.fundpaysteponelock = false;
        }
        if (project.fundpaystepthreeispay) {
          project.fundpaystepthreelock = true;
        } else {
          project.fundpaystepthreelock = false;
        }
      },
      //退回报告
      deleteReport(report) {
        let myFormDatas = new FormData();
        //请求后台，保存日期
        let url = this.$store.state.host + 'projectreports/deletereportbyreport';
        myFormDatas.append('report', JSON.stringify(report));
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {
              //后台 根据报告情况 是否解除锁
              this.avaliblepo = result.data.project;
              this.editProject(this.avaliblepo);
            }
          });
      },
      //根据 po 后台查找 符合要求的  所有项目
      searchProjectByPo(po) {
        //根据po 查找对象
        let myFormDatas = new FormData();
        //请求后台，保存项目
        let url = this.$store.state.host + 'avalibleprojects/searchProjectByPo';
        myFormDatas.append('po', JSON.stringify(po));
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {//查找项目成功
              this.projects = result.data.projects;
              this.searchproject.total = result.data.total;
            } else {
              this.projects = [];
            }
          })
      },
      showAllProjects() {
        this.switchPage("projectshowall");
        let url = this.$store.state.host + 'avalibleprojects/getprojectsall';
        axios.get(url)
          .then((res) => {
            if (res.data.status === 0) {
              this.projects = res.data.projects;
              this.switchPage("projectshowall");
            } else {
              this.$store.commit("showMessageBox",{message:"获取项目失败！！！",type:"error"})

            }
          });
      },

      // 切换 编辑项目 页面
      editProject(project) {

        axios.get(this.$store.state.host + "avalibleprojects/findprojectbyid?_id=" + project._id.toString())
          .then(res => {
            if (res.data.status === 0) {
              let project = res.data.project;

              let date = this.$store.getters.submitdatecustom;
              //只要还没有发放就 更改 到提交报告日期
              if (!project.percentagepaysteponeispay) {
                project.percentagepaysteponeispaydate = date
                ;
              }
              if (!project.percentagepaystepthreeispay) {
                project.percentagepaystepthreeispaydate = date;
              }
              if (!project.fundpaysteponeispay) {
                project.fundpaysteponeispaydate = date;
              }
              if (!project.fundpaystepthreeispay) {
                project.fundpaystepthreeispaydate = date;
              }
              this.editpo = project;

              this.showcreateproject = true;
              this.showavalibleproject = false;
            }
          });
        /*
        //查询历史报告
        let myFormDatas = new FormData();
        //请求后台，保存基础方案提成
        let url = this.$store.state.host+'projectreports/findprojectreportsbyid';
        myFormDatas.append('projectid', project._id.toString());
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if(result.data.status === 0){
              this.projectreportscurrent = result.data.report;
             if(this.projectreportscurrent.reportarray.length>0){
               this.selectprojectreport = this.projectreportscurrent.reportarray[this.projectreportscurrent.reportarray.length-1];
             }



            }else{

            }
          });*/
      },
      openEditProject(project) {
        //this.addprojectbut = false;
        this.editprojectbut = true;
        this.backprojectsbtu = true;
        this.avaliblepo = project;
        this.switchPage("createproject");
      },
      //创建页面
      createProject() {
        this.getBasicProject();
        this.historyreporttitleisshow = false;
        /*this.avaliblepo.percentages =[];// this.baseicpercentages;
        console.log(1,this.avaliblepo.percentages);
        for(let percentage of this.baseicpercentages){
          console.log(percentage);
          this.avaliblepo.percentages.push(percentage);
        }*/
        //this.addprojectbut = true;
        this.editprojectbut = false;
        this.backprojectsbtu = false;
        this.switchPage("createproject");
      },
      switchPage(text) {
        //先关闭所有页面，再打开对应的页面
        this.projectshowsearch = false;
        this.projectsshow = false;
        this.createproject = false;
        this.edititem = false;
        this.reportpageishow = false;
        this.shortreportisshow = false;
        switch (text) {
          case 'projectshowall':
            this.projectshowsearch = true;
            this.projectsshow = true;
            this.edititem = false;
            break;
          case "createproject":
            this.createproject = true;
            break;
          case  "edititem":
            for (let per of this.baseicpercentages) {
              this.caculate(per);
            }
            this.edititem = true;

            break;
          case  "reportpageishow":
            this.reportpageishow = true;
            break;
          case  "shortreportisshow":
            this.shortreportisshow = true;
            break;

        }
      },

      //检查是否数据
      checkIsDouble(value) {
        var patrn = /^(-)?\d+(\.\d+)?$/;
        return !(patrn.exec(value) == null);
      },

    }
  }
</script>

<style scoped>
  /* #bottom {
     position: fixed;
     z-index: 10;
     right: 0;
     left: 0;
     height: 40px;
     padding-right: 10px;
     padding-left: 10px;
     border-bottom: 0;
     background-color: #f7f7f7;
     bottom: 0px;
     box-shadow: 0 1px 6px #ccc;
   }*/

  #bottom {
    position: fixed;
    z-index: 0;
    right: 0;
    left: 0;
    height: 40px;
    padding-right: 10px;
    padding-left: 10px;
    border-bottom: 0;
    background-color: #f7f7f7;
    bottom: 0px;
    box-shadow: 0 1px 6px #ccc;
  }

  .l0 {
    width: 40px;
    float: left;
    margin: 2px;
  }

  .l1 {
    width: 80px;
    float: left;
    margin: 2px;
  }

  .l2 {
    width: 140px;
    margin: 2px;
    float: left;
  }

  .l3 {
    width: 100px;
    float: left;
    margin: 2px;
  }

  .keyclass {
    height: 30px;
    width: 100px;
    float: left;
  }

  .keyclass31 {
    height: 30px;
    width: 130px;
    float: left;
  }

  .keyclass32 {
    height: 30px;
    width: 200px;
    float: left;

  }

  .keyclass33 {
    height: 30px;
    width: 140px;
    float: left;
  }

  .keyclass34 {
    height: 30px;
    width: 100px;
    float: left;
  }

  .clear {
    clear: both;
  }

  .father {
    border: 1px solid dimgrey;
    height: 50px;
    width: 1570px;
    padding: 5px;
  }

  #table1 {
    border: 1px solid dimgrey;
    width: 40%;
    height: 585px;
    float: left;
    margin-top: 10px;
    padding: 2px;
  }

  #table3 {
    border: 1px solid dimgrey;
    width: 100%;
    height: 585px;
    float: left;
    margin-top: 10px;
    margin-left: 2px;
    padding: 2px;
  }

  #table2 {
    border: 1px solid dimgrey;
    border-bottom: 0px;
    width: 58%;
    height: 585px;
    float: left;
    margin-top: 10px;
    margin-left: 0.5%;
    padding: 2px;
  }
  .el-table{
    overflow:visible !important;
  }
</style>
