import * as vscode from "vscode";
import { constantCase, pascalCase, snakeCase, camelCase, kebabCase, capitalCase, dotCase, pathCase, sentenceCase, trainCase } from "change-case";

enum CaseConvention {
  SnakeCase = 'snake_case',
  CamelCase = 'camelCase',
  CapitalCase = 'Capital Case',
  KebabCase = 'kebab-case',
  PascalCase = 'PascalCase',
  ConstantCase = 'CONSTANT_CASE',
  UpperCase = 'UPPER CASE',
  LowerCase = 'lower case',
  DotCase = 'dot.case',
  PathCase = 'path/case',
  SentenceCase = 'Sentence case',
  TrainCase = 'Train-Case'
}

const ChangeCaseFunctionsMap: {[key: string]: ((str: string) => string)} = {
  [CaseConvention.SnakeCase]: (str: string) => snakeCase(str),
  [CaseConvention.CamelCase]: (str: string) => camelCase(str),
  [CaseConvention.CapitalCase]: (str: string) => capitalCase(str),
  [CaseConvention.KebabCase]: (str: string) => kebabCase(str),
  [CaseConvention.PascalCase]: (str: string) => pascalCase(str),
  [CaseConvention.ConstantCase]: (str: string) => constantCase(str),
  [CaseConvention.UpperCase]: (str: string) => str?.toUpperCase(),
  [CaseConvention.LowerCase]: (str: string) => str?.toLowerCase(),
  [CaseConvention.DotCase]: (str: string) => dotCase(str),
  [CaseConvention.PathCase]: (str: string) => pathCase(str),
  [CaseConvention.SentenceCase]: (str: string) => sentenceCase(str),
  [CaseConvention.TrainCase]: (str: string) => trainCase(str),
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      [
        { scheme: "file", language: "javascript" },
        { scheme: "file", language: "typescript" },
        { scheme: "file", language: "html" },
        { scheme: "file", language: "css" },
        { scheme: "file", language: "less" },
        { scheme: "file", language: "typescriptreact" },
        { scheme: "file", language: "scss" },
        { scheme: "file", language: "python" },
        { scheme: "file", language: "markdown" },
        { scheme: "file", language: "json" },
        { scheme: "file", language: "javascriptreact" },
        { scheme: "file", language: "sass" },
        { scheme: "file", language: "go" },
      ],
      new ChangeCase(),
      {
        providedCodeActionKinds: ChangeCase.providedCodeActionKinds,
      }
    )
  );
}

export class ChangeCase implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    var selection = editor.selection;
    var text = editor.document.getText(selection);

    const settingToFunctionMapping: {[key: string]: CaseConvention} = {
      snakeCase: CaseConvention.SnakeCase,
      camelCase: CaseConvention.CamelCase,
      kebabCase: CaseConvention.KebabCase,
      constantCase: CaseConvention.ConstantCase,
      pascalCase: CaseConvention.PascalCase,
      capitalizeCase: CaseConvention.CapitalCase,
      lowerCase: CaseConvention.LowerCase,
      upperCase: CaseConvention.UpperCase,
      dotCase: CaseConvention.DotCase,
      pathCase: CaseConvention.PathCase,
      sentenceCase: CaseConvention.SentenceCase,
      trainCase: CaseConvention.TrainCase
    };

    const workspaceConf = vscode.workspace.getConfiguration("case.setting");
    const preferredCases: vscode.CodeAction[] = Object.entries(settingToFunctionMapping)
      .map(v => {
        const [settingKey, caseConvention] = v;
        if (workspaceConf[settingKey] === false) {
          return null;
        }

        return this.createFix(
          document,
          caseConvention,
          text
        );
      })
      .filter(v => v !== null) as vscode.CodeAction[];
    
    if (preferredCases.length > 0) {
      preferredCases[0].isPreferred = true;
    }
    return preferredCases;
  }

  private createFix(
    document: vscode.TextDocument,
    selectedCase: CaseConvention,
    text: string
  ): vscode.CodeAction | null {
    const updateFn = ChangeCaseFunctionsMap[selectedCase];
    if (!updateFn) {
      return null;
    }

    const updatedText = updateFn(text);
    if (updatedText === text) {
      return null;
    }
    const fix = new vscode.CodeAction(
      `Change to ${selectedCase} (${(updatedText.length > 50 ? updatedText.substring(1, 50) + '...' : updatedText)})`,
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();
    var editor = vscode.window.activeTextEditor;
    if (editor) {
      const selections: readonly vscode.Selection[] = editor.selections;
      editor.edit(() => {
        for (const selection of selections) {
          if (fix.edit) {
            fix.edit.replace(
              document.uri,
              selection,
              updateFn(editor?.document.getText(selection)!)
            );
          }
        }
      });
    }
    return fix;
  }
}