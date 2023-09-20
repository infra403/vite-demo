import {ethers} from "ethers";

export const getProvider = ()=> {
  const provider = ethers.getDefaultProvider()
  return provider
}
