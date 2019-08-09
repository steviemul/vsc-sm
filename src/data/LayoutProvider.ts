import * as vscode from 'vscode';
import Layout from './Layout';

export class LayoutProvider implements vscode.TreeDataProvider<Layout> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  layouts: any[]

  constructor(private context: vscode.ExtensionContext) {
    this.layouts = new Array();
  }

  public setData(layouts: []) {
    this.layouts.splice(0);
    this.layouts.push(...layouts);

    this._onDidChangeTreeData.fire();
  }

  private getLayouts(page: any) {
    return page.pageLayouts.map(pageLayout => new Layout('layout', pageLayout.layout.displayName, vscode.TreeItemCollapsibleState.Collapsed, {
      command: 'layout.getStructure',
      title: "Expand",
      arguments: [pageLayout.layout.repositoryId]  
    }))
  }

  public async getChildren(layout?: Layout): Promise<Layout[]> {

    let layouts: Layout[] = [];

    if (layout && layout.regions) {

    }
    else {
      this.layouts.forEach((layout: any) => {
        layouts.push(...this.getLayouts(layout));
      });
    }

    return layouts;
  }

  getTreeItem(layout: Layout): vscode.TreeItem {
    return layout;
  }
}