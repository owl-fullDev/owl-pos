import { contextBridge, ipcRenderer } from "electron";
import Store from "electron-store";

const store = new Store({ clearInvalidConfig: true });
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("storeInfo", {
  persistInfo: (data) => {
    store.set("storeData", data);
    console.log(store.get("storeData"));
  },
  getInfo: () => {
    return store.get("storeData");
  },
});
