<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" :label="curPageLabel" name="1">
        <subject-add-content ref="subAddContent" :subInfo="curSubjectInfo" @submit="onSubmit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import subjectAddContent from './subject-add-content';
import { hintSaveBeforeLeave, deleteEmptyAttr } from '../../utils/appCommon';
import { addSubject, editSubject } from '../../api/activity';
export default {
  data() {
    return {
      curPageType: 'add', // add-添加页面 edit-编辑页面
      addSuccess: false,
      curSubjectInfo: {}
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
      const wareIds = [];
      tableData.forEach((value, index) => {
        wareIds.push(value.id);
      });
      const subjectInfo = { name: formData.name, ids: wareIds.join(',') };
      deleteEmptyAttr(subjectInfo);

      if (this.curPageType === 'add') {
        addSubject(subjectInfo)
          .then(response => {
            if (response.status === 200) {
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
                message: `添加专题失败 ${response.status}：${response.statusText}`,
                duration: 1800
              });
            }
          })
          .catch(err => {
            this.$message.error('添加专题失败:' + err.message);
          });
      } else {
        subjectInfo.id = formData.id;

        editSubject(subjectInfo)
          .then(response => {
            if (response.status === 200) {
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
                message: `专题修改失败 ${response.status}：${response.statusText}`,
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
          this.$router.replace({ path: '/activity/subject' });
        })
        .catch(() => {});
    }
  },
  components: {
    subjectAddContent
  },
  created() {
    if (this.$route.path === '/activity/subject-edit') {
      this.curPageType = 'edit';
      this.addSuccess = true;
      if (this.$route.params.editData) {
        this.$set(this.curSubjectInfo, 'id', this.$route.params.editData.id);
        this.$set(this.curSubjectInfo, 'name', this.$route.params.editData.name);
      } else {
        this.overdueMeg();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.addSuccess) {
      hintSaveBeforeLeave(to, from, next, this);
    } else {
      next(true);
    }
  }
};
</script>
