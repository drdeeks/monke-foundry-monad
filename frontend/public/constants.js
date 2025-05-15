// constants.js
export const config = {
    contractAddress: "0x56Df969bc8C91989FA5d6cBa7E9B91486e728080",
    contractABI: [], // Replace with your actual ABI
    difficultySettings: {
        easy: { maxSelectable: 10, numbersToDraw: 20 },
        medium: { maxSelectable: 8, numbersToDraw: 15 },
        hard: { maxSelectable: 6, numbersToDraw: 10 }
    },
    totalNumbers: 60,
    monadChainId: 201,
    monadTestnetChainId: 202,
    networks: {
        201: { name: "Monad Mainnet", shortName: "MONAD", class: "network-monad" },
        202: { name: "Monad Testnet", shortName: "MONAD-TEST", class: "network-monad-testnet" },
        default: { name: "Unsupported Network", shortName: "UNSUPPORTED", class: "network-other" }
    }
};
