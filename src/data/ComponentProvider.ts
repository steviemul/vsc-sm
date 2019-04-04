import * as vscode from 'vscode';
import Component from './Component';

export class ComponentProvider implements vscode.TreeDataProvider<Component> {

  components: []

  constructor(private context: vscode.ExtensionContext, components: []) {
    this.components = components;
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