<!--新增用户组label="新增用户组"-->
<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" :label="curPageLabel" name="1">
        <el-card>
          <el-form label-width="6rem" :rules="formRules" ref="probabilityForm" :model="formData">
            <el-form-item label="用户组名称" prop="userName" required>
              <el-input v-model="formData.userName" style="max-width: 20rem;"></el-input>
            </el-form-item>
            <div style="overflow: hidden">
              <el-form-item label="判别条件" prop="lowerLimit" style="max-width: 23rem;float: left;">
                <template>
                  <el-input v-model="formData.lowerLimit" :maxlength="30">
                    <template slot="prepend">总参与次数</template>
                    <template slot="append">下限</template>
                  </el-input>
                </template>
              </el-form-item>
              <el-form-item prop="upperLimit" style="max-width: 19rem;float: left; margin-left: -6rem;">
                <template>
                  <el-input v-model="formData.upperLimit" :maxlength="30">
                    <template slot="prepend">至</template>
                    <template slot="append">上限</template>
                  </el-input>
                </template>
              </el-form-item>
            </div>
            <div style="overflow: hidden">
              <el-form-item prop="dayLowerLimit" style="max-width: 23rem;float: left;">
                <template>
                  <el-input v-model="formData.dayLowerLimit" :maxlength="30">
                    <template slot="prepend">当日参与次数</template>
                    <template slot="append">下限</template>
                  </el-input>
                </template>
              </el-form-item>
              <el-form-item prop="dayUpperLimit" style="max-width: 19rem;float: left; margin-left: -6rem;">
                <template>
                  <el-input v-model="formData.dayUpperLimit" :maxlength="30">
                    <template slot="prepend">至</template>
                    <template slot="append">上限</template>
                  </el-input>
                </template>
              </el-form-item>
            </div>
            <div style="overflow: hidden">
              <el-form-item prop="betLowerLimit" style="max-width: 23rem;float: left;">
                <template>
                  <el-input v-model="formData.betLowerLimit" :maxlength="30">
                    <template slot="prepend">投注金额</template>
                    <template slot="append">下限</template>
                  </el-input>
                </template>
              </el-form-item>
              <el-form-item prop="betUpperLimit" style="max-width: 19rem;float: left; margin-left: -6rem;">
                <template>
                  <el-input v-model="formData.betUpperLimit" :maxlength="30">
                    <template slot="prepend">至</template>
                    <template slot="append">上限</template>
                  </el-input>
                </template>
              </el-form-item>
              <div>
                <span style="color:#ccc; padding-left: 12px;font-size: 14px; line-height: 35px;"
                  >总参与次数、当日参与次数和投注金额，若无限制，上限和下限填写【U】（U为大写）</span
                >
              </div>
            </div>
            <div style="overflow: hidden;">
              <el-form-item label="连赢" prop="winGuaranteedNum" style="float: left;">
                <el-input
                  v-model="formData.winGuaranteedNum"
                  style="max-width: 16.5rem;float: left; padding-right: 5px; position: relative;"
                >
                  <template slot="append">次执行保底</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="winGuaranteedList" style="max-width: 25rem;float: left; margin-left: -6rem;">
                <el-input v-model="formData.winGuaranteedList" style=" padding-right: 5px;">
                  <template slot="append">保底序列</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="overflow: hidden;">
              <el-form-item label="连输" prop="failGuaranteedNum" style="float: left;">
                <el-input
                  v-model="formData.failGuaranteedNum"
                  style="max-width: 16.5rem;float: left; padding-right: 5px; position: relative;"
                >
                  <template slot="append">次执行保底</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="failGuaranteedList" style="max-width: 25rem;float: left; margin-left: -6rem;">
                <template>
                  <el-input v-model="formData.failGuaranteedList" style=" padding-right: 5px;">
                    <template slot="append">保底序列</template>
                  </el-input>
                </template>
              </el-form-item>
              <div>
                <span style="color:#ccc; padding-left: 12px;font-size: 14px; line-height: 35px;"
                  >0为必输，10为必赢，次数和序列需同时填写</span
                >
              </div>
            </div>

            <el-form-item label="概率序列" prop="probabilityList">
              <el-input type="text" v-model="probabilityList" v-show="false"></el-input>
              <el-button type="primary" @click="onAddMall()">新增序列</el-button>
            </el-form-item>

            <el-table id="gameUser-add-content" :data="tableData" border style="width: 100%">
              <el-table-column align="center" prop="listName" label="序列名称" width="300"> </el-table-column>
              <el-table-column align="center" label="序列详情" width="500">
                <template slot-scope="scope">
                  {{ scope.row.listInfo }}
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.isCurrentState"> </el-switch>
                  <template>
                    <span class="btn-seperator">|</span>
                    <el-button
                      type="text"
                      size="small"
                      @click="
                        curProbabList = scope.row;
                        index = scope.$index;
                        editDlgShow = true;
                      "
                      >编辑</el-button
                    >
                  </template>
                  <template>
                    <span class="btn-seperator">|</span>
                    <el-button type="text" size="small" @click="onRemove(scope)">删除</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>

            <el-form-item style="float:right;">
              <el-button type="primary" @click="onSubmit('probabilityForm')">确定</el-button>
              <el-button type="primary" @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-dialog title="添加概率序列" :visible.sync="addDlgShow" :close-on-click-modal="false">
            <probability-add ref="addList" curType="add" @ok="addDlgShow = false;" @cancel="addDlgShow = false;"></probability-add>
            &lt;!&ndash;:processID="processID"&ndash;&gt;
        </el-dialog>-->

    <el-dialog title="添加概率序列" :visible.sync="addDlgShow" :close-on-click-modal="false" @open="onAddCardDlgOpen">
      <probability-add ref="addListComp" operType="add" @selectMallComplete="onSelectMallComplete" @cancel="addDlgShow = false" />
    </el-dialog>

    <el-dialog title="编辑概率序列" :visible.sync="editDlgShow" :close-on-click-modal="false" @open="onEditCardDlgOpen">
      <probability-add
        ref="editListComp"
        operType="edit"
        :index="index"
        :gameUserInfo="curProbabList"
        @probabComplete="onProbabComplete"
        @cancel="editDlgShow = false"
      ></probability-add>
    </el-dialog>
    <!--@ok="onAdEdCardOk"-->
  </div>
