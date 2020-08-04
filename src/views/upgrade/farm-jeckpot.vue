<template>
  <el-card class="box-card">
    <div class="title clearfix">
      <span>权重说明</span>
    </div>
    <div class="text">
      <div class="title-item">
        <ul class="horizontal-item">
          <li style="border: none; margin-left: 0">权重因素</li>
          <li>总奖励金额（m）</li>
          <li>总参与用户数（u）</li>
          <li>商品遗漏数（d）</li>
          <li>单注下注金额（s）</li>
        </ul>
        <!--</ul>-->
      </div>
      <div class="title-item">
        <ul class="vertical-item">
          <li>权重值（st）=m*权重系数+u*权重系数+d*权重系数+s*权重系数</li>
          <li>1.总权重系数为5,每个区间的权重系数，由奖池区间决定公式决定</li>
          <li>2.在奖池匹配的前提下，按照权重值最高的奖励来匹配最终中奖区间</li>
          <li>3.奖池范围中有多个权重计算公式时，采取轮流计算方式， 每隔10min（暂定，具体时间按照实际情况调整，轮换当前公式组</li>
        </ul>
      </div>
    </div>
    <div class="title clearfix">
      <span>奖池设置</span>
    </div>
    <div class="text">
      <div class="j-item">
        <div class="j-item-left">
          <el-form label-width="6rem" ref="warningUpdate" :model="warningFormData">
            <el-form-item label="奖池警戒线">
              <el-input v-model="warningFormData.warningValue" style="width: 12rem;" :disabled="true">
                <template slot="append">元</template></el-input
              >
              <el-button type="primary" @click="expressDlgShow = true" style="margin-left: 12px;">编辑</el-button>
            </el-form-item>
          </el-form>

          <el-form label-width="6rem" ref="lowestUpdate" :model="lowestFormData">
            <el-form-item label="奖池最低线">
              <el-input v-model="lowestFormData.lowestValue" style="width: 12rem;" :disabled="true">
                <template slot="append">元</template></el-input
              >
              <el-button type="primary" @click="expressDlgShowL = true" style="margin-left: 12px;">编辑</el-button>
            </el-form-item>
          </el-form>

          <el-form label-width="6rem" ref="heightUpdate" :model="heightFormData">
            <el-form-item label="奖池最高线">
              <el-input v-model="heightFormData.heightValue" style="width: 12rem;" :disabled="true">
                <template slot="append">元</template></el-input
              >
              <el-button type="primary" @click="expressDlgShowH = true" style="margin-left: 12px;">编辑</el-button>
            </el-form-item>
          </el-form>

          <el-form label-width="6rem" ref="sendUpdate" :model="sendFormData">
            <el-form-item label="送分池">
              <el-input v-model="sendFormData.sendValue" style="width: 12rem;" :disabled="true">
                <template slot="append">元</template></el-input
              >
              <el-button type="primary" @click="expressDlgShowS = true" style="margin-left: 12px;">编辑</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="j-item-right">
          <!--<el-form label-width="8rem" ref="highestUpdate" :model="highestFormData">
                        <el-form-item label="奖池最高预警线">
                            <el-input v-model="highestFormData.highestValue" style="width: 12rem;"  :disabled="true">
                            <template slot="append">元</template></el-input>
                            <el-button type="primary" @click="expressDlgShowHe = true" style="margin-left: 12px;">编辑</el-button>
                        </el-form-item>
                    </el-form>-->
          <el-form label-width="8rem" ref="pumpingUpdate" :model="pumpingFormData">
            <el-form-item label="抽水率">
              <el-input v-model="pumpingFormData.pumpingValue" style="width: 12rem;" :disabled="true">
                <!--<template slot="append">元</template>--></el-input
              >
              <el-button type="primary" @click="expressDlgShowP = true" style="margin-left: 12px;">编辑</el-button>
              <div style="color: #cccccc;">抽水率，请用小数传递:例如5% =0.05</div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="j-item">
        <div class="j-item-title">
          <p>当前奖池 &lt; 奖池预警线</p>
          <el-button
            class="add-btn"
            @click="
              addDlgShow = true;
              onDlgShow('addComp');
            "
            >添加公式</el-button
          >
        </div>
        <el-table v-loading="isLoading" :data="tableData1" style="width: 100%">
          <el-table-column label="公式" width="400">
            <template slot-scope="scope">
              <small style="font-weight:bold;color:#a6a3a3;"> 权重值（st）=</small>
              {{ scope.row.formulas }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <template>
                <el-button
                  type="text"
                  size="small"
                  @click="
                    processID = scope.row.id;
                    editDlgShow = true;
                    onDlgShow('editComp');
                  "
                  >修改</el-button
                >
              </template>
              <template>
                <span class="btn-seperator" style="margin: 0 12px;">|</span>
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="j-item">
        <div class="j-item-title">
          <p>当前奖池 &lt; 奖池最低限</p>
          <el-button
            class="add-btn"
            @click="
              addDlgShow2 = true;
              onDlgShow('addComp2');
            "
            >添加公式</el-button
          >
        </div>
        <el-table v-loading="isLoading" :data="tableData2" style="width: 100%">
          <el-table-column label="公式" width="400">
            <template slot-scope="scope">
              <small style="font-weight:bold;color:#a6a3a3;"> 权重值（st）=</small>
              {{ scope.row.formulas }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <template>
                <el-button
                  type="text"
                  size="small"
                  @click="
                    processID = scope.row.id;
                    editDlgShow2 = true;
                    onDlgShow('editComp2');
                  "
                  >修改</el-button
                >
              </template>
              <template>
                <span class="btn-seperator" style="margin: 0 12px;">|</span>
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="j-item">
        <div class="j-item-title">
          <p>奖池最低限 &lt; 当前奖池 &lt; 奖池最高限</p>
          <el-button
            class="add-btn"
            @click="
              addDlgShow3 = true;
              onDlgShow('addComp3');
            "
            >添加公式</el-button
          >
        </div>
        <el-table v-loading="isLoading" :data="tableData3" style="width: 100%">
          <el-table-column label="公式" width="400">
            <template slot-scope="scope">
              <small style="font-weight:bold;color:#a6a3a3;"> 权重值（st）=</small>
              {{ scope.row.formulas }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <template>
                <el-button
                  type="text"
                  size="small"
                  @click="
                    processID = scope.row.id;
                    editDlgShow3 = true;
                    onDlgShow('editComp3');
                  "
                  >修改</el-button
                >
              </template>
              <template>
                <span class="btn-seperator" style="margin: 0 12px;">|</span>
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="j-item">
        <div class="j-item-title">
          <p>当前奖池 > 奖池最高限</p>
          <el-button
            class="add-btn"
            @click="
              addDlgShow4 = true;
              onDlgShow('addComp4');
            "
            >添加公式</el-button
          >
        </div>
        <el-table v-loading="isLoading" :data="tableData4" style="width: 100%">
          <el-table-column label="公式" width="400">
            <template slot-scope="scope">
              <small style="font-weight:bold;color:#a6a3a3;"> 权重值（st）=</small>
              {{ scope.row.formulas }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <template>
                <el-button
                  type="text"
                  size="small"
                  @click="
                    processID = scope.row.id;
                    editDlgShow4 = true;
                    onDlgShow('editComp4');
                  "
                  >修改</el-button
                >
              </template>
              <template>
                <span class="btn-seperator" style="margin: 0 12px;">|</span>
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--奖池警戒线设置对话框-->
    <el-dialog
      :title="this.warningFormData.warningValue === '' ? '填写奖池警戒线' : '修改奖池警戒'"
      :visible.sync="expressDlgShow"
      @open="onExpressDlgOpen"
      :close-on-click-modal="false"
    >
      <farm-jackpot-update :expressData="expressData" @ok="onChangeExpressOk" @cancel="onChangeExpressCancel" />
    </el-dialog>
    <!--奖池最低线设置对话框-->
    <el-dialog
      :title="this.lowestFormData.lowestValue === '' ? '填写奖池最低线' : '修改奖池最低线'"
      :visible.sync="expressDlgShowL"
      @open="onExpressDlgOpenL"
      :close-on-click-modal="false"
    >
      <farm-jackpot-update :expressData="expressData" @ok="onChangeExpressOkL" @cancel="onChangeExpressCancelL" />
    </el-dialog>
    <!--奖池最高线设置对话框-->
    <el-dialog
      :title="this.heightFormData.heightValue === '' ? '填写奖池最高线' : '修改奖池最高线'"
      :visible.sync="expressDlgShowH"
      @open="onExpressDlgOpenH"
      :close-on-click-modal="false"
    >
      <farm-jackpot-update :expressData="expressData" @ok="onChangeExpressOkH" @cancel="onChangeExpressCancelH" />
    </el-dialog>
    <!--送分池设置对话框-->
    <el-dialog
      :title="this.sendFormData.sendValue === '' ? '填写送分池' : '修改送分池'"
      :visible.sync="expressDlgShowS"
      @open="onExpressDlgOpenS"
      :close-on-click-modal="false"
    >
      <farm-jackpot-update :expressData="expressData" @ok="onChangeExpressOkS" @cancel="onChangeExpressCancelS" />
    </el-dialog>
    <!--最高预警线设置对话框-->
    <el-dialog
      :title="this.highestFormData.highestValue === '' ? '填写最高预警线' : '修改最高预警线'"
      :visible.sync="expressDlgShowHe"
      @open="onExpressDlgOpenHe"
      :close-on-click-modal="false"
    >
      <farm-jackpot-update :expressData="expressData" @ok="onChangeExpressOkHe" @cancel="onChangeExpressCancelHe" />
    </el-dialog>
    <!--抽水率设置对话框-->
    <el-dialog
      :title="this.pumpingFormData.pumpingValue === '' ? '填写抽水率' : '修改抽水率'"
      :visible.sync="expressDlgShowP"
      @open="onExpressDlgOpenP"
      :close-on-click-modal="false"
    >
      <farm-jackpot-update :expressData="expressData" @ok="onChangeExpressOkP" @cancel="onChangeExpressCancelP" />
    </el-dialog>

    <!--公式:当前奖池 < 奖池预警线弹窗 formulaType =1 -->
    <el-dialog title="添加权重设置" :visible.sync="addDlgShow" :close-on-click-modal="false" class="adddw">
      <farmFormulaAdd
        ref="addComp"
        formulaType="1"
        curType="add"
        @ok="
          addDlgShow = false;
          onRefresh();
        "
        @cancel="addDlgShow = false"
      />
    </el-dialog>
    <el-dialog title="编辑权重设置" :visible.sync="editDlgShow" :close-on-click-modal="false">
      <farmFormulaAdd
        ref="editComp"
        curType="edit"
        :processID="processID"
        @ok="
          editDlgShow = false;
          onRefresh();
        "
        @cancel="editDlgShow = false"
      ></farmFormulaAdd>
    </el-dialog>
    <!--公式:当前奖池<奖池最低限 formulaType =2 -->
    <el-dialog title="添加权重设置" :visible.sync="addDlgShow2" :close-on-click-modal="false" class="adddw">
      <farmFormulaAdd
        ref="addComp2"
        formulaType="2"
        curType="add"
        @ok="
          addDlgShow2 = false;
          onRefresh();
        "
        @cancel="addDlgShow2 = false"
      />
    </el-dialog>
    <el-dialog title="编辑权重设置" :visible.sync="editDlgShow2" :close-on-click-modal="false">
      <farmFormulaAdd
        ref="editComp2"
        curType="edit"
        :processID="processID"
        @ok="
          editDlgShow2 = false;
          onRefresh();
        "
        @cancel="editDlgShow2 = false"
      ></farmFormulaAdd>
    </el-dialog>
    <!--公式:奖池最低限 < 当前奖池 < 奖池最高限 formulaType =3 -->
    <el-dialog title="添加权重设置" :visible.sync="addDlgShow3" :close-on-click-modal="false" class="adddw">
      <farmFormulaAdd
        ref="addComp3"
        formulaType="3"
        curType="add"
        @ok="
          addDlgShow3 = false;
          onRefresh();
        "
        @cancel="addDlgShow3 = false"
      />
    </el-dialog>
    <el-dialog title="编辑权重设置" :visible.sync="editDlgShow3" :close-on-click-modal="false">
      <farmFormulaAdd
        ref="editComp3"
        curType="edit"
        :processID="processID"
        @ok="
          editDlgShow3 = false;
          onRefresh();
        "
        @cancel="editDlgShow3 = false"
      ></farmFormulaAdd>
    </el-dialog>
    <!--公式:当前奖池 < 奖池最低限 formulaType =4 -->
    <el-dialog title="添加权重设置" :visible.sync="addDlgShow4" :close-on-click-modal="false" class="adddw">
      <farmFormulaAdd
        ref="addComp4"
        formulaType="4"
        curType="add"
        @ok="
          addDlgShow4 = false;
          onRefresh();
        "
        @cancel="addDlgShow4 = false"
      />
    </el-dialog>
    <el-dialog title="编辑权重设置" :visible.sync="editDlgShow4" :close-on-click-modal="false">
      <farmFormulaAdd
        ref="editComp4"
        curType="edit"
        :processID="processID"
        @ok="
          editDlgShow4 = false;
          onRefresh();
        "
        @cancel="editDlgShow4 = false"
      ></farmFormulaAdd>
    </el-dialog>
  </el-card>
</template>

<script type="text/ecmascript-6">
    import farmJackpotUpdate from './farm-jackpot-update';
    import farmFormulaAdd from './farm-formula-add';
    import {getjackpotList, getformulaList, deleteFormula} from '../../api/upgrade';
    export default {
        data() {
            return{
                expressDlgShow: false,
                expressDlgShowL: false,
                expressDlgShowH: false,
                expressDlgShowS: false,
                expressDlgShowHe: false,
                expressDlgShowP: false,
                addDlgShow: false,
                addDlgShow2: false,
                addDlgShow3: false,
                addDlgShow4: false,
                editDlgShow: false,
                editDlgShow2: false,
                editDlgShow3: false,
                editDlgShow4: false,
                warningFormData:{
                    warningValue: '',/* 警戒值*/
                    moneyType: 1,
                    id: 0,
                    expressId: 0
                },
                lowestFormData:{
                    lowestValue: '',/* 最低值*/
                    moneyType: 2,
                    id: 0,
                    expressId: 0
                },
                heightFormData:{
                    heightValue: '',/* 最高值*/
                    moneyType: 3,
                    id: 0,
                    expressId: 0
                },
                sendFormData:{
                    sendValue: '',/* 送分池*/
                    moneyType: 4,
                    id: 0,
                    expressId: 0
                },
                highestFormData:{
                    highestValue: '',/* 最高预警*/
                    moneyType: 5,
                    id: 0,
                    expressId: 0
                },
                pumpingFormData:{
                    pumpingValue: '',/* 抽水率*/
                    moneyType: 6,
                    id: 0,
                    expressId: 0
                },
                expressData:{
                    warningValue: '',
                    moneyType: '',
                    id: 0,
                    jackValue: ''
                },
                tableData1: [{formulas: 'a+b*c',formulaType: 1}],
                tableData2: [{formulas: 'a+b*c',formulaType: 2}],
                tableData3: [],
                tableData4: [],
                isLoading: false,
                processID: -1,
            }
        },
        components: {
            farmJackpotUpdate,
            farmFormulaAdd
        },
        methods:{
            // 奖池警戒线
            onChangeExpressCancel(){
                this.expressDlgShow = false;
            },
            onChangeExpressOk(newInfo){
                this.warningFormData.warningValue = newInfo.money;
                this.warningFormData.moneyType = 1;
                this.expressDlgShow = false;
            },
            onExpressDlgOpen(){
                this.expressData.moneyType = this.warningFormData.moneyType;
                this.expressData.warningValue = this.warningFormData.warningValue;
                this.expressData.jackValue = this.warningFormData.warningValue;
                this.expressData.id = this.warningFormData.id;
            },
            // 奖池最低线
            onChangeExpressCancelL(){
                this.expressDlgShowL = false;
            },
            onChangeExpressOkL(newInfo){
                this.lowestFormData.lowestValue = newInfo.money;
                this.lowestFormData.moneyType = 2;
                this.expressDlgShowL = false;
            },
            onExpressDlgOpenL(){
                this.expressData.moneyType = this.lowestFormData.moneyType;
                this.expressData.warningValue = this.lowestFormData.lowestValue;
                this.expressData.jackValue = this.lowestFormData.lowestValue;
                this.expressData.id = this.lowestFormData.id;
            },
            // 奖池最高线
            onChangeExpressCancelH(){
                this.expressDlgShowH = false;
            },
            onChangeExpressOkH(newInfo){
                this.heightFormData.heightValue = newInfo.money;
                this.heightFormData.moneyType = 3;
                this.expressDlgShowH = false;
            },
            onExpressDlgOpenH(){
                this.expressData.moneyType = this.heightFormData.moneyType;
                this.expressData.warningValue = this.heightFormData.heightValue;
                this.expressData.jackValue = this.heightFormData.heightValue;
                this.expressData.id = this.heightFormData.id;
            },
            // 送分池
            onChangeExpressCancelS(){
                this.expressDlgShowS = false;
                this.getJackpotValue();
            },
            onChangeExpressOkS(newInfo){
                this.sendFormData.sendValue = newInfo.money;
                this.sendFormData.moneyType = 4;
                this.expressDlgShowS = false;
            },
            onExpressDlgOpenS(){
                this.expressData.moneyType = this.sendFormData.moneyType;
                this.expressData.warningValue = this.sendFormData.sendValue;
                this.expressData.jackValue = this.sendFormData.sendValue;
                this.expressData.id = this.sendFormData.id;
            },
            // 最高预警线
            onChangeExpressCancelHe(){
                this.$nextTick(()=>{
                    this.getJackpotValue();
                });
                this.expressDlgShowHe = false;
            },
            onChangeExpressOkHe(newInfo){
                this.highestFormData.highestValue = newInfo.money;
                this.highestFormData.moneyType = 5;
                this.expressDlgShowHe = false;
            },
            onExpressDlgOpenHe(){
                this.expressData.moneyType = this.highestFormData.moneyType;
                this.expressData.warningValue = this.highestFormData.highestValue;
                this.expressData.jackValue = this.highestFormData.highestValue;
                this.expressData.id = this.highestFormData.id;
            },
            // 抽水率
            onChangeExpressCancelP(){
                this.$nextTick(()=>{
                    this.getJackpotValue();
                });
                this.expressDlgShowP = false;
            },
            onChangeExpressOkP(newInfo){
                this.$set(this.pumpingFormData, 'pumpingValue', newInfo.money);
//                this.pumpingFormData.pumpingValue = newInfo.money;
                this.pumpingFormData.moneyType = 6;
                this.expressDlgShowP = false;
            },
            onExpressDlgOpenP(){
                this.expressData.moneyType = this.pumpingFormData.moneyType;
                this.expressData.warningValue = this.pumpingFormData.pumpingValue;
                this.expressData.jackValue = this.pumpingFormData.pumpingValue;
                this.expressData.id = this.pumpingFormData.id;
//                this.expressData.xid = this.pumpingFormData.expressId;
            },

            getJackpotValue(){
                const getjackpot={gameId: 3};
                getjackpotList(getjackpot).then( response =>{
                    if(response.data.code===200)
                    {
                        response.data.resData.forEach((value, index, array)=> {
                            // 奖池预警线
                            if (response.data.resData[index].moneyType === 1) {

                                this.warningFormData.warningValue = value.money;
                                this.warningFormData.id = value.id;

                            }
                            // 奖池最低线
                            if (response.data.resData[index].moneyType === 2) {

                                this.lowestFormData.lowestValue = value.money;
                                this.lowestFormData.id = value.id;

                            }
                            // 奖池最高线
                            if (response.data.resData[index].moneyType === 3) {

                                this.heightFormData.heightValue = value.money;
                                this.heightFormData.id = value.id;

                            }
                            // 送分池
                            if (response.data.resData[index].moneyType === 4) {

                                this.sendFormData.sendValue = value.money;
                                this.sendFormData.id = value.id;

                            }
                            // 最高预警
                            if (response.data.resData[index].moneyType === 5) {

                                this.highestFormData.highestValue = value.money;
                                this.highestFormData.id = value.id;
                                this.highestFormData.expressId = value.createTime;

                            }
                            // 抽水率
                            if (response.data.resData[index].moneyType === 6) {

                                this.pumpingFormData.pumpingValue = value.money;
                                this.pumpingFormData.id = value.id;

                            }
                        });
                    }
                    else
                    {
                        this.$message({
                            type: 'error',
                            message: `获取奖池失败 ${response.status}：${response.statusText}`,
                            duration: 1800
                        });
                    }
                }).catch(err=> {
                    this.$message.error(err);
                });
            },

            // 获取公式列表
            onRefresh(){
                const getformula={gameId: 3};

                this.tableData1.length = 0;
                this.$delete(this.tableData1, 0);
                this.tableData2.length = 0;
                this.$delete(this.tableData2, 0);
                this.tableData3.length = 0;
                this.$delete(this.tableData3, 0);
                this.tableData4.length = 0;
                this.$delete(this.tableData4, 0);
                getformulaList(getformula).then( response =>{

                    if(response.data.code===200)
                    {
                        if(response.data.code === 200)
                        {
                            let index1=0;
                            let index2=0;
                            let index3=0;
                            let index4=0;
                            response.data.resData.forEach((value, index, array)=>{

                                if(value.formulaType === 1){
                                    const oneItem = {};
                                    oneItem.formulas= value.formula;
                                    oneItem.formulaType=value.formulaType;
                                    oneItem.id=value.id;
                                    oneItem.m= value.m;
                                    oneItem.u= value.u;
                                    oneItem.d= value.d;
                                    oneItem.s= value.s;
                                    this.$set(this.tableData1, index1, oneItem);
                                    index1++;
                                }
                                if(value.formulaType === 2){

                                    const oneItem = {};
                                    oneItem.formulas= value.formula;
                                    oneItem.formulaType=value.formulaType;
                                    oneItem.id=value.id;
                                    oneItem.m= value.m;
                                    oneItem.u= value.u;
                                    oneItem.d= value.d;
                                    oneItem.s= value.s;

                                    this.$set(this.tableData2, index2, oneItem);
                                    index2++;
                                }
                                if(value.formulaType === 3){

                                    const oneItem = {};
                                    oneItem.formulas= value.formula;
                                    oneItem.formulaType=value.formulaType;
                                    oneItem.id=value.id;
                                    oneItem.m= value.m;
                                    oneItem.u= value.u;
                                    oneItem.d= value.d;
                                    oneItem.s= value.s;

                                    this.$set(this.tableData3, index3, oneItem);
                                    index3++;
                                }
                                if(value.formulaType === 4){

                                    const oneItem = {};
                                    oneItem.formulas= value.formula;
                                    oneItem.formulaType=value.formulaType;
                                    oneItem.id=value.id;
                                    oneItem.m= value.m;
                                    oneItem.u= value.u;
                                    oneItem.d= value.d;
                                    oneItem.s= value.s;

                                    this.$set(this.tableData4, index4, oneItem);
                                    index4++;
                                }

                            });

                        }
                        else
                        {
                            this.$message({
                                type: 'error',
                                message: `获取十选一公式失败：${response.data.message}`,
                                duration: 1800
                            });
                        }
                    }
                    else
                    {
                        this.$message({
                            type: 'error',
                            message: `获取十选一公式失败 ${response.status}：${response.statusText}`,
                            duration: 1800
                        });
                    }
                }).catch(err=> {
                    this.$message.error(err);
                });
            },
            onDlgShow(refName){
                if(this.$refs[refName])
                {
                    this.$refs[refName].onInit();
                }
            },

            // 删除公式
            onDelete(item){
                // console.log(item);
                this.$confirm(`将删除公式 “${item.formulas}” , 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isLoading = true;
                    const formularInfo = {id: item.id};
                    deleteFormula(formularInfo).then(response=>{
                        if(response.status===200)
                        {
                            if(response.data.code === 200)
                            {
                                this.$message({
                                    type: 'success',
                                    message: `公式 “${item.formulas}” 删除成功!`,
                                    duration: 1800
                                });
                                this.onRefresh();
                            }
                            else
                            {
                                this.$message({
                                    type: 'success',
                                    message: `公式 “${item.formulas}” 删除失败：${response.data.message}`,
                                    duration: 1800
                                });
                            }
                        }
                        else
                        {
                            this.$message({
                                type: 'error',
                                message: `${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }
                        this.isLoading = false;
                    }).catch(err =>{
                        this.isLoading = false;
                        this.$message.error(err);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1000
                    });
                });
            },
        },
        mounted(){
            this.onRefresh();
            this.getJackpotValue();
        },
        created (){

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card {
  margin-bottom: 100px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.title-item ul {
  list-style: none;
  overflow: hidden;
}
.horizontal-item li {
  float: left;
  padding: 3px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 0 12px;
}
.vertical-item li {
  padding: 5px 8px;
}
.title {
  border-bottom: 1px solid #cccccc;
  line-height: 35px;
}
.title span {
  margin-bottom: 12px;
}
.j-item {
  overflow: hidden;
  background-color: #c3c1c10f;
  margin-top: 12px;
}
.j-item-left {
  float: left;
  width: 40%;
  margin-top: 18px;
}
.j-item-left ul {
  list-style: none;
}
.j-item-right {
  width: 50%;
  float: left;
  margin-top: 18px;
}
.j-item-title {
  overflow: hidden;
}
.j-item-title p {
  margin-left: 12px;
  width: 30%;
  float: left;
}
.j-item-title button {
  float: right;
  margin-top: 12px;
  margin-right: 30px;
}
</style>
