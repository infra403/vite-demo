import {getProvider} from "./plugins/eth.ts";


export const helloWorld = async (name: string): Promise<string> => {
  return `Hello ${name}!`;
}

export const getGasPrice = async ():Promise<string> => {
  const provider = getProvider()
  const gas = await provider.getGasPrice()
  return gas.toString()
}
