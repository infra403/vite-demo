import {initWorker} from "./worker/worker.ts";
import {executeGetPrice, initClient} from "./worker/client.ts";
import {ipcMain} from "electron";
import {getGasPrice} from "./worker/activities.ts";

export class IPCHandler {

    constructor() {

        ipcMain.handle("init", async (event, arg) => {
            try {
                await this.handleInit()
                return {'data': '', 'success': true, 'message': ''}
            }catch (e) {
                console.log(e)
                return {'data': e, 'success': false, 'message': e.message}
            }
        })

        ipcMain.handle("getPrice", async (event, arg) => {
            try {
                const result = await this.handleGetPrice()
                return {'data': result, 'success': true, 'message': ''}
            }catch (e) {
                console.log(e)
                return {'data': e, 'success': false, 'message': e.message}
            }
        })

        ipcMain.handle("getPriceDirect", async (event, arg) => {
            try {
                const result = await this.handleGetPriceDirect()
                return {'data': result, 'success': true, 'message': ''}
            }catch (e) {
                console.log(e)
                return {'data': e, 'success': false, 'message': e.message}
            }
        })

    }

    public async handleGetPrice() {
        const result = await executeGetPrice()
        return result
    }

    public async handleGetPriceDirect() {
        const result = await getGasPrice()
        return result
    }

    public async handleInit() {
        await initClient()
        await initWorker()
    }



}