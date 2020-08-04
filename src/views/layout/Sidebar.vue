<template>
  <el-menu mode="vertical" background-color="#7dc194" :default-active="activeMenuItem">
    <sidebar-item :routes="permission_routers"></sidebar-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
export default {
  components: { SidebarItem },
  computed: {
    activeMenuItem() {
      let result = this.$route.path;
      switch (result) {
        case '/authority/add':
        case '/authority/password': {
          result = '/authority/list';
          break;
        }
        case '/user/check': {
          switch (this.$route.params.from) {
            case 'list': {
              result = '/user/list';
              break;
            }
            case 'frozen': {
              result = '/user/frozen';
              break;
            }
            case 'deleted': {
              result = '/user/deleted';
              break;
            }
            default: {
              break;
            }
          }
          break;
        }
        case '/money/user-check': {
          switch (this.$route.params.from) {
            case 'recharge-list': {
              result = '/money/recharge';
              break;
            }
            case 'consume-list': {
              result = '/money/consume';
              break;
            }
            default: {
              break;
            }
          }

          break;
        }
        case '/user/edit': {
          result = '/user/list';
          break;
        }
        case '/ware/edit':
        case '/ware/add': {
          result = '/ware/list';
          break;
        }
        case '/ware/category-add':
        case '/ware/category-edit': {
          result = '/ware/category';
          break;
        }
        case '/order/check': {
          switch (this.$route.params.from) {
            default: {
              result = '/order/list';
              break;
            }
          }
          break;
        }
        case '/money/order-check': {
          switch (this.$route.params.from) {
            case 'consume-list': {
              result = '/money/consume';
              break;
            }
            default: {
              break;
            }
          }
          break;
        }
        case '/money/check': {
          result = '/money/withdraw';
          break;
        }
        case '/activity/banner-edit':
        case '/activity/banner-add': {
          result = '/activity/banner';
          break;
        }
        case '/activity/subject-add':
        case '/activity/subject-edit': {
          result = '/activity/subject';
          break;
        }
        case '/mall/edit':
        case '/mall/add': {
          result = '/mall/list';
          break;
        }
        case '/mall/category-add':
        case '/mall/category-edit': {
          result = '/mall/category';
          break;
        }
        case '/mall/special-add':
        case '/mall/special-edit': {
          result = '/mall/special';
          break;
        }
        case '/mall/orderCheck': {
          result = '/mall/orderList';
          break;
        }
        case '/mall/convert-check':
        case '/mall/convert-order-check': {
          result = '/mall/convert-log';
          break;
        }
        case '/mall/gold-check':
        case '/mall/gold-order-check': {
          result = '/mall/gold-log';
          break;
        }
        case '/upgrade/pair-edit': {
          result = '/upgrade/pair';
          break;
        }
        case '/upgrade/order-check': {
          result = '/upgrade/order';
          break;
        }
        case '/upgrade/gametype-add':
        case '/upgrade/gametype-edit':
        case '/upgrade/gameUser-add':
        case '/upgrade/gameUser-edit':
        case '/upgrade/gametype-oddeven-usergroup':
        case '/upgrade/farm-icon-manage': {
          result = '/upgrade/game';
          break;
        }
        case '/agent/check': {
          result = '/agent/list';
          break;
        }
        default: {
          break;
        }
      }

      return result;
    },
    ...mapGetters(['permission_routers'])
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  min-height: 100%;
}
</style>
