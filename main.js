const electron = require('electron');
const url = require('url');
const path = require('path');

const{app, BrowserWindow, Menu, ipcMain} = electron;
 
let mainWindow;
let addWindow;

const menuItensEmpty =  [{}];

const menuItens =  [
	{
	  label: 'File',
	  submenu:[
		{
		  label:'Adicionar',
		  click(){
			add();
		  }
		},
		{
		  label:'Clear Items',
		  click(){
			reset();
		  }
		},
		{
		  label: 'Sair',
		  click(){
			app.quit();
		  }
		},
	  ]
	},
	{
		label: 'Dev info',
		submenu:[
			{
				label: 'Refresh',
				role:  'reload'
			},
			{
				label: 'Dev info',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	}
];

app.on('ready', function(){
	mainWindow = new BrowserWindow({});

	mainWindow.loadURL(url.format({
		pathname : path.join(__dirname, 'html/principal.html'),
		protocol : 'file:', 
		slashes : true
	}));

	mainWindow.on('closed', function(){
		app.quit();
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate(menuItens));
});

ipcMain.on('eventitem:add', function(e, item){
	mainWindow.webContents.send('eventitem:add', item);
	addWindow.close(); 
});

function add(){
	addWindow = new BrowserWindow({
			width: 300,
			height:200,
			title:' Adicionar Item'
		}
	);

	addWindow.loadURL(url.format(
		{
			pathname: path.join(__dirname, 'html/addItem.html'),
			protocol: 'file:',
			slashes:true
		}
	));

	Menu.setApplicationMenu(Menu.buildFromTemplate(menuItensEmpty));

	addWindow.on('close', function(){
		Menu.setApplicationMenu(Menu.buildFromTemplate(menuItens));
		addWindow = null;
	});
}

function reset(){
	mainWindow.webContents.send('eventitem-reset');
}