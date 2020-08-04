// 代理等级
export const agentGradeList = [
  { label: '初级代理', value: 1 },
  { label: '中级代理', value: 2 },
  { label: '高级代理', value: 3 }
];

export function convertToAgentGradeLabel(value) {
  for (let i = 0; i < agentGradeList.length; i++) {
    if (agentGradeList[i].value === value) {
      return agentGradeList[i].label;
    }
  }
  return '未知等级';
}

// 代理状态
export const agentStateList = [
  { label: '暂停', value: 0 },
  { label: '正常', value: 1 }
];

export function convertToStateLabel(value) {
  for (let i = 0; i < agentStateList.length; i++) {
    if (agentStateList[i].value === value) {
      return agentStateList[i].label;
    }
  }
  return '未知状态';
}
