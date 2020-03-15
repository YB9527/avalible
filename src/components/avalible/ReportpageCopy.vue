<template>
  <div>
    <div v-show="showreportpage">
      <div class="input-group mb-3" style="text-align: center;width: 300px;" v-show="showreportpagetop">
        <input type="month" class="form-control"
               aria-describedby="button-addon2"
               v-model="lookshortreportdate">
        <div class="input-group-append" @click="findProjectReportByDate(lookshortreportdate)">
          <button class="btn btn-outline-secondary" type="button">查看当月报告</button>
        </div>
      </div>
      <div style="text-align: center;margin: 0px 0px 50px 10%" v-for="(current,i) in historyreports">
        <table :id="'table'+(1+i)" class="table table-bordered table-hover">
          <thead>
          <tr>
            <!--<th style="width: 150px">
              <button type="button" @click="exportExcel('table'+(i+1),current.monthreport.project.projectname)"
                      v-show="showreportpagetop"
                      class="form-control  btn-outline-dark form-control-sm" style="margin-top: 2px;">
                下载Excel
              </button>
              &lt;!&ndash;<button type="button" @click="lookCurrentHistoryProject(current.monthreport)"
                      class="form-control  btn-outline-dark form-control-sm">
                当月报告
              </button>&ndash;&gt;
              <button type="button" @click="backProject(current.monthreport.project._id)" v-show="showreportpagetop"
                      class="form-control  btn-outline-dark form-control-sm" style="margin-top: 2px">
                当前项目
              </button>
            </th>-->
            <th :colspan="4+current.colspan"><h4>{{current.monthreport.project.projectname}}</h4></th>
            <!-- <th style="border-top: 0px red solid"></th>-->
          </tr>
          <tr>
            <th style="width: 150px">项目合同金额:</th>
            <th style="width: 150px;text-align: right">{{current.monthreport.project.contrafacevalue|moneyformat}}</th>
            <th style="width: 150px">有效比例金额：</th>
            <th style="width: 150px;text-align: right">{{current.monthreport.project.validratefee|moneyformat}}</th>
            <td style="width: 100px" v-for="(percentage,i) in current.colspan"></td>
          </tr>
          <tr>
            <th style="width: 150px">总提成:</th>
            <th style="width: 150px;text-align: right">{{current.monthreport.project.percentagetotal |moneyformat}}</th>
            <th style="width: 150px">总分红：</th>
            <th style="width: 150px;text-align: right">{{current.monthreport.project.fundpay|moneyformat}}</th>
            <td style="width: 100px" v-for="(percentage,i) in current.colspan"></td>
          </tr>
          <tr>
            <th colspan="2">总提成 + 总分红</th>
            <th colspan="2"> {{current.monthreport.project.percentagetotal*1+ current.monthreport.project.fundpay*1 |
              moneyformat}}
            </th>
            <td style="width: 100px" v-for="(percentage,i) in current.colspan"></td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th>之前累计收款：</th>
            <th style="text-align: right">
              {{(current.lastmonthreport)?current.lastmonthreport.project.amountcollectedtotal:0 |moneyformat}}
            </th>
            <th>本次收款：</th>
            <th style="text-align: right">{{current.monthreport.project.amountcollectedtotal|
              getAmountCollectedTotal(current.lastmonthreport)}}
            </th>
            <td v-for="(percentage,i) in current.colspan"></td>

          </tr>
          <tr>
            <th :colspan="4+ current.colspan">提成、分红 详细</th>
          </tr>
          <tr>

            <th>
              <!-- <button type="button" @click="lookCurrentHistoryProject(current.monthreport)"
                       class="form-control  btn-outline-dark form-control-sm">
                 之前累计数据
               </button>-->
            </th>
            <td></td>
            <th rowspan="2">之前累计合计<!-- <div  v-for="(percentage,i) in current.monthreport.project.percentages" style="margin: 0px 0px 3px 12px;font-size: 12px">
                  {{current.lastmonthreport | getCurrentPercentageValue(i,current.monthreport)}}
                </div>--></th>
            <th rowspan="2">本次合计<!----></th>
            <th colspan="2" v-for="(percentage,i) in current.monthreport.project.percentages">{{percentage.name}}</th>
          </tr>
          <tr>
            <th>
              <!-- <button type="button" @click="lookCurrentHistoryProject(current.monthreport)"
                       class="form-control  btn-outline-dark form-control-sm">
                 本次数据
               </button>-->
            </th>
            <td></td>
            <td v-for="(data,i) in current.qiandingdatas">{{data.msg}}</td>
          </tr>
          <tr>

            <th rowspan="4"><h4>提成:</h4></th>
            <td>合同签订</td>
            <td style="text-align: right">
              {{current.data.tichenglastqianding |moneyformat}}
            </td>
            <td style="text-align: right">
              {{current.data.tichengqianding|moneyformat}}
            </td>
            <td style="text-align: right" v-for="(data,i) in current.qiandingdatas">{{data.value |moneyformat}}</td>
          </tr>
          <tr>

            <td>收款绑定</td>
            <td style="text-align: right">
              {{current.data.tichenglastshoukuan |moneyformat}}
            </td>
            <td style="text-align: right">
              {{current.data.tichengshoukuan |moneyformat}}
            </td>
            <td style="text-align: right" v-for="(data,i) in current.shoukuandatas">{{data.value|moneyformat}}</td>

          </tr>
          <tr>

            <td>年终</td>
            <td style="text-align: right">
              {{current.data.tichenglastnianzhong |moneyformat}}
            </td>
            <td style="text-align: right">
              {{current.data.tichengnianzhong |moneyformat}}
            </td>
            <td style="text-align: right" v-for="(data,i) in current.nianzhogndatas">{{data.value|moneyformat}}</td>
          </tr>
          <tr>
            <td style="text-align: right">
              合计
            </td>
            <th style="text-align: right"> {{current.tichengzhiqain | moneyformat}}</th>
            <th style="text-align: right"> {{current.tichengxianzai |moneyformat}}</th>

            <th style="text-align: right" v-for="(hj,i) in current.hjs" v-if=" !(i===0 || i===1)"> {{hj |
              moneyformat}}
            </th>

          </tr>
          <tr>
            <th rowspan="4" ref="input1"><h4>分红:</h4></th>
            <td>合同签订</td>
            <td style="text-align: right">
              {{current.data.fenhonglastqianding |moneyformat}}
            </td>
            <td style="text-align: right">
              {{current.data.fenhongqianding |moneyformat}}
            </td>
            <td rowspan="5" :colspan="current.colspan"></td>
          </tr>
          <tr>

            <td>收款绑定</td>
            <td style="text-align: right">
              {{current.data.fenhonglastshoukuan |moneyformat}}
            </td>
            <td style="text-align: right">
              {{current.data.fenhongshoukuan |moneyformat}}
            </td>

          </tr>
          <tr>
            <td>年终</td>
            <td style="text-align: right">
              {{current.data.fenhonglastnianzhong |moneyformat}}
            </td>
            <td style="text-align: right">
              {{current.data.fenhongnianzhong |moneyformat}}
            </td>

          </tr>
          <tr>
            <td style="text-align: right">
              合计
            </td>
            <th style="text-align: right"> {{current.fenhongleji |moneyformat}}</th>
            <th style="text-align: right"> {{current.fenhongxianzai |moneyformat}}</th>
          </tr>
          <tr>
            <th colspan="1">
              合计：

            </th>
            <th>{{current.hjs[0] +current.hjs[1] | moneyformat}}
            </th>
            <th style="text-align: right" v-for="(hj,i) in current.hjs" v-if=" (i===0 || i===1)"> {{hj |
              moneyformat}}
            </th>
          </tr>
          </tbody>
        </table>
      </div>
    </div>


  </div>
