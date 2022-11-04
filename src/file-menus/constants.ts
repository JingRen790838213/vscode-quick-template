export const commonPropsMatch = [
  {
    match: ['必填', '必选'],
    template: {
      rules: [{ required: true }],
    },
  },
  {
    match: ['非必填'],
    template: {
      rules: [{ required: false }],
    },
  },
];

export const componentMatch = [
  {
    match: ['输入框', '文本框', '输入', '搜索', '查询'],
    template: {
      type: 'input',
    },
    matchItemProps: (content) => {
      const maxLength = /[限制|最多].*?(\d*?)个字/.exec(content)?.[1];
      if (Number(maxLength)) {
        return { maxLength: Number(maxLength), showCount: true };
      }
      return {};
    },
  },
  {
    match: ['数字输入框', '数字'],
    template: {
      type: 'inputNumber',
      itemProps: {
        min: 0,
      },
    },
  },
  {
    match: ['下拉选择', '下拉', '下拉框', '多选', '单选'],
    template: {
      type: 'select',
      optionList: [],
    },
  },
  {
    match: ['单选框'],
    template: {
      type: 'radio',
      optionList: [],
    },
  },
  {
    match: ['复选框'],
    template: {
      type: 'checkbox',
      optionList: [],
    },
  },
  {
    match: ['日期', '起止时间', '开始时间', '结束时间'],
    template: {
      type: 'datePicker',
    },
  },
  {
    match: ['时间选择'],
    template: {
      type: 'timePicker',
    },
  },
  {
    match: ['级联'],
    template: {
      type: 'cascader',
      optionList: [],
    },
  },
];
