const electron = require("electron");

const { ipcMain } = electron;

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true,
       contextIsolation: false
    },
    width: 300,
    height: 200,
    title: "Add New Todo",
    
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('close', ()=>( 
      addWindow = null
  ))
}

function clearTodo (){
  mainWindow.webContents.send('todo:clear','clear')
}



app.on("ready", () => {
    
  mainWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,

    }
  });
  mainWindow.webContents.on('dom-ready',()=>{
      console.log("fuck u ");
      mainWindow.webContents.send('cool1', 'shut')
  })
  mainWindow.loadURL(`file://${__dirname}/main.html`);
    ipcMain.on('todo:add',async (event, todo)=>{
            
        if(mainWindow){
          console.log("hre in ")
          mainWindow.webContents.send('todo:add', todo)

        }
           
      
        mainWindow.webContents.on('did-finish-load', ()=>{
            console.log("here ia m ")
            mainWindow.webContents.send('todo:app', todo)

        })
addWindow.close();
        console.log("todo app listener ", todo)
       
    } )

  mainWindow.on("closed", () => app.quit());

  if (process.platform == "darwin") {
    menuTemplate.unshift({ label: "" });
  }
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  console.log("proces ------------", process.platform);

  Menu.setApplicationMenu(mainMenu);
});

let menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
      {
        label: "Clear All todos",
        accelerator: process.platform === "darwin" ? "Command+D" : "Ctrl+D",
        click() {
          //clear todos logic 
          clearTodo();
        },
      },


    ],
  },
];

if (process.platform === "darwin") {
  menuTemplate.unshift({ label: "" });
}
if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "DEVELOPER!!!",
    submenu: [
      {
        role: 'reload'
      }, 
      {
        label: "Toggle Developer Tools",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator: process.platform === "darwin" ? "Command+Option+I" : "Ctrl+Shift+I",
      },
    ],
  }, 
  );
}