</template>

<script>
  import axios from 'axios'
  import tool from '@/public/js/tool.js'
  import $ from 'jquery'
  export default {
    name: "ReportpageCopy",
    props: ['submitreport'],
    data() {
      return {
        historyreports: [],//历史项目
        lookshortreportdate: null,
        showcreateproject: false,
        showreportpage: true,
        editpo: null,
        colspan: 0,
        showreportpagetop: true,
      }
    },
    created() {
      //查询提交报告日期
      let date = new Date();
      let submitdate = this.$store.getters.submitdate;
      if (submitdate.month.length > 1) {
        this.lookshortreportdate = submitdate.year + "-" + submitdate.month;
      } else {
        this.lookshortreportdate = submitdate.year + "-0" + submitdate.month;
      }

      if (this.submitreport) {
        this.showreportpagetop = false;//顶部搜索隐藏

        this.historyreports = [];
        this.historyreports.push(this.submitreport);
        this.setdata(this.historyreports);
      }
    },
    computed: {},
    filters: {
      //所有报告的统计
      hejiproject(historyreports, method) {
        let sum = 0;
        for (let historyreport of historyreports) {
          sum = sum + parseFloat(historyreport.data[method]);
        }
        return tool.number_format(sum, 2, '.', ',');
      },
      moneyformat(value) {
        //return value;
        return tool.number_format(value, 2, '.', ',');
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
        return tool.number_format(result, 2, '.', ',');
        ;
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
        return tool.number_format(sum, 2, '.', ',');
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
        return tool.number_format(result, 2, '.', ',');
      },
      //yu shang
      fund1(lastmonthispay, monthispay, value) {
        if (lastmonthispay) {
          return 0.00;
        }
        if (monthispay) {
          return tool.number_format(value, 2, '.', ',');
        }
        return 0.00;
      },
      //得到本次收款
      getAmountCollectedTotal(value, lastmonthreport) {
        if (!lastmonthreport) {
          return tool.number_format(value, 2, '.', ',');
        }
        let sum = value - lastmonthreport.project.amountcollectedtotal;
        return tool.number_format(sum, 2, '.', ',');
      },
      //得到提成明细
      getPercentageValue(lastmonthreport, i) {
        if (!lastmonthreport) {
          return 0.00;
        }
        let percentage = lastmonthreport.project.percentages[i];
        let collectionrecords = lastmonthreport.project.collectionrecords;
        let sum = 0.00;
        for (let collectionrecord of collectionrecords) {
          if (collectionrecord.percentagepayispay) {
            //提成是发放状态
            sum = sum * 1 + collectionrecord.percentagepayvalueArray[i].value * 1;
          }
        }
        sum = sum.toFixed(2);
        return tool.number_format(sum, 2, '.', ',');
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

        return tool.number_format(currentsum - sum, 2, '.', ',');
      },
      getTotal(lastmonthproject, monthproject) {
        let lathsum = 0;
        let sum = 0;
        if (lastmonthproject) {
          lathsum = lastmonthproject.percentagepaysum * 1 + lastmonthproject.fundpaysum * 1
        }
        sum = monthproject.percentagepaysum * 1 + monthproject.fundpaysum * 1;
        let result = (sum - lathsum).toFixed(2);
        return tool.number_format(result, 2, '.', ',');

      },
      //已支付的 分红
      getFundTotal(collectionrecords) {
        if (collectionrecords === 0) {
          return 0.00;
        }
        let sum = 0;
        for (let collectionrecord of collectionrecords) {
          if (collectionrecord.fundispay) {
            sum = sum + collectionrecord.fundvalue * 1;
          }
        }
        return tool.number_format(sum, 2, '.', ',');
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
    methods: {
      exportExcel(id, filename) {

        let workbook = XLSX.utils.table_to_book(document.getElementById(id));
        XLSX.writeFile(workbook, filename + ' ' + this.lookshortreportdate + '.xlsx');


      },
      //根据id返回项目
      backProject(_id) {
        axios.get(this.$store.state.host + "avalibleprojects/findprojectbyid?_id=" + _id.toString())
          .then(res => {
            if (res.data.status === 0) {
              this.editpo = res.data.project;
              this.showreportpage = false;
              this.showcreateproject = true;

            }
          });
      },
      editpofunction_back(project) {
        this.showcreateproject = false;
        this.showreportpage = true;
      },
      shoukuanFilter(percentage, shoukuan, rate) {
        let p = JSON.parse(JSON.stringify(percentage));
        p.percentagerate = rate;
        p.input = shoukuan;
        tool.caculate(p, false);
        return p.percentageresult;
      },
      fund(lastmonthispay, monthispay, value) {
        if (lastmonthispay) {
          return 0;
        }
        if (monthispay) {
          return value;
        }
        return 0;
      },
      //根据日期查看历史项目
      findProjectReportByDate(date) {
        date = new Date(date);
        let submitdate = {year: date.getFullYear(), month: date.getMonth() + 1};
        let myFormDatas = new FormData();
        //请求后台，保存日期
        let url = this.$store.state.host + 'projectreports/findprojectreportbysubmitdate';
        myFormDatas.append('submitdate', JSON.stringify(submitdate));
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {//保存成功
              this.historyreports = result.data.reports;
              //循环添加对比数据
              this.setdata(this.historyreports);

            } else if (result.data.status === 1) {

            }
          });
      },
      setdata(historyreports) {
        let total = {
          tichengqianding: 0,
          tichengshoukuan: 0,
          tichengnianzhong: 0,
          tichenglastqianding: 0,
          tichenglastshoukuan: 0,
          tichenglastnianzhong: 0,

          fenhongqianding: 0,
          fenhongshoukuan: 0,
          fenhongnianzhong: 0,
          fenhonglastqianding: 0,
          fenhonglastshoukuan: 0,
          fenhonglastnianzhong: 0,

          contrafacevalue: 0,
          validratefee: 0,
          percentagetotal: 0,
          fundpay: 0,
          amountcollectedtotallast: 0,
          amountcollectedtotal: 0,

          fenghongzhiqian: 0,
          fenghongxianzai: 0,
          tichengzhiqain: 0,
          tichengxianzai: 0,

          zhiqianheji: 0,
          xianzaiheji: 0,

        };
        historyreports.total = total;
        for (let historyreport of historyreports) {

          let lastreport = historyreport.lastmonthreport;
          let currentproject = historyreport.monthreport.project;
          total.contrafacevalue += currentproject.contrafacevalue * 1;
          total.validratefee += currentproject.validratefee * 1;
          total.percentagetotal += currentproject.percentagetotal * 1;
          total.fundpay += currentproject.fundpay * 1;

          let amountcollectedtotallast = 0;
          if (lastreport) {
            amountcollectedtotallast = lastreport.project.amountcollectedtotal * 1;
            total.amountcollectedtotallast += lastreport.project.amountcollectedtotal * 1;
          }
          total.amountcollectedtotal += currentproject.amountcollectedtotal * 1 - amountcollectedtotallast;

          historyreport.colspan = currentproject.percentages.length * 2;
          let qiandingdatas = [];
          let shoukuandatas = [];
          let nianzhogndatas = [];
          let hjs = [];
          let zq = 0;
          let xianzai = 0;
          /*for(let i in currentproject.percentages.length){
            let percentage = currentproject.percentages[i];
          }*/
          for (let i = 0; i < currentproject.percentages.length; i++) {
            let percentage = currentproject.percentages[i];
            let qiandingvalue = currentproject.percentagepaysteponeratevaluearray[i];
            let nianzhongvalue = this.shoukuanFilter(percentage, currentproject.contrafacevalue, currentproject.percentagepaystepthreerate);
            let lastqianding, lastshoukuan = 0, lastnianzhong = 0, currentqianding = 0, currentnianzhong = 0,
              currentshoukuan = 0;
            if (!lastreport) {
              lastqianding = 0;
              lastshoukuan = 0;
              lastnianzhong = 0;
            } else {
              if (lastreport.project.percentagepaysteponeispay) {
                lastqianding = qiandingvalue;
              } else {
                lastqianding = 0;
              }
              //lastshoukuan = this.shoukuanFilter(percentage, currentproject,  total.amountcollectedtotallast);

              for (let record of lastreport.project.collectionrecords) {
                if (record.percentagepayispay) {
                  lastshoukuan = (lastshoukuan * 1 + record.percentagepayvalueArray[i] * 1).toFixed(2);
                }

              }
              if (lastreport.project.percentagepaystepthreeispay) {
                lastnianzhong = nianzhongvalue;
              } else {
                lastnianzhong = 0;
              }
            }
            if (currentproject.percentagepaysteponeispay) {
              currentqianding = qiandingvalue - lastqianding;
            } else {
              currentqianding = 0;
            }
            if (currentproject.percentagepaystepthreeispay) {
              currentnianzhong = nianzhongvalue - lastnianzhong;
            } else {
              currentnianzhong = 0;
            }
            for (let record of currentproject.collectionrecords) {
              if (record.percentagepayispay) {

                currentshoukuan = (currentshoukuan * 1 +  tool.moneySymbol(record.percentagepayvalueArray[i],false) * 1).toFixed(2);

              }
            }
            currentshoukuan = currentshoukuan - lastshoukuan;
            qiandingdatas.push({msg: "之前", value: lastqianding});
            qiandingdatas.push({msg: "本次", value: currentqianding});
            shoukuandatas.push({msg: "之前", value: lastshoukuan});
            shoukuandatas.push({msg: "本次", value: currentshoukuan});
            nianzhogndatas.push({msg: "之前", value: lastnianzhong});
            nianzhogndatas.push({msg: "本次", value: currentnianzhong});
            hjs.push(lastqianding * 1 + lastshoukuan * 1 + lastnianzhong * 1);
            hjs.push(currentqianding * 1 + currentshoukuan * 1 + currentnianzhong * 1);
            zq = zq * 1 + lastqianding * 1 + lastshoukuan * 1 + lastnianzhong * 1;
            xianzai = xianzai * 1 + currentqianding * 1 + currentshoukuan * 1 + currentnianzhong * 1;
          }

          historyreport.qiandingdatas = qiandingdatas;
          historyreport.shoukuandatas = shoukuandatas;
          historyreport.nianzhogndatas = nianzhogndatas;
          //合计计算
          hjs.unshift(xianzai);
          hjs.unshift(zq);
          historyreport.hjs = hjs;
          //之前分红
          let fenhongqianding = (lastreport) && (lastreport.project.fundpaysteponeispay) ? currentproject.fundpaysteponeratevalue : 0;
          hjs[0] = hjs[0] + fenhongqianding * 1;
          let fenghongshoukuan = lastreport ? lastreport.project.collectionrecords : 0;
          fenghongshoukuan = this.getFundTotal(fenghongshoukuan) * 1;
          //console.log(this.getFundTotal(fenghongshoukuan) * 1)
          hjs[0] = hjs[0] + fenghongshoukuan;
          let fenhongnianzhong = lastreport && (lastreport.project.fundpaystepthreeispay) ? currentproject.fundpaystepthreeratevalue : 0;
          hjs[0] = hjs[0] + fenhongnianzhong * 1;
          historyreport.fenhongleji = fenhongqianding * 1 + fenghongshoukuan * 1 + fenhongnianzhong * 1;


          //现在分红
          let xianzaiqianding = (lastreport) ? lastreport.project.fundpaysteponeispay : false;
          xianzaiqianding = this.fund1(xianzaiqianding, currentproject.fundpaysteponeispay, currentproject.fundpaysteponeratevalue);
          hjs[1] = hjs[1] * 1 + xianzaiqianding * 1;

          let xianzaishoukuan = (lastreport) ? lastreport.project.collectionrecords : null;

          xianzaishoukuan = this.getCurrentFundpay(xianzaishoukuan, currentproject.collectionrecords);
          hjs[1] = hjs[1] * 1 + xianzaishoukuan * 1;

          let xianzainianzhong = (lastreport) ? lastreport.project.fundpaystepthreeispay : false;
          xianzainianzhong = this.fund1(xianzainianzhong, currentproject.fundpaystepthreeispay, currentproject.fundpaystepthreeratevalue);
          hjs[1] = hjs[1] * 1 + xianzainianzhong * 1;

          historyreport.fenhongxianzai = xianzaiqianding * 1 + xianzaishoukuan * 1 + xianzainianzhong * 1;


          //计算提成
          //之前提成
          let tichengzhiqian_qianding = (lastreport) && (lastreport.project.percentagepaysteponeispay) ? lastreport.project.percentagepaysteponeratevalue : 0;
          let tichengzhiqian_shoukuan = (lastreport) ? lastreport.project.collectionrecords : 0;
          tichengzhiqian_shoukuan = this.getPercentageTotal(tichengzhiqian_shoukuan);
          let tichengzhiqian_nianzhong = (lastreport) && (lastreport.project.percentagepaystepthreeispay) ? lastreport.project.percentagepaystepthreeratevalue : 0;
          historyreport.tichengzhiqain = tichengzhiqian_qianding * 1 + tichengzhiqian_shoukuan * 1 + tichengzhiqian_nianzhong * 1;
          //现在提成
          let tichengxianzai_qianding = (lastreport) ? lastreport.project.percentagepaysteponeispay : false;
          tichengxianzai_qianding = this.fund1(tichengxianzai_qianding, currentproject.percentagepaysteponeispay, currentproject.percentagepaysteponeratevalue);
          let tichengxianzai_shoukuan = (lastreport) ? lastreport.project.collectionrecords : null;
          tichengxianzai_shoukuan = this.getCurrentPercentagepay(tichengxianzai_shoukuan, currentproject.collectionrecords);
          let tichengxianzai_nianzhong = (lastreport) ? lastreport.project.percentagepaystepthreeispay : false;
          tichengxianzai_nianzhong = this.fund1(tichengxianzai_nianzhong, currentproject.percentagepaystepthreeispay, currentproject.percentagepaystepthreeratevalue);
          historyreport.tichengxianzai = tichengxianzai_qianding * 1 + tichengxianzai_shoukuan * 1 + tichengxianzai_nianzhong * 1;
          let data = {};

          data.tichengqianding = tichengxianzai_qianding;
          data.tichengshoukuan = tichengxianzai_shoukuan;
          data.tichengnianzhong = tichengxianzai_nianzhong;
          data.tichenglastqianding = tichengzhiqian_qianding;
          data.tichenglastshoukuan = tichengzhiqian_shoukuan;
          data.tichenglastnianzhong = tichengzhiqian_nianzhong;

          data.fenhongqianding = xianzaiqianding;
          data.fenhongshoukuan = xianzaishoukuan;
          data.fenhongnianzhong = xianzainianzhong;
          data.fenhonglastqianding = fenhongqianding;
          data.fenhonglastshoukuan = fenghongshoukuan;
          data.fenhonglastnianzhong = fenhongnianzhong;
          historyreport.data = data;

          total.tichengqianding += tichengxianzai_qianding * 1;
          total.tichengshoukuan += tichengxianzai_shoukuan * 1;
          total.tichengnianzhong += data.tichengnianzhong * 1;
          total.tichenglastqianding += tichengzhiqian_qianding * 1;
          total.tichenglastshoukuan += tichengzhiqian_shoukuan * 1;
          total.tichenglastnianzhong += tichengzhiqian_nianzhong * 1;

          total.fenhongqianding += xianzaiqianding * 1;
          total.fenhongshoukuan += xianzaishoukuan * 1;
          total.fenhongnianzhong += xianzainianzhong * 1;
          total.fenhonglastqianding += fenhongqianding * 1;
          total.fenhonglastshoukuan += fenghongshoukuan * 1;
          total.fenhonglastnianzhong += fenhongnianzhong * 1;

          total.fenghongzhiqian += historyreport.fenhongleji * 1;
          total.fenghongxianzai += historyreport.fenhongxianzai * 1;
          total.tichengzhiqain += historyreport.tichengzhiqain * 1;
          total.tichengxianzai += historyreport.tichengxianzai * 1;

          total.zhiqianheji += hjs[0] * 1;
          total.xianzaiheji += hjs[1] * 1;

        }
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
        return sum;
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
      fund1(lastmonthispay, monthispay, value) {
        if (lastmonthispay) {
          return 0.00;
        }
        if (monthispay) {
          return value;
        }
        return 0.00;
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
        return sum;
      },
    },

  }
</script>

<style scoped>
  .table {
    width: 800px;
  }
</style>
