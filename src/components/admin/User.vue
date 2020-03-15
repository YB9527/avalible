<template>
  <div>
    <div id="loginback">
      <h2 style="margin-left: -20px">管理用户</h2>
      <table class="table table-borderless">
        <thead>
        <th>序号</th>
        <th>用户昵称</th>
        <th>用户账号</th>
        <th>用户密码</th>
        <th>用户等级</th>
        <th>项目数量</th>
        <th colspan="2">操作</th>
        </thead>
        <tbody>
        <tr v-for="(user,i) in users">
          <td>{{i+1}}</td>
          <td>{{ user.alias}}</td>
          <td>{{ user.accountnum}}</td>
          <td>{{ user.pass}}</td>
          <td>{{ user.levelnum | getlevelname(levels)}}</td>
          <td>{{user.projectlength}}</td>
          <td>
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#usermodal"
                    @click="edit(user)">编辑
            </button>

          </td>
          <td style="text-align: left">
            <button type="button" class="btn btn-danger" @click="deleteuser(users,i)" v-if="user.projectlength === 0">
              删除
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="usermodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">更改用户</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">用户昵称:</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="modaluser.alias">
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-4 col-form-label">用户账号:</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="modaluser.accountnum" disabled="true">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">用户等级:</label>
              <div class="col-sm-6">
                <select class="form-control" v-model="modaluser.levelnum">
                  <option v-for="(level,i) in levels" :value="level.levelnum">{{level.name}}</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">密码:</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="modaluser.pass">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary"  @click="saveEdit(modaluser)">Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    name: "User",
    data() {
      return {
        users: [],
        modaluser: "",
        olduser: "",
        levels: [],
      }
    },
    filters: {
      getlevelname(levelnum, levels) {
        for (let level of levels) {
          if (level.levelnum == levelnum) {
            return level.name;
          }
        }
        return -1;
      }
    },
    created() {
      let userurl = this.$store.state.host + "users/getusersall";
      this.users = [];
      axios.get(userurl)
        .then(res => {
          if (res.data.status === 0) {
            this.users = res.data.users;
          }
        });
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
      deleteuser(users, i) {
        let user = users[i];
        this.$store.commit("confirm", {
          message: "确定要删除：" + user.alias + " 人员吗", callback: istrue => {
            if (istrue) {
              let url = this.$store.state.host + "users/deleteuser";
              let myFormDatas = new FormData();
              myFormDatas.append('user', JSON.stringify(user));
              axios({
                url: url,
                method: "POST",
                data: myFormDatas
              })
                .then(res => {
                  if (res.data.status === 0) {

                    this.$store.commit("notify",{message:"删除成功",type:"success"} );
                    users.splice(i, 1);
                    ($('#usermodal')).modal("hide");
                  }
                });
            } else {

            }
          }
        });


      },
      //模态窗口注入的对象
      edit(user) {
        this.olduser = user;
        this.modaluser = JSON.parse(JSON.stringify(user));
      },
      //保存更改
      saveEdit(modaluser) {
        if (JSON.stringify(this.olduser) == JSON.stringify(modaluser)) {
          this.$store.commit("showMessageBox",{message:"对象没有改变，不用保存！！！",type:"warning"} );
          return;
        }
        let url = this.$store.state.host + "users/updatesuer";
        let myFormDatas = new FormData();
        myFormDatas.append('user', JSON.stringify(modaluser));
        axios({
          url: url,
          method: "POST",
          data: myFormDatas
        })
          .then(res => {
            if (res.data.status === 0) {
              let index = this.users.indexOf(this.olduser);
              this.users.splice(index, 1);
              if (index === this.users.length) {
                this.users.push(modaluser);
              } else {
                this.users.splice(index, 0, modaluser);
              }
              this.$store.commit("notify",{message:"更改成功",type:"success"} );
              ($('#usermodal')).modal("hide");
            }
          });

      },
    }
  }
</script>

<style scoped>
  #loginback {
    width: 800px;
    margin: 100px auto;
    text-align: center;
    border-radius: 10px;
  }

</style>
