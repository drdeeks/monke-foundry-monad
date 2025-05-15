// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {MonKeKeno} from "../src/MonKeKeno.sol";

contract MonKeKenoTest is Test {
    MonKeKeno public monKeKeno;
    address public player = address(0x1);
    uint256 public initialBalance = 100 ether;

    function setUp() public {
        // Fund the contract with initial balance
        vm.deal(address(this), initialBalance);
        
        // Deploy the contract
        monKeKeno = new MonKeKeno{value: initialBalance}();
        
        // Fund the player
        vm.deal(player, 10 ether);
    }

    function testContractDeployment() public {
        assertEq(address(monKeKeno).balance, initialBalance);
    }

    function testPlayKenoEasy() public view {
        // Set player as msg.sender
        vm.startPrank(player);

        // Select numbers for Easy difficulty (10 selections)
        uint256[] memory selectedNumbers = new uint256[](5);
        selectedNumbers[0] = 1;
        selectedNumbers[1] = 10;
        selectedNumbers[2] = 20;
        selectedNumbers[3] = 30;
        selectedNumbers[4] = 40;

        // Play the game with 1 ether wager
        uint256 playerBalanceBefore = player.balance;
        
        (uint256[] memory drawnNumbers, uint256 payout) = monKeKeno.playKeno{value: 1 ether}(
            selectedNumbers,
            "easy"
        );
        
        // Basic assertions
        assertEq(drawnNumbers.length, 20); // Easy mode draws 20 numbers
        
        // Player received payout or lost wager
        if (payout > 0) {
            assertGe(player.balance, playerBalanceBefore);
        } else {
            assertEq(player.balance, playerBalanceBefore - 1 ether);
        }
        
        vm.stopPrank();
    }
}