<template>
  <!--注册页面-->
  <div id="loginback">
    <h2 style="margin-left: -20px">注册账号</h2>
    <table class="table table-borderless">
      <thead>
      </thead>
      <tbody>
      <tr>
        <th><font :color="user.alias?successrgb:errrgb">昵称: </font></th>
        <td><input type="text" class="form-control" v-model="user.alias"></td>
      </tr>

      <tr>
        <th><font :color="user.accountnum?successrgb:errrgb">账号: </font></th>
        <td><input type="text" class="form-control" v-model="user.accountnum"></td>
      </tr>
      <tr>
        <th><font :color="user.pass?successrgb:errrgb">密码: </font></th>
        <td><input type="text" class="form-control" v-model="user.pass"></td>
      </tr>
      <tr>
        <th><font :color="password2?successrgb:errrgb">重复密码: </font></th>
        <td><input type="text" class="form-control" v-model="password2"></td>
        <td><font :color="errrgb" v-show="user.pass != password2">密码不一致</font></td>
      </tr>
      <tr>
        <th><font :color="user.levelnum != null?successrgb:errrgb">级别: </font></th>
        <td><select class="form-control" v-model="user.levelnum">
          <option v-for="(level,i) in levels" :value="level.levelnum">{{level.name}}</option>
        </select>
        </td>
      </tr>
      <tr>
        <th></th>
        <th style="text-align: left">
          <button type="button" class="btn btn-secondary btn-lg" @click="regist(user)">注册</button>
        </th>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    name: "Regist",
    data() {
      return {
        successrgb: '#000',
        errrgb: '#F40002',
        isShow: false,
        usertishi: '',
        passtishi: '',
        tishi: '',
        levels: [],
        password2: '',
        user: {
          accountnum: '',
          pass: '',
          alias: '',
          levelnum: null,
          projectlength:0,
        }
      }
    },
    created() {
      let levelurl = this.$store.state.host + "levels/getlevelsall";
      this.levels = [];
      axios.get(levelurl)
        .then(res => {
          if (res.data.status === 0) {
            this.levels = res.data.levels;
          }
        });
    },
    methods: {
      regist(user) {
        console.log(user);
        if (!user.accountnum || !user.pass || !user.alias || user.levelnum == null || user.pass != this.password2) {
          return;
        }
        let url = this.$store.state.host + 'users/regist';
        let myFormDatas = new FormData();
        myFormDatas.append('user', JSON.stringify(user));
        axios({
          url: url,
          method: "POST",
          data: myFormDatas,
        })
          .then(res => {
            if (res.data.status === 0) {
              //成功，跳转到其他页面

              this.$store.commit("notify",{message: "恭喜：" + user.alias + " 注册成功",type:"success"} );
              this.$router.push('/admin/user');
            } else if (res.data.status === 1) {
              //账号重复
              this.$store.commit("showMessageBox",{message: "账号 或者 昵称 重复",type:"error"} );
            }
          });
      },
      cleartip() {
        this.usertishi = '';
        this.passtishi = '';
      },
      login() {
        /*console.log(obj[0])//去数组里的第一组数据*/
        if (!this.user.accountnum) {
          this.usertishi = '用户名不能为空';
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
            } else if (result.data.status === 1) {
              this.usertishi = '用户名错误';
            } else if (result.data.status === 2) {
              this.passtishi = '密码错误';
            }
          })
      }
    }
  }
</script>

<style scoped>

  #loginback {
    width: 500px;
    height: 800px;
    margin: 100px auto;
    text-align: center;
    border-radius: 10px;
  }


</style>
