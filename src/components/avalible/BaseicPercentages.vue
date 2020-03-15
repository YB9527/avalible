<template>
  <div>

    <div style="text-align: center" v-show="selectitemisshow"></div>
    <div style="text-align: left">
      <button type="button" class="btn btn-outline-dark" v-bind:hidden="lookpercentageisshow"
              v-show="edititembutshow && levelnum ==0"
              @click="addItem(baseicpercentages,baseicpercentages[0])">
        添加模板
      </button>
      <span style="font-size: 5px;color:red" v-show="!lookpercentageisshow">*点击方案名字 打开/关闭 折叠窗口</span>
    </div>
    <div class="clear"></div>

    <div v-for="(baseicpercentage,i) in baseicpercentages"
         style="width: 750px;border: 1px solid dimgrey;margin: 20px 2px 2px 2px;padding: 2px; float: left">
      <div>
        <div>
          <div class="input-group mb-3">
            <input type="text" v-model="baseicpercentage.name" v-bind:disabled="lookpercentageisshow"
                   class="form-control form-control-sm"
                   data-toggle="collapse" :data-target="'#collapseExample'+i" aria-expanded="true"
                   style="font-size: 20px;text-align: center">
            <div class="input-group-prepend">
              <button type="button" class="btn btn-outline-dark" v-show="selectitemisshow"
                      @click="selectItemOk(baseicpercentage)">
                选择此方案
              </button>
            </div>

          </div>

        </div>
        <div :class="collapse" :id="'collapseExample'+i">
          <div class="card card-body">
            <div style="text-align: left">
              <button type="button" class="btn btn-outline-dark form-control-sm" @click="editItemOk(baseicpercentage)"
                      v-bind:hidden="lookpercentageisshow" v-show="edititembutshow && levelnum ==0 ">
                保存模板
              </button>
              <button type="button" class="btn btn-outline-dark form-control-sm"
                      @click="deleteItemOk(baseicpercentages,i)"
                      v-bind:hidden="lookpercentageisshow" v-show="edititembutshow && levelnum ==0">
                删除模板
              </button>
              <button type="button" class="btn btn-outline-dark form-control-sm"
                      @click="editProjectBaseicpercentage(baseicpercentage,true)"
                      v-bind:hidden="lookpercentageisshow" v-show="!edititembutshow">
                保存返回
              </button>
            </div>
            <table class="table" style="margin: 5px">
              <thead>
              <tr>
                <th>收款金额</th>
                <th>有效比例</th>
                <th>有效金额</th>
                <th>总提成</th>
                <th>收款提成绑定比例</th>
                <th>收款提成</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><input type="text" class="form-control form-control-sm" v-model="baseicpercentage.input">
                </td>
                <td><input type="text" class="form-control form-control-sm" v-model="baseicpercentage.validrate">
                </td>
                <td><input type="text" class="form-control form-control-sm"
                           v-model="baseicpercentage.validratefee"
                           v-bind:disabled="true">
                </td>
                <td><input type="text" class="form-control form-control-sm" v-model="baseicpercentage.output"
                           v-bind:disabled="true">
                </td>
                <td><input type="text" class="form-control form-control-sm"
                           v-model="baseicpercentage.percentagerate"
                >
                </td>
                <td><input type="text" class="form-control form-control-sm"
                           v-model="baseicpercentage.percentageresult"
                           v-bind:disabled="true">
                </td>
              </tr>
              <tr>
                <td>
                  <button type="button" class="btn btn-outline-dark form-control-sm"
                          @click="toolcaculate(baseicpercentage)">
                    计算结果
                  </button>
                </td>
              </tr>
              </tbody>
            </table>


            <table class="table  table-hover table-condensed" style="margin: 5px">
              <thead>
              <tr>
                <th width="80px">序号</th>
                <th>数值</th>
                <th>比例</th>
                <th>值</th>
                <th width="200px">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-show="!lookpercentageisshow">
                <td>/</td>
                <td><input type="text" v-model="baseicpercentage.interval" class="form-control form-control-sm">
                </td>
                <td><input type="text" v-model="baseicpercentage.rate" class="form-control form-control-sm">
                </td>
                <td><input type="text" class="form-control form-control-sm" value="/"
                           v-bind:disabled="true"></td>
                <td><input type="button" value="添加比例" class="btn btn-outline-dark "
                           @click="add(baseicpercentage.salarylist,baseicpercentage.interval,baseicpercentage.rate)"
                >
                </td>
              </tr>
              <tr v-show="!lookpercentageisshow">
                <td></td>
                <td></td>
                <td>
                  <button type="button" class="btn btn-outline-dark form-control-sm"
                          @click="order(baseicpercentage,baseicpercentage.salarylist)">
                    自动排序
                  </button>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr v-for="(salary,i) in baseicpercentage.salarylist">
                <td>{{i+1}}</td>
                <td><input type="text" class="form-control form-control-sm"
                           v-model="salary.interval"
                           v-bind:disabled="lookpercentageisshow"></td>
                <td><input type="text" class="form-control form-control-sm"
                           v-model="salary.rate"
                           v-bind:disabled="lookpercentageisshow"></td>
                <td><input type="text" class="form-control form-control-sm"
                           v-model="salary.value"
                           v-bind:disabled="true"></td>
                <td><input type="button" value="删除" class="btn btn-outline-dark"
                           @click="deletesalary(baseicpercentage,i)"
                           v-bind:hidden="lookpercentageisshow"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>


  </div>
