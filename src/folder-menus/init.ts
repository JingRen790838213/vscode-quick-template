import { folderCreator } from './folder-creator';
import * as vscode from 'vscode';
import { MemFS } from '../utils/fileSystemProvider';

export function initFolderMenu(context: vscode.ExtensionContext) {
  const memFs = new MemFS();
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider('memfs', memFs, {
      isCaseSensitive: true,
    }),
  );
  context.subscriptions.push(folderCreator(context, { memFs }));
}
