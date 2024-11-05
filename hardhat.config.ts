import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000429720, // whatever you want here
      //gasPrice: 0,
      accounts: {
        accountsBalance: "10000000000000000000000000000000"
      }
    }
  },
  mocha: {
    timeout: 100000000
  },
  
};

export default config;