export const config = {
  contractAddress: "0x56Df969bc8C91989FA5d6cBa7E9B91486e728080",
  contractABI: [ // shortened to fit in context, should be fully injected in real usage
    { "inputs": [], "stateMutability": "payable", "type": "constructor" },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "FundsAdded",
      "type": "event"
    }
    // ... continue full ABI here
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