</template>

<script type="text/ecmascript-6">
import probabilityAdd from './probability-add';
import { addUserGroup, editUserGroup, getresult, getGroudUserInfo } from '../../api/upgrade';
export default {
  data() {
    const userNameValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入用户组名称'));
      } else {
        if (this.curPageType === 'edit' && this.$route.params.gameUserEditData.name === this.formData.userName) {
          callback();
        } else {
          // 判断用户组名称是否重复
          const nameInfo = { name: this.formData.userName };
          getresult(nameInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data === true) {
                  callback();
                } else {
                  callback(new Error('用户组名称不能重复'));
                }
              } else {
                callback(new Error('判断用户组名称是否重复出错，请重试'));
              }
            })
            .catch(err => {
              callback(new Error('判断用户组名称是否重复出错，请重试'));
            });
        }
      }
    };
    const numberValidator = (rule, value, callback) => {
      // value += '';
      if (!value || value.length <= 0) {
        callback(new Error('不可以为空'));
      } else if (value === 'U') {
        callback();
      } else if (!value.match(/^[0-9]*$/)) {
        callback(new Error('请填写正整数'));
      }
      {
        callback();
      }
    };
    const winGuaranteedNumValid = (rule, value, callback) => {
      if (!value == '' || !value == null) {
        if (!/^[1-9]+[0-9]*$/.test(value)) {
          callback(new Error('请输入正确的连赢执行保底次数'));
        } else {
          callback();
        }
      } else {
        if (this.formData.winGuaranteedList != '') {
          callback(new Error('连赢执行保底次数和保底序列需同时填写'));
        } else {
          callback();
        }
      }
    };
    const winGuaranteedListValid = (rule, value, callback) => {
      if (!value == '' || !value == null) {
        if (!/^([0-9]|(1[0]))$/.test(value)) {
          callback(new Error('请输入正确的连赢保底序列，只能输入0-10'));
        } else {
          callback();
        }
      } else {
        if (this.formData.winGuaranteedNum != '') {
          callback(new Error('连赢执行保底次数和保底序列需同时填写'));
        } else {
          callback();
        }
      }
    };
    const failGuaranteedNumValid = (rule, value, callback) => {
      if (!value == '' || !value == null) {
        if (!/^[0-9]*$/.test(value)) {
          callback(new Error('请输入正确的连输执行保底次数'));
        } else {
          callback();
        }
      } else {
        if (this.formData.failGuaranteedList != '') {
          callback(new Error('连输执行保底次数和保底序列需同时填写'));
        } else {
          callback();
        }
      }
    };
    const failGuaranteedListValid = (rule, value, callback) => {
      if (!value == '' || !value == null) {
        if (!/^([0-9]|(1[0]))$/.test(value)) {
          callback(new Error('请输入正确的连输保底序列，只能输入0-10'));
        } else {
          callback();
        }
      } else {
        if (this.formData.failGuaranteedNum != '') {
          callback(new Error('连输执行保底次数和保底序列需同时填写'));
        } else {
          callback();
        }
      }
    };
    return {
      curPageType: 'add', // add-添加页面 edit-编辑页面
      formData: {
        id: '',
        userName: '',
        lowerLimit: 'U',
        upperLimit: 'U',
        dayLowerLimit: 'U',
        dayUpperLimit: 'U',
        betLowerLimit: 'U',
        betUpperLimit: 'U',
        winGuaranteedNum: '',
        winGuaranteedList: '',
        failGuaranteedNum: '',
        failGuaranteedList: ''
      },
      formRules: {
        userName: [{ required: true, trigger: 'blur', validator: userNameValidator }],
        lowerLimit: [{ required: true, trigger: 'blur', validator: numberValidator }],
        upperLimit: [{ required: true, trigger: 'blur', validator: numberValidator }],
        dayLowerLimit: [{ required: true, trigger: 'blur', validator: numberValidator }],
        dayUpperLimit: [{ required: true, trigger: 'blur', validator: numberValidator }],
        betLowerLimit: [{ required: true, trigger: 'blur', validator: numberValidator }],
        betUpperLimit: [{ required: true, trigger: 'blur', validator: numberValidator }],
        probabilityList: [{ required: true, trigger: 'change', validator: this.probabilityListValidator }],
        winGuaranteedNum: [{ trigger: 'blur', validator: winGuaranteedNumValid }],
        winGuaranteedList: [{ trigger: 'blur', validator: winGuaranteedListValid }],
        failGuaranteedNum: [{ trigger: 'blur', validator: failGuaranteedNumValid }],
        failGuaranteedList: [{ trigger: 'blur', validator: failGuaranteedListValid }]
      },
      tableData: [],
      addDlgShow: false,
      editDlgShow: false,
      curProbabList: {},
      index: 0
    };
  },
  computed: {
    probabilityList() {
      return this.tableData && this.tableData.length > 0 ? this.tableData[0].listName : '';
    },
    curPageLabel() {
      if (this.curPageType === 'add') {
        return '新增用户组';
      } else {
        return '修改用户组';
      }
    }
  },
  components: {
    probabilityAdd
  },
  methods: {
    probabilityListValidator(rule, value, callback) {
      if (this.probabilityList.length <= 0) {
        callback(new Error('请填写概率序列'));
      } else {
        callback();
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let number = 0;
          this.tableData.forEach((value, index) => {
            const isTrue = value.isCurrentState;
            if (isTrue) {
              number++;
            }
          });
          if (number != 1) {
            this.$message({
              type: 'error',
              message: `新增概率序列开启个数应为一个，请检查!`,
              duration: 1800
            });
            return false;
          }
          // List（sequenceName 序列名字 sequenceContent 序列内容isCurrent 当前序列是否开启 0默认不开启 1开启）
          const formData = this.formData;
          const counter = [formData.betLowerLimit, formData.betUpperLimit].join(',');
          const gamecountAll = [formData.lowerLimit, formData.upperLimit].join(',');
          const gamecountToday = [formData.dayLowerLimit, formData.dayUpperLimit].join(',');

          const sequenceList = [];
          this.tableData.forEach((value, index) => {
            const lists = {
              sequenceName: value.listName,
              sequenceContent: value.listInfo,
              isCurrent: value.isCurrentState + 0
            };
            sequenceList.push(lists);
          });
          const userGroupInfo = {
            id: '',
            name: formData.userName,
            conditionCounter: counter,
            conditionGamecountAll: gamecountAll,
            conditionGamecountToday: gamecountToday,
            guaWincount: formData.winGuaranteedNum === '' ? 0 : formData.winGuaranteedNum,
            guaLosecount: formData.failGuaranteedNum === '' ? 0 : formData.failGuaranteedNum,
            guaSequenceWin: formData.winGuaranteedList,
            guaSequenceLose: formData.failGuaranteedList,
            chanceList: sequenceList
          };
          if (this.curPageType === 'add') {
            addUserGroup(userGroupInfo)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `新用户组添加成功!`,
                      duration: 1800
                    });
                    this.addSuccess = true;
                    this.$router.back();
                  } else {
                    this.$message({
                      type: 'error',
                      message: `新用户组添加失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `新用户组添加失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
              })
              .catch(err => {
                this.$message.error(err);
              });
          } else {
            userGroupInfo.id = formData.id;
            editUserGroup(userGroupInfo)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `新用户组修改成功!`,
                      duration: 1800
                    });
                    this.addSuccess = true;
                    this.$router.back();
                  } else {
                    this.$message({
                      type: 'error',
                      message: `新用户组修改失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `新用户组修改失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
              })
              .catch(err => {
                this.$message.error(err);
              });
          }
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.$router.back();
    },
    onDlgShow(refName) {
      if (this.$refs[refName]) {
        //                    this.$refs[refName].onInit();
      }
    },
    onAddMall() {
      this.addDlgShow = true;
    },
    /* onAdEdCardOk(){
                this.editDlgShow = false;
            },*/
    onSelectMallComplete(selectedMallList) {
      this.$set(this.tableData, this.tableData.length, {
        listInfo: selectedMallList.probabilityList,
        listName: selectedMallList.name,
        isCurrentState: selectedMallList.isCurrent
      });
      this.addDlgShow = false;
    },
    onProbabComplete(probabList) {
      if (probabList.onIndex === this.index) {
        this.$set(this.tableData, this.index, {
          listInfo: probabList.probabilityList,
          listName: probabList.name,
          isCurrentState: this.tableData[this.index].isCurrentState
        });
      }
      this.editDlgShow = false;
    },
    gameUserInfo() {
      this.editDlgShow = true;
    },
    onAddCardDlgOpen() {
      if (this.$refs['addListComp']) {
        this.$refs['addListComp'].onInit();
      }
    },
    onEditCardDlgOpen() {
      if (this.$refs['editListComp']) {
        this.$refs['editListComp'].onInit();
      }
    },
    onRemove(scope) {
      const item = scope.row;
      const delIndex = scope.$index;
      this.$confirm(`将移除概率序列 “${item.listName}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$delete(this.tableData, delIndex);
          this.$message({
            type: 'success',
            message: `概率序列 “${item.listName}” 移除成功!`,
            duration: 1800
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消移除`,
            duration: 1000
          });
        });
    },
    getGroudUserInfos(id) {
      // 使用id获取用户组信息，遍历到输入框
      const groupInfos = { id: id };
      getGroudUserInfo(groupInfos)
        .then(response => {
          if (response.data.code === 200) {
            const resDatas = response.data.resData;
            const dstData = this.formData;

            dstData.id = resDatas.id;
            dstData.userName = resDatas.name;
            dstData.winGuaranteedNum = resDatas.guaWincount;
            dstData.failGuaranteedNum = resDatas.guaLosecount;
            dstData.winGuaranteedList = resDatas.guaSequenceWin;
            dstData.failGuaranteedList = resDatas.guaSequenceLose;

            dstData.betLowerLimit = resDatas.conditionCounter.split(',')[0];
            dstData.betUpperLimit = resDatas.conditionCounter.split(',')[1];
            dstData.lowerLimit = resDatas.conditionGamecountAll.split(',')[0];
            dstData.upperLimit = resDatas.conditionGamecountAll.split(',')[1];
            dstData.dayLowerLimit = resDatas.conditionGamecountToday.split(',')[0];
            dstData.dayUpperLimit = resDatas.conditionGamecountToday.split(',')[1];

            resDatas.chanceList.forEach((value, index) => {
              const oneUser = {
                isCurrentState: value.isCurrent === 1 ? true : false,
                listInfo: value.sequenceContent,
                listName: value.sequenceName,
                chanceId: value.id
              };
              this.$set(this.tableData, index, oneUser);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取用户分组信息失败 ${response.date.code}：${response.data.message}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    onRefresh() {},
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/upgrade/gametype-oddeven-usergroup' });
        })
        .catch(() => {});
    }
  },
  mounted() {
    if (this.$route.path === '/upgrade/gameUser-edit') {
      this.curPageType = 'edit';
      if (this.$route.params.gameUserEditData && this.$route.params.gameUserEditData.name.length > 0) {
        this.getGroudUserInfos(this.$route.params.gameUserEditData.id);
      } else {
        this.overdueMeg();
      }
    }
  },
  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-table {
  margin-top: 1rem;
  .btn-seperator {
    margin: 0 5px;
    color: rgb(27, 110, 171);
  }
}
.el-tab-pane {
  overflow: auto;
}
</style>
