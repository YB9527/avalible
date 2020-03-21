<template>
  <div style="text-align: center;">

    <div style="text-align: center; height: 40px;padding-top: 3px;padding-bottom: 3px">
      <div class="form-group row">
        <label class="col-sm-1" style="text-align: right">项目名称: </label>
        <div class="col-sm-2">
          <input type="text" class="form-control" v-model="searchproject.projectname"/>
        </div>
        <label style="text-align: left">项目编号: </label>
        <div class="col-sm-2">
          <input type="text" class="form-control" v-model="searchproject.projectid"/>
        </div>
        <label style="text-align: left">合同编号: </label>
        <div class="col-sm-2">
          <input type="text" class="form-control" v-model="searchproject.projectcantractid"/>
        </div>
        <div class="btn-group">
          <button type="button" class="btn btn-outline-dark" @click="searchProjectByPo(searchproject)">
            查询 <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
          </button>
        </div>


      </div>
   <!--   <div class="btn-group" style="float: right;margin-top: -55px">
        <button type="button" class="btn btn-outline-dark" @click="searchProjectByPo(searchproject)">
          查询 <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
        </button>
      </div>-->


    </div>
    <div><!--数据显示地方-->
      <el-table
        :data="projects"
        :height="height"
        :header-cell-style="{
          'background-color': '#e2e3e5',
          'font-weight': 'bold',
          'border-bottom': '1px #e2e3e5 solid'
        }"
        border
        style="width: 100%;margin-left: 5px;margin-top: 3px">
        <el-table-column
          type="index"
          label="序号"
          width="60px"

        >
          <template slot-scope="scope">{{ (searchproject.pageindex-1)*searchproject.limit + (scope.$index+1) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="projectname"
          label="项目名称"
          width="400px">
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
          prop="totalreceivables"
          label="收款总额">
          <template slot-scope="scope">{{ scope.row.totalreceivables | formatMoney }}</template>
          >
        </el-table-column>
        <el-table-column
          label="付款总额"
          prop="totalpayment"
        >
          <template slot-scope="scope">{{ scope.row.totalpayment | formatMoney }}</template>
        </el-table-column>
        <el-table-column
          label="未收款金额"
          prop="uncollectedamount"
        >
          <template slot-scope="scope">{{ scope.row.uncollectedamount | formatMoney }}</template>
        </el-table-column>
        <el-table-column
          prop="unpaidamount"
          label="未付款金额"
        >
          <template slot-scope="scope">{{ scope.row.unpaidamount | formatMoney }}</template>
        </el-table-column>
        <el-table-column
          prop="firstparty"
          label="甲方名称"
          width="200px"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <button type="button" class="btn btn-outline-dark btn-sm" @click="lookXT(scope.row)">查看</button>
            <button type="button" class="btn btn-outline-dark btn-sm" v-if="showokbtu"
                    @click="selectSelectXT(scope.row)">确定
            </button>
            <!-- <el-button
               size="mini"
               @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
             <el-button
               size="mini"
               @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!-- <table class="table  table-hover "  >
         <thead >
         <tr id="header" >
           <th>序号</th>
           <th width="400px">项目名称</th>
           <th width="200px">项目编号</th>
           <th width="200px">合同编号</th>
           <th>合同总价</th>
           <th>收款总额</th>
           <th>付款总额</th>
           <th>未收款金额</th>
           <th>未付款金额</th>
           <th width="200px">甲方名称</th>
           <th width="200px">操作</th>
         </tr>
         </thead>

         <tbody >
         <tr v-for="(project,i) in projects">
           <td>{{(searchproject.pageindex-1)*searchproject.limit + (i+1)}}</td>
           <td>{{project.projectname}}</td>
           <td>{{project.projectid}}</td>
           <td>{{project.projectcantractid}}</td>
           <td>{{project.contrafacevalue | formatMoney}}</td>
           <td>{{project.totalreceivables| formatMoney}}</td>
           <td>{{project.totalpayment| formatMoney}}</td>
           <td>{{project.uncollectedamount| formatMoney}}</td>
           <td>{{project.unpaidamount| formatMoney}}</td>
           <td>{{project.firstparty}}</td>
           <td>
             <div class="btn-group">
               <button type="button" class="btn btn-outline-dark" @click="lookXT(project)">
                 查看详细
               </button>
               <button v-show="showokbtu" type="button" class="btn btn-outline-dark" @click="selectSelectXT(project)">
                 确定
               </button>
             </div>
           </td>
         </tr>
         </tbody>

       </table>-->
    </div>
    <div id="bottom">
      <Pageination :searchcustom="searchproject"></Pageination>
    </div>
  </div>
</template>

<script>
  import tool from '@/public/js/tool.js'
  import Pageination from "../public/Pageination";
  import axios from 'axios'
  import $ from 'jquery'

  export default {
    name: "SelectProject",
    data() {
      return {
        showokbtu: false,
        searchproject: {
          projectname: "",
          projectid: "",
          projectcantractid: "",
          pageindex: 1,
          limit: 20,
          total: 0,
        },
        projects: [],
        height: 100,
      }
    },
    watch: {
      'searchproject.pageindex'(val, oldVal) {

        this.searchProjectByPo(this.searchproject)
      },
      'searchproject.limit'(val, oldVal) {

        this.searchProjectByPo(this.searchproject)
      }
    },
    components: {Pageination},
    filters: {
      formatMoney(value) {
        let a = tool.number_format(value, 2, ".", ",");//1,234,567.08
        return a;
      },


    },
    created() {

      this.height = this.$store.state.height - 130;
      this.searchProjectByPo(this.searchproject, 1);
      //console.log(document.getElementById('bottom').getClientRects()[0].bottom);
    },
    mounted() {


      if (this.$route.path === "/user/createproject") {
        this.showokbtu = true;
      }

    },
    methods: {
      formatMoney(row, column, cellValue, index) {
        return tool.number_format(cellValue, 2, ".", ",");//1,234,567.08

      },
      indexMethod(index) {
        return (this.searchproject.pageindex - 1) * this.searchproject.limit + (index + 1);
      },
      //请求本地， 本地转协同,找出符合要求的项目
      searchProjectByPo(po) {

        //根据po 查找对象
        let myFormDatas = new FormData();
        //请求后台，保存项目
        let url = this.$store.state.host + 'xietong/searchProjectByPo';
        myFormDatas.append('po', JSON.stringify(po));
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then(res => {

            if (res.data.status === 0) {//查找项目成功
              let custom = res.data.custom;
              this.projects = custom.projects;
              this.searchproject.total = custom.total;
            } else {
              this.projects = [];
            }
          })
      },
      //确定项目
      selectSelectXT(project) {
        this.$emit('childFn', project);
      },
      //打开协同项目信息详细页面
      lookXT(project) {

        this.$store.commit("openXTprojectHtml", project)
      },
    }
  }
</script>

<style scoped>

  #bottom {
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
  }
</style>
