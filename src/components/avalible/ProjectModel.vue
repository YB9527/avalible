<template>
  <div>
    <div>
      <div>
        <div class="alert alert-secondary" role="alert" style="height: 45px;padding: 2px 0px 0px 10px;margin-top: 40px">
          <div v-show="init">
            <button type="button" class="btn btn-outline-dark" @click="saveProjectModel(avaliblepo)"
            >
              保存模板
              <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
            </button>
            <button type="button" v-if="!createproject" class="btn btn-warning" @click="back_Project()">
              返回
            </button>
          </div>

          <div style="text-align: center;margin-top: -40px">
            <h2>项目模板</h2>
          </div>
        </div>
      </div>
      <div v-if="createproject">
        <div style="float: left;width: 35%;">
          <table class="table-bordered" style="margin: 5px">
            <thead>
            <tr>
              <th>内容</th>
              <th style="width: 180px">比例</th>
              <th>值</th>
              <th style="width: 160px">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td><font :color="avaliblepo.contrafacevalue?successrgb:errrgb"> 主合同金额:</font></td>
              <td><input type="text" class="form-control form-control-sm" v-bind:disabled="true"/></td>
              <td><input type="text" class="form-control form-control-sm" @blur.prevent="computedAvaliblepo()"
                         required
                         v-model="avaliblepo.contrafacevalue "
                         v-bind:disabled="true"/></td>
              <td></td>
            </tr>
            <tr>
              <td><font :color="avaliblepo.validratefee!=0?successrgb:errrgb"> 有效比例:</font></td>
              <td><input type="text" class="form-control form-control-sm" @blur.prevent="computedAvaliblepo()"
                         required
                         v-model="avaliblepo.validrate"
                         v-bind:disabled="historyreporttitleisshow | flag(avaliblepo.issubmitreport)"/></td>
              <td><input type="text" class="form-control form-control-sm" v-model="avaliblepo.validratefee"
                         v-bind:disabled="true"/></td>
              <td></td>
            </tr>
            <tr>
              <td><font :color="avaliblepo.preparefeefixfee!=0?successrgb:errrgb"> 前期固定:</font></td>
              <td><input type="text" class="form-control form-control-sm" @blur.prevent="computedAvaliblepo()"
                         required
                         v-model="avaliblepo.preparefeefix"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"/>
              <td><input type="text" class="form-control form-control-sm"
                         v-model="avaliblepo.preparefeefixfee"
                         v-bind:disabled="true"/></td>
              <td></td>
            </tr>
            <tr>
              <td> 前期（实际）:</td>
              <td><input type="text" class="form-control form-control-sm" v-bind:disabled="true"/></td>
              <td><input type="text" class="form-control form-control-sm" @blur.prevent="computedAvaliblepo()"
                         v-model="avaliblepo.preparefeereal"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"/></td>
              <td></td>
            </tr>
            <tr>
              <td>前期费（超额）:</td>
              <td><input type="text" class="form-control form-control-sm" v-bind:disabled="true"/></td>
              <td><input type="text" class="form-control form-control-sm" @blur.prevent="computedAvaliblepo()"
                         v-model="avaliblepo.prepareover"
                         v-bind:disabled="true"/></td>
              <td></td>
            </tr>
            <tr>
              <td><font :color="avaliblepo.workingfee.length>0?successrgb:errrgb"> 工作经费:</font></td>
              <td><input type="text" class="form-control form-control-sm" required
                         v-model="avaliblepo.workingfeerate"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"/>
              </td>
              <td><input type="text" class="form-control form-control-sm" required
                         v-model="avaliblepo.workingfee"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"/></td>
              <td></td>
            </tr>
            <tr v-for="(percentage,i) in avaliblepo.percentages">
              <td>提成方案</td>
              <td><input type="text" class="form-control form-control-sm" @blur.prevent="computedAvaliblepo()"
                         v-model="percentage.name"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"></td>
              <td><input type="text" class="form-control form-control-sm" v-model="percentage.result "
                         v-bind:disabled="true"/></td>
              <td>
                <div class="btn-group">
                  <button type="button" class="btn btn-outline-dark"
                          v-bind:hidden="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                          data-toggle="modal"
                          data-target="#percentagemodal"
                          @click="editItem(i)">
                    编辑
                  </button>
                  <button type="button" class="form-control  btn-outline-dark form-control-sm"
                          v-bind:hidden="!avaliblepo.issubmitreport"
                          @click="lookEditItem(i)">
                    查看方案
                  </button>
                  <button type="button" class="btn btn-outline-dark"
                          v-bind:hidden="historyreporttitleisshow | flag(avaliblepo.issubmitreport)"
                          @click="deleteItem(avaliblepo.percentages,i)">
                    删除
                  </button>

                </div>

              </td>

            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <input type="button" value="添加提成方案" class="form-control  btn-outline-dark form-control-sm"
                       v-bind:hidden="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                       data-toggle="modal"
                       data-target="#percentagemodal"
                       @click="addPercentage(avaliblepo)"></td>
            </tr>
            <tr>
              <td>预算A:</td>
              <td><input type="text" class="form-control form-control-sm" v-bind:disabled="true"/></td>
              <td><input type="text" class="form-control form-control-sm"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                         v-model="avaliblepo.cooperationbudget" @blur.prevent="computedAvaliblepo()"/></td>
              <td></td>
            </tr>
            <tr>
              <td>合作预算A:</td>
              <td><input type="text" class="form-control form-control-sm" v-bind:disabled="true"/></td>
              <td><input type="text" class="form-control form-control-sm"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                         v-model="avaliblepo.hezuoyusuanA" @blur.prevent="computedAvaliblepo()"/></td>
              <td></td>
            </tr>
            <tr v-for="(baseexpence,i) in avaliblepo.baseexpences">
              <td><input type="text" class="form-control " required
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                         v-model="baseexpence.name" :title="baseexpence.name">
                <!--   <input type="text"  v-model="baseexpence.name" class="form-control "  v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)" required>
                   <div class="valid-feedback">
                     12313212312
                   </div>
 -->
              </td>
              <td><input type="text" class="form-control form-control-sm" required
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                         @blur.prevent="computedAvaliblepo()" v-model="baseexpence.rate"/></td>
              <td><input type="text" class="form-control form-control-sm" v-model="baseexpence.value"
                         v-bind:disabled="true"/></td>
              <td><input type="button" class="form-control  btn-outline-dark form-control-sm"
                         v-bind:hidden="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                         @click="deleteBaseexpence(avaliblepo.baseexpences,i)" value="删除"></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td><input type="button" class="form-control  btn-outline-dark form-control-sm" value="添加固定开支"
                         v-bind:hidden="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                         data-toggle="modal"
                         data-target="#baseexpencemodal"
                         @click="addBaseexpence(avaliblepo.baseexpences)"></td>
            </tr>

            <tr>
              <td><font :color="(avaliblepo.fundrate).length > 1 ?successrgb:errrgb"> 分红:</font></td>
              <td><input type="text" class="form-control form-control-sm" @blur.prevent="computedAvaliblepo()"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                         v-model="avaliblepo.fundrate"/></td>
              <td><input type="text" v-model="avaliblepo.fundpay" class="form-control form-control-sm"
                         v-bind:disabled="true"/></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div style="float: left;width: 60%;margin-left: 50px;">
          <div>
            <table class="table" style="margin: 5px;max-width: 500px">
              <thead>
              <tr>
                <th style="width: 100px"></th>
                <th style="width: 180px">内容</th>
                <th style="width: 80px">比例</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td rowspan="3"><h4>提成</h4></td>
                <td>合同签订当月</td>
                <td><input type="text" class="form-control form-control-sm "
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.percentagepaysteponerate"
                           @blur.prevent="computedAvaliblepo()"/></td>
              </tr>
              <tr>

                <td>收款绑定</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.percentagepaysteptworate"
                           @blur.prevent="computedAvaliblepo()"/></td>

              </tr>
              <tr>

                <td>年终</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.percentagepaystepthreerate"
                           @blur.prevent="computedAvaliblepo()"/></td>

              </tr>
              <tr>
                <td rowspan="3"><h4>分红</h4></td>
                <td>合同签订当月</td>


                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.fundpaysteponerate"
                           @blur.prevent="computedAvaliblepo()"/></td>


              </tr>
              <tr>

                <td>收款绑定</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.fundpaysteptworate"
                           @blur.prevent="computedAvaliblepo()"/></td>

              </tr>
              <tr>
                <td>年终</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.fundpaystepthreerate"
                           @blur.prevent="computedAvaliblepo()"/></td>


              </tr>
              </tbody>
            </table>


          </div>

        </div>
      </div>

    </div>

    <!--添加提成-->
    <div class="modal fade" id="percentagemodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle2"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable  modal-xl" role="document" style="width: 830px">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle2">请选择方案</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="percentages(avaliblepo)">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="text-align: center">
            <div>
              <div v-if="showbaseicpercentages" >
                <BaseicPercentages @percentages="percentages" :state="percentagestate" :editindex="editindex"
                                   :avaliblepo="avaliblepo"></BaseicPercentages>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- 添加固定开支 -->
    <div class="modal fade" id="baseexpencemodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle1">添加固定开支</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-borderless">

              <tbody>
              <tr >
                <td>固定开支名字:</td>
                <td>  <input type="text" class="form-control" v-model="modalbaseexpence.name"></td>
              </tr>
              <tr >
                <td>比例:</td>
                <td>  <input type="text" class="form-control" v-model="modalbaseexpence.rate" placeholder="不要加%"></td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="addmodalbaseexpence(modalbaseexpence)">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  import tool from '@/public/js/tool.js'
  import XTProject from '@/components/avalible/XTProject'
  import BaseicPercentages from "./BaseicPercentages";
  import Reportpage from "./ReportpageCopy";
  import toggleswitch from "./toggleswitch";
  import $ from 'jquery'
  export default {
    name: "CreateProject",
    props: ['editpo', 'history'],
    components: {
      Reportpage,
      BaseicPercentages,
      XTProject,
      toggleswitch,
    },
    watch:{
      modalbaseexpencetitle(val,oldvalue){
        $('#percentagemodal').modal({backdrop: 'static', keyboard: false});
      },
    },
    data() {
      return {
        modal: "",
        modalbaseexpence:{},
        modalbaseexpencetitle:"",
        successrgb: '',
        errrgb: '',
        showcollectionrecordmodal: false,
        waitxtshoukuanrecords: true,
        xtshoukuanrecords: [],
        collectionrecord: {
          amountdate: null,//收款日期
          amountcollected: 0,//收款金额
          percentagepayispay: false,//提成是还发放
          percentagevalue: 0,//提成金额
          percentagepayvalueArray: [],//提成详细情况
          percentagepaydate: null,//提成发放日期
          percentagecollectionlock: false,//提成锁
          fundispay: false,//分红是还发放
          fundpaydate: null,//分红发放日期
          fundvalue: 0,//分红金额
          fundcollectionlock: false,//分红锁
        },
        submitreport: null,//报告页面的使用对象
        showreportpage: false,//报告页面
        percentagestate: 0,//提成页面状态
        editindex: -1,//提成页面 编辑方案 index
        showbaseicpercentages: false,//基础提成方案控件
        iscurrentmothreport: false,//是否是当月报告
        selectprojectisshow: false,//是否显示协同控件
        report: {submitdate: {year: 0, month: 0}},//报告
        lookshortreportdate: null,
        historyreports: [],//历史项目
        historyreporttitleisshow: false,//完整 历史 项目标题
        projectreportscurrent: {},
        selectprojectreport: {},
        edititembutshow: true,//基础方案保存按钮
        oldpercentage: "",//项目中 提成方案，
        searchproject: {
          //搜索对象 栏 使用
          projectname: "",//项目名称
          projectid: "",//项目id
          projectcantractid: "",//合同id
          starttime: null,
          endtime: null,
        },
        projects: [],
        avaliblepo: {},
        addprojectbut: false,
        editprojectbut: false,
        createproject: false,
        projectshowall: false,//默认显示所有的项目
        projectshowsearch: true,//搜索框
        projectsshow: true,//显示项目
        edititem: false,//方案编辑
        backprojectsbtu: false,//返回按钮
        baseicpercentages: [],//基础提成方案，现在只有三个
        reportpageishow: false,//报告页面显示
        shortreportisshow: false,//查看简报页面
        selectitemisshow: false,
        lookpercentageisshow: false,//查看方案历史提成表格，方框不可编辑
        init: false,
      }
    },
    filters: {
      //合同签订 金额详情过滤器
      heTongQianDingFilter(percentage, rate) {
        let p = JSON.parse(JSON.stringify(percentage));
        p.percentagerate = rate;
        tool.caculate(p);
        return p.name + "：" + p.percentageresult;
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
          return 0.00;
        }
        if (monthispay) {
          return value;
        }
        return 0.00;
      },
      //已支付的 提成
      getPercentageTotal(collectionrecords) {
        if (collectionrecords === 0) {
          return 0.00;
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
          return 0.00;
        }
        let sum = 0.00;
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
        return 0.00;
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
        return value;
      },
      //提交日期
      FormateSubmitdate(date) {
        if (date) {
          return date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月 ";
        }
        return null;

      },
    },
    mounted() {

    },
    created() {
      let url = this.$store.state.host + "avalibleprojects/getbasicproject";
      axios.get(url)
        .then(res => {
          if (res.data.status === 0) {
            this.init = true;
            this.avaliblepo = res.data.project;
            this.computedAvaliblepo();
            this.historyreporttitleisshow = false;
            this.addprojectbut = true;
            this.editprojectbut = false;
            this.backprojectsbtu = false;
            this.createproject = true;
          }
        });
    },
    methods: {
      addmodalbaseexpence(modalbaseexpence){
        if(!modalbaseexpence.name){
          this.$store.commit("showMessageBox",{message:"名字缺少",type:"error"} );
          return ;
        }
        try {
          if(modalbaseexpence.rate*1 <= 0){

            this.$store.commit("showMessageBox",{message:"比例有问题",type:"error"} );
            return ;
          }
        }catch (e) {
          this.$store.commit("showMessageBox",{message:"比例输入有问题",type:"error"} );

          return ;
        }
        ($('#baseexpencemodal')).modal("hide");
        this.avaliblepo.baseexpences.push(modalbaseexpence);
        this.computedAvaliblepo();
      },
      back_Project() {
        this.createproject = true;
        this.showbaseicpercentages = false;
      },
      //保存模板
      saveProjectModel(projectModel) {
        tool.projectMoneySymbol(projectModel, false);
        if (this.CheckAvaliblepo(projectModel, true)) {
          this.$store.commit("postCustom", {
            url: "avalibleprojects/savebasicproject", po: projectModel, callback: (res) => {

              this.$store.commit("notify",{message:"保存成功",type:"success"} );
            }
          });


        }
        tool.projectMoneySymbol(projectModel, true);

      },
      //检查 提成 和 分红 比例 是否是100
      CheckAvaliblepo(avaliblepo, isshowerror) {
        //提成比例总和
        let tichengsum = avaliblepo.percentagepaysteponerate * 1 + avaliblepo.percentagepaysteptworate * 1 + avaliblepo.percentagepaystepthreerate * 1;
        if (tichengsum !== 100) {
          if (isshowerror) {

            this.$store.commit("showMessageBox",{message:"提成比例之和是"+ tichengsum,type:"error"} );
          }
          return false;
        }
        //分红比例总和
        let fenghuongSum = avaliblepo.fundpaysteponerate * 1 + avaliblepo.fundpaysteptworate * 1 + avaliblepo.fundpaystepthreerate * 1;
        if (fenghuongSum !== 100) {
          if (isshowerror) {
            this.$store.commit("showMessageBox",{message:"分红比例之和是"+ fenghuongSum,type:"error"} );

          }
          return false;
        }
        //固定检查
        for (let baseexpence of avaliblepo.baseexpences) {
          if (!baseexpence.name) {

            this.$store.commit("showMessageBox",{message:"固定开支 名称 为空",type:"error"} );
            return false;
          }
          if (baseexpence.rate < 0) {

            this.$store.commit("showMessageBox",{message:"固定开支 提成比例 小于0",type:"error"} );
            return false;
          }
        }
        for (let percentage of avaliblepo.percentages) {
          if (!percentage.name) {
            this.$store.commit("showMessageBox",{message:"提成方案 名称 为空",type:"error"} );

            return false;
          }
        }
        //检查提成 点发放时 没有点击 要有发放日期
        {
          //检查内容 是否填写完整
          let checkarray = [
            {m: "validrate", message: "有效比例"},
            {m: "preparefeefix", message: "前期固定比例"},
            {m: "preparefeefixfee", message: "前期固定金额"},
            //{m: "preparefeereal", message: "前期（实际）"},
            {m: "workingfeerate", message: "工作经费比率"},
            {m: "fundrate", message: "分红比例"},
          ];
          for (let check of checkarray) {
            if (avaliblepo[check.m] == null || avaliblepo[check.m] < 0) {
              if (isshowerror) {
                this.$store.commit("showMessageBox",{message:"没有填写 或者 不能小于0",type:"error"} );

              }
              return false;
            }
          }
        }
        return true;
      },

      //计算 间接数据 avaliblepo 对象中的数据
      computedAvaliblepo() {
        //先解除符号，在添加
        tool.projectMoneySymbol(this.avaliblepo, true);
      },
      //协同页面选中项目后 确定返回
      selectProjectInXT_ok(xitongproject) {
        this.selectprojectisshow = false;
        this.createproject = true;
        this.avaliblepo.projectid = xitongproject.projectid;
        this.avaliblepo.projectcantractid = xitongproject.projectcantractid;
        this.avaliblepo.projectname = xitongproject.projectname;
        this.avaliblepo.contrafacevalue = xitongproject.contrafacevalue;
        this.avaliblepo.xietongproject = xitongproject;
        //this.avaliblepo.amountcollectedtotal = xitongproject.totalreceivables;
        //添加收款
        axios.get(this.$store.state.host + 'xietong/shoukuan?id=' + xitongproject.id)
          .then(res => {
            if (res.data.status === 0) {
              this.xtshoukuanrecords = res.data.records;
              this.waitxtshoukuanrecords = false;
              for (let shoukuan of this.xtshoukuanrecords) {
                let record = this.getCollectionRecordBasic();
                this.addShouKuanByXT(record, shoukuan);
                this.avaliblepo.collectionrecords.push(record);
              }
              this.computedAvaliblepo();
            }
          });

        this.computedAvaliblepo();
      },

      //保存收款记录
      saveCollectionrecord(record) {
        this.modal = "";
        //检查添加的数据正确不？
        if (parseFloat(record.amountcollected) <= 0) {

          this.$store.commit("showMessageBox",{message:"收款金额小于0",type:"error"} );

          return;
        }
        if (!record.amountdate) {
          this.$store.commit("showMessageBox",{message:"收款日期为空",type:"error"} );

          return;
        }
        if (!record.amountdate) {

          this.$store.commit("showMessageBox",{message:"收款日期为空",type:"error"} );
          return;
        }
        if (record.percentagepayispay) {
          if (!record.percentagepaydate) {
            this.$store.commit("showMessageBox",{message:"提成分发日期没有填写",type:"error"} );

            return;
          }

        }
        if (record.fundispay) {
          if (!record.fundpaydate) {

            this.$store.commit("showMessageBox",{message:"分红分发日期没有填写",type:"error"} );
            return;
          }

        }
        if (!(record.percentagepayispay || record.fundispay)) {
          if (!confirm("提成 或 分红 不准备发吗？")) {
            return;
          }
        }
        this.avaliblepo.collectionrecords.push(record);
        this.modal = "modal";
        this.computedAvaliblepo();

      },
      //根据协同收款添加记录
      addShouKuanByXT(collectionrecord, xtshoukuan) {


        collectionrecord.amountdate = xtshoukuan.date;
        collectionrecord.amountcollected = tool.moneySymbol(xtshoukuan.money, false);
        //计算提成，分红金额
        let date = new Date(collectionrecord.amountdate);
        date.setMonth(date.getMonth() + 2);

        collectionrecord.percentagepaydate = tool.monthFormat(date);
        collectionrecord.fundpaydate = tool.monthFormat(date);

        this.computedamountcollected_add(this.avaliblepo, collectionrecord);
        /*  tool.projectMoneySymbol(this.avaliblepo, false);
          let max = this.avaliblepo.contrafacevalue * 1 - this.avaliblepo.amountcollectedtotal * 1;
          this.computedamountcollected(this.avaliblepo, collectionrecord, max);

          for (let i = 0; i < collectionrecord.percentagepayvalueArray.length; i++) {
            let p = collectionrecord.percentagepayvalueArray[i];
            collectionrecord.percentagepayvalueArray[i] = tool.moneySymbol(p, true);
          }

          tool.projectMoneySymbol(this.avaliblepo, true);*/
      },
      //添加收款记录 到 集合中
      addCollectionRecord() {
        this.$refs.child1.childMethod(false);
        this.$refs.child2.childMethod(false);
        this.collectionrecord = this.getCollectionRecordBasic();

      },
      //得到初始化的收款记录
      getCollectionRecordBasic() {
        let collectionrecord = {
          amountdate: null,//收款日期
          amountcollected: 0,//收款金额
          percentagepayispay: false,//提成是还发放
          percentagevalue: 0,//提成金额
          percentagepayvalueArray: [],//提成详细情况
          percentagepaydate: null,//提成发放日期
          percentagecollectionlock: false,//提成锁
          fundispay: false,//分红是还发放
          fundpaydate: null,//分红发放日期
          fundvalue: 0,//分红金额
          fundcollectionlock: false,//分红锁
        };
        return collectionrecord;
      },
      // 模态 提交报告确认
      reportSubmit_ok() {

        //请求后台，保存
        this.computedAvaliblepo();
        let url = this.$store.state.host + 'projectreports/saveprojectreport';
        let submitdate = this.$store.getters.submitdate;
        tool.projectMoneySymbol(this.avaliblepo, false);
        let projectreport = {submitdate: submitdate, project: this.avaliblepo};
        let myFormDatas = new FormData();
        myFormDatas.append('projectreport', JSON.stringify(projectreport));
        tool.projectMoneySymbol(this.avaliblepo, true);
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0 || result.data.status === 3) {
              //提交了之后，更换project
              this.avaliblepo = result.data.project;
              tool.projectMoneySymbol(this.avaliblepo, true);

              this.$store.commit("notify",{message:"提交成功",type:"success"} );
            } else if (result.data.status === 1) {

              this.$store.commit("showMessageBox",{message:result.data.message} );
            }
          })
      },
      //提交报告
      submitProjectReport(project) {
        this.showreportpage = false;
        tool.projectMoneySymbol(project, false);
        if (!this.CheckAvaliblepo(this.avaliblepo, true)) {
          tool.projectMoneySymbol(project, true);
          return;
        }
        let submitdate = this.$store.getters.submitdate;
        let projectreport = {submitdate: submitdate, project: project,};

        //找出上一次报告
        axios.get(this.$store.state.host + 'projectreports/findprojectreportsbyid?projectid=' + project._id.toString())
          .then(res => {
            let lastmonthreport = null;
            if (res.data.report) {
              lastmonthreport = res.data.report.reportarray[res.data.report.reportarray.length - 1];
            }
            if (lastmonthreport) {
              tool.projectMoneySymbol(lastmonthreport.project, false);
            }
            this.submitreport = {lastmonthreport: lastmonthreport, monthreport: projectreport};

            this.showreportpage = true;
          });


        /*  if (confirm("当前提交月份是：" + submitdate.year + " 年 " + submitdate.month + " 月 ，确定要提交吗？")) {

          }*/
      },

      computedamountcollected_add(avaliblepo, collectionrecord) {
        tool.projectMoneySymbol(avaliblepo, false);
        let max = avaliblepo.contrafacevalue * 1 - avaliblepo.amountcollectedtotal * 1;
        this.computedamountcollected(avaliblepo, collectionrecord, max);
        //计算收款 时的误差
        let sum = 0;
        let tichengsum = 0;
        for (let record of avaliblepo.collectionrecords) {
          sum = sum * 1 + record.fundvalue * 1;
          for (let tichengvalue of record.percentagepayvalueArray) {
            tichengsum = tichengsum * 1 + tichengvalue * 1;
          }
        }
        sum = sum * 1 + collectionrecord.fundvalue * 1;
        if (sum - avaliblepo.fundpaysteptworatevalue * 1 > 0.001) {
          collectionrecord.fundvalue = collectionrecord.fundvalue * 1 + (avaliblepo.fundpaysteptworatevalue * 1 - sum);
        }
        for (let tichengvalue of collectionrecord.percentagepayvalueArray) {
          tichengsum = tichengsum * 1 + tichengvalue * 1;
        }

        let tichengCha = tichengsum - avaliblepo.percentagepaysteponeratevalue * 1;

        if (tichengCha > 0.001) {

          let recordlength = avaliblepo.collectionrecords.length;
          let plenth = this.avaliblepo.percentages.length;
          collectionrecord.percentagepayvalueArray[plenth - 1] = collectionrecord.percentagepayvalueArray[plenth - 1] - tichengCha;
          collectionrecord.percentagevalue = tool.moneySymbol(collectionrecord.percentagevalue, false) * 1 - tichengCha;
        }
        tool.recordMoneySymbol(collectionrecord, true);
        tool.projectMoneySymbol(avaliblepo, true);
        /* for(let i =0; i < collectionrecord.percentagepayvalueArray.length;i++){
           let p =collectionrecord.percentagepayvalueArray[i];
           collectionrecord.percentagepayvalueArray[i] = tool.moneySymbol(p,true);
         }*/
      },
      //计算收款时方法的金额
      computedamountcollected(avaliblepo, collectionrecord, max) {
        //计算提成详细
        {
          tool.moneySymbolPoSet(collectionrecord, "amountcollected", false);
          //如果max 大于0 取正常值
          let amountcollected = 0;
          if (max * 1 <= 0) {
            amountcollected = 0;
          } else if (max * 1 >= collectionrecord.amountcollected * 1) {//去全部值
            amountcollected = collectionrecord.amountcollected * 1;
          } else if (collectionrecord.amountcollected - max >= 0) {
            //部分值有效
            amountcollected = max * 1;
          } else {
            //完全无效
            amountcollected = 0;
          }
          if (amountcollected < 0) {
            amountcollected = 0;
          }
          //先清空再添加
          collectionrecord.percentagepayvalueArray = [];
          collectionrecord.percentagevalue = 0;
          collectionrecord.fundvalue = 0;
          tool.moneySymbolPoSet(avaliblepo, "contrafacevalue", false);
          tool.moneySymbolPoSet(avaliblepo, "fundpay", false);


          for (let percentage of avaliblepo.percentages) {
            //提成金额
            let percentageresult = tool.moneySymbol(percentage.percentageresult, false);
            let result = (amountcollected / avaliblepo.contrafacevalue * percentageresult).toFixed(2);
            //console.log(amountcollected,result);
            //collectionrecord.percentagepayvalueArray.push(tool.moneySymbol( result,true));
            collectionrecord.percentagepayvalueArray.push(result);
            //console.log( collectionrecord.percentagepayvalueArray);
            collectionrecord.percentagevalue = collectionrecord.percentagevalue * 1 + result * 1;
          }

          tool.moneySymbolPoSet(collectionrecord, "percentagevalue", true);
          //分红 分发计算
          tool.rateSymbolSet(avaliblepo, "fundpaysteptworate", false);

          collectionrecord.fundvalue = (amountcollected / avaliblepo.contrafacevalue * avaliblepo.fundpay * avaliblepo.fundpaysteptworate / 100);

          tool.moneySymbolPoSet(collectionrecord, "fundvalue", true);
          tool.moneySymbolPoSet(collectionrecord, "amountcollected", true);
        }
      },

      //保存 编辑 的 项目对象
      editProjectSave(avaliblepo) {
        //检查 提成 和 分红 比例 是否是100
        tool.projectMoneySymbol(avaliblepo, false);
        let checkedresult = this.CheckAvaliblepo(this.avaliblepo, false);
        if (!checkedresult) {
          tool.projectMoneySymbol(avaliblepo, true);
          //如果有问题，不保存
          return;
        }
        this.computedAvaliblepo();
        tool.projectMoneySymbol(avaliblepo, false);
        let myFormDatas = new FormData();
        //请求后台，保存基础方案提成
        let url = this.$store.state.host + 'avalibleprojects/saveproject';
        myFormDatas.append('project', JSON.stringify(avaliblepo));
        tool.projectMoneySymbol(avaliblepo, true);
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {

              this.showMessageBox("保存成功");
            }
          })
      },
      //返回当前项目
      backProjectBy_id(_id) {

        if (!_id) {
          //为空的情况是 当前正在创建项目，没有选择方案的返回
          this.showbaseicpercentages = false;
          this.createproject = true;
          this.addprojectbut = true;
        } else {
          axios.get(this.$store.state.host + "avalibleprojects/findprojectbyid?_id=" + _id.toString())
            .then(res => {
              if (res.data.status === 0) {
                this.historyreporttitleisshow = false;
                this.createproject = true;
                // this.avaliblepo = res.data.project;
                this.showbaseicpercentages = false;
                this.computedAvaliblepo();
              }
            });
        }

      },
      //添加方案提成
      addPercentage(avaliblepo) {
        //添加提成状态
        this.modalbaseexpencetitle="添加方案";
        this.percentagestate = 2;
        this.showbaseicpercentages = true;

        //this.createproject = false;
        //this.addprojectbut = false;
      },
      //提成界面返回信息
      percentages(project) {
        this.avaliblepo = project;//更新
        this.showbaseicpercentages = false;
        this.createproject = true;
        this.createproject = true;
        if (project._id) {
          this.addprojectbut = false;
        } else {
          this.addprojectbut = true;
        }

        if (this.percentagestate == 2) {
          //如果是添加
        }
        ($('#percentagemodal')).modal("hide");
        this.computedAvaliblepo();
      },
      //查看提成方案
      lookEditItem(i) {
        //this.editItem(percentage);
        //this.lookpercentageisshow=true;
        this.modalbaseexpencetitle="查看方案";
        this.editindex = i;
        this.percentagestate = 4;
        this.showbaseicpercentages = true;
        //this.createproject = false;

      },


      //删除方案提成
      deleteItem(percentages, index) {
        percentages.splice(index, 1);
        this.computedAvaliblepo();//重新计算
      },
      //编辑方案
      editItem(i) {
        this.modalbaseexpencetitle="编辑方案";
        this.editindex = i;
        this.percentagestate = 3;
        this.showbaseicpercentages = true;
       // this.createproject = false;

      },

      //方案不提交，关闭页面
      editItemClose() {
        this.edititem = false;
      },


      //退回报告 ,只能删除
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
              this.historyreporttitleisshow = false;
            }
          });
      },
      //打开报告页面
      openHistoryReport(historyreport) {
        this.historyreporttitleisshow = true;
        this.report = historyreport;
        let submitdate = this.$store.getters.submitdate;
        if (historyreport.submitdate.year == submitdate.year && historyreport.submitdate.month == submitdate.month) {
          this.iscurrentmothreport = true;
        } else {
          this.iscurrentmothreport = false;
        }

        this.avaliblepo = historyreport.project;
        this.computedAvaliblepo();
      },
      //查看有些历史报告
      searchHistoryreports() {
        let myFormDatas = new FormData();
        //请求后台，保存基础方案提成
        let url = this.$store.state.host + 'projectreports/findprojectreportsbyid';
        myFormDatas.append('projectid', this.avaliblepo._id.toString());
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {
              if (result.data.report) {
                this.historyreports = result.data.report.reportarray;
              } else {
                this.historyreports = [];
              }
            }
          });
      },


      //打开协同详情页面
      lookXT(project) {

        this.$store.commit("openXTprojectHtml", project)
      },
      ///在协同中选择项目
      selectProjectInXT() {
        this.createproject = false;
        this.selectprojectisshow = true;
      },

      //添加项目
      addProject() {

        //console.log(this.avaliblepo);
        //检查 提成 和 分红 比例 是否是100
        tool.projectMoneySymbol(this.avaliblepo, false)
        let checkedresult = this.CheckAvaliblepo(this.avaliblepo, false);
        if (!checkedresult) {
          //如果有问题，不保存
          tool.projectMoneySymbol(this.avaliblepo, true)
          return;
        }
        let myFormDatas = new FormData();
        //请求后台，保存项目
        let url = this.$store.state.host + 'avalibleprojects/addproject';
        myFormDatas.append('project', JSON.stringify(this.avaliblepo));
        tool.projectMoneySymbol(this.avaliblepo, true);
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {//添加成功
              this.$router.push({path: '/avalibleProject'});
            } else {

              this.$store.commit("showMessageBox",{message:"添加失败，已经这个项目，可能是 名字重复 或者 项目编号 或者 合同编号 ",type:"error"} );
            }
          })
      },
      //弹出窗口
      showMessageBox(str) {
        alert(str);
      },
      //查看报告
      lookReport(report) {
        if (this.projectreportscurrent && this.projectreportscurrent.reportarray.length > 0) {
          this.lookCurrentHistoryProject(report);
        }
      },


      //查看报告页面
      switchReport() {
        this.switchPage("reportpageishow")
      },

      // 打勾 或者 取消勾 时 检查是否有收款时间，收款金额，发放时间
      checkCollectionRecord(collectionrecord) {
        if (!collectionrecord.ispay) {
          //this.showMessageBox("打勾")

        } else {

        }
      },

      //删除固定开支
      deleteBaseexpence(baseexpences, index) {
        baseexpences.splice(index, 1);
        this.computedAvaliblepo();//重新计算
      },
      //添加固定开支
      addBaseexpence(baseexpences) {
        this.modalbaseexpence = {name: "", rate: "", value: 0};

        /* //查看最后一个数据 是否有空
         if (baseexpences.length > 0) {
           let lastpo = baseexpences[baseexpences.length - 1];
           if (lastpo.name && lastpo.rate) {
             baseexpences.push({name: "", rate: 0, value: 0});
           }
         } else {
           baseexpences.push({name: "", rate: 0, value: 0});
         }*/
      },


      //从工作经费计算比例
      computedworkingfeerate(avaliblepo) {
        tool.projectMoneySymbol(avaliblepo, false);
        avaliblepo.workingfeerate = avaliblepo.workingfee / avaliblepo.validratefee * 100;
        if (avaliblepo.workingfeerate.toString().length > 9) {
          avaliblepo.workingfeerate = avaliblepo.workingfeerate.toFixed(6);
        }
        this.computedAvaliblepo();
      },
      computedworkingfee(avaliblepo) {
        tool.projectMoneySymbol(avaliblepo, false);
        avaliblepo.workingfee = avaliblepo.validratefee * avaliblepo.workingfeerate / 100;
        this.computedAvaliblepo();
      },

      //检查是否数据
      checkIsDouble(value) {
        var patrn = /^(-)?\d+(\.\d+)?$/;
        return !(patrn.exec(value) == null);
      },
    }
    ,
  }
</script>

<style scoped>
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

    border-bottom: 0px;
    width: 58%;
    height: 585px;
    float: left;
    margin-top: 10px;
    margin-left: 0.5%;
    padding: 2px;
  }
</style>
