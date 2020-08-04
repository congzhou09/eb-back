import Vue from 'vue';
import Router from 'vue-router';

/* layout */
import Layout from '../views/layout/Layout';

/* login */
import Login from '../views/login/';

const sendPWD = () => import('../views/login/sendpwd');
const reset = () => import('../views/login/reset');

/* home*/
import home from '../views/home/index';

/* authority*/
const authority = () => import('../views/authority/list');

/* user*/
const userList = () => import('../views/user/list');

/* error page */
const Err404 = () => import('../views/error/404');
const Err401 = () => import('../views/error/401');

/* error log */
// const ErrorLog = () => import('../views/errlog/index');

/* permission */
// const Permission = () => import('../views/permission/index');

Vue.use(Router);

export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/authredirect', component: () => import('../views/login/authredirect'), hidden: true },
  { path: '/sendpwd', component: sendPWD, hidden: true },
  { path: '/reset', component: reset, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    redirect: '/home',
    hidden: true
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    icon: 'home',
    noDropdown: true,
    children: [{ path: 'index', component: home, menuName: '首页' }]
  }
];

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/authority',
    component: Layout,
    redirect: '/authority/list',
    icon: 'quanxianguanli',
    menuName: '权限管理',
    meta: { roles: [1] },
    children: [
      { path: 'list', component: authority, name: 'list-authority', params: { fromSiderBar: true }, menuName: '管理员列表' },
      { path: 'add', component: () => import('../views/authority/add'), hidden: true },
      { path: 'password', name: 'password', component: () => import('../views/authority/password'), hidden: true }
    ]
  },
  {
    path: '/user',
    component: Layout,
    icon: 'yonghu',
    menuName: '用户管理',
    meta: { roles: [1, 2, 3, 4, 5], readonly: [2, 3] },
    children: [
      { path: 'list', component: userList, name: 'list-user', params: { fromSiderBar: true }, menuName: '用户列表' },
      {
        path: 'frozen',
        component: () => import('../views/user/frozen'),
        name: 'list-frozen',
        params: { fromSiderBar: true },
        menuName: '封号用户'
      },
      {
        path: 'deleted',
        component: () => import('../views/user/deleted'),
        name: 'list-deleted',
        params: { fromSiderBar: true },
        menuName: '已删除用户'
      },
      { path: 'check', name: 'user-check', component: () => import('../views/user/check'), hidden: true },
      { path: 'edit', name: 'edit', component: () => import('../views/user/edit'), hidden: true }
    ]
  },
  {
    path: '/ware',
    component: Layout,
    icon: 'shangpinguanli',
    menuName: '商品管理',
    meta: { roles: [1, 2, 3, 4], readonly: [3] },
    children: [
      {
        path: 'list',
        component: () => import('../views/ware/list'),
        name: 'list-ware',
        params: { fromSiderBar: true },
        meta: { roles: [1, 2, 3, 4] },
        menuName: '商品列表'
      },
      { path: 'add', component: () => import('../views/ware/add'), hidden: 'true' },
      { path: 'edit', name: 'ware-edit', component: () => import('../views/ware/add'), hidden: 'true' },
      { path: 'category', component: () => import('../views/ware/category'), meta: { roles: [1, 2, 4] }, menuName: '分类管理' },
      { path: 'category-add', name: 'category-add', component: () => import('../views/ware/category-add'), hidden: 'true' },
      { path: 'category-edit', name: 'category-edit', component: () => import('../views/ware/category-edit'), hidden: 'true' }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/',
    icon: 'dingdan',
    menuName: '订单管理',
    meta: { roles: [1, 2, 3, 4], readonly: [3] },
    children: [
      {
        path: 'list',
        component: () => import('../views/order/list'),
        name: 'list-order',
        params: { fromSiderBar: true },
        menuName: '普通订单'
      },
      { path: 'check', name: 'order-check', component: () => import('../views/order/check'), hidden: true }
    ]
  },
  {
    path: '/money',
    component: Layout,
    redirect: '/',
    icon: 'zijin',
    menuName: '资金账务',
    meta: { roles: [1, 3, 4], readonly: [4] },
    children: [
      {
        path: 'recharge',
        component: () => import('../views/money/recharge-list'),
        name: 'list-recharge',
        params: { fromSiderBar: true },
        menuName: '充值记录'
      },
      {
        path: 'consume',
        component: () => import('../views/money/consume-list'),
        name: 'list-consume',
        params: { fromSiderBar: true },
        menuName: '消费记录'
      },
      {
        path: 'withdraw',
        component: () => import('../views/money/withdraw-list'),
        name: 'list-withdraw',
        params: { fromSiderBar: true },
        menuName: '提现记录'
      },
      { path: 'user-check', name: 'money-user-check', component: () => import('../views/user/check'), hidden: true },
      {
        path: 'order-check',
        name: 'money-order-check',
        component: () => import('../views/order/check'),
        hidden: true,
        meta: { readonly: [3] }
      },
      { path: 'check', name: 'withdraw-check', component: () => import('../views/money/withdraw-check'), hidden: true }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/',
    icon: 'yingxiao',
    menuName: '活动营销',
    meta: { roles: [1, 2, 4, 5] },
    children: [
      { path: 'banner', component: () => import('../views/activity/banner'), menuName: 'banner位' },
      { path: 'banner-add', name: 'banner-add', component: () => import('../views/activity/banner-add'), hidden: true },
      { path: 'banner-edit', name: 'banner-edit', component: () => import('../views/activity/banner-edit'), hidden: true },
      { path: 'subject', component: () => import('../views/activity/subject'), menuName: '专题设置', meta: { readonly: [5] } },
      { path: 'subject-add', name: 'subject-add', component: () => import('../views/activity/subject-add'), hidden: true },
      { path: 'subject-edit', name: 'subject-edit', component: () => import('../views/activity/subject-add'), hidden: true },
      {
        path: 'voucher',
        component: () => import('../views/activity/voucher'),
        name: 'list-voucher',
        params: { fromSiderBar: true },
        menuName: '优惠券',
        meta: { readonly: [2, 5] }
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    icon: 'shangpinguanli',
    menuName: '金币商城',
    meta: { roles: [1, 2, 3, 4], readonly: [3] },
    children: [
      {
        path: 'list',
        component: () => import('../views/mall/list'),
        name: 'list-mall',
        params: { fromSiderBar: true },
        menuName: '商品列表'
      },
      { path: 'add', component: () => import('../views/mall/add'), hidden: 'true' },
      { path: 'edit', name: 'mall-edit', component: () => import('../views/mall/add'), hidden: 'true' },
      {
        path: 'card',
        component: () => import('../views/mall/card'),
        name: 'card-mall',
        params: { fromSiderBar: true },
        meta: { roles: [1, 2, 4] },
        menuName: '充值卡管理'
      },
      { path: 'category', component: () => import('../views/mall/category'), meta: { roles: [1, 2, 4] }, menuName: '分类列表' },
      { path: 'category-add', name: 'categoryMall-add', component: () => import('../views/mall/category-add'), hidden: 'true' },
      { path: 'category-edit', name: 'categoryMall-edit', component: () => import('../views/mall/category-edit'), hidden: 'true' },
      { path: 'special', component: () => import('../views/mall/special'), meta: { roles: [1, 2, 4] }, menuName: '专题列表' },
      { path: 'special-add', name: 'special-add', component: () => import('../views/mall/special-add'), hidden: 'true' },
      { path: 'special-edit', name: 'special-edit', component: () => import('../views/mall/special-add'), hidden: 'true' },
      { path: 'orderList', component: () => import('../views/mall/orderList'), menuName: '订单列表' },
      { path: 'orderCheck', name: 'order-check-mall', component: () => import('../views/mall/orderCheck'), hidden: true },
      { path: 'convert-log', component: () => import('../views/mall/convert-log'), menuName: '兑换记录' },
      { path: 'convert-check', name: 'convert-user-check', component: () => import('../views/user/check'), hidden: true },
      { path: 'convert-order-check', name: 'convert-order-check', component: () => import('../views/mall/orderCheck'), hidden: true },
      { path: 'gold-log', component: () => import('../views/mall/gold-log'), menuName: '增加记录' },
      { path: 'gold-check', name: 'gold-user-check', component: () => import('../views/user/check'), hidden: true },
      { path: 'gold-order-check', name: 'gold-order-check', component: () => import('../views/order/check'), hidden: true }
    ]
  },
  {
    path: '/upgrade',
    component: Layout,
    icon: 'shangsheng',
    menuName: '升值购',
    meta: { roles: [1, 2, 3, 4], readonly: [3] },
    children: [
      {
        path: 'pair',
        component: () => import('../views/upgrade/pair'),
        name: 'list-pair',
        params: { fromSiderBar: true },
        menuName: '促销商品',
        meta: { roles: [1, 2, 4] }
      },
      { path: 'pair-edit', name: 'pair-edit', component: () => import('../views/upgrade/pair-edit'), hidden: true },
      { path: 'order-check', name: 'upgrade-order-check', component: () => import('../views/order/check'), hidden: true },
      {
        path: 'order',
        component: () => import('../views/upgrade/order'),
        name: 'list-pair-order',
        params: { fromSiderBar: true },
        menuName: '升值订单',
        meta: { roles: [1, 2, 3, 4] }
      },
      { path: 'game', component: () => import('../views/upgrade/gametype-list'), menuName: '玩法管理', meta: { roles: [1, 4] } },
      { path: 'gametype-add', name: 'gametype-add', component: () => import('../views/upgrade/gametype-add'), hidden: true },
      {
        path: 'gametype-oddeven-usergroup',
        name: 'gametype-oddeven-usergroup',
        component: () => import('../views/upgrade/gametype-oddeven-usergroup'),
        hidden: true
      },
      { path: 'gametype-edit', name: 'gametype-edit', component: () => import('../views/upgrade/gametype-add'), hidden: true },
      { path: 'gameUser-add', name: 'gameUser-add', component: () => import('../views/upgrade/gameUser-add'), hidden: true },
      { path: 'gameUser-edit', name: 'gameUser-edit', component: () => import('../views/upgrade/gameUser-add'), hidden: true },
      { path: 'farm-icon-manage', name: 'farm-icon-manage', component: () => import('../views/upgrade/farm-icon-manage'), hidden: true },
      {
        path: 'jackpot',
        component: () => import('../views/upgrade/jackpot'),
        name: 'list-jackpot',
        params: { fromSiderBar: true },
        menuName: '奖池管理',
        meta: { roles: [1, 4] }
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    icon: 'shangsheng',
    menuName: '代理推广',
    meta: { roles: [1, 2, 3, 4, 5], readonly: [3] },
    children: [
      {
        path: 'list',
        name: 'agent-list',
        component: () => import('../views/agent/agent'),
        params: { fromSiderBar: true },
        menuName: '代理管理',
        meta: { roles: [1, 2, 4, 5], readonly: [2, 5] }
      },
      {
        path: 'mode',
        name: 'agent-mode',
        component: () => import('../views/agent/mode'),
        params: { fromSiderBar: true },
        menuName: '模式管理',
        meta: { roles: [1, 2, 4, 5], readonly: [2, 3, 5] }
      },
      {
        path: 'check',
        name: 'agent-check',
        component: () => import('../views/agent/agent-check'),
        meta: { roles: [1, 2, 4, 5], readonly: [2, 5] },
        hidden: true
      },
      {
        path: 'withdraw',
        name: 'agent-withdraw-list',
        component: () => import('../views/agent/withdraw-list'),
        params: { fromSiderBar: true },
        menuName: '提现记录',
        meta: { roles: [1, 3, 4, 5], readonly: [5] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];
