<template>
  <div>
    <div>
      <div class="alert alert-secondary" role="alert" style="height: 40px;padding: 2px 0px 0px 50px;margin-top: 2px;width: 100.7%">
        <div v-show="historyreporttitleisshow">
          <h3 style="margin: 0px 20px 0px 0px;float: left"> {{report.submitdate.year}}&nbsp;&nbsp;年&nbsp;&nbsp;{{report.submitdate.month}}&nbsp;&nbsp;月&nbsp;&nbsp;报告
          </h3>
          <button type="button" class="btn btn-outline-dark" @click="deleteReport(report)"
                  v-show="iscurrentmothreport">
            &nbsp;&nbsp;&nbsp;退回报告
            <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
          </button>

          <button type="button" class="btn btn-outline-dark" @click="backProjectBy_id(report.project._id)">
            返回项目 <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
          </button>
          <button type="button" class="btn btn-warning" @click="back_SearchAvalibleProject()">
            返回
          </button>
        </div>
        <div v-show="!historyreporttitleisshow">
          <div v-show="addprojectbut">
            <button type="button" class="btn btn-outline-dark" @click="selectProjectInXT">
              协同中选择 <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
            </button>
            <button type="submit" class="btn btn-outline-dark" @click="addProject" v-show="createproject">
              保存项目 <span class="glyphicon glyphicon-search"></span>
            </button>
          </div>

          <div class="btn-group" v-show="editprojectbut">
            <button type="submit" class="btn btn-outline-dark" @click="editProjectSave(avaliblepo)">
              修改
            </button>
            <button type="button" class="btn btn-outline-dark" @click="lookXT(avaliblepo.xietongproject)">
              协同详情
            </button>
            <button type="submit" class="btn btn-outline-dark" data-toggle="modal" data-target="#submitreport"
                    @click="submitProjectReport(avaliblepo)">
              提交报告
            </button>
            <div class="btn-group">
              <button type="button" @click="searchHistoryreports" class="btn btn-outline-dark dropdown-toggle"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                浏览历史报告
              </button>
              <div class="dropdown-menu">
                <button type="button" class="btn btn-outline-dark dropdown-item"
                        @click="openHistoryReport(historyreport)" v-for="(historyreport,i) in historyreports">
                  {{historyreport.submitdate.year+'年'+historyreport.submitdate.month+'月报告'}}
                </button>
              </div>
            </div>

            <button type="button" class="btn btn-warning" @click="back_SearchAvalibleProject()">
              返回
            </button>
          </div>
          <!--<button type="button" class="btn btn-warning" @click="backProjectBy_id(avaliblepo._id)"
                  v-show="showbaseicpercentages">
            返回本项目
          </button>-->
          <!--<button type="button" class="btn btn-warning" @click="test()">
            测试
          </button>-->
        </div>
        <!--<div style="float: right" v-show="editprojectbut">
          <select v-model="selectprojectreport">
                
            <option v-for="report in projectreportscurrent.reportarray" :value="report">
              {{report.submitdate.year}}年{{report.submitdate.month}}月
            </option>
          </select>
          <input type="button" value="查看报告" @click="lookReport(selectprojectreport)">
        </div>-->
      </div>
    </div>
    <div v-if="createproject">
      <div>
        <div class="form-group row">
          <label style="width: 90px;text-align: right"><font
            :color="avaliblepo.projectname?successrgb:errrgb">项目名称: </font></label>
          <div class="col-sm-3">
            <input type="text" class="form-control form-control-sm " v-model="avaliblepo.projectname" required
                   v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"/>
          </div>
          <label style="text-align: left"><font :color="avaliblepo.projectid?successrgb:errrgb"> 项目编号:</font> </label>
          <div class="col-sm-2">
            <input v-bind:disabled="true" class="form-control form-control-sm" type="text" required
                   v-model="avaliblepo.projectid"/>
          </div>
          <label style="text-align: left"><font :color="avaliblepo.projectcantractid?successrgb:errrgb"> 合同编号:</font>
          </label>
          <div class="col-sm-2">
            <input type="text" class="form-control form-control-sm" v-model="avaliblepo.projectcantractid" required
                   v-bind:disabled="true"/>
          </div>
          <div class="col-sm-2">
            <h3 style="margin: 0px">收款总额：{{avaliblepo.amountcollectedtotal }}</h3>
          </div>

        </div>
      </div>
      <div>
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
                         v-bind:disabled="historyreporttitleisshow | flag(avaliblepo.issubmitreport)"/></td>
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
                         @blur.prevent="computedworkingfee(avaliblepo)"
                         v-model="avaliblepo.workingfeerate"
                         v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"/>
              </td>
              <td><input type="text" class="form-control form-control-sm" required
                         @blur.prevent="computedworkingfeerate(avaliblepo)"
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
                          data-toggle="modal"
                          data-target="#percentagemodal"
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
              <td>分红利润:</td>
              <td><input type="text" class="form-control form-control-sm" v-bind:disabled="true"/></td>
              <td><input type="text" v-model="avaliblepo.avalibleshare" class="form-control form-control-sm"
                         v-bind:disabled="true"/></td>
              <td></td>
            </tr>
            <tr>
              <td>毛利率:</td>
              <td><input type="text" class="form-control form-control-sm" v-bind:disabled="true"/></td>
              <td><input type="text" v-model="avaliblepo.benifitrate" class="form-control form-control-sm" required
                         v-bind:disabled="true"/></td>
              <td></td>
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
            <table class="table" style="margin: 5px;max-width: 800px">
              <thead>
              <tr>
                <th style="width: 100px"></th>
                <th style="width: 180px">内容</th>
                <th style="width: 80px">比例</th>
                <th>值</th>
                <th style="width: 80px"> 是否发放</th>
                <th style="width: 100px">发放月份</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td rowspan="3"><h4>提成</h4>  <br/>合计:<br/>{{avaliblepo.percentagetotal }}</td>
                <td>合同签订当月</td>
                <td><input type="text" class="form-control form-control-sm "
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.percentagepaysteponerate"
                           @blur.prevent="computedAvaliblepo()"/></td>
                <td>
                  <div class="btn-group">
                    <button type="button"
                            class="form-control  btn-outline-dark  dropdown-toggle "
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {{avaliblepo.percentagepaysteponeratevalue}}
                    </button>
                    <div class="dropdown-menu">
                      <button type="button" class="btn btn-outline-dark dropdown-item"
                              v-for="(percentage,i) in avaliblepo.percentages">
                        {{percentage.name}}：{{ avaliblepo.percentagepaysteponeratevaluearray[i]}}
                      </button>
                    </div>
                  </div>
                <td>
                  <toggleswitch
                    :edit="{po:avaliblepo,method:'percentagepaysteponeispay',disabled:(avaliblepo.percentagepaysteponelock || historyreporttitleisshow)}">

                  </toggleswitch>
                </td>
                <td><input type="month" class="form-control"
                           v-bind:disabled="avaliblepo.percentagepaysteponelock | flag(historyreporttitleisshow)"
                           v-model="avaliblepo.percentagepaysteponeispaydate"></td>
              </tr>
              <tr>

                <td>收款绑定</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.percentagepaysteptworate"
                           @blur.prevent="computedAvaliblepo()"/></td>
                <td>
                  <div class="btn-group">
                    <button type="button"
                            class="form-control  btn-outline-dark  dropdown-toggle "
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {{avaliblepo.percentagepaysteptworatevalue}}
                    </button>
                    <div class="dropdown-menu">
                      <button type="button" class="btn btn-outline-dark dropdown-item"
                              v-for="(percentage,i) in avaliblepo.percentages">
                        {{percentage.name}}：{{ avaliblepo.percentagepaysteptworatevaluearray[i]}}
                      </button>
                    </div>
                  </div>

                </td>

                <td></td>
              </tr>
              <tr>

                <td>年终</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.percentagepaystepthreerate"
                           @blur.prevent="computedAvaliblepo()"/></td>
                <td>
                  <div class="btn-group">
                    <button type="button"
                            class="form-control  btn-outline-dark  dropdown-toggle "
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {{avaliblepo.percentagepaystepthreeratevalue}}
                    </button>
                    <div class="dropdown-menu">
                      <button type="button" class="btn btn-outline-dark dropdown-item"
                              v-for="(percentage,i) in avaliblepo.percentages">
                        {{percentage.name}}：{{ avaliblepo.percentagepaystepthreeratevaluearray[i]}}
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <toggleswitch
                    :edit="{po:avaliblepo,method:'percentagepaystepthreeispay',disabled:(avaliblepo.percentagepaystepthreelock || historyreporttitleisshow)}">

                  </toggleswitch>
                </td>
                <td><input type="month" class="form-control"
                           v-bind:disabled="avaliblepo.percentagepaystepthreelock  | flag(historyreporttitleisshow)"
                           v-model="avaliblepo.percentagepaystepthreeispaydate">
                </td>

              </tr>
              <tr>
                <td rowspan="3"><h4>分红</h4>  <br/>合计:<br/>{{avaliblepo.fundpay }}</td>
                <td>合同签订当月</td>


                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.fundpaysteponerate"
                           @blur.prevent="computedAvaliblepo()"/></td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="true" v-model="avaliblepo.fundpaysteponeratevalue"></td>

                <td>
                  <toggleswitch
                    :edit="{po:avaliblepo,method:'fundpaysteponeispay',disabled:(avaliblepo.fundpaysteponelock || historyreporttitleisshow)}">

                  </toggleswitch>
                </td>
                <td><input type="month" class="form-control"
                           v-bind:disabled="avaliblepo.fundpaysteponelock | flag(historyreporttitleisshow)"
                           v-model="avaliblepo.fundpaysteponeispaydate">
                </td>

              </tr>
              <tr>

                <td>收款绑定</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.fundpaysteptworate"
                           @blur.prevent="computedAvaliblepo()"/></td>

                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="true" v-model="avaliblepo.fundpaysteptworatevalue"></td>
                <td></td>
              </tr>
              <tr>
                <td>年终</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow| flag(avaliblepo.issubmitreport)"
                           v-model="avaliblepo.fundpaystepthreerate"
                           @blur.prevent="computedAvaliblepo()"/></td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="true" v-model="avaliblepo.fundpaystepthreeratevalue"></td>

                <td>
                  <toggleswitch
                    :edit="{po:avaliblepo,method:'fundpaystepthreeispay',disabled:(avaliblepo.fundpaystepthreelock || historyreporttitleisshow)}">

                  </toggleswitch>
                </td>
                <td><input type="month" class="form-control"
                           v-bind:disabled="avaliblepo.fundpaystepthreelock | flag(historyreporttitleisshow)"
                           v-model="avaliblepo.fundpaystepthreeispaydate">
                </td>


              </tr>
              </tbody>
            </table>

            <table class="table-bordered" style="width: 100%">
              <thead>
              <tr style="text-align: center">
                <th>
                  <button type="button" class="btn btn-primary" data-toggle="modal"
                          data-target="#collectionrecordmodal"
                          v-bind:hidden="historyreporttitleisshow"
                          @click="addCollectionRecord()">
                    添加收款 <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                  </button>
                </th>
                <th rowspan="2">收款时间</th>
                <th rowspan="2">收款金额</th>
                <th colspan="3">提成</th>
                <th colspan="3">分红</th>
                <th rowspan="2">操作</th>
              </tr>
              <tr style="text-align: center">
                <th> 序号
                </th>
                <th>发放时间</th>
                <th>发放金额</th>
                <th>是否发放</th>
                <th>发放时间</th>
                <th>发放金额</th>
                <th>是否发放</th>
              </tr>
              </thead>
              <tbody>

              <tr v-for="(collectionrecord,i) in avaliblepo.collectionrecords">
                <td style="text-align: center">{{i+1}}</td>
                <td><input type="date" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow | lockCollectionrecordDate(collectionrecord.percentagecollectionlock,collectionrecord.fundcollectionlock)"
                           v-model="collectionrecord.amountdate"
                ></td>
                <td><input type="text" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow | lockCollectionrecordDate(collectionrecord.percentagecollectionlock,collectionrecord.fundcollectionlock)"
                           v-model="collectionrecord.amountcollected" @blur.prevent="computedAvaliblepo()">
                </td>
                <td><input type="month" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow  | lockCollectionrecordPercentage(collectionrecord.percentagecollectionlock)"
                           v-model="collectionrecord.percentagepaydate">
                </td>
                <td>
                  <div class="btn-group">
                    <button type="button"
                            class="form-control  btn-outline-dark  dropdown-toggle "
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {{collectionrecord.percentagevalue}}
                    </button>
                    <div class="dropdown-menu">
                      <button type="button" class="btn btn-outline-dark dropdown-item"
                              v-for="(percentage,i) in avaliblepo.percentages">
                        {{percentage.name}}：{{ collectionrecord.percentagepayvalueArray[i]}}
                      </button>
                    </div>
                  </div>

                </td>
                <td style="text-align: center">
                  <!-- <el-checkbox v-model="collectionrecord.percentagepayispay" label="发放"  size="medium"  v-bind:disabled="historyreporttitleisshow  | lockCollectionrecordPercentage(collectionrecord.percentagecollectionlock) "
                                @blur.prevent="checkCollectionRecord(collectionrecord)" ></el-checkbox>-->
                  <input type="checkbox"
                         v-bind:disabled="historyreporttitleisshow  | lockCollectionrecordPercentage(collectionrecord.percentagecollectionlock) "
                         @blur.prevent="checkCollectionRecord(collectionrecord)"
                         v-model="collectionrecord.percentagepayispay"></td>
                <td><input type="month" class="form-control form-control-sm"
                           v-bind:disabled="historyreporttitleisshow  | lockCollectionrecordPercentage(collectionrecord.fundcollectionlock)"
                           v-model="collectionrecord.fundpaydate"></td>

                <td> {{collectionrecord.fundvalue}}</td>
                <td style="text-align: center">

                  <input type="checkbox"
                         v-bind:disabled="historyreporttitleisshow  | lockCollectionrecordPercentage(collectionrecord.fundcollectionlock)"
                         @blur.prevent="checkCollectionRecord(collectionrecord)"
                         v-model="collectionrecord.fundispay">
                </td>
                <td>
                  <button type="button" class="btn btn-outline-dark"
                          :hidden="historyreporttitleisshow | lockCollectionrecordDate(collectionrecord.percentagecollectionlock,collectionrecord.fundcollectionlock)"
                          @click="deleteItem(avaliblepo.collectionrecords,i)">
                    删除
                  </button>
                </td>
              </tr>


              </tbody>
            </table>

          </div>

        </div>
      </div>

    </div>
    <div v-if="selectprojectisshow">
      <XTProject @childFn="selectProjectInXT_ok" :createproject="false"></XTProject>
    </div>

    <!-- 提交报告对比 Modal -->
    <!-- Modal -->
    <div class="modal fade" id="submitreport" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable  modal-xl" role="document" st>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle">提交报告 {{this.$store.getters.submitdatecustom}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <reportpage v-if="showreportpage" :submitreport="submitreport"></reportpage>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="reportSubmit_ok">提交</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal 收款记录-->
    <div class="modal fade" id="collectionrecordmodal" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">添加收款记录</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-bordered">
              <tbody>
              <tr>
                <th scope="row">收款时间：</th>
                <td><input type="date" class="form-control form-control-sm" v-model="collectionrecord.amountdate"></td>
                <td style="text-align: right">收款金额</td>
                <td style="text-align: right"><input type="text" class="form-control form-control-sm"
                                                     @blur.prevent="computedamountcollected_add(avaliblepo,collectionrecord)"
                                                     v-model="collectionrecord.amountcollected">
                </td>
                <td style="text-align: center">
                  <div class="btn-group" v-show="editprojectbut">
                    <button type="button"
                            class="form-control  btn-outline-dark  dropdown-toggle "
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span v-show="waitxtshoukuanrecords">查询中。。。</span> <span
                      v-show="!waitxtshoukuanrecords"> 协同收款</span>
                    </button>
                    <div class="dropdown-menu">
                      <button type="button" class="btn btn-outline-dark dropdown-item"
                              @click="addShouKuanByXT(collectionrecord,xtshoukuan)"
                              v-for="(xtshoukuan,i) in xtshoukuanrecords">
                        收款日期： {{xtshoukuan.date}}，收款金额： {{xtshoukuan.money}} 元
                      </button>
                    </div>
                  </div>

                </td>
              </tr>
              <tr>
                <th scope="row">提成发放月份</th>
                <td><input type="month" class="form-control form-control-sm"
                           v-model="collectionrecord.percentagepaydate"></td>

                <td style="text-align: right">发放金额</td>
                <td style="text-align: left">

                  <div class="btn-group dropright">
                    <button type="button" class="form-control  btn-outline-dark" style="width: 180px;text-align: left">
                      {{collectionrecord.percentagevalue}}
                    </button>
                    <button type="button" class="btn btn-outline-dark dropdown-toggle dropdown-toggle-split"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span class="sr-only">Toggle Dropright</span>
                    </button>
                    <div class="dropdown-menu">
                      <button type="button" class="btn btn-outline-dark dropdown-item"
                              v-for="(percentage,i) in avaliblepo.percentages">
                        {{percentage.name}}：{{ collectionrecord.percentagepayvalueArray[i]}}
                      </button>
                    </div>
                  </div>

                </td>
                <td style="text-align: center">
                  <toggleswitch ref="child1"
                                :edit="{po:collectionrecord,method:'percentagepayispay',disabled:false}">
                  </toggleswitch>
                </td>
              </tr>
              <tr>
                <th scope="row">分红发放月份</th>
                <td><input type="month" class="form-control form-control-sm" v-model="collectionrecord.fundpaydate">
                </td>
                <td style="text-align: right">发放金额</td>
                <td style="text-align: right"><input type="text" class="form-control form-control-sm"
                                                     v-bind:disabled="true"
                                                     v-model="collectionrecord.fundvalue"></td>
                <td style="text-align: center">
                  <toggleswitch ref="child2"
                                :edit="{po:collectionrecord,method:'fundispay',disabled:false}">
                  </toggleswitch>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" :data-dismiss="modal"
                    @click="saveCollectionrecord(collectionrecord)">保存
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--添加提成-->
    <div class="modal fade" id="percentagemodal" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalScrollableTitle2"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable  modal-xl" role="document" style="width: 830px;height: 90%">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle2">{{modalbaseexpencetitle}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    @click="percentages(avaliblepo)">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="text-align: center">
            <div>
              <div v-if="showbaseicpercentages">
                <BaseicPercentages @percentages="percentages" :state="percentagestate" :editindex="editindex"
                                   :avaliblepo="avaliblepo"></BaseicPercentages>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- 添加固定开支 -->
    <div class="modal fade" id="baseexpencemodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle1"
         aria-hidden="true">
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
              <tr>
                <td>固定开支名字:</td>
                <td><input type="text" class="form-control" v-model="modalbaseexpence.name"></td>
              </tr>
              <tr>
                <td>比例:</td>
                <td><input type="text" class="form-control" v-model="modalbaseexpence.rate" placeholder="不要加%"></td>
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
    watch: {
      modalbaseexpencetitle(val, oldvalue) {
        $('#percentagemodal').modal({backdrop: 'static', keyboard: false});
      },
      submitreport(val, oldvalue) {
        $('#submitreport').modal({backdrop: 'static', keyboard: false});
      },
    },
    data() {
      return {
        modal: "",
        modalbaseexpence: {},
        modalbaseexpencetitle: "",
        successrgb: '#000',
        errrgb: '#F40002',
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
      if (this.$route.path === "/user/createproject") {

        this.$store.commit("getCustom", {
          url: "avalibleprojects/getcreatebasicproject", callback: (res) => {
            this.avaliblepo = res.data.project;
            this.avaliblepo.user = this.$store.getters.getUser;
            //console.log(this.avaliblepo);
            this.historyreporttitleisshow = false;
            this.addprojectbut = true;
            this.editprojectbut = false;
            this.backprojectsbtu = false;
            this.createproject = false;
          }
        });
      } else {
        this.avaliblepo = this.editpo;
        this.computedAvaliblepo(this.avaliblepo);
        this.historyreporttitleisshow = false;
        this.addprojectbut = false;
        this.editprojectbut = true;
        this.backprojectsbtu = true;
        this.createproject = true;
      }
      if (this.editprojectbut) {
        //如果是编辑状态才添加 ,根据协同添加收款记录
        this.xtshoukuanrecords = [];
        this.waitxtshoukuanrecords = true;
        axios.get(this.$store.state.host + 'xietong/shoukuan?id=' + this.avaliblepo.xietongproject.id)
          .then(res => {
            if (res.data.status === 0) {
              this.xtshoukuanrecords = res.data.records;
              this.waitxtshoukuanrecords = false;
            }
          });
      }
    },
    methods: {

      addmodalbaseexpence(modalbaseexpence) {
        if (!modalbaseexpence.name) {
          this.$store.commit("showMessageBox", {message:"名字缺少",type:'error'});
          return;
        }
        try {
          if (modalbaseexpence.rate * 1 <= 0) {
            this.$store.commit("showMessageBox", {message:"比例有问题",type:'error'});

            return;
          }
        } catch (e) {
          this.$store.commit("showMessageBox", {message:"比例输入有问题",type:'error'});

          return;
        }
        ($('#baseexpencemodal')).modal("hide");
        this.avaliblepo.baseexpences.push(modalbaseexpence);
        this.computedAvaliblepo();
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

          this.$store.commit("showMessageBox", {message:"收款金额小于0",type:'error'});
          return;
        }
        if (!record.amountdate) {

          this.$store.commit("showMessageBox", {message:"收款日期为空",type:'error'});
          return;
        }
        if (!record.amountdate) {
          this.$store.commit("showMessageBox", {message:"收款日期为空",type:'error'});

          return;
        }
        if (record.percentagepayispay) {
          if (!record.percentagepaydate) {
            this.$store.commit("showMessageBox", {message:"提成分发日期没有填写",type:'error'});

            return;
          }

        }
        if (record.fundispay) {
          if (!record.fundpaydate) {

            this.$store.commit("showMessageBox", {message:"分红分发日期没有填写",type:'error'});
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
              this.$store.commit("notify", {message:"提交成功",type:'success'});
            } else if (result.data.status === 1) {
              this.$store.commit("showMessageBox", result.data.message);
            }
          })
      },
      //提交报告
      submitProjectReport(project) {
        this.showreportpage = false;
        tool.projectMoneySymbol(project, false);
        if (!this.CheckAvaliblepo(this.avaliblepo, true)) {
          tool.projectMoneySymbol(project, true)
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
      //得到初始的项目
      /* getBasicProject() {
         this.avaliblepo = {
           xietongproject: {},
           issubmitreport: false,
           projectid: '',//合同编号
           projectcantractid: '',//合同编号
           projectname: '',//项目名称
           contrafacevalue: '',//主合同金额
           validrate: 100,/!*有效比例，*!/  validratefee: 0,/!*有效金额，*!/
           preparefeefix: 1,/!*前期固定比例*!/ preparefeefixfee: 0,/!*前期固定金额*!/
           preparefeereal: 0,/!*前期（实际）*!/
           prepareover: 0,/!*前期费（超额）*!/
           workingfeerate: 10,/!*工作经费比率*!/ workingfee: 0,/!*工作金额值*!/

           percentages: [],//预计提成奖励A型,预计提成奖励B型,预计提成奖励C型

           cooperationbudget: 0,//预算A,
           //projectid: fundproject.projectid,//固开支A、固开支B、固开支C、固开支D
           hezuoyusuanA: 0,//合作预算A
           baseexpences: [//固开支
             {name: "税务成本（增值税、附加税）", rate: 5, value: 0},
             {name: "市场拓展部公摊（失败项目、办公位、设备消耗、材料费等）", rate: 1, value: 0},
             {name: "经营中心公摊", rate: 3, value: 0},
             {name: "软件中心公摊", rate: 1, value: 0},
           ],//固开支
           percentagetotal: 0,//总提成
           avalibleshare: 0,//分红利润
           benifitrate: 0,//毛利率
           fundrate: 7,/!*分红比例*!/ fundpay: 0,//分红金额，总分红
           percentagepaysteponerate: 40,/!*提成_合同签订当月*!/ percentagepaysteponeratevalue: 0,//金额
           percentagepaysteponeratevaluearray: [],//提成签订合同详细金额
           percentagepaysteponeispay: false,//是否发放签订提成
           percentagepaysteponeispaydate: null,//发放签订提成日期
           percentagepaysteptworate: 40,/!*提成_收款绑定*!/percentagepaysteptworatevalue: 0,//金额
           percentagepaysteptworatevaluearray: [],//提成收款绑定详细金额
           percentagepaystepthreerate: 20,/!*提成_年终*!/percentagepaystepthreeratevalue: 0,//金额
           percentagepaystepthreeratevaluearray: [],//提成年终详细金额
           percentagepaystepthreeispay: false,//是否发放年终提成
           percentagepaystepthreeispaydate: null,//发放年终提成日期
           percentagepaysum: 0,//已支付项目提成
           percentagenotpaysum: 0,//未支付的项目提成

           percentagepaysteponelock: false,//提成签订锁定
           percentagepaystepthreelock: false,//提成年终锁定
           fundpaysteponelock: false,//分红签订锁定
           fundpaystepthreelock: false,//分红年终锁定

           fundpaysteponerate: 40,/!*分红_合同签订当月*!/fundpaysteponeratevalue: 0,//金额
           fundpaysteponeispay: false,//是否发放签订分红
           fundpaysteponeispaydate: null,//发放签订分红日期
           fundpaysteptworate: 40,/!*分红_收款绑定*!/fundpaysteptworatevalue: 0,//金额
           fundpaystepthreerate: 20,/!*分红_年终*!/fundpaystepthreeratevalue: 0,//金额
           fundpaystepthreeispay: false,//是否发放年终分红
           fundpaystepthreeispaydate: null,//发放年终分红日期
           fundpaysum: 0,//已支付项目分红
           fundnotpaysum: 0,//未支付的项目分红
           //收款金额
           collectionrecords: [
             /!*{
               amountdate: null,//收款日期
               amountcollected: 0,//收款金额
               percentagepayispay: false,//提成是还发放
               percentagevalue: 0,//提成金额
               percentagepayvalueArray: [],//提成详细情况 只有值
               percentagepaydate: null,//提成发放日期
               percentagecollectionlock: false,//提成锁
               fundispay: false,//分红是还发放
               fundpaydate: null,//分红发放日期
               fundvalue: 0,//分红金额
               fundcollectionlock: false,//分红锁
             },*!/
           ],
           amountcollectedtotal: 0,//收款总额
         };
         this.computedAvaliblepo();
       },*/
      //计算 间接数据 avaliblepo 对象中的数据
      computedAvaliblepo() {
        //先解除符号，在添加
        tool.projectMoneySymbol(this.avaliblepo, false);
        //有效比例 金额计算
        this.avaliblepo.validratefee = (this.avaliblepo.contrafacevalue * this.avaliblepo.validrate / 100).toFixed(2);
        //前期固定 金额计算
        this.avaliblepo.preparefeefixfee = (this.avaliblepo.validratefee * this.avaliblepo.preparefeefix / 100).toFixed(2);
        //前期费（超额） 如果差值小于0 取0
        let max = this.avaliblepo.preparefeereal - this.avaliblepo.preparefeefixfee;
        if (max < 0) {
          this.avaliblepo.prepareover = 0;
        } else {
          this.avaliblepo.prepareover = max;
        }
        this.avaliblepo.workingfee = this.avaliblepo.validratefee * this.avaliblepo.workingfeerate / 100;
        //工作经费 金额计算
        //this.avaliblepo.workingfee=this.avaliblepo.validratefee* this.avaliblepo.workingfeerate/100;
        //计算固开支 数据值
        if (this.avaliblepo.baseexpences) {
          for (let baseexpence of this.avaliblepo.baseexpences) {
            baseexpence.value = (this.avaliblepo.validratefee * baseexpence.rate / 100).toFixed(2);
          }
        }
        //得到 提成表A、B、C。。。。对应的 值
        {
          //查找数据库 中的 提成表 ，
          this.avaliblepo.percentagetotal = 0;//提成总金额
          this.avaliblepo.percentagepaysteponeratevaluearray = [];
          this.avaliblepo.percentagepaysteptworatevaluearray = [];
          this.avaliblepo.percentagepaystepthreeratevaluearray = [];
          //计算 提成 合同签订详细 最后一个值加差值
          let total1 = 0;
          let total2 = 0;
          let total3 = 0;
          let plenth = this.avaliblepo.percentages.length;
          for (let i = 0; i < plenth; i++) {
            let percentage = this.avaliblepo.percentages[i];
            percentage.input = this.avaliblepo.contrafacevalue;
            percentage.validrate = this.avaliblepo.validrate;
            percentage.result = (tool.caculate(percentage)).toFixed(2);

            if (i !== plenth - 1) {


              total1 = (total1 * 1 + (percentage.result * this.avaliblepo.percentagepaysteponerate / 100).toFixed(2) * 1);
              total2 = (total2 * 1 + (percentage.result * this.avaliblepo.percentagepaysteptworate / 100).toFixed(2) * 1);
              total3 = (total3 * 1 + (percentage.result * this.avaliblepo.percentagepaystepthreerate / 100).toFixed(2) * 1);
            }


            //计算 提成 合同签订详细
            this.avaliblepo.percentagepaysteponeratevaluearray.push((percentage.result * this.avaliblepo.percentagepaysteponerate / 100).toFixed(2));
            //计算 提成 收款绑定详细
            this.avaliblepo.percentagepaysteptworatevaluearray.push((percentage.result * this.avaliblepo.percentagepaysteptworate / 100).toFixed(2));
            //计算 提成 年终绑定详细,用总和去减
            this.avaliblepo.percentagepaystepthreeratevaluearray.push((percentage.result * this.avaliblepo.percentagepaystepthreerate / 100).toFixed(2));
            this.avaliblepo.percentagetotal += percentage.result * 1;
          }

          //计算
          //计算提成发放金额
          {
            this.avaliblepo.percentagepaysteponeratevalue = (this.avaliblepo.percentagetotal * this.avaliblepo.percentagepaysteponerate / 100).toFixed(2);
            this.avaliblepo.percentagepaysteptworatevalue = (this.avaliblepo.percentagetotal * this.avaliblepo.percentagepaysteptworate / 100).toFixed(2);
            this.avaliblepo.percentagepaystepthreeratevalue = (this.avaliblepo.percentagetotal * 1 - this.avaliblepo.percentagepaysteponeratevalue - this.avaliblepo.percentagepaysteptworatevalue).toFixed(2);

            if (plenth > 0) {
              this.avaliblepo.percentagepaysteponeratevaluearray[plenth - 1] = this.avaliblepo.percentagepaysteponeratevalue * 1 - total1;
              this.avaliblepo.percentagepaysteptworatevaluearray[plenth - 1] = this.avaliblepo.percentagepaysteptworatevalue - total2;
              this.avaliblepo.percentagepaystepthreeratevaluearray[plenth - 1] = this.avaliblepo.percentagepaystepthreeratevalue - total3;
            }
          }

          let baseexpencessum = 0;
          for (let baseexpence of this.avaliblepo.baseexpences) {
            baseexpencessum += baseexpence.value * 1;
          }
          //算分红利润
          //this.avaliblepo.avalibleshare = this.avaliblepo.validratefee - this.avaliblepo.preparefeereal-this.avaliblepo.workingfee-this.avaliblepo.cooperationbudget-this.avaliblepo.hezuoyusuanA-baseexpencessum-12000;
          this.avaliblepo.avalibleshare = (this.avaliblepo.validratefee - this.avaliblepo.preparefeereal - this.avaliblepo.workingfee - this.avaliblepo.cooperationbudget - this.avaliblepo.hezuoyusuanA - baseexpencessum - this.avaliblepo.percentagetotal).toFixed(2);
          //毛利率
          this.avaliblepo.benifitrate = (this.avaliblepo.avalibleshare / this.avaliblepo.validratefee * 100).toFixed(2);
          //分红
          this.avaliblepo.fundpay = (this.avaliblepo.avalibleshare * this.avaliblepo.fundrate / 100).toFixed(2);
          //计算分红金额
          {
            this.avaliblepo.fundpaysteponeratevalue = (this.avaliblepo.fundpay * this.avaliblepo.fundpaysteponerate / 100).toFixed(2);
            this.avaliblepo.fundpaysteptworatevalue = (this.avaliblepo.fundpay * this.avaliblepo.fundpaysteptworate / 100).toFixed(2);

            this.avaliblepo.fundpaystepthreeratevalue = (this.avaliblepo.fundpay - this.avaliblepo.fundpaysteponeratevalue - this.avaliblepo.fundpaysteptworatevalue).toFixed(2)
          }
          //计算收款时 提成
          {
            //计算收款总金额
            {
              this.avaliblepo.amountcollectedtotal = 0;

              for (let collectionrecord of this.avaliblepo.collectionrecords) {
                //如果收款大于 总合同金额，取差值过去

                let max = this.avaliblepo.contrafacevalue - this.avaliblepo.amountcollectedtotal;
                this.computedamountcollected(this.avaliblepo, collectionrecord, max);

                tool.moneySymbolPoSet(collectionrecord, "percentagevalue", false);
                tool.moneySymbolPoSet(collectionrecord, "amountcollected", false);

                this.avaliblepo.amountcollectedtotal = this.avaliblepo.amountcollectedtotal * 1 + collectionrecord.amountcollected * 1;

              }

              //总金额保留两位小数
              this.avaliblepo.amountcollectedtotal = (this.avaliblepo.amountcollectedtotal).toFixed(2);
            }
          }
        }

        //计算已支付的提成
        {
          let percentagepaysum = 0;
          for (let collectionrecord of this.avaliblepo.collectionrecords) {

            if (collectionrecord.percentagepayispay) {
              if (collectionrecord.percentagevalue) {//有问题
                percentagepaysum = percentagepaysum * 1 + collectionrecord.percentagevalue * 1;
              }
            }
          }

          //加 合同绑定
          if (this.avaliblepo.percentagepaysteponeispay) {
            percentagepaysum = percentagepaysum * 1 + this.avaliblepo.percentagepaysteponeratevalue * 1;
          }
          //加 年终绑定
          if (this.avaliblepo.percentagepaystepthreeispay) {
            percentagepaysum = percentagepaysum * 1 + this.avaliblepo.percentagepaystepthreeratevalue * 1;
          }
          this.avaliblepo.percentagepaysum = (percentagepaysum * 1).toFixed(2);//.toFixed(2);
        }

        //计算未支付的提成
        {
          this.avaliblepo.percentagenotpaysum = (this.avaliblepo.percentagetotal - this.avaliblepo.percentagepaysum).toFixed(2);
        }
        //计算已支付的分红
        {
          let fundpaysum = 0;
          for (let collectionrecord of this.avaliblepo.collectionrecords) {

            if (collectionrecord.fundispay) {
              if (collectionrecord.fundvalue) {
                fundpaysum += collectionrecord.fundvalue * 1;
              }
            }
          }

          //加 合同绑定
          if (this.avaliblepo.fundpaysteponeispay) {
            fundpaysum += this.avaliblepo.fundpaysteponeratevalue * 1;
          }
          //加 年终绑定
          if (this.avaliblepo.fundpaystepthreeispay) {
            fundpaysum += this.avaliblepo.fundpaystepthreeratevalue * 1;
          }
          this.avaliblepo.fundpaysum = fundpaysum.toFixed(2);
        }

        //计算未支付的分红
        {
          this.avaliblepo.fundnotpaysum = this.avaliblepo.fundpay - this.avaliblepo.fundpaysum;
        }
        tool.projectMoneySymbol(this.avaliblepo, false);
        //计算收款 时的误差
        let sum = 0;
        let tichengsum = 0;
        for (let record of this.avaliblepo.collectionrecords) {
          sum = sum * 1 + record.fundvalue * 1;
          for (let tichengvalue of record.percentagepayvalueArray) {
            tichengsum = tichengsum * 1 + tichengvalue * 1;
          }
        }
        let recordlength = this.avaliblepo.collectionrecords.length;
        if (sum - this.avaliblepo.fundpaysteptworatevalue * 1 > 0.001) {
          for (let i = recordlength - 1; i >= 0; i--) {
            if (this.avaliblepo.collectionrecords[i].fundvalue > 0) {
              this.avaliblepo.collectionrecords[i].fundvalue = this.avaliblepo.collectionrecords[i].fundvalue * 1 + (this.avaliblepo.fundpaysteptworatevalue * 1 - sum);
              break;
            }

          }
        }

        let tichengCha = tichengsum - this.avaliblepo.percentagepaysteponeratevalue * 1;
        if (tichengCha > 0.001) {
          let plenth = this.avaliblepo.percentages.length;
          for (let i = recordlength - 1; i >= 0; i--) {
            if (this.avaliblepo.collectionrecords[i].fundvalue > 0) {
              this.avaliblepo.collectionrecords[i].percentagepayvalueArray[plenth - 1] = this.avaliblepo.collectionrecords[i].percentagepayvalueArray[plenth - 1] - tichengCha;
              this.avaliblepo.collectionrecords[i].percentagevalue = this.avaliblepo.collectionrecords[i].percentagevalue - tichengCha;
              break;
            }
          }

        }
        tool.projectMoneySymbol(this.avaliblepo, true);

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
        this.showbaseicpercentages = false;

        this.modalbaseexpencetitle = "添加方案";
        //添加提成状态

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
        this.modalbaseexpencetitle = "查看方案";
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
        this.modalbaseexpencetitle = "编辑方案";
        this.editindex = i;
        this.percentagestate = 3;
        this.showbaseicpercentages = true;
        //this.createproject = false;

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
      back_SearchAvalibleProject() {
        axios.get(this.$store.state.host + "avalibleprojects/findprojectbyid?_id=" + this.avaliblepo._id.toString())
          .then(res => {
            if (res.data.status === 0) {
              this.$emit('editpofunction_back', res.data.project);
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
        tool.projectMoneySymbol(this.avaliblepo, false);
        let checkedresult = this.CheckAvaliblepo(this.avaliblepo, false);
        if (!checkedresult) {
          //如果有问题，不保存
          tool.projectMoneySymbol(this.avaliblepo, true);
          return;
        }
        this.$store.commit("confirm", {
          message: "确认要添加项目吗？", callback: (istrue) => {
            if (istrue) {
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
                    this.$router.push({path: '/user/avalibleProject'});
                    this.$store.commit("notify",{message:"创建项目成功",type:"success"})
                  } else {
                    this.$store.commit("showMessageBox", {message:"添加失败，已经这个项目，可能是 名字重复 或者 项目编号 或者 合同编号",type:'error'});

                  }
                })
            }

          }
        });

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

      //检查 提成 和 分红 比例 是否是100
      CheckAvaliblepo(avaliblepo, isshowerror) {

        let project = avaliblepo;
        //提成比例总和
        let tichengsum = avaliblepo.percentagepaysteponerate * 1 + avaliblepo.percentagepaysteptworate * 1 + avaliblepo.percentagepaystepthreerate * 1;
        if (tichengsum !== 100) {
          this.$store.commit("showMessageBox",{message:"提成比例之和是：" + tichengsum,type:"error"});
          return false;
        }
        //分红比例总和
        let fenghuongSum = avaliblepo.fundpaysteponerate * 1 + avaliblepo.fundpaysteptworate * 1 + avaliblepo.fundpaystepthreerate * 1;
        if (fenghuongSum !== 100) {
          this.$store.commit("showMessageBox",{message:"分红比例之和是：" + fenghuongSum,type:"error"});
          return false;
        }
        //检查提成 点发放时 没有点击 要有发放日期
        {
          if (project.percentagepaysteponeispay && !project.percentagepaysteponeispaydate) {
            this.$store.commit("showMessageBox",{message:"提成_签订金额，发放日期没有选择！！！",type:"error"});
            return false;
          }
          if (project.percentagepaystepthreeispay && !project.percentagepaystepthreeispaydate) {
            this.$store.commit("showMessageBox",{message:"提成_年终金额，发放日期没有选择！！！" ,type:"error"});
            return false;
          }
          if (project.fundpaysteponeispay && !project.fundpaysteponeispaydate) {
            this.$store.commit("showMessageBox",{message:"分红_签订金额，发放日期没有选择！！！",type:"error"});
            return false;
          }
          if (project.fundpaystepthreeispay && !project.fundpaystepthreeispaydate) {
            this.$store.commit("showMessageBox",{message:"分红_年终金额，发放日期没有选择！！！" ,type:"error"});
            return false;
          }

          //检查收款记录里面的 发放日期
          for (let record of project.collectionrecords) {
            let flag = false;
            if (record.percentagepayispay) {
              flag = true;
              if (!record.percentagepaydate) {
                this.$store.commit("showMessageBox",{message:"收款记录_提成_发放日期没有选择！！！" ,type:"error"});
                this.showMessageBox()
                return false;
              }
            }
            if (record.fundispay) {
              flag = true;
              if (!record.fundpaydate) {
                this.$store.commit("showMessageBox",{message:"收款记录_分红_发放日期没有选择！！！" ,type:"error"});
                return false;
              }
            }
            if (flag) {
              if (!record.amountcollected || !record.amountdate) {
                this.$store.commit("showMessageBox",{message:"收款记录_收款金额或者收款日期_没有！！！" ,type:"error"});
                return false;
              }
            }
          }
          //检查内容 是否填写完整
          let checkarray = [
            {m: "projectid", message: "项目编号"},
            {m: "projectcantractid", message: "合同编号"},
            {m: "projectname", message: "项目名称"},
            {m: "contrafacevalue", message: "主合同金额"},
            {m: "validrate", message: "有效比例"},
            {m: "validratefee", message: "有效金额"},
            {m: "preparefeefix", message: "前期固定比例"},
            {m: "preparefeefixfee", message: "前期固定金额"},
            //{m: "preparefeereal", message: "前期（实际）"},
            {m: "workingfeerate", message: "工作经费比率"},
          ];
          for (let check of checkarray) {

            if (!project[check.m] || project[check.m] == 0.00) {
              if (isshowerror)
                this.$store.commit("showMessageBox",{message:check.message + ",没有填写" ,type:"error"});

              return false;
            }
          }
          if (project.percentages.length === 0) {
            this.$store.commit("showMessageBox",{message:  "没有添加任何提成方案" ,type:"error"});

            return false;
          }
          if (project.baseexpences.length === 0) {
            this.$store.commit("showMessageBox",{message:  "没有添加任何固定开支" ,type:"error"});
            return false;
          }
        }

        return true;
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

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: red;
  }
</style>
