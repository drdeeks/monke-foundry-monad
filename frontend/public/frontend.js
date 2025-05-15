// MonKe Keno Game - Frontend Logic (ES Module Version)
// Compatible with Foundry and Monad Blockchain

import { config } from './constants.js';

config.contractABI = [
  { "inputs": [], "stateMutability": "payable", "type": "constructor" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "FundsAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint256[]", "name": "selectedNumbers", "type": "uint256[]" },
      { "indexed": false, "internalType": "uint256[]", "name": "drawnNumbers", "type": "uint256[]" },
      { "indexed": false, "internalType": "uint256", "name": "matches", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "wager", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "payout", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "difficulty", "type": "string" }
    ],
    "name": "GamePlayed",
    "type": "event"
  },
  { "inputs": [], "name": "MAX_SELECTIONS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "TOTAL_NUMBERS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "addFunds", "outputs": [], "stateMutability": "payable", "type": "function" },
  {
    "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "name": "difficulties",
    "outputs": [
      { "internalType": "uint256", "name": "maxSelections", "type": "uint256" },
      { "internalType": "uint256", "name": "numbersToDraw", "type": "uint256" },
      { "internalType": "uint256", "name": "difficultyFactor", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  { "inputs": [], "name": "getContractBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [
      { "internalType": "uint256[]", "name": "selectedNumbers", "type": "uint256[]" },
      { "internalType": "string", "name": "difficulty", "type": "string" }
    ],
    "name": "playMonKe",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  { "inputs": [], "name": "totalGamesPlayed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalPayout", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdrawFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "stateMutability": "payable", "type": "receive" }
];
