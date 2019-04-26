import * as vscode from 'vscode';
import Application from './Application';

export class ApplicationProvider implements vscode.TreeDataProvider<Application> {

  applications: []

  constructor(private context: vscode.ExtensionContext, applications: []) {
    this.applications = applications;
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