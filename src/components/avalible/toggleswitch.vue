<template>
  <div v-if="ms">
    <label role="checkbox" :class="['switch', { toggled }]">
      <input type="checkbox" v-bind:disabled="edit.disabled"
             class="switch-input"
             @change="toggle"/>
      <div class="switch-core"
           :style="{backgroundColor: toggled ? colorChecked  : colorUnchecked,borderColor: toggled ? colorChecked  : colorUnchecked}">
        <div class="switch-button" ref="btu"
             :style="{transition: `transform ${ {
        type: Number,
        default: 100
      }}ms`,
	           transform: toggled ? null: `translate3d(34px, 0px, 0px)`}">
        </div>
      </div>
      <span class="switch-label label-right"
            v-if="toggled"
            v-html="labelChecked">
	     </span>
      <span class="switch-label label-left"
            v-html="labelUnchecked" v-else>
	    </span>
    </label>
  </div>

</template>

<script>
  export default {
    name: 'toggleswitch',
    props: ["edit"],
    data() {
      return {
        check: {
          type: Boolean,
          default: false
        },
        toggled: {
          type: Boolean,
          default: false
        },
        colorChecked: '#4cd900',
        colorUnchecked: 'red',
        labelChecked: '发放',
        labelUnchecked: '待发',
        ms: true,
      }
    },
    mounted() {
      if (!this.edit.po[this.edit.method]) {
        this.toggle2();
      }
      if(this.edit.disabled){
        this.$refs.btu.style.backgroundColor = "#ddd";
      }
    },

    methods: {
      childMethod(istrue) {

        if (!istrue) {
          this.toggled = true;
          this.toggle2();
        } else {
          this.toggled = false;
          this.toggle2();

        }
      },
      toggle(event) {

        this.toggled = !this.toggled;
        this.$emit('change', this.toggled);
        if (this.toggled) {
          this.$refs.btu.style.marginLeft = "0px";
          this.edit.po[this.edit.method] = true;
        } else {
          this.$refs.btu.style.marginLeft = "10px";
          this.edit.po[this.edit.method] = false;
        }
        //this.$emit('setswith',this.edit.po,this.edit.method);
      },
      toggle2() {
        this.toggled = !this.toggled;
        this.$emit('change', this.toggled);
        if (this.toggled) {
          this.$refs.btu.style.marginLeft = "0px";

        } else {
          this.$refs.btu.style.marginLeft = "10px";
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .switch {
    position: relative;
    display: block;
    width: 74px;
    height: 30px;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out;
    -webkit-transition-duration: .2s;
    transition-duration: .2s;
    -webkit-transition-property: background-color, border;
    transition-property: background-color, border;
    border: 2px solid #ddd;
    border-radius: 20px;
    background-color: #fff;

    background-clip: padding-box;

    .switch-input {
      display: none;
    }

    .switch-label {
      position: absolute;
      top: 0;
      font-weight: 600;
      color: white;

      z-index: 2;

      &.label-left {
        left: 10px;
        line-height: 25px;
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }

      &.label-right {
        right: 10px;
        line-height: 25px;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }

    .switch-core {
      display: block;
      position: relative;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: border-color .3s, background-color .3s;
      user-select: none;
      width: 70px;
      height: 26px;
      line-height: 25px;
      border-radius: 15px;

      .switch-button {
        position: absolute;
        z-index: 1;
        top: -1px;
        left: 0px;
        width: 28px;
        height: 28px;
        -webkit-transition: .3s ease-in-out;
        transition: .3s ease-in-out;
        -webkit-transition-property: -webkit-transform, width, left;
        transition-property: transform, width, left;
        border-radius: 16px;
        background-color: #fff;
        background-clip: padding-box;
        -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, .4);
        box-shadow: 0 2px 5px rgba(0, 0, 0, .4);
      }
    }
  }
</style>
