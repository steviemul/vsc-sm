import * as vscode from 'vscode';
import Layout from './Layout';

export class LayoutProvider implements vscode.TreeDataProvider<Layout> {

  layouts: []

  constructor(private context: vscode.ExtensionContext, layouts: []) {
    this.layouts = layouts;
  }

  public async getChildren(layout?: Layout): Promise<Layout[]> {

    let layouts: Layout[] = [];

    this.layouts.forEach((layout:any) => {
      layouts.push(new Layout(
        'layout', layout.displayName, vscode.TreeItemCollapsibleState.None, {
          command: 'taskOutline.executeTask',
          title: "Execute",
          arguments: ['test']
        })
      );
    });

    return layouts;
  }

  getTreeItem(layout: Layout): vscode.TreeItem {
    return layout;
  }
}