import * as vscode from 'vscode';
import * as path from 'path';

export default class Layout extends vscode.TreeItem {

  type: string;
  regions: any[];

  constructor(
    type: string,
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.command = command;
    this.iconPath = path.join(__filename, '..', '..', '..', 'images/th.png');
    this.regions = new Array();
  }

}