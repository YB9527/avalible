<template>
  <div>
    <div class="page-bar">
      <ul>
        <li v-if="cur>1"><a v-on:click="cur--,pageClick()">上一页</a></li>
        <li v-if="cur==1" ><a class="banclick">上一页</a></li>
        <!--当前页背景色为蓝色-->
        <li v-for="index in indexs" v-bind:class="{ 'active': cur == index}">
          <a v-on:click="btnClick(index)" >{{ index}}</a>
        </li>
        <li v-if="cur<all"><a v-on:click="cur++,pageClick()">下一页</a></li>
        <li v-if="cur == all"><a class="banclick">下一页</a></li>
        <li><a>共<i>{{all}}</i>页</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Test1",
    data() {
      return {
        all: 20, //总页数
        cur: 1//当前页码
      }

    },
    filters:{

    },
    watch: {
      cur: function (oldValue, newValue) {
        console.log(arguments);
      }
    }, methods: {
      btnClick: function (data) {
        if (data != this.cur) {
          this.cur = data;
        }
      },
      pageClick: function () {
        console.log('现在在' + this.cur + '页');
      }
    },
    computed: {
      indexs: function () {
        var left = 1;
        var right = this.all;
        var ar = [];
        if (this.all >= 5) {
          //这里最大范围从3到6，如果到达7，那么下边加2变成9，已经超过最大的范围值
          if (this.cur > 3 && this.cur < this.all - 1) {
            //以4为参考基准，左面加2右边加2
            left = this.cur - 2
            right = this.cur + 2
          } else {
            if (this.cur <= 3) {
              left = 1
              right = 5
            } else {
              right = this.all
              left = this.all - 4
            }
          }
        }
        while (left <= right) {
          ar.push(left)
          left++
        }
        console.log(ar);
        return ar
      }
    }

  }

</script>

<style scoped>
  .page-bar {
    margin: 40px;
  }

  ul, li {
    margin: 0px;
    padding: 0px;
  }

  li {
    list-style: none
  }

  .page-bar li:first-child > a {
    margin-left: 0px
  }

  .page-bar a {
    border: 1px solid #ddd;
    text-decoration: none;
    position: relative;
    float: left;
    padding: 10px 30px;

    margin-left: 2px;
    line-height: 1.42857143;

    cursor: pointer
  }

  .page-bar a:hover {
    background-color: #eee;
  }

  .page-bar a.banclick {
    cursor: not-allowed;
  }

  .page-bar .active a {
    color: #fff;
    cursor: default;
    background-color: #5a6268;
    border-color: #5a6268;
  }

  .page-bar i {
    font-style: normal;

    margin: 0px 6px;
    font-size: 12px;
  }
</style>
