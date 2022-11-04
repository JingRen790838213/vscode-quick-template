import * as vscode from 'vscode';
import { openPanel } from '../pages/panel-config/init';
import { createFolder, showSelect } from './utils';
import type { MemFS } from '../utils/fileSystemProvider';

export function folderCreator(
  context: vscode.ExtensionContext,
  { memFs }: { memFs: MemFS },
) {
  return vscode.commands.registerCommand(
    'quick-template-helper.folder-creator',
    async (currentUri: vscode.Uri) => {
      const menuList =
        (context.globalState.get('template-data') as any[]) || [];
      const selectedItem = await showSelect(menuList);
      if (!selectedItem) {
        return;
      }
      // 管理页
      if (selectedItem.data?.type === 'menu') {
        openPanel(context);
        return;
      }
      // 获取输入名
      const inputName = await vscode.window.showInputBox({
        placeHolder: '输入文件夹/文件名称',
      });
      if (!inputName) {
        return;
      }
      createFolder({
        name: inputName,
        currentUri,
        selected: selectedItem,
        memFs,
      });
    },
  );
}
