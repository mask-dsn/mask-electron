// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const IPFS = require("ipfs");
const path = require("path");

require("electron-reload")(__dirname, {
	electron: path.join(__dirname, "node_modules", ".bin", "electron")
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 1100,
		x: 0,
		y: 0,
		webPreferences: {
			nodeIntegration: true
		}
	});
	// and load the index.html of the app.
	mainWindow.loadFile("index.html");

	// Open the DevTools.
	mainWindow.webContents.openDevTools({ mode: "bottom" });

	// Emitted when the window is closed.
	mainWindow.on("closed", function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	// Spawn your IPFS node
	const node = new IPFS({
		repo: path.join(__dirname, "/.ipfs"),
		relay: { enabled: true, hop: { enabled: true } }
	});

	node.on("ready", async () => {
		// log ipfs version
		const version = await node.version();
		console.log("Version:", version.version);

		// add a file
		const filesAdded = await node.files.add({
			path: "hello.txt",
			content: Buffer.from("Hello from Mask")
		});

		console.log("Added file:", filesAdded[0].path, filesAdded[0].hash);

		const fileBuffer = await node.files.cat(filesAdded[0].hash);

		console.log("Added file contents:", fileBuffer.toString());
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
