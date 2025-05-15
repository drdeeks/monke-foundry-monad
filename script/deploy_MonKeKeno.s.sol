// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {MonKeKeno} from "../src/MonKeKeno.sol";

/**
 * @title DeployMonKeKeno
 * @dev Foundry script for deploying the MonKeKeno contract to Monad blockchain
 */
contract DeployMonKeKeno is Script {
    event ContractDeployed(address contractAddress);
    function run() external {
        // Start broadcasting transactions
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get initial contract balance from environment variable (default to 100 ether if not set)
        uint256 initialBalance;
        try vm.envUint("INITIAL_CONTRACT_BALANCE") returns (uint256 value) {
            initialBalance = value * 1 ether;
        } catch {
            initialBalance = 1 ether;
        }

        // Deploy contract with initial funding
        MonKeKeno monKeKeno = new MonKeKeno{value: initialBalance}();
        
        // Log contract address
        emit ContractDeployed(address(monKeKeno));
        console.log("Initial contract balance:", initialBalance / 1 ether, "MONAD");

        // End broadcasting transactions
        vm.stopBroadcast();
    }
}