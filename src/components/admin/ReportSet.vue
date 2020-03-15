<template>


  <div id="loginback">

    <table class="table table-borderless">
      <tbody>
      <tr style="text-align: left">
        <th colspan="2"><span>当前提交报告设定时间：</span>{{submitdate.year}} &nbsp;年 &nbsp;{{submitdate.month}} &nbsp;
          月
        </th>

      </tr>

      <tr>
        <th style="width: 150px">
          <input type="month" class="form-control"  style="width: 200px;text-align: right" v-model="setdate">

        </th>

        <th style="text-align: left">
          <button type="button" class="btn btn-secondary " @click="setSubmitDate(setdate)">设定</button>
        </th>
      </tr>
      </tbody>
    </table>
    <div style="margin: 50px;">
    </div>
    <div>
    </div>


  </div>

</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    name: "ReportSet",
    data() {
      return {
        setdate: null,//设定日期
        submitdate: {year: null, month: null},//提交日期
      }
    },
    created() {
      //查询提交报告日期
      this.submitdate = this.$store.getters.submitdate;
      if (this.submitdate.month.length > 1) {
        this.setdate = this.submitdate.year + "-" + this.submitdate.month;
      } else {
        this.setdate = this.submitdate.year + "-0" + this.submitdate.month;
      }
      /*let url = this.$store.state.host+'projectreports/findsubmitreportdate';
      axios.get(url)
        .then((res) => {
            if (!this.submitdate || !this.submitdate.year) {
              this.submitdate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1};
            }

          }
        });*/
    },
    methods: {
      //设定提交日期
      setSubmitDate(setdate) {
        if (!setdate) {
          return;
        }
        let date = new Date(setdate);
        this.submitdate.year = date.getFullYear();
        this.submitdate.month = date.getMonth() + 1;

        let myFormDatas = new FormData();
        //请求后台，保存日期
        let url = this.$store.state.host + 'projectreports/savesubmitreportdate';
        myFormDatas.append('submitreportdate', JSON.stringify(this.submitdate));
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {//保存成功
              this.$store.commit("setSubmitdate", this.submitdate);
              this.$store.commit("notify",{message:"保存成功",type:"success"} );

            } else if (result.data.status === 1) {
              this.$store.commit("showMessageBox",{message:"保存失败",type:"error"} );
            }
          });
        /*
         //如果 时间 相同 就不用访问后台了
         if (this.submitdate.year == date.getFullYear() && this.submitdate.month == date.getMonth() + 1) {
           return;
         }
         this.submitdate.year = null;
         this.submitdate.month = null;
         if (setdate) {
           //如果不为null 保存到数据库
           let myFormDatas = new FormData();
           //请求后台，保存日期
           let url = this.$store.state.host + 'projectreports/savesubmitreportdate';
           this.submitdate.year = date.getFullYear();
           this.submitdate.month = date.getMonth() + 1;
           if (this.submitdate.month < 10) {
             this.submitdate.month = "0" + this.submitdate.month;
           }
           myFormDatas.append('submitreportdate', JSON.stringify(this.submitdate));
           axios({
             url: url,
             method: 'POST',
             data: myFormDatas
           })
             .then((result) => {
               if (result.data.status === 0) {//保存成功

               } else if (result.data.status === 1) {

               }
             });
         }*/

      },
    }
  }
</script>

<style scoped>
  #loginback {
    width: 400px;
    margin: 100px auto;
    text-align: center;
    border-radius: 10px;
  }
</style>
