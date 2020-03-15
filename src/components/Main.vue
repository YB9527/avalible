<template>
  <div>


   <!-- <input type="button" value="aaa" @click="test">-->


  <!--  <router-link to="/calculate">

      <div ><h2>计算分红</h2></div></router-link>-->

  </div>

</template>

<script>
    import Loading from "./Loading";
    export default {
        name: "Main",
      components: {Loading},
      data(){
          return{

          }
      },
      created() {
      },
      methods:{
        test(){
          const childData = this.$refs.refName;
          childData.modal('show');
        }
      }
    }
</script>

<style scoped>

</style>
