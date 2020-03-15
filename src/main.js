// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'



import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

Vue.use(ElementUI);

/*import { Message,Notification,MessageBox } from 'element-ui';
Vue.prototype.$message = Message;
Vue.prototype.$message = Notification;
Vue.prototype.$message = MessageBox;*/
/*import {
  Pagination,
  Table,
  TableColumn,
  Button,
} from 'element-ui';

Vue.component(Pagination.name, Pagination);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Button.name, Button);*/


import Router from 'vue-router'

Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap'
/*import './lib/mui-master/examples/hello-mui/css/mui.min.css'
import './lib/mui-master/examples/hello-mui/css/app.css'*/
/*import './lib/mui-master/examples/hello-mui/js/mui.min'*/
Vue.config.productionTip = false;


import axios from 'axios'


/*import './lib/mui-master/dist/css/icons-extra.css'
import './lib/mui-master/dist/css/mui.min.css'
import './lib/mui-master/dist/css/style.css'*/

import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    host: "http://120.79.177.94:3333/",
    //host: "http://127.0.0.1:3333/",
    submitdate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1},//实际的值在 app created 中设置
    user: null,
    height: 1260,
    self: '',
  },
  getters: {
    levelnum(state) {
      if (state.user) {
        return state.user.levelnum;
      } else {
        return 0;
      }
    },
    getUser(state) {
      return state.user;
    },
    submitdate(state) {
      return state.submitdate;
    },
    submitdatecustom(state) {
      let date;
      if (state.submitdate.month.length > 1) {
        date = state.submitdate.year + "-" + state.submitdate.month;
      } else {
        date = state.submitdate.year + "-0" + state.submitdate.month;
      }
      return date;
    },
  },
  mutations: {
    setSelf(state, self) {
      state.self = self;
    },
    setHeight(state, height) {
      state.height = height;
    },
    setUser(state, user) {
      state.user = user;
    },
    setSubmitdate(state, submitdate) {
      state.submitdate = submitdate;
    },
    postCustom(state, custom) {
      let url = state.host + custom.url;
      let po = custom.po;
      let callback = custom.callback;
      let myFormDatas = new FormData();
      myFormDatas.append('po', JSON.stringify(po));
      axios({
        url: url,
        method: "POST",
        data: myFormDatas,
      })
        .then(res => {
          callback(res);
        })
    },
    getCustom(state, custom) {
      let url = state.host + custom.url;
      let callback = custom.callback;
      axios.get(url)
        .then(res => {
          callback(res);
        });
    },
    //打开协同 项目详情网页
    openXTprojectHtml(state, project) {
      let myFormDatas = new FormData();
      //请求后台，保存项目
      let url = state.host + 'xietong/lookproject?id=' + project.id;
      axios.get(url)
        .then((res) => {
          if (res.data.status === 0) {
            // console.log(res.data.html);

            let start = res.data.html.indexOf("<table xd:widgetIndex=\"0\" xd:CtrlId=\"CTRL112\" border=\"1\"");
            let stop = res.data.html.indexOf("</table>", start) + 8;
            let shoukuantable = res.data.html.substring(start, stop);
            let num1 = 0;
            let array = [];
            while ((num1 = shoukuantable.indexOf("</span></span>", num1 + 1)) !== -1) {
              let num2 = shoukuantable.lastIndexOf(">", num1);
              array.push(shoukuantable.substring(num2 + 1, num1));

            }
            let records = [];
            for (let i = 0; i < array.length; i++) {
              let record = {
                id: array[i],
                contains: array[i + 1],
                date: array[i + 2],
                money: tool.moneySymbol(array[i + 3], false),
                log: array[i + 4],
              };
              i = i + 4;
              records.push(record);
            }
            //最后的合计金额更正
            records[records.length - 1].money = tool.moneySymbol(records[records.length - 1].id, false);
            records[records.length - 1].id = "合计";
            console.log(records);

            var newwin = window.open('', '', '');
            newwin.opener = null;
            newwin.document.write(res.data.html.replace("/seeyon/fileUpload.do?method=showRTE&fileId=5409312909157353250&createDate=2019-01-11&type=image", "static/image/timg.jpg"));
            newwin.document.title = project.projectname;
            newwin.document.close();
          }
        });
    },
    confirm(state, callbackpo) {
      console.log(1)
      state.self.$confirm(callbackpo.message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callbackpo.callback(true);
      }).catch(() => {
        callbackpo.callback(false);
      });
    },
    showMessageBox(state, messagecustom) {
      ElementUI.Message({
        showClose: true,
        message: messagecustom.message,
        type: messagecustom.type,
        duration:2000,
      });
    },
    notify(state, custom) {
      ElementUI.Notification({
        title: custom.title,
        message: custom.message,
        type: custom.type,
        duration:2000,
      });
    },

  }
});
export default store

import tool from '@/public/js/tool.js'

Vue.filter('moneyformat', (value) => {
  if (value == 0 || value == 0.00) {
    return 0;
  } else {
    return tool.number_format(value, 2, '.', ',');
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
