import * as glob from 'glob';
import * as vscode from 'vscode';

export default class MetaScanner {

  items: []

  constructor() {
    this.items = []
  }

  scan () {

    const pattern = vscode.workspace.rootPath + '/**/meta.js';

    glob.sync(pattern, { "ignore": ['**/node_modules/**'] }).forEach((metaFile) => {

      try {
        const meta = require(metaFile);

        console.log(meta);
      }
      catch(error) {}
    });

  }
};
