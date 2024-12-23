const { app, BrowserWindow } = require("electron");
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname);
}
require("./menu");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程里面使用 Node.js
      contextIsolation: false, // 关闭上下文隔离
    },
  });

  return win;
};

app.whenReady().then(() => {
  const win = createWindow();
  win.loadFile("./window/index.html");
});
