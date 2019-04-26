import * as glob from 'glob';
import * as vscode from 'vscode';
import * as fs from 'fs';
import {parse} from '@babel/parser';

export default class MetaScanner {

  items: []

  constructor() {
    this.items = []
  }

  scan () {

    const pattern = vscode.workspace.rootPath + '/**/*.js';

    glob.sync(pattern, { "ignore": ['**/node_modules/**'] }).forEach((jsFile) => {

      try {
        const contents = fs.readFileSync(jsFile);

        const ast = parse(contents);

        console.log(ast);
      }
      catch(error) {
        console.error(error);
      }
    });

  }
};
