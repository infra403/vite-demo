import {initWorker} from "../src/worker/worker.ts";
import {executeGetPrice, initClient} from "../src/worker/client.ts";
import {ipcMain} from "electron";

export class IPCHandler {

    constructor() {

        ipcMain.on("init", async (event, arg) => {
            try {
                await this.handleInit()
                return {'data': '', 'success': true, 'message': ''}
            }catch (e) {
                return {'data': e, 'success': false, 'message': e.message}
            }
        })

        ipcMain.on("getPrice", async (event, arg) => {
            try {
                const result = await this.handleGetPrice()
                return {'data': result, 'success': true, 'message': ''}
            }catch (e) {
                return {'data': e, 'success': false, 'message': e.message}
            }
        })

    }

    public async handleGetPrice() {
        const result = await executeGetPrice()
        return result
    }

    public async handleInit() {
        await initWorker()
        await initClient()
    }



}