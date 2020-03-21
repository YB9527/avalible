<template>
  <div>
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light" id="header">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link class="nav-link " to="/user/avalibleproject">查看分红项目</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link " to="/user/xtproject"><span>  查看协同项目</span></router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link " to="/user/createproject">创建项目</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link " to="/user/reportpage">查看简报</router-link>
            </li>
            <li class="nav-item dropdown">
              <!--   <router-link :class="dropdownclass" data-toggle="dropdown" role="button" aria-haspopup="true"
                              aria-expanded="false" to="#">关于软件
                 </router-link>-->
              <button type="button" :class="dropdownclass" data-toggle="dropdown" aria-haspopup="true"
                      aria-expanded="false">
                关于软件
              </button>
              <div class="dropdown-menu">
                <router-link class="dropdown-item " to="/user/software/softwarelog">软件日志</router-link>
                <router-link class="dropdown-item " to="/user/software/userreadme">帮助文档</router-link>
                <router-link class="dropdown-item " to="/user/software/feedback">用户反馈</router-link>
              </div>
            </li>

            <!-- <li class="nav-item">
               <router-link  class="nav-link " to="/admin">报告设置</router-link >
             </li>-->
          </ul>
          <div class="btn-group dropdown">
            <button class="btn  dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
            </button>
            <span style="line-height: 40px">当前用户：{{$store.getters.getUser?$store.getters.getUser.alias:""}}&nbsp;&nbsp;&nbsp;</span>
            <div class="dropdown-menu">
              <button class="dropdown-item" type="button"
                      @click="setXTCookie">设置协同Cookie
              </button>
              <button class="dropdown-item" data-toggle="modal" data-target="#setusermodal" type="button"
                      @click="editUser($store.getters.getUser)">编辑用户
              </button>
              <button class="dropdown-item" data-toggle="modal" data-target="#setusermodal" type="button"
                      @click="reLogin()">重新登录
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="modal fade" id="setusermodal" ref="setusermodal" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalCenterTitle"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">账户编辑</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-borderless" v-if="user">
              <tbody>
              <tr>
                <th><font :color="user.alias?successrgb:errrgb">昵称: </font></th>
                <td><input type="text" class="form-control" v-model="user.alias"></td>
              </tr>
              <tr>
                <th><font :color="user.pass?successrgb:errrgb">原始密码: </font></th>
                <td><input type="text" class="form-control" placeholder="必填" v-model="user.pass"></td>
              </tr>
              <tr>
                <th><font :color="successrgb">新密码: </font></th>
                <td><input type="text" class="form-control" placeholder="不改密码,不需要填写" v-model="newpass"></td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" :data-dismiss="modal" @click="saveEdit(user)">Save
            </button>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 40px">
      <router-view/>
    </div>

  </div>

</template>

<script>
  import axios from 'axios'
  import tool from '@/public/js/tool.js'
  import $ from 'jquery'

  export default {
    name: "User",
    data() {
      return {
        successrgb: '#000',
        errrgb: '#F40002',
        user: this.$store.getters.getUser,
        newpass: "",
        modal: "",
        dropdownclass: "btn  nav-link dropdown-toggle",
      }
    },
    watch: {
      $route(to, from) {
        if (to.path.indexOf("/user/software") !== -1) {
          this.dropdownclass = 'btn  nav-link dropdown-toggle active';
        } else {
          this.dropdownclass = 'btn  nav-link dropdown-toggle';
        }
      }
    },
    created() {
      if (!this.$store.getters.getUser) {
        //转到登录页面
        this.$router.push({path: '/login'})
      }
    },
    methods: {
      setXTCookie() {
        this.$prompt('请输入Cookie', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9]+/,
          inputErrorMessage: '内容不正确'
        }).then(({value}) => {
          this.$store.commit("getCustom", {
            url: "xietong/setcookie?JSESSIONIDValue="+value, callback: result => {

            }
          });
        }).catch(() => {
          this.$store.commit("notify", {type: "warning", message: "取消输入", title: "提示："});

        });
      },
      //重新登录
      reLogin() {
        this.$router.push({path: '/login'})
      },
      editUser(user) {
        this.user = JSON.parse(JSON.stringify(user));
      },
      saveEdit(user) {
        this.modal = "";
        if (!user.pass) {
          this.$store.commit("showMessageBox", {message: "密码没有填写不能填写！！！", type: "error"});
          return;
        }

        let url = this.$store.state.host + "users/edituser?newpass=" + this.newpass;
        let myFormDatas = new FormData();
        myFormDatas.append('user', JSON.stringify(user));
        axios({
          url: url,
          method: "POST",
          data: myFormDatas
        })
          .then(res => {
            if (res.data.status === 0) {
              ($('#setusermodal')).modal("hide");
              this.$store.commit("notify", {message: "更改成功", type: "success"});
              this.$store.commit("setUser", user);
              /* this.modal = "modal";*/
            } else if (res.data.status === 1) {
              this.$store.commit("showMessageBox", {message: "密码错误，编辑失败！！！", type: "error"});
            }
          });
      },
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
</style>
