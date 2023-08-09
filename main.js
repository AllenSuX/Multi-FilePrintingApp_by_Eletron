const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let printWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  // 創建一個不顯示的 BrowserWindow 來執行列印操作
  printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('print-google', (event,obj) => {
  const contents = printWindow.webContents;
  console.log(obj)

  // 載入 Google 首頁
  contents.loadURL('https://www.google.com/').then(() => {
    // 在渲染進程中列印 Google 首頁
    contents.print({}, (success, failureReason) => {
      // 處理完成後回傳結果到渲染進程
      event.sender.send('print-result', {
        success: success,
        failureReason: failureReason
      });

      // 關閉不顯示的列印視窗
      printWindow.close();
    });
  }).catch((error) => {
    // 處理錯誤並回傳結果到渲染進程
    event.sender.send('print-result', {
      success: false,
      failureReason: error.message
    });
    // 關閉不顯示的列印視窗
    printWindow.close();
  });
});
