import path from 'path';
import * as vscode from 'vscode';
const fs = require('fs');

function getWebviewContent(jsSrc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模版</title>
    <script>
      window.vscode=acquireVsCodeApi();
      window.vscodePostMessage = vscode.postMessage;
    </script>
    <script defer="defer" src="${jsSrc}"></script>
</head>
<body style="background:rgb(238, 240, 243)">
   <div id="root"></div>
</body>
</html>`;
}

export function openPanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'tpl-panel-config', // Identifies the type of the webview. Used internally
    '模版管理', // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );
  // Get path to resource on disk
  const onDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, 'dist', 'panel.js'),
  );

  // And get the special URI to use with the webview
  const jsSrc = panel.webview.asWebviewUri(onDiskPath);

  panel.webview.html = getWebviewContent(jsSrc);
  panel.webview.postMessage({
    type: 'init-template-data',
    data: context.globalState.get('template-data'),
  });
  panel.webview.onDidReceiveMessage((message) => {
    const { type, data } = message;
    switch (type) {
      case 'save-template-data':
        context.globalState.update('template-data', data);
        break;
      default:
        break;
    }
  });
}

export function initPanel(context: vscode.ExtensionContext) {
  context.globalState.setKeysForSync(['template-data']);
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'quick-template-helper.tpl-panel-config',
      () => {
        console.log(`initPanel`);
        openPanel(context);
      },
    ),
  );
}
