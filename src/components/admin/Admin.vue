<template>
  <div>
    <div class="modal fade" id="setadminmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">更改密码</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">新密码:</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="newpass">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">重复新密码:</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="newpass2">
              </div>
              <font :color="errrgb"> <span v-show="newpass !== newpass2">密码不一致</span> </font>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" :data-dismiss="modal" @click="setPass()">Save
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!show" id="loginback">

      <table class="table table-borderless">
        <thead>
        </thead>
        <tbody>
        <tr>
          <th>请输入后台密码:</th>
          <td><input type="password" class="form-control" v-model="pass"></td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: left">
            <button type="button" class="btn btn-secondary"
                    @click="comparePass(pass)">登录
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-show="show" >
      <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light" id="header">
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <router-link class="nav-link " to="/admin/user"><span>查看用户</span></router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link " to="/admin/level"><span>查看等级</span></router-link>
              </li>

              <li class="nav-item">
                <router-link class="nav-link " to="/admin/regist"><span>注册账号</span></router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link " to="/admin/reportset"><span>设置报告提交日期</span></router-link>
              </li>
              <li class="nav-item dropdown">
               <!-- <router-link :class="dropdownclass" data-toggle="dropdown" role="button" aria-haspopup="true"
                             aria-expanded="false" to="#">模板调整
                </router-link>-->
                <button type="button" :class="dropdownclass" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  模板调整
                </button>
                <div class="dropdown-menu">
                  <router-link class="dropdown-item " to="/admin/baseicpercentages">基础提成方案</router-link>
                  <router-link class="dropdown-item " to="/admin/projectmodel">项目模板</router-link>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group dropleft">
            <button type="button" class="btn  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>
            <div class="dropdown-menu">
              <button class="dropdown-item" data-toggle="modal" data-target="#setadminmodal" type="button">设置登录密码</button>
            </div>
          </div>

        </nav>
      </div>
      <div style="margin-top: 42px;" >
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    name: "Admin",
    data() {
      return {
        pass: "",
        show: false,
        newpass: "",
        newpass2: "",
        setnewpassmodal: "",
        successrgb: '#000',
        errrgb: '#F40002',
        modal: "",
        dropdownclass: "btn  nav-link dropdown-toggle",
      }
    },
    watch: {
      $route(to, from) {
        if ("/admin/baseicpercentages" === to.path || "/admin/projectmodel" === to.path) {
          this.dropdownclass = 'btn  nav-link dropdown-toggle active';
        } else {
          this.dropdownclass = 'btn nav-link dropdown-toggle';
        }
      }
    },
    methods: {
      //对比密码是否正确,正确就登录
      comparePass(pass) {
        let ulr = this.$store.state.host + "admins/compareadmin?backpass=" + pass;
        axios.get(ulr)
          .then(res => {
            if (res.data.status === 0) {
              this.show = true;
              this.$router.push({path: '/admin/user'});
            } else {

              this.$store.commit("showMessageBox",{message:"登录密码错误",type:"error"} );
            }
          })
      },
      setPass() {
        this.modal = "";
        if (this.newpass == this.newpass2 && this.newpass) {
          this.modal = "modal";
          let myFormDatas = new FormData();
          myFormDatas.append("admin", JSON.stringify({backpass: this.newpass}));
          axios({
            url: this.$store.state.host + "admins/setadmin",
            method: "POST",
            data: myFormDatas,
          })
            .then(res => {
              if (res.data.status === 0) {

                this.$store.commit("notify",{message:"更改后台密码成功",type:"success"} );
              }
            });
        }

      }
    }
  }
</script>

<style scoped>
  #header {
    position: fixed;
    z-index: 10;
    right: 0;
    left: 0;
    height: 40px;
    padding-right: 10px;
    padding-left: 10px;
    border-bottom: 0;
    background-color: #f7f7f7;
    top: 0;
    box-shadow: 0 1px 6px #ccc;

  }
  .dropdown-item.active {
    background-color: #5a6268;
  }
  #loginback {
    width: 600px;
    height: 400px;
    margin: 100px auto;
    text-align: center;
    border-radius: 10px;
  }
</style>
