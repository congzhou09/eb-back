// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/custom-theme/index.css';
import 'styles/index.scss'; // 全局自定义的css样式
import 'assets/iconfont/iconfont.js';
import 'assets/iconfont/iconfont_mine.js';

import './mock/index.js'; // 使用mockjs模拟所有请求

// import ElementUI from 'element-ui';
// Vue.use(ElementUI);

import {
  Message,
  MessageBox,
  Form,
  FormItem,
  Input,
  Button,
  Menu,
  Submenu,
  MenuItem,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  Loading,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Pagination,
  DatePicker,
  Select,
  Option,
  Radio,
  RadioGroup,
  InputNumber,
  Upload,
  Popover,
  Steps,
  Step
} from 'element-ui';

Vue.component(Message.name, Message);
Vue.component(MessageBox.name, MessageBox);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Menu.name, Menu);
Vue.component(Submenu.name, Submenu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Card.name, Card);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(Dialog.name, Dialog);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Upload.name, Upload);
Vue.component(Popover.name, Popover);
Vue.component(Steps.name, Steps);
Vue.component(Step.name, Step);

Vue.use(Loading.directive);

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (store.getters.token && store.getters.userId) {
    // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (store.getters.roleId < 0) {
        store
          .dispatch('GetUserInfo', parseInt(store.getters.userId))
          .then(() => {
            // 拉取user_info
            let roles = [];
            roles = roles.concat(store.getters.roleId);
            store.dispatch('GenerateRoutes', roles).then(() => {
              // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
              // console.log(store.getters.addRouters);
              store.dispatch('GenerateReadonlyMap', roles).then(() => {
                next(); // hack方法 确保addRoutes已完成
              });
            });
          })
          .catch(err => {
            Message.error('获取用户信息失败：' + err.message);
          });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next('/login'); // 否则全部重定向到登录页
    }
  }
});

setTimeout(() => {
  // 防止干扰主程序初始化速度，将ServiceWorker的初始化放到主线程执行队列的队尾
  console.log('serviceWorker init');
  import('offline-plugin/runtime').then(swRuntime => {
    swRuntime.install({
      onUpdateReady: () => {
        console.log('sw onUpdateReady');
        swRuntime.applyUpdate(); // 作用相当于原生ServiceWorker的self.skipWaiting()
      },
      onUpdated: () => {
        // 作用相当于原生ServiceWorker的监听 controllerchange 事件
        console.log('sw onUpdated');
        window.location.reload();
      }
    });
  }, 0);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
