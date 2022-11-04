/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import { quickConvertMenu } from './quick-convert';

export function initFileMenu(context: vscode.ExtensionContext) {
  context.subscriptions.push(quickConvertMenu(context));
}
