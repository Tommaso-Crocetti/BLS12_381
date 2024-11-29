"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("@typechain/hardhat");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");
const config = {
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
    gasReporter: {
        reportPureAndViewMethods: true,
        outputFile: 'Test_gas.txt',
        currency: 'EUR',
        L1: "polygon",
        coinmarketcap: "abc123...",
        enabled: false
    }
    // Example
};
exports.default = config;
