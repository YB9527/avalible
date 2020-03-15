<template>
  <div>
    <div id="loginback">
      <h2 style="margin-left: -20px">管理等级</h2>
      <table class="table table-borderless">
        <thead>
        <th>序号</th>
        <th>用户等级</th>
        <th>等级昵称</th>
        <th>用户数量</th>
        <th>操作</th>
        </thead>
        <tbody>

        <tr v-for="(level,i) in levels">
          <td>{{i+1}}</td>
          <td>{{ level.levelnum}}</td>
          <td>{{level.name}}</td>
          <td>{{level.personcount}}</td>
          <td>
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#levelmodal"
                    @click="edit(level)">更改昵称
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="levelmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">更改昵称</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" v-model="modallevel.name">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="saveEdit(modallevel)">Save
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
    name: "Level",
    data() {
      return {
        levels: [],
        modallevel: "",
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
      //模态窗口注入的对象
      edit(level) {
        this.modallevel = level;
      },
      //保存更改
      saveEdit(modallevel) {
        let url = this.$store.state.host + "levels/editlevel";
        let myFormDatas = new FormData();
        myFormDatas.append('level', JSON.stringify(modallevel));
        axios({
          url: url,
          method: "POST",
          data: myFormDatas
        })
          .then(res => {
            if(res.data.status === 0){

              this.$store.commit("notify",{message:"更改成功",type:"success"} );
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
