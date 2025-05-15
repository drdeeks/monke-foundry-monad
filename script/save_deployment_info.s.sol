// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import "forge-std/console.sol";


/**
 * @title Save_Deployment_Info
 * @dev Helper script to save deployment information for the frontend
 */
contract Save_Deploy_mentInfo is Script {
    function run() external {
        // Get contract address from environment variable
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        
        // Create JSON output
        string memory json = vm.serializeAddress("deployment", "contractAddress", contractAddress);
        
        // Write JSON to file
        string memory filePath = "deployment-info.json";
        vm.writeJson(json, filePath);
        
        console.log("Deployment info saved to", filePath);
    }
}