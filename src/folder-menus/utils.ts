import * as vscode from 'vscode';
import { toCamelCase } from '../utils';
import type { MemFS } from '../utils/fileSystemProvider';

export function travelTreeAndCreateFile(props: {
  parentUri: vscode.Uri;
  children: any[];
  memFs: MemFS;
  inputName: string;
}) {
  const { children, parentUri, memFs, inputName } = props;
  try {
    children.forEach((item) => {
      const fileMemUri = vscode.Uri.joinPath(parentUri, item.name);
      if (item.type === 'file') {
        const templateContent = Buffer.from(
          (item.content || '').replace(/REPLACE_STRING/g, inputName),
        );
        memFs.writeFile(fileMemUri, templateContent, {
          create: true,
          overwrite: false,
        });
      } else {
        memFs.createDirectory(fileMemUri);
        if (item.children) {
          travelTreeAndCreateFile({
            children: item.children,
            parentUri,
            memFs,
            inputName,
          });
        }
      }
    });
  } catch (error) {}
}

export function createFolder(props: {
  name: string;
  currentUri: vscode.Uri;
  selected: Record<string, any>;
  memFs: MemFS;
}) {
  const { name, currentUri, selected, memFs } = props;
  const inputName = toCamelCase(name);

  if (selected.data.type === 'file') {
    let templateFileName = selected.data.name || '';
    // 默认是_NAME，直接使用输入名做文件名
    if (templateFileName === '_NAME') {
      templateFileName = '';
    }
    const etx = templateFileName.split('.').at(-1);
    const memFileName = etx ? `${name}.${etx}` : templateFileName || name;
    const memFileUri = vscode.Uri.parse(`memfs:/${memFileName}`);

    const templateContent = Buffer.from(
      (selected.data.content || '').replace(/REPLACE_STRING/g, inputName),
    );

    memFs.writeFile(memFileUri, templateContent, {
      create: true,
      overwrite: false,
    });
    const targetUri = vscode.Uri.joinPath(currentUri, memFileName);

    vscode.workspace.fs.copy(memFileUri, targetUri, {
      overwrite: true,
    });
  } else {
    const parentMemUri = vscode.Uri.parse(`memfs:/${name}/`);
    const targetUri = vscode.Uri.joinPath(currentUri, name);

    memFs.createDirectory(parentMemUri);
    travelTreeAndCreateFile({
      children: selected.data.children,
      parentUri: parentMemUri,
      memFs,
      inputName,
    });

    vscode.workspace.fs.copy(parentMemUri, targetUri, {
      overwrite: true,
    });
  }

  vscode.window.showInformationMessage(`${name} Created Successfully`);
}

export async function showSelect(optionList: any[]) {
  const list = optionList
    .filter((item) => item.status)
    .map((item) => ({ data: item, label: item.templateName }));
  list.unshift({
    label: '📔进入Quick模版管理页面',
    data: { type: 'menu' },
  });
  const selected = await vscode.window.showQuickPick(list, {
    placeHolder: '选择模版',
  });
  return selected;
}
