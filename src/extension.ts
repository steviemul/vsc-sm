import * as vscode from 'vscode';
import {LayoutProvider} from './data/LayoutProvider';
import {ComponentProvider} from './data/ComponentProvider';
import {ApplicationProvider} from './data/ApplicationProvider';
import {AxiosResponse} from 'axios';
import Client from './net/Client';
import Deployer from './tools/Deployer';
import MetaScanner from './file/MetaScanner';

const scanner = new MetaScanner();

async function getLayouts (client: Client, appName: String) : Promise<AxiosResponse> {

	const loginResponse = await client.login();

	const accessToken = loginResponse.data.access_token;

	return await client.axi.request({
		method: 'get',
		url: '/ccadmin/v1/layouts',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + accessToken,
			'X-CCAsset-Language': 'en'
		},
		params: {
			'x-occ-app': appName
		}
	});
};

async function getApplications(client: Client, appName:String) : Promise<AxiosResponse> {

	const loginResponse = await client.login();

	const accessToken = loginResponse.data.access_token;

	return await client.axi.request({
		method: 'get',
		url: '/ccadmin/v1/clientApplications/' + appName,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + accessToken,
			'X-CCAsset-Language': 'en'
		}
	});
}

async function getComponents(client: Client, appName:String) : Promise<AxiosResponse> {
	const loginResponse = await client.login();

	const accessToken = loginResponse.data.access_token;

	return await client.axi.request({
		method: 'get',
		url: '/ccadmin/v1/clientApplications/' + appName + '/components',
		headers: {
			'Content-Type': 'application/json',
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

		getApplications(client, appConfig.name).then((response) => {
			const applications = [response.data];

			vscode.window.registerTreeDataProvider('dsApplications', new ApplicationProvider(context, applications));
		});
		
		let disposable = vscode.commands.registerCommand('occ.deploy', () => {
			const deployer = new Deployer();
			deployer.deploy();
		});

		let openComponentCommand = vscode.commands.registerCommand('extension.openComponentCode', (component) => {
			console.log('Attempting to locate ', component);
		});

		context.subscriptions.push(disposable);
		context.subscriptions.push(openComponentCommand);

		scanner.scan();
	}

}

// this method is called when your extension is deactivated
export function deactivate() {}
