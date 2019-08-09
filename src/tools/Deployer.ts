import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {exec} from 'child_process';
import {promisify} from 'util';

const execp = promisify(exec);

async function executeDeploy (cliTool) {

  const command = `${cliTool} deploy`;

  const { error, stdout, stderr } = await execp(command);

  if (error) {
    vscode.window.showErrorMessage('Unable to deploy application ' + error);
  }
  else {
    vscode.window.showInformationMessage(stdout);
  }
};

export default class Deployer {
  
  deploy () {
    const cliTool = path.join(vscode.workspace.rootPath, 'node_modules', '@occ', 'cli');

    if (!fs.existsSync(cliTool)) {
      vscode.window.showWarningMessage('Could not locate cli tool @occ/cli');
    }
    else {
      executeDeploy(cliTool);
    }
  }
}