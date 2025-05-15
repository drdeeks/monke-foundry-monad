<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MonKe Keno Keno - Monad Testnet</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background-color: #111;
      color: #fff;
    }
    button {
      padding: 10px 20px;
      margin: 10px;
      font-size: 16px;
      cursor: pointer;
    }
    .network-indicator {
      margin-top: 10px;
      font-weight: bold;
    }
    #gameBoard {
      display: grid;
      grid-template-columns: repeat(10, 40px);
      gap: 5px;
      justify-content: center;
      margin-top: 20px;
    }
    .number {
      width: 40px;
      height: 40px;
      background-color: #444;
      border: 1px solid #666;
      color: #fff;
      line-height: 40px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>MonKe Keno Keno</h1>
  <button id="connectWalletBtn">Connect Wallet</button>
  <div id="networkInfo" style="display: none">
    <p id="networkIndicator"></p>
    <p>Contract Address: <span id="contractAddress"></span></p>
  </div>
  <div id="gameBoard"></div>

  <script type="module">
    import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js";

    const MONAD_TESTNET_RPC = "https://testnet-rpc.monad.xyz";
    const MONAD_TESTNET_CHAIN_ID = 10143;
    const MONAD_CHAIN_HEX = "0x279F";
    const CONTRACT_ADDRESS = "0x56Df969bc8C91989FA5d6cBa7E9B91486e728080";

    const ABI = [
      {"inputs":[],"stateMutability":"payable","type":"constructor"},
      {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsAdded","type":"event"},
      {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsWithdrawn","type":"event"},
      {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"selectedNumbers","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"drawnNumbers","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"matches","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wager","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"},{"indexed":false,"internalType":"string","name":"difficulty","type":"string"}],"name":"GamePlayed","type":"event"},
      {"inputs":[],"name":"MAX_SELECTIONS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"TOTAL_NUMBERS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"addFunds","outputs":[],"stateMutability":"payable","type":"function"},
      {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"difficulties","outputs":[{"internalType":"uint256","name":"maxSelections","type":"uint256"},{"internalType":"uint256","name":"numbersToDraw","type":"uint256"},{"internalType":"uint256","name":"difficultyFactor","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
      {"inputs":[{"internalType":"uint256[]","name":"selectedNumbers","type":"uint256[]"},{"internalType":"string","name":"difficulty","type":"string"}],"name":"playKeno","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},
      {"inputs":[],"name":"totalGamesPlayed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"totalPayout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
      {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},
      {"stateMutability":"payable","type":"receive"}
    ];

    let provider, signer, contract;

    async function connectWallet() {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        if (network.chainId !== MONAD_TESTNET_CHAIN_ID) {
          await switchToMonad();
        }

        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        document.getElementById("contractAddress").innerText = CONTRACT_ADDRESS;
        updateNetworkUI("Monad Testnet");
        drawGameBoard();
      } else {
        alert("MetaMask not detected");
      }
    }

    async function switchToMonad() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: MONAD_CHAIN_HEX }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: MONAD_CHAIN_HEX,
              chainName: "Monad Testnet",
              rpcUrls: [MONAD_TESTNET_RPC],
              nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
              blockExplorerUrls: ["https://testnet-explorer.monad.xyz"]
            }]
          });
        } else {
          console.error("Network switch error", switchError);
        }
      }
    }

    function updateNetworkUI(networkName) {
      const indicator = document.getElementById("networkIndicator");
      indicator.innerText = networkName;
      indicator.className = "network-indicator network-monad-testnet";
      document.getElementById("networkInfo").style.display = "block";
    }

    function drawGameBoard() {
      const board = document.getElementById("gameBoard");
      board.innerHTML = "";
      for (let i = 1; i <= 80; i++) {
        const number = document.createElement("div");
        number.className = "number";
        number.innerText = i;
        board.appendChild(number);
      }
    }

    document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
  </script>
</body>
</html>
