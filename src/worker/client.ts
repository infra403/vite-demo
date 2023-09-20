import {Connection,Client} from "@temporalio/client";
import {getPriceWorkflow} from "./worker.ts";

let client: Client;
export const initClient = async () => {
    const address = "43.163.240.26:7233"
    const connection = await Connection.connect({
        address,
    });
    const namespace = "default"
     client = new Client({ connection, namespace });
}

export const executeGetPrice = async () => {
    // Run example workflow and await its completion
    const result = await client.workflow.execute(getPriceWorkflow, {
        taskQueue: 'test',
        workflowId: `my-business-id-${Date.now()}`,
    });
    console.log(result); // Hello, Temporal!
    return result
}