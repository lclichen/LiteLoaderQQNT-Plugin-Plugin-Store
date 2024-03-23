// src/preload/index.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("pluginStore", {
  ipcRenderer_LL: import_electron.ipcRenderer,
  ipcRenderer_LL_on: (channel, callback) => {
    import_electron.ipcRenderer.on(channel, callback);
  },
  // 安装
  install: (url, slug) => import_electron.ipcRenderer.invoke("LiteLoader.pluginStore.install", url, slug),
  // 下载文件
  downloadFile: (url, fileName, saveFolder) => import_electron.ipcRenderer.invoke("LiteLoader.pluginStore.downloadFile", url, fileName, saveFolder),
  // 卸载
  uninstall: (slug) => import_electron.ipcRenderer.invoke(
    "LiteLoader.pluginStore.uninstall",
    slug
  ),
  // 更新
  update: (url, slug) => import_electron.ipcRenderer.invoke("LiteLoader.pluginStore.update", url, slug),
  // 重开
  restart: () => import_electron.ipcRenderer.invoke("LiteLoader.pluginStore.restart"),
  // 外部打开网址
  openWeb: (url) => {
    import_electron.ipcRenderer.send("LiteLoader.pluginStore.openWeb", url);
  },
  createWin: (message) => import_electron.ipcRenderer.send("LiteLoader.pluginStore.createWin", message),
  createBrowserWindow: (slug) => {
    const LiteLoader = import_electron.ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader");
    const store = LiteLoader.plugins[slug].manifest.store;
    store.slug = slug;
    import_electron.ipcRenderer.send("LiteLoader.pluginStore.createBrowserWindow", JSON.stringify(store));
  },
  isSnippetInstall: (slug, fileName) => import_electron.ipcRenderer.invoke(`LiteLoader.${slug}.isSnippetInstall`, fileName),
  isSnippetRestart: (slug, fileName) => import_electron.ipcRenderer.invoke(`LiteLoader.${slug}.isSnippetRestart`, fileName),
  log: (level, ...serializedArgs) => import_electron.ipcRenderer.send("LiteLoader.pluginStore.log", level, ...serializedArgs),
  LiteLoader: () => {
    return {
      ...import_electron.ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader"),
      storeData: import_electron.ipcRenderer.sendSync("LiteLoader.pluginStore.getStoreData")
    };
  }
});
