<template>
  <div>
    <template v-for="(item, index) in routes">
      <router-link
        :key="index"
        v-if="!item.hidden && item.noDropdown && item.children.length > 0"
        :to="item.path + '/' + item.children[0].path"
      >
        <el-menu-item :index="item.path + '/' + item.children[0].path">
          <svg v-if="item.icon" class="font-icon" aria-hidden="true">
            <use :xlink:href="`#icon-${item.icon}`"></use>
          </svg>
          {{ item.children[0].menuName }}
        </el-menu-item>
      </router-link>
      <el-submenu :key="index" :index="item.menuName" v-if="!item.noDropdown && !item.hidden">
        <template slot="title">
          <svg v-if="item.icon" class="font-icon" aria-hidden="true">
            <use :xlink:href="`#icon-${item.icon}`"></use>
          </svg>
          {{ item.menuName }}
        </template>
        <template v-for="(child, index) in item.children">
          <template v-if="!child.hidden">
            <sidebar-item :key="index" class="menu-indent" v-if="child.children && child.children.length > 0" :routes="[child]">
            </sidebar-item>
            <router-link :key="index" v-else class="menu-indent" :to="getRouterTo(item, child)">
              <el-menu-item :index="item.path + '/' + child.path">
                {{ child.menuName }}
              </el-menu-item>
            </router-link>
          </template>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  },
  methods: {
    getRouterTo(item, child) {
      if (child.params) {
        return { name: child.name, params: child.params };
      } else {
        return item.path + '/' + child.path;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wscn-icon {
  margin-right: 10px;
}
.hideSidebar .menu-indent {
  display: block;
  text-indent: 10px;
}
</style>
