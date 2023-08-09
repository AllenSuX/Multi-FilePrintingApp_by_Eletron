// 在 preload.js 中將需要在網頁中使用的 Node.js API 放到這裡
const { ipcRenderer } = require('electron');
window.ipcRenderer = ipcRenderer;

