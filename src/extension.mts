import * as vscode from "vscode";
import {
  constantCase,
  pascalCase,
  snakeCase,
  camelCase,
  kebabCase,
  capitalCase,
  dotCase,
  pathCase,
  sentenceCase,
  trainCase,
  pascalSnakeCase,
} from "change-case";
import { titleCase } from "title-case";
import { swapCase } from "swap-case";
import { spongeCase } from "sponge-case";

declare type CaseConvention = {
  example: string;
  convert: (input: string) => string;
};

const SettingToCaseMapping: { [key: string]: CaseConvention } = {
  snakeCase: { example: "snake_case", convert: snakeCase },
  camelCase: { example: "camelCase", convert: camelCase },
  kebabCase: { example: "kebab-case", convert: kebabCase },
  constantCase: { example: "CONSTANT_CASE", convert: constantCase },
  pascalCase: { example: "PascalCase", convert: pascalCase },
  pascalSnakeCase: {
    example: "Pascal_Snake_Case",
    convert: pascalSnakeCase,
  },
  capitalizeCase: { example: "Capital Case", convert: capitalCase },
  lowerCase: { example: "lower case", convert: (str) => str?.toLowerCase() },
  upperCase: { example: "UPPER CASE", convert: (str) => str?.toUpperCase() },
  dotCase: { example: "dot.case", convert: dotCase },
  pathCase: { example: "path/case", convert: pathCase },
  sentenceCase: { example: "Sentence case", convert: sentenceCase },
  trainCase: { example: "Train-Case", convert: trainCase },
  titleCase: { example: "Title Case", convert: titleCase },
  swapCase: { example: "sWAP cASE", convert: swapCase },
  spongeCase: { example: "SpoNge CAsE", convert: spongeCase },
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      [{ scheme: "file" }, { scheme: "untitled" }],
      new ChangeCase(),
      {
        providedCodeActionKinds: ChangeCase.providedCodeActionKinds,
      },
    ),
  );
}

export class ChangeCase implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
  ): vscode.CodeAction[] | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const selection = editor.selection;
    const text = editor.document.getText(selection);

    const workspaceConf = vscode.workspace.getConfiguration("case.setting");
    const preferredCases: vscode.CodeAction[] = Object.entries(
      SettingToCaseMapping,
    )
      .map((v) => {
        const [settingKey, caseConvention] = v;
        if (workspaceConf[settingKey] === false) {
          return null;
        }

        return this.createFix(document, caseConvention, text);
      })
      .filter((v) => v !== null) as vscode.CodeAction[];

    if (preferredCases.length > 0) {
      preferredCases[0].isPreferred = true;
    }
    return preferredCases;
  }

  private createFix(
    document: vscode.TextDocument,
    caseConvention: CaseConvention,
    text: string,
  ): vscode.CodeAction | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return null;
    }

    const selections: readonly vscode.Selection[] = editor.selections;
    const updatedText = caseConvention.convert(text);
    if (updatedText === text && selections.length <= 1) {
      return null;
    }
    const fix = new vscode.CodeAction(
      `Change to ${caseConvention.example} (${
        updatedText.length > 50
          ? updatedText.substring(1, 50) + "..."
          : updatedText
      })`,
      vscode.CodeActionKind.QuickFix,
    );
    fix.edit = new vscode.WorkspaceEdit();
    editor.edit(() => {
      for (const selection of selections) {
        if (fix.edit) {
          fix.edit.replace(
            document.uri,
            selection,
            caseConvention.convert(editor.document.getText(selection)),
          );
        }
      }
    });
    return fix;
  }
}