</template>

<script>
  import axios from 'axios'
  import tool from '@/public/js/tool.js'
  import $ from 'jquery'
  export default {
    name: "BaseicPercentages",
    props: ['avaliblepo', 'state', 'editindex'],
    data() {

      return {
        collapse:"collapse show ",//窗口折叠
        edititembutshow: true,//基础方案保存按钮
        oldpercentage: "",//项目中 提成方案，
        edititem: false,//方案编辑
        baseicpercentages: [],//基础提成方案，现在只有三个
        selectitemisshow: false,//选择方案
        lookpercentageisshow: false,//查看方案历史提成表格，方框不可编辑
        levelnum: this.$store.getters.levelnum,
      }
    },
    filters: {},
    created() {
      //注意这个bug 查找数据库 中的 提成表 ，只要前三个 ,
      let path = this.$route.path;
      if (path.indexOf("user") !== -1) {
        this.lookpercentageisshow = true;
      }
      if (path.indexOf("/baseicpercentages") !== -1) {
        let slef = this;
        this.searchBaseicPercentages(function (baseicPercentages) {
            for (let percentage of baseicPercentages) {
              tool.caculate(percentage);
            }
            slef.baseicpercentages = baseicPercentages;
          }
        )
      } else {
        //有4种状态 1、查看基础提成 2、添加提成方案过来，3、提成方案编辑，4、历史项目过来不可编辑
        this.baseicpercentages = [];
        if (this.state == 2) {
          let slef = this;
          this.searchBaseicPercentages(function (baseicPercentages) {
            for (let percentage of baseicPercentages) {
              percentage.input = slef.avaliblepo.contrafacevalue;
              percentage.validrate = slef.avaliblepo.validrate;
              percentage.percentagerate = slef.avaliblepo.percentagepaysteptworate;
              tool.caculate(percentage);
            }
            slef.lookpercentageisshow = false;
            slef.selectitemisshow = true;
            slef.collapse="collapse"
          });
        } else if (this.state == 3) {
          this.lookpercentageisshow = false;
          this.oldpercentage = this.avaliblepo.percentages[this.editindex];
          let newpercentage = JSON.parse(JSON.stringify(this.oldpercentage));
          this.edititem = true;
          this.edititembutshow = false;

          this.baseicpercentages = [];
          newpercentage.input = this.avaliblepo.contrafacevalue;
          newpercentage.validrate = this.avaliblepo.validrate;
          newpercentage.percentagerate = this.avaliblepo.percentagepaysteptworate;
          tool.caculate(newpercentage);
          this.baseicpercentages.push(newpercentage);
        } else if (this.state == 4) {
          this.lookpercentageisshow = true;
          let newpercentage = this.avaliblepo.percentages[this.editindex];
          newpercentage.input = this.avaliblepo.contrafacevalue;
          newpercentage.validrate = this.avaliblepo.validrate;
          newpercentage.percentagerate = this.avaliblepo.percentagepaysteptworate;
          tool.caculate(newpercentage);
          this.baseicpercentages.push(newpercentage);
        }
      }
    },
    methods: {
      toolcaculate(baseicpercentage) {
        tool.caculate(baseicpercentage);
      },
      //按照数字自动排序
      order(baseicpercentage, salarylist) {
        for (let i = 0; i < salarylist.length - 1; i++) {//外层循环控制排序趟数
          for (let j = 0; j < salarylist.length - 1 - i; j++) {//内层循环控制每一趟排序多少次
            if (salarylist[j].interval * 1 > salarylist[j + 1].interval * 1) {
              let temp = salarylist[j];
              salarylist[j] = salarylist[j + 1];
              salarylist[j + 1] = temp;
            }
          }
        }
        baseicpercentage.salarylist = [];
        for (let salary of salarylist) {
          baseicpercentage.salarylist.push(salary);
        }
      },
      //编辑 项目中 的 提成方案
      editProjectBaseicpercentage(percentage, issave) {
        if (percentage) {
          if (issave) {
            //保存的话， string 转换成 以前的 对象
            for (let i = 0; i < this.avaliblepo.percentages.length; i++) {
              if (this.avaliblepo.percentages[i] === this.oldpercentage) {
                this.avaliblepo.percentages[i] = percentage;
                break;
              }
            }
          }
        }
        this.$emit('percentages', this.avaliblepo);
      },
      //选定方案
      selectItemOk(baseicpercentage) {
        this.avaliblepo.percentages.push(JSON.parse(JSON.stringify(baseicpercentage)));
        this.$emit('percentages', this.avaliblepo);
      },
      //检查方案提成
      checkItem(baseicpercentage) {
        if (!baseicpercentage) {
          return false;
        }

        if (!baseicpercentage.name) {
          this.$store.commit("showMessageBox",{msg:"方案没有名字",type:"error"} );
          return false;
        }

        for (let salary of baseicpercentage.salarylist) {
          if (!(salary.rate && salary.interval)) {
            this.$store.commit("showMessageBox",{msg:"方案有比例 或则 值 为null 的",type:"error"} );
            return false;
          }
        }
        return true;
      },
      //添加提成模板
      addItem(baseicpercentages, baseicpercentage) {
        //阻止给不停点击添加按钮
        if (!baseicpercentage.name) {
          this.$store.commit("showMessageBox",{msg:"上一个模板还没有保存名字",type:"error"} );
          return;
        }
        let newbaseicpercentage = JSON.parse(JSON.stringify(baseicpercentage));
        newbaseicpercentage.name = "";
        newbaseicpercentage._id = null;
        newbaseicpercentage._id = null;

        baseicpercentages.unshift(newbaseicpercentage);
      },
      //方案提交
      editItemOk(baseicpercentage) {
        if (!this.checkItem(baseicpercentage, true)) {
          return;
        }
        let myFormDatas = new FormData();
        //请求后台，保存基础方案提成
        let url = this.$store.state.host + 'avalibleprojects/savebaseicpercentage';
        tool.percentageMoneySymbol(baseicpercentage, false);
        myFormDatas.append('baseicpercentage', JSON.stringify(baseicpercentage));
        tool.percentageMoneySymbol(baseicpercentage, true);
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {
              this.$store.commit("showMessageBox",{message:result.data.message} );

            }
          })
      },
      //删除方案
      deleteItemOk(baseicpercentages, i) {
        if (baseicpercentages.length === 1) {

          this.$store.commit("showMessageBox",{message:"还有最后一个模板不能删除",type:"error"} );
        } else {
          if (confirm("确定是要删除模板：" + baseicpercentages[i].name + " 吗？")) {
            let id = baseicpercentages[i]._id;
            if (id) {
              let url = this.$store.state.host + 'avalibleprojects/deletebaseicpercentagebyid?_id=' + id;
              axios.get(url)
                .then((res) => {
                  if (res.data.status === 0) {
                    baseicpercentages.splice(i, 1);

                  }
                })
            } else {
              baseicpercentages.splice(i, 1);
            }
          }
        }


      },

      lookBaseicPercentages() {
        let slef = this;
        this.edititembutshow = true;
        this.lookpercentageisshow = false;
        //slef.switchPage("edititem");
        this.searchBaseicPercentages(function (baseicpercentages) {
          slef.switchPage("edititem");
        });
      },
      //查看基础提成方案
      searchBaseicPercentages(callback) {
        let slf = this;
        slf.baseicpercentages = [];
        //请求后台，查找基础方案提成
        let url = this.$store.state.host + 'avalibleprojects/baseicpercentages';
        axios.get(url)
          .then((response) => {
            //this.edititem =true;
            //slf.baseicpercentages = response.data.baseicpercentages;
            for (let baseicpercentage of response.data.baseicpercentages) {
              slf.baseicpercentages.push(baseicpercentage);
            }
            callback(slf.baseicpercentages);
          })
      },

      deletesalary(baseicpercentage, i) {
        baseicpercentage.salarylist.splice(i, 1);
      },
      add(salarylist, interval, rate) {

        if (this.checkIsDouble(interval) && this.checkIsDouble(rate)) {
          if (interval == 0 || rate == 0) {
            this.$store.commit("showMessageBox",{message:"输入值有为0，不能添加",type:"error"} );
            return;
          }
          let index = -1;

          for (let i = 0; i < salarylist.length; i++) {
            let salary = salarylist[i];

            if (salary.interval * 1 < interval * 1) {
              //console.log(interval,salary.interval);
              index = i;
            }
          }
          //console.log(1,this.interval,this.rate);
          salarylist.splice(index + 1, 0, {"interval": interval, "rate": rate, value: 0});
        } else {
          this.$store.commit("showMessageBox",{message:"你输入的不是数字，不能添加",type:"error"} );
        }
      },
    }
  }
</script>

<style scoped>
  .clear {
    clear: both;
  }
</style>
