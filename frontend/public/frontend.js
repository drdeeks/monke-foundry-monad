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
    button, select, input[type="number"] {
      padding: 10px;
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
    .selected {
      background-color: #f9a826;
      color: #000;
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
  <div id="selectionInfo">
    <p>Selected: <span id="selectedCount">0</span>/10</p>
    <label>Wager (MONAD): <input id="wagerAmount" type="number" min="0.05" max="10.00" step="0.01" value="0.1"></label>
    <label>Difficulty:
      <select id="difficulty">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </label>
    <button id="playBtn" disabled>Play</button>
  </div>
  <div id="gameBoard"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js"></script>
  <script>
    const MONAD_TESTNET_CHAIN_ID = 10143;
    const MONAD_CHAIN_HEX = "0x279F";
    const CONTRACT_ADDRESS = "0x56Df969bc8C91989FA5d6cBa7E9B91486e728080";
    const ABI = [
      {"inputs":[],"stateMutability":"payable","type":"constructor"},
      {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"selectedNumbers","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"drawnNumbers","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"matches","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wager","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"},{"indexed":false,"internalType":"string","name":"difficulty","type":"string"}],"name":"GamePlayed","type":"event"},
      {"inputs":[{"internalType":"uint256[]","name":"selectedNumbers","type":"uint256[]"},{"internalType":"string","name":"difficulty","type":"string"}],"name":"playKeno","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"}
    ];

    let provider, signer, contract;
    let selectedNumbers = [];
    const maxSelection = 10;

    async function connectWallet() {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== MONAD_TESTNET_CHAIN_ID) await switchToMonad();
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
          params: [{ chainId: MONAD_CHAIN_HEX }]
        });
      } catch (error) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: MONAD_CHAIN_HEX,
              chainName: "Monad Testnet",
              rpcUrls: ["https://testnet-rpc.monad.xyz"],
              nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
              blockExplorerUrls: ["https://testnet-explorer.monad.xyz"]
            }]
          });
        }
      }
    }

    function updateNetworkUI(name) {
      const indicator = document.getElementById("networkIndicator");
      indicator.innerText = name;
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
        number.dataset.value = i;
        number.addEventListener("click", () => toggleSelection(i, number));
        board.appendChild(number);
      }
    }

    function toggleSelection(number, element) {
      const index = selectedNumbers.indexOf(number);
      if (index >= 0) {
        selectedNumbers.splice(index, 1);
        element.classList.remove("selected");
      } else {
        if (selectedNumbers.length >= maxSelection) {
          alert(`You can only select up to ${maxSelection} numbers.`);
          return;
        }
        selectedNumbers.push(number);
        element.classList.add("selected");
      }
      document.getElementById("selectedCount").innerText = selectedNumbers.length;
      document.getElementById("playBtn").disabled = selectedNumbers.length === 0;
    }

    async function playGame() {
      if (!signer || !contract || selectedNumbers.length === 0) {
        alert("Please connect your wallet and select numbers.");
        return;
      }
      const wagerInput = document.getElementById("wagerAmount");
      const wagerVal = parseFloat(wagerInput.value);
      if (isNaN(wagerVal) || wagerVal < 0.05 || wagerVal > 10.00) {
        alert("Wager must be between 0.05 and 10.00 MONAD");
        return;
      }
      const difficulty = document.getElementById("difficulty").value;
      try {
        const tx = await contract.playKeno(selectedNumbers, difficulty, {
          value: ethers.parseEther(wagerVal.toString())
        });
        await tx.wait();
        alert("Game played successfully! Check contract for event data.");
      } catch (err) {
        console.error("Play failed:", err);
        alert("Transaction failed.");
      }
    }

    document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
    document.getElementById("playBtn").addEventListener("click", playGame);
  </script>
</body>
</html>

