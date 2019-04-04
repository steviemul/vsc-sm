import * as vscode from 'vscode';
import {LayoutProvider} from './data/LayoutProvider';
import {ComponentProvider} from './data/ComponentProvider';
import {AxiosResponse} from 'axios';
import Client from './net/Client';

async function getLayouts (client: Client, appName: String) : Promise<AxiosResponse> {

	const loginResponse = await client.login();

	const accessToken = loginResponse.data.access_token;

	return await client.axi.request({
		method: 'get',
		url: '/ccadmin/v1/layouts',
		headers: {
			'Content-Type': 'application/octet-stream',
			'Authorization': 'Bearer ' + accessToken,
			'X-CCAsset-Language': 'en'
		},
		params: {
			'x-occ-app': appName
		}
	});
};

async function getComponents(client: Client, appName:String) : Promise<AxiosResponse> {
	const loginResponse = await client.login();

	const accessToken = loginResponse.data.access_token;

	return await client.axi.request({
		method: 'get',
		url: '/ccadmin/v1/clientApplications/' + appName + '/components',
		headers: {
			'Content-Type': 'application/octet-stream',
			'Authorization': 'Bearer ' + accessToken,
			'X-CCAsset-Language': 'en'
		}
	});
}

export function activate(context: vscode.ExtensionContext) {

	const workspaceRoot = vscode.workspace.rootPath;

	const config = require(workspaceRoot + '/.occ/config');

	if (config && config.appKey) {
		const appServer = config.serverConfig.development.appServerAdmin;
		const appConfig = require(workspaceRoot + '/' + config.appDir + '/.occ/app.json');

		const client = new Client(appServer, config.appKey);

		getLayouts(client, appConfig.name).then((response) => {
			vscode.window.registerTreeDataProvider('dsLayouts', new LayoutProvider(context, response.data.items));
		});

		getComponents(client, appConfig.name).then((response) => {
			vscode.window.registerTreeDataProvider('dsComponents', new ComponentProvider(context, response.data.items));
		});

		console.log('Congratulations, your extension "vsc-sm" is now active!');

		
		let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
			// The code you place here will be executed every time your command is executed

			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World!');
		});

		let openComponentCommand = vscode.commands.registerCommand('extension.openComponentCode', (component) => {
			console.log('Attempting to locate ', component);
		});

		context.subscriptions.push(disposable);
		context.subscriptions.push(openComponentCommand);

	}

}

// this method is called when your extension is deactivated
export function deactivate() {}
