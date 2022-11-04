# Quick 模版 简介

![image](https://github.com/JingRen790838213/vscode-quick-template/blob/main/public/quick-template-helper.gif)
Quick 模版是一个自定义模版的管理工具，可以通过选择录入的模版快捷生成对应的目录文件。

## 功能说明

- ### 自定义模版

1、在文件夹目录下，右键可以获取 Quick 模版的菜单，第一个选项默认是模版管理页面，下面的选项是自定义开启的模版

![image](https://github.com/JingRen790838213/vscode-quick-template/blob/main/public/1.gif)

2、进行编辑新增操作,支持新增模版，新增文件和文件夹等

![image](https://github.com/JingRen790838213/vscode-quick-template/blob/main/public/2.gif)

3、在目标文件夹目录下，右键从 Quick 模版菜单进入选项，选择对应的模版，输入对应的文件夹名称，在该文件夹下生成目标模版

![image](https://github.com/JingRen790838213/vscode-quick-template/blob/main/public/3.gif)

- ### QuickConvert 方法【vscode snippet】

  简介：将飞书文档格式的需求文案根据不同场景转化为特定的代码片段，例如表格字段，下拉框选项，表单组件，下拉框的 options，自定义组件等。
  用法：适用 `antd` 管理后台开发，在 `ts/tsx`文件下，输入代码片段快捷键

  实现原理：根据产品的需求习惯，使用飞书文档来写需求文案，例如习惯用飞书的排序列表功能做文案展开描述，我们就可以直接复制文案到代码里面进行一键转换，通过正则规则`/(\s*- |\s*\d+\. |^)/`进行匹配和分割，得出我们想要的字段名，再通过内置的方法进行转换出对应的格式。

  <video src='https://github.com/JingRen790838213/vscode-quick-template/blob/main/public/conver-show/public/convert-show.mp4' controls/>

  提供方法

- quick-convert-columns 转换为 {dataIndex:\_label,title:label}

- quick-convert-options 转换为 {value:\_label,label:label}

- convertJsonFormItem 转换为 {type:input|inputNumber|select|radio|datePicker|timePicker,label:label,name:\_label,...}

- quick-convert-customs

```

/*** @function QuickCustomConvert(  - 名称：文本输入框，非必填，支持模糊搜索。
  - 创建时间：时间选择器，对创建时间支持区间范围的筛选，非必填，最多支持 30 天的跨度，默认为空
  - 创建方式：下拉选择单选，非必填，有自动、手动两个选项。
  - 关联：下拉选择单选，非必填).format(<>$label</>)*/
format(自定义格式)，$label为label的占位符
```

```
/*** @function QuickCustomConvert(需求文本内容).format(<>$label</>)*/
format(自定义格式)，$label为label的占位符

/*** @function QuickCustomConvert(司机、用户、企业).format(<UserItem label="$label"/>)*/
==><UserItem label="司机"/> <UserItem label="用户"/> <UserItem label="企业"/>
```

**Enjoy!**

# vscode-quick-template
# vscode-quick-template
