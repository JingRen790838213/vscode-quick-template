// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initFolderMenu } from './folder-menus/init';
import { initPanel } from './pages/panel-config/init';
import { initFileMenu } from './file-menus/init';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  initFolderMenu(context);
  initFileMenu(context);
  initPanel(context);
  // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
