/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import {
  convertContentToCustom,
  convertContentToJsonFormItem,
  convertContentToOptionList,
  convertContentToTabelColumn,
} from './convert-funcs';

const ConvertObj: Record<string, any> = {
  QuickColumnConvert: convertContentToTabelColumn,
  QuickJsonFormItemConvert: convertContentToJsonFormItem,
  QuickOptionListConvert: convertContentToOptionList,
};

export function quickConvertMenu(context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(
    'quick-template-helper.quick-convert',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // Get the word within the selection
        const word = document.getText(selection);
        /***
         * etc.
         * @function QuickColumnConvert(`$1`)
         * */

        const convertList =
          /\/\*\*\* \@function (QuickColumnConvert|QuickJsonFormItemConvert|QuickOptionListConvert|QuickCustomConvert)\(([.\s\S]*?)\)\*\//.exec(
            word,
          );

        if (convertList) {
          const funcName = convertList[1];
          const originContentStr = convertList[2];

          if (funcName === 'QuickCustomConvert') {
            const customConvertList =
              /\/\*\*\* \@function QuickCustomConvert\(([.\s\S]*?)\)\.format\(([.\s\S]*?)\)/.exec(
                word,
              );

            if (customConvertList) {
              const customOriginContentStr = customConvertList[1];
              const format = customConvertList[2];
              editor.edit((editBuilder) => {
                editBuilder.replace(
                  selection,
                  convertContentToCustom(customOriginContentStr, format) || '',
                );
              });
            }
            return;
          }
          editor.edit((editBuilder) => {
            editBuilder.replace(
              selection,
              ConvertObj[funcName]?.(originContentStr) || originContentStr,
            );
          });
        }
      }
    },
  );
}
