

import {NativeConnection, Worker} from '@temporalio/worker';
import * as activities from './activities.ts';
import {getGasPrice} from "./activities.ts";

// @@@SNIPSTART typescript-production-worker
// const workflowOption = () =>
//   process.env.NODE_ENV === 'production'
//     ? {
//       workflowBundle: {
//         codePath: require.resolve('../data/workflow-bundle.bs'),
//       },
//     }
//     : { workflowsPath: require.resolve('./workflows') };

const workflowOption = () => { workflowsPath: require.resolve('./workflows') };

export async function initWorker() {
    const connectionOptions = {
        address: "43.163.240.26:7233",
        connectTimeout: 10000,
    }
    let connection = await NativeConnection.connect(connectionOptions)
   Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
       connection,
    taskQueue: 'test',
  }).then(worker => worker.run());
}
// @@@SNIPEND
