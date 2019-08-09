import * as vscode from 'vscode';
import Application from './Application';

export class ApplicationProvider implements vscode.TreeDataProvider<Application> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  applications: any[]

  constructor(private context: vscode.ExtensionContext) {
    this.applications = new Array();
  }

  public setData(applications: any[]) {
    this.applications.splice(0);
    this.applications.push(...applications);

    this._onDidChangeTreeData.fire();
  }

  public async getChildren(application?: Application): Promise<Application[]> {

    let applications: Application[] = [];

    this.applications.forEach((application: any) => {
      applications.push(new Application('application', application.name, vscode.TreeItemCollapsibleState.None));
    });

    return applications;
  }

  getTreeItem(application: Application): vscode.TreeItem {
    return application;
  }
}