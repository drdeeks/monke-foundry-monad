export const config = {
  contractAddress: "0x56Df969bc8C91989FA5d6cBa7E9B91486e728080",
  contractABI: [[
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
    "name": "GamePlayed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAX_SELECTIONS",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TOTAL_NUMBERS",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "addFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
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
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256[]", "name": "selectedNumbers", "type": "uint256[]" },
      { "internalType": "string", "name": "difficulty", "type": "string" }
    ],
    "name": "playKeno",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalGamesPlayed",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPayout",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]
  ],
  difficultySettings: {
    easy: { maxSelectable: 10, numbersToDraw: 20 },
    medium: { maxSelectable: 8, numbersToDraw: 15 },
    hard: { maxSelectable: 6, numbersToDraw: 10 }
  },
  totalNumbers: 60,
  monadChainId: 10143,
  networks: {
    10143: { name: "Monad Testnet", shortName: "MONAD-TEST", class: "network-monad-testnet" },
    default: { name: "Unsupported", shortName: "UNSUPPORTED", class: "network-other" }
  },
  rpcUrl: "https://testnet-rpc.monad.xyz"
};
