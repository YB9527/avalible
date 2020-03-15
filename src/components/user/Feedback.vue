<template>
  <!--用户反馈-->
  <div style="width:100%;text-align:center">
    <div style="width: 1200px;margin-left: 20%" >
      <div>
        <h2>软件使用反馈</h2>
      </div>
      <div>
              <textarea class="form-control " style="display: inline-block;height: 500px;font-size: 12px"
                        id="validationTextarea"
                        placeholder="研发中，如有问题找：闫波">
          </textarea>
      </div>
      <div style="text-align: right">
        <button type="button" class="btn btn-secondary btn-lg" @click="send">发送</button>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import tool from '@/public/js/tool.js'
  import $ from 'jquery'
  export default {
    name: "Feedback",
    methods:{
      send(){
        this.$store.commit("showMessageBox",{message:"研发中，如有问题找：闫波",type:"error"});
      }
    }

  }
</script>

<style scoped>

</style>
