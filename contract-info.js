// This file should be placed in your project to import the ABI for the frontend
// In Foundry, the ABI is generated during compilation

// Import the ABI and contract address
const monKeKenoABI = require('../out/MonKeKeno.sol/MonKeKeno.json').abi;
const deploymentInfo = require('../deployment-info.json');

// Export contract info for the frontend
module.exports = {
    contractAddress: deploymentInfo.contractAddress,
    contractABI: MonKeKenoABI
};
