<template>
  <!--<div id="loginback">
    <h2 class="title">登录</h2>
    <div class="inner">
      <input type="text" placeholder="请输入账号" v-model="user.accountnum" @input="cleartip"><br>
      <span><font color="#F40002"> {{ usertishi }}</font></span><br>
      <input type="text" placeholder="请输入密码" v-model="user.pass" @input="cleartip"><br>
      <span><font color="#F40002"> {{ passtishi }}</font></span><br>
      <span>{{ tishi }}</span><br>
    </div>
    <a href="../登录/注册账号.html">没有账号？点击注册</a><br>
    <button type="button" @click="login()" id="login">登录</button>
    <h3 v-show="isShow">{{Info}}</h3>
  </div>-->
  <div class="container" style="margin-left: 35%">
    <div class="row">
      <div class="col-md-offset-3 col-md-6">
        <div class="form-horizontal">
          <span class="heading">用户登录</span>
          <div class="form-group">
            <input type="text" class="form-control" v-model="user.accountnum" @input="cleartip" placeholder="账  号">
            <i class="fa fa-user"></i>
            <span><font color="#F40002"> {{ usertishi }}</font></span>
          </div>
          <div class="form-group help">
            <input type="password" class="form-control" v-model="user.pass" @input="cleartip" placeholder="密　码">
            <i class="fa fa-lock"></i>
            <span><font color="#F40002"> {{ passtishi }}</font></span>
          </div>
          <div class="form-group">
           <!-- <div class="main-checkbox">
              <input type="checkbox" value="None" id="checkbox1" name="check"/>
              <label for="checkbox1"></label>
            </div>
            <span class="text">Remember me</span>-->
            <button type="submit" class="btn btn-secondary" @click="login()">登录</button>
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
    name: "Login",
    data() {
      return {
        isShow: false,
        Info: localStorage.getItem("userArr"),
        usertishi: '',
        passtishi: '',
        tishi: '',
        user: {
          accountnum: '',
          pass: '',
        }
      }
    },
    created(){
      //删除以前的账号

    },
    methods: {
      cleartip() {
        this.usertishi = '';
        this.passtishi = '';
      },
      login() {
        /*console.log(obj[0])//去数组里的第一组数据*/
        if (!this.user.accountnum) {
          this.usertishi = '账号不能为空';
          return;
        }
        //密码
        if (!this.user.pass) {
          this.passtishi = '密码不能为空';
          return;
        }
        let url = this.$store.state.host + 'users/login';
        let myFormDatas = new FormData();
        myFormDatas.append('user', JSON.stringify(this.user));
        //后台查询
        axios({
          url: url,
          method: 'POST',
          data: myFormDatas
        })
          .then((result) => {
            if (result.data.status === 0) {
              //window.location.href = '../登录/登录成功.html';
              this.$store.commit("setUser", result.data.user);
              //跳转到用户页面
              this.$router.push({path: '/user/avalibleproject'});
              this.$store.commit("notify",{message:"登录成功" ,type:"success"});


            } else if (result.data.status === 1) {
              this.usertishi = '账号错误';
            } else if (result.data.status === 2) {
              this.passtishi = '密码错误';
            }
          })
      }
    }
  }

</script>
<style scoped>
  .form-bg{
    background: #00b4ef;
  }
  .form-horizontal{
    background: #fff;
    padding-bottom: 40px;
    border-radius: 15px;
    text-align: center;
  }
  .form-horizontal .heading{
    display: block;
    font-size: 35px;
    font-weight: 700;
    padding: 35px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 30px;
  }
  .form-horizontal .form-group{
    padding: 0 40px;
    margin: 0 0 25px 0;
    position: relative;
  }
  .form-horizontal .form-control{
    background: #f0f0f0;
    border: none;
    border-radius: 20px;
    box-shadow: none;
    padding: 0 20px 0 45px;
    height: 40px;
    transition: all 0.3s ease 0s;
  }
  .form-horizontal .form-control:focus{
    background: #e0e0e0;
    box-shadow: none;
    outline: 0 none;
  }
  .form-horizontal .form-group i{
    position: absolute;
    top: 12px;
    left: 60px;
    font-size: 17px;
    color: #c8c8c8;
    transition : all 0.5s ease 0s;
  }
  .form-horizontal .form-control:focus + i{
    color: #00b4ef;
  }
  .form-horizontal .fa-question-circle{
    display: inline-block;
    position: absolute;
    top: 12px;
    right: 60px;
    font-size: 20px;
    color: #808080;
    transition: all 0.5s ease 0s;
  }
  .form-horizontal .fa-question-circle:hover{
    color: #000;
  }
  .form-horizontal .main-checkbox{
    float: left;
    width: 20px;
    height: 20px;
    background: #11a3fc;
    border-radius: 50%;
    position: relative;
    margin: 5px 0 0 5px;
    border: 1px solid #11a3fc;
  }
  .form-horizontal .main-checkbox label{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  .form-horizontal .main-checkbox label:after{
    content: "";
    width: 10px;
    height: 5px;
    position: absolute;
    top: 5px;
    left: 4px;
    border: 3px solid #fff;
    border-top: none;
    border-right: none;
    background: transparent;
    opacity: 0;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .form-horizontal .main-checkbox input[type=checkbox]{
    visibility: hidden;
  }
  .form-horizontal .main-checkbox input[type=checkbox]:checked + label:after{
    opacity: 1;
  }
  .form-horizontal .text{
    float: left;
    margin-left: 7px;
    line-height: 20px;
    padding-top: 5px;
    text-transform: capitalize;
  }
  .form-horizontal .btn{
    float: right;
    font-size: 14px;
    color: #fff;
    background: #00b4ef;
    border-radius: 30px;
    padding: 10px 25px;
    border: none;
    text-transform: capitalize;
    transition: all 0.5s ease 0s;
  }
  @media only screen and (max-width: 479px){
    .form-horizontal .form-group{
      padding: 0 25px;
    }
    .form-horizontal .form-group i{
      left: 45px;
    }
    .form-horizontal .btn{
      padding: 10px 20px;
    }
  }

</style>
