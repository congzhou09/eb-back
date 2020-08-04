<!--新增专题-->
<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" :label="curPageLabel" name="1">
        <special-add-content ref="subAddContent" :subInfo="curSpecialInfo" @submit="onSubmit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import specialAddContent from './special-add-content';
import { hintSaveBeforeLeave, deleteEmptyAttr } from '../../utils/appCommon';
import { addSpecial, editSpecial } from '../../api/mall';
export default {
  data() {
    return {
      curPageType: 'add', // add-添加页面 edit-编辑页面
      addSuccess: false,
      curSpecialInfo: {}
    };
  },
  computed: {
    curPageLabel() {
      if (this.curPageType === 'add') {
        return '新增专题';
      } else {
        return '修改专题';
      }
    }
  },
  methods: {
    onSubmit(formData, tableData) {
      const mallIds = [];
      tableData.forEach((value, index) => {
        mallIds.push(value.id);
      });
      const specialInfo = {};
      specialInfo.name = formData.name;
      specialInfo.productIds = JSON.stringify(mallIds);
      deleteEmptyAttr(specialInfo);
      if (this.curPageType === 'add') {
        addSpecial(specialInfo)
          .then(response => {
            if (response.data.code === 200) {
              if (response.data.result) {
                this.$message({
                  type: 'success',
                  message: `专题添加成功!`,
                  duration: 1800
                });
                this.addSuccess = true;
                this.$router.back();
              } else {
                this.$message({
                  type: 'error',
                  message: `添加专题失败：${response.data.message}`,
                  duration: 1800
                });
              }
            } else {
              this.$message({
                type: 'error',
                message: `添加专题失败 ${response.data.code}：${response.data.message}`,
                duration: 1800
              });
            }
          })
          .catch(err => {
            this.$message.error('添加专题失败:' + err.message);
          });
      } else {
        // 修改专题
        const specialInfo = {};
        specialInfo.name = formData.name;
        specialInfo.channelId = formData.id;
        specialInfo.productIds = mallIds;
        //                    {name: formData.name, channelId:formData.id, productIds:JSON.stringify(mallIds)};

        editSpecial(specialInfo)
          .then(response => {
            if (response.data.code === 200) {
              if (response.data.result) {
                this.$message({
                  type: 'success',
                  message: `专题修改成功!`,
                  duration: 1800
                });
                this.addSuccess = true;
                this.$router.back();
              } else {
                this.$message({
                  type: 'error',
                  message: `专题修改失败：${response.data.message}`,
                  duration: 1800
                });
              }
            } else {
              this.$message({
                type: 'error',
                message: `专题修改失败 ${response.data.code}：${response.data.message}`,
                duration: 1800
              });
            }
          })
          .catch(err => {
            this.$message.error('专题修改失败:' + err.message);
          });
      }
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/mall/special' });
        })
        .catch(() => {});
    }
  },
  components: {
    specialAddContent
  },
  created() {
    if (this.$route.path === '/mall/special-edit') {
      this.curPageType = 'edit';
      this.addSuccess = true;
      if (this.$route.params.editData) {
        this.$set(this.curSpecialInfo, 'id', this.$route.params.editData.id);
        this.$set(this.curSpecialInfo, 'name', this.$route.params.editData.name);
      } else {
        this.overdueMeg();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.addSuccess) {
      hintSaveBeforeLeave(to, from, next, this);
      hintSaveBeforeLeave(to, from, next, this);
    } else {
      next(true);
    }
  }
};
</script>

<style></style>
