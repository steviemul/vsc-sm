import * as vscode from 'vscode';
import Component from './Component';

export class ComponentProvider implements vscode.TreeDataProvider<Component> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  components: any[]

  constructor(private context: vscode.ExtensionContext) {
    this.components = new Array();
  }

  public setData(components: []) {
    this.components.splice(0);
    this.components.push(...components);

    this._onDidChangeTreeData.fire();
  }

  public async getChildren(component?: Component): Promise<Component[]> {

    let components: Component[] = [];

    this.components.forEach((component: any) => {
      components.push(new Component(
        'component', component.name, vscode.TreeItemCollapsibleState.None, {
          command: 'extension.openComponentCode',
          title: "Open Component Code",
          arguments: [component]
        })
      );
    });

    return components;
  }

  getTreeItem(component: Component): vscode.TreeItem {
    return component;
  }
}