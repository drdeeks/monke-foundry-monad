Skip to content
DrDeek's
DrDeek's

Hobby

monke-keno-foundry

3W6mka5ER


Changelog
Help
Docs

Source
Output
frontend.js

// MonKe Keno Game - Frontend Logic
// Compatible with Foundry and Monad Blockchain

// Game Configuration
const config = {
    contractAddress: "0x56Df969bc8C91989FA5d6cBa7E9B91486e728080", 
    contractABI: [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
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
monke-keno-foundry – Deployment Source – Vercel
