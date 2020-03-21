<template>
  <div id="app" ref="app">
    <div class="test" style="margin-top: 50px">


    </div>
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Toggleswitch from "./components/avalible/toggleswitch";

  export default {
    name: 'App',
    components: {Toggleswitch: Toggleswitch},
    data() {
      return {
        checked: true,
      }
    },
    computed: {
      listeners() {
        let result = Object.assign({}, this.$listeners);
        return result
      }
    },

    created() {

      this.$store.commit("setSelf",this);
      this.checked = this.propsChecked;
      let url = this.$store.state.host + 'projectreports/getsubmitdate';
      axios.get(url)
        .then(res => {
          if (res.data.status === 0) {
            this.$store.commit("setSubmitdate", res.data.submitdate);
          }
        })


    },
    watch: {
      $route(to, from) {
        this.$store.commit("setHeight", window.innerHeight-10);
      }
    },

    mounted() {
      /*this.$store.commit("setHeight", window.innerHeight);
      let self = this;
      var t2 = setInterval(function () {
        //定时刷新屏幕高度
        self.$store.commit("setHeight", window.innerHeight);
      }, 5000);*/

    },
    methods: {
      //开关键
      handleMessage(onoff) {
        console.log(onoff)
      },
      onChange(e) {
        this.checked = e.target.checked;
        this.$emit('change', e.target.checked);
      },


    },
  }
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    margin: 2px;
    width: 99%;
  }


</style>
