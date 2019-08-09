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
		url: '/ccadmin/v1/applications/' + appName + '/components',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + accessToken,
			'X-CCAsset-Language': 'en'
		}
	});
}

async function loadApplications (client: Client, config: any, provider: ApplicationProvider) {
	const response = await getApplications(client, config.name);

	provider.setData([response.data]);
}

async function loadLayouts (client: Client, config: any, provider: LayoutProvider) {
	const response = await getLayouts(client, config.name);

	provider.setData(response.data.items);
};

async function loadComponents (client: Client, config: any, provider: ComponentProvider) {
	const response = await getComponents(client, config.name);

	provider.setData(response.data.items);
};

export function activate(context: vscode.ExtensionContext) {

	const applicationProvider = new ApplicationProvider(context);
	const layoutProvider = new LayoutProvider(context);
	const componentProvider = new ComponentProvider(context);

	vscode.window.registerTreeDataProvider('dsApplications', applicationProvider);
	vscode.window.registerTreeDataProvider('dsLayouts', layoutProvider);
	vscode.window.registerTreeDataProvider('dsComponents', componentProvider);

	const workspaceRoot = vscode.workspace.rootPath;

	const config = require(workspaceRoot + '/.occ/config');

	if (config && config.appKey) {
		const appServer = config.serverConfig.development.appServerAdmin;
		const appConfig = require(workspaceRoot + '/' + config.appDir + '/.occ/app.json');

		const client = new Client(appServer, config.appKey);

		loadApplications(client, appConfig, applicationProvider);
		loadLayouts(client, appConfig, layoutProvider);
		loadComponents(client, appConfig, componentProvider);
		
		let disposable = vscode.commands.registerCommand('occ.deploy', () => {
			const deployer = new Deployer();
			deployer.deploy();
		});

		let openComponentCommand = vscode.commands.registerCommand('extension.openComponentCode', (component) => {
			console.log('Attempting to locate ', component);
		});

		let refreshApplicationsCommand = vscode.commands.registerCommand('occ.refresh.applcations', () => {
			loadApplications(client, appConfig, applicationProvider);
		});

		let refreshLayoutsCommand = vscode.commands.registerCommand('occ.refresh.layouts', () => {
			loadLayouts(client, appConfig, layoutProvider);
		});

		let refreshComponentsCommand = vscode.commands.registerCommand('occ.refresh.components', () => {
			loadComponents(client, appConfig, componentProvider);
		});

		context.subscriptions.push(disposable);
		context.subscriptions.push(openComponentCommand);
		context.subscriptions.push(refreshLayoutsCommand);
		context.subscriptions.push(refreshComponentsCommand);
		context.subscriptions.push(refreshApplicationsCommand);
	}

}

// this method is called when your extension is deactivated
export function deactivate() {}
