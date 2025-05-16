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
],
    difficultySettings: {
        easy: { maxSelectable: 10, numbersToDraw: 20 },
        medium: { maxSelectable: 8, numbersToDraw: 15 },
        hard: { maxSelectable: 6, numbersToDraw: 10 }
    },
    totalNumbers: 60,
    monadChainId: 10143, // Updated Monad testnet chain ID
    networks: {
        10143: { name: "Monad Testnet", shortName: "MONAD", class: "network-monad-testnet", rpcUrl: "https://testnet-rpc.monad.xyz" },
        default: { name: "Unsupported Network", shortName: "UNSUPPORTED", class: "network-other" }
    }
};

// State management
const state = {
    provider: null,
    signer: null,
    contract: null,
    connected: false,
    account: null,
    networkId: null,
    difficulty: 'easy',
    selectedNumbers: [],
    wagerAmount: 10,
    gameInProgress: false,
    drawnNumbers: [],
    matchedNumbers: [],
    payout: 0,
    multiplier: 0
};

// DOM Elements
const elements = {};

// Initialize DOM elements after the document is loaded
function initializeElements() {
    elements.connectWalletBtn = document.getElementById('connectWalletBtn');
    elements.walletInfo = document.getElementById('walletInfo');
    elements.contractAddress = document.getElementById('contractAddress');
    elements.contractBalance = document.getElementById('contractBalance');
    elements.wagerAmount = document.getElementById('wagerAmount');
    elements.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    elements.easyBtn = document.getElementById('easyBtn');
    elements.mediumBtn = document.getElementById('mediumBtn');
    elements.hardBtn = document.getElementById('hardBtn');
    elements.multiplierDisplay = document.getElementById('multiplierDisplay');
    elements.maxSelectable = document.getElementById('maxSelectable');
    elements.numbersToDraw = document.getElementById('numbersToDraw');
    elements.selectionCount = document.getElementById('selectionCount');
    elements.maxSelectionCount = document.getElementById('maxSelectionCount');
    elements.gameBoard = document.getElementById('gameBoard');
    elements.clearBtn = document.getElementById('clearBtn');
    elements.randomBtn = document.getElementById('randomBtn');
    elements.playBtn = document.getElementById('playBtn');
    elements.resultsSection = document.getElementById('resultsSection');
    elements.matchesValue = document.getElementById('matchesValue');
    elements.payoutValue = document.getElementById('payoutValue');
    elements.multiplierValue = document.getElementById('multiplierValue');
    elements.winningAnimation = document.getElementById('winningAnimation');
    elements.playAgainBtn = document.getElementById('playAgainBtn');
    elements.pixelMonkey = document.getElementById('pixelMonkey');
    elements.txStatus = document.getElementById('txStatus');
    elements.networkInfo = document.getElementById('networkInfo');
    elements.networkIndicator = document.getElementById('networkIndicator');
    elements.notificationModal = document.getElementById('notificationModal');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.modalBody = document.getElementById('modalBody');
    elements.modalConfirmBtn = document.getElementById('modalConfirmBtn');
    elements.closeModal = document.getElementById('closeModal');
    
    // Fix for the game title - Update the title in the HTML to "Monke"
    const titleElement = document.getElementById('gameTitle');
    if (titleElement) {
        titleElement.textContent = "Monke";
    }
    
    // Remove unwanted "Download Project Files" button if it exists
    const downloadBtn = document.getElementById('downloadProjectBtn');
    if (downloadBtn) {
        downloadBtn.remove();
    }
}

// Connect wallet
async function connectWallet() {
    if (!window.ethereum) {
        showNotification("No Wallet Detected", "Please install MetaMask or another Web3 wallet to connect.");
        return;
    }
    
    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        state.account = accounts[0];
        
        // Get the current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        state.networkId = parseInt(chainId, 16);
        
        // Check if we're on Monad network, if not prompt to switch
        if (state.networkId !== config.monadChainId) {
            try {
                await switchToMonadNetwork();
            } catch (switchError) {
                console.error("Failed to switch network:", switchError);
                showNotification(
                    "Network Switch Failed", 
                    "Please manually switch to Monad Testnet (Chain ID: 10143) in your wallet."
                );
            }
        }
        
        // Initialize ethers provider - Modified to use ethers v6 correctly
        state.provider = new ethers.BrowserProvider(window.ethereum);
        state.signer = await state.provider.getSigner();
        
        // Initialize contract
        await initializeContract();
        
        // Update UI
        state.connected = true;
        updateWalletUI();
        updateNetworkUI();
        
        // Enable play button if conditions are met
        updatePlayButtonState();
    } catch (error) {
        console.error("Error connecting wallet:", error);
        showNotification("Connection Error", "Failed to connect wallet. Please try again.");
    }
}

// Switch to Monad network
async function switchToMonadNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + config.monadChainId.toString(16) }],
        });
    } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        if (error.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0x' + config.monadChainId.toString(16),
                        chainName: 'Monad Testnet',
                        nativeCurrency: {
                            name: 'MONAD',
                            symbol: 'MONAD',
                            decimals: 18
                        },
                        rpcUrls: [config.networks[config.monadChainId].rpcUrl],
                        blockExplorerUrls: ['https://explorer.monad.xyz/']
                    },
                ],
            });
        } else {
            throw error;
        }
    }
}

// Disconnect wallet (UI update only, doesn't actually disconnect the wallet)
function disconnectWallet() {
    state.connected = false;
    state.account = null;
    state.signer = null;
    state.contract = null;
    
    // Update UI
    if (elements.connectWalletBtn) {
        elements.connectWalletBtn.textContent = "Connect Wallet";
    }
    
    if (elements.walletInfo) {
        elements.walletInfo.innerHTML = `
            <button class="connect-wallet-btn" id="connectWalletBtn">Connect Wallet</button>
            <div id="networkInfo" style="display: none;">
                <span class="network-indicator" id="networkIndicator">Network</span>
            </div>
        `;
        
        // Re-add event listener
        const newConnectBtn = document.getElementById('connectWalletBtn');
        if (newConnectBtn) {
            newConnectBtn.addEventListener('click', connectWallet);
        }
    }
    
    // Update contract info
    if (elements.contractAddress) {
        elements.contractAddress.textContent = "Not connected";
    }
    
    if (elements.contractBalance) {
        elements.contractBalance.textContent = "N/A";
    }
    
    // Disable play button
    if (elements.playBtn) {
        elements.playBtn.disabled = true;
    }
}

// Initialize contract
async function initializeContract() {
    if (!state.signer) return;
    
    try {
        // Create contract instance
        state.contract = new ethers.Contract(
            config.contractAddress,
            config.contractABI,
            state.signer
        );
        
        // Update contract info in UI
        if (elements.contractAddress) {
            elements.contractAddress.textContent = config.contractAddress;
        }
        
        // Get contract balance
        await updateContractBalance();
    } catch (error) {
        console.error("Error initializing contract:", error);
        showNotification(
            "Contract Error", 
            "Failed to connect to the Monke contract. Please check if you're on the correct network."
        );
    }
}

// Update contract balance
async function updateContractBalance() {
    if (!state.contract || !state.provider) return;
    
    try {
        const balance = await state.provider.getBalance(config.contractAddress);
        if (elements.contractBalance) {
            elements.contractBalance.textContent = ethers.formatEther(balance);
        }
    } catch (error) {
        console.error("Error getting contract balance:", error);
        if (elements.contractBalance) {
            elements.contractBalance.textContent = "Error";
        }
    }
}

// Update wallet UI
function updateWalletUI() {
    if (!state.connected || !state.account || !elements.walletInfo) {
        if (elements.connectWalletBtn) {
            elements.connectWalletBtn.textContent = "Connect Wallet";
        }
        return;
    }
    
    // Format the address for display (first 6 chars + last 4 chars)
    const shortAddress = `${state.account.substring(0, 6)}...${state.account.substring(state.account.length - 4)}`;
    
    // Update wallet info
    elements.walletInfo.innerHTML = `
        <div class="wallet-balance" id="walletBalance">Fetching...</div>
        <div class="wallet-address">${shortAddress}</div>
        <div id="networkInfo" style="display: block;">
            <span class="network-indicator" id="networkIndicator">Network</span>
        </div>
    `;
    
    // Get and display wallet balance
    updateWalletBalance();
    
    // Re-initialize network indicator element
    elements.networkIndicator = document.getElementById('networkIndicator');
    elements.networkInfo = document.getElementById('networkInfo');
}

// Update wallet balance
async function updateWalletBalance() {
    if (!state.provider || !state.account) return;
    
    try {
        const balance = await state.provider.getBalance(state.account);
        const walletBalanceElement = document.getElementById('walletBalance');
        if (walletBalanceElement) {
            walletBalanceElement.textContent = `${parseFloat(ethers.formatEther(balance)).toFixed(4)} MONAD`;
        }
    } catch (error) {
        console.error("Error getting wallet balance:", error);
        const walletBalanceElement = document.getElementById('walletBalance');
        if (walletBalanceElement) {
            walletBalanceElement.textContent = "Error fetching balance";
        }
    }
}

// Update network UI
function updateNetworkUI() {
    const networkInfoElement = elements.networkInfo;
    const networkIndicatorElement = elements.networkIndicator;
    
    if (!networkInfoElement || !networkIndicatorElement) return;
    
    networkInfoElement.style.display = 'block';
    
    // Get network information
    const network = config.networks[state.networkId] || config.networks.default;
    
    // Update network indicator
    networkIndicatorElement.textContent = network.shortName;
    networkIndicatorElement.className = 'network-indicator ' + network.class;
}

// Create the game board
function createGameBoard() {
    // Clear existing board
    if (!elements.gameBoard) {
        console.error("Game board element not found");
        return;
    }
    
    elements.gameBoard.innerHTML = '';
    
    // Create 60 number cards (1-60)
    for (let i = 1; i <= config.totalNumbers; i++) {
        const numberCard = document.createElement('div');
        numberCard.className = 'number-card';
        numberCard.textContent = i;
        numberCard.dataset.number = i;
        
        // Add click event to select/deselect number
        numberCard.addEventListener('click', () => toggleNumberSelection(i));
        
        elements.gameBoard.appendChild(numberCard);
    }
    
    // Make sure the game board is visible
    elements.gameBoard.style.display = 'grid';
}

// Toggle number selection
function toggleNumberSelection(number) {
    // If game is in progress, don't allow changing selection
    if (state.gameInProgress) return;
    
    const index = state.selectedNumbers.indexOf(number);
    const maxSelectable = config.difficultySettings[state.difficulty].maxSelectable;
    
    // Get the card element
    const card = document.querySelector(`.number-card[data-number="${number}"]`);
    
    if (index === -1) {
        // Number not selected yet - check if we can add more
        if (state.selectedNumbers.length < maxSelectable) {
            state.selectedNumbers.push(number);
            card.classList.add('selected');
        } else {
            // Show notification that max selection reached
            showNotification(
                "Maximum Selection", 
                `You can only select up to ${maxSelectable} numbers in ${state.difficulty} mode.`
            );
            return;
        }
    } else {
        // Number already selected - remove it
        state.selectedNumbers.splice(index, 1);
        card.classList.remove('selected');
    }
    
    // Update UI
    updateSelectionCount();
    updateMultiplier();
    updatePlayButtonState();
}

// Update selection count display
function updateSelectionCount() {
    if (!elements.selectionCount || !elements.maxSelectionCount) return;
    
    const maxSelectable = config.difficultySettings[state.difficulty].maxSelectable;
    elements.selectionCount.textContent = state.selectedNumbers.length;
    elements.maxSelectionCount.textContent = maxSelectable;
}

// Set difficulty level
function setDifficulty(level) {
    // If game is in progress, don't allow changing difficulty
    if (state.gameInProgress) return;
    
    state.difficulty = level;
    
    // Update UI
    if (elements.difficultyBtns) {
        elements.difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.level === level) {
                btn.classList.add('active');
            }
        });
    }
    
    // Clear current selection
    clearSelection();
    
    // Update difficulty UI
    updateDifficultyUI();
}

// Update UI elements related to difficulty
function updateDifficultyUI() {
    const settings = config.difficultySettings[state.difficulty];
    
    if (elements.maxSelectable) {
        elements.maxSelectable.textContent = settings.maxSelectable;
    }
    
    if (elements.numbersToDraw) {
        elements.numbersToDraw.textContent = settings.numbersToDraw;
    }
    
    if (elements.maxSelectionCount) {
        elements.maxSelectionCount.textContent = settings.maxSelectable;
    }
}

// Clear selection
function clearSelection() {
    state.selectedNumbers = [];
    
    // Remove selected class from all cards
    document.querySelectorAll('.number-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Update UI
    updateSelectionCount();
    updateMultiplier();
    updatePlayButtonState();
}

// Select random numbers
function selectRandom() {
    // If game is in progress, don't allow changing selection
    if (state.gameInProgress) return;
    
    // Clear current selection
    clearSelection();
    
    // Get random numbers
    const maxSelectable = config.difficultySettings[state.difficulty].maxSelectable;
    const available = Array.from({length: config.totalNumbers}, (_, i) => i + 1);
    
    // Shuffle array
    for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
    }
    
    // Select random numbers
    state.selectedNumbers = available.slice(0, maxSelectable);
    
    // Update UI
    state.selectedNumbers.forEach(number => {
        const card = document.querySelector(`.number-card[data-number="${number}"]`);
        if (card) card.classList.add('selected');
    });
    
    // Update UI
    updateSelectionCount();
    updateMultiplier();
    updatePlayButtonState();
}

// Update multiplier based on selections
function updateMultiplier() {
    if (!elements.multiplierDisplay || !elements.wagerAmount) return;
    
    const numSelected = state.selectedNumbers.length;
    state.wagerAmount = parseFloat(elements.wagerAmount.value) || 0;
    
    if (numSelected === 0) {
        elements.multiplierDisplay.textContent = "Select numbers to see multiplier";
        state.multiplier = 0;
        return;
    }
    
    // Calculate multiplier based on difficulty and number of selections
    // This is a simple formula for demonstration - adjust as needed
    let baseMultiplier = 0;
    
    switch(state.difficulty) {
        case 'easy':
            // Easy mode: 10 selections, 20 drawn numbers
            if (numSelected <= 3) baseMultiplier = 1;
            else if (numSelected <= 5) baseMultiplier = 2;
            else if (numSelected <= 8) baseMultiplier = 3;
            else baseMultiplier = 5;
            break;
            
        case 'medium':
            // Medium mode: 8 selections, 15 drawn numbers
            if (numSelected <= 3) baseMultiplier = 2;
            else if (numSelected <= 5) baseMultiplier = 4;
            else if (numSelected <= 7) baseMultiplier = 6;
            else baseMultiplier = 10;
            break;
            
        case 'hard':
            // Hard mode: 6 selections, 10 drawn numbers
            if (numSelected <= 2) baseMultiplier = 3;
            else if (numSelected <= 4) baseMultiplier = 7;
            else if (numSelected <= 5) baseMultiplier = 15;
            else baseMultiplier = 25;
            break;
    }
    
    state.multiplier = baseMultiplier;
    elements.multiplierDisplay.textContent = `${baseMultiplier}x your wager`;
}

// Update play button state
function updatePlayButtonState() {
    if (!elements.playBtn) return;
    
    const canPlay = 
        state.connected && 
        state.selectedNumbers.length > 0 && 
        state.wagerAmount > 0 && 
        !state.gameInProgress;
    
    elements.playBtn.disabled = !canPlay;
}

// Play the game
async function playGame() {
    if (!validateGameSettings()) return;
    
    state.gameInProgress = true;
    
    if (elements.playBtn) {
        elements.playBtn.disabled = true;
    }
    
    // Update UI to show transaction in progress
    showTxStatus('pending', 'Transaction pending...');
    
    try {
        // Prepare wager amount in wei (convert from MONAD to wei)
        const wagerAmountWei = ethers.parseEther(state.wagerAmount.toString());
        
        // Call the contract to play the game
        const tx = await state.contract.playKeno(
            state.selectedNumbers,
            state.difficulty,
            { value: wagerAmountWei }
        );
        
        showTxStatus('pending', 'Transaction sent! Waiting for confirmation...');
        console.log("Transaction sent:", tx.hash);
        
        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        
        // Get game result from transaction events
        const gamePlayedEvent = receipt.logs
            .find(log => {
                try {
                    // For ethers v6, we need to decode the log differently
                    const decoded = state.contract.interface.parseLog({
                        topics: log.topics,
                        data: log.data
                    });
                    return decoded && decoded.name === 'GamePlayed';
                } catch (e) {
                    return false;
                }
            });
            
        if (gamePlayedEvent) {
            // Parse the event data
            const event = state.contract.interface.parseLog({
                topics: gamePlayedEvent.topics,
                data: gamePlayedEvent.data
            });
            
            // Process the result
            processGameResult(event.args);
        } else {
            // Fallback to simulation if we can't find the event
            console.warn("Could not find GamePlayed event, using simulation instead");
            simulateGameResult();
        }
        
        showTxStatus('success', 'Transaction confirmed!');
    } catch (error) {
        console.error("Error playing game:", error);
        showTxStatus('error', 'Transaction failed: ' + (error.message || "Unknown error"));
        
        // Reset game state
        state.gameInProgress = false;
        if (elements.playBtn) {
            elements.playBtn.disabled = false;
        }
        
        // Show notification
        showNotification(
            "Game Error", 
            "Failed to play the game: " + (error.message || "Please try again later.")
        );
    }
}

// Validate game settings before playing
function validateGameSettings() {
    // Check if wallet is connected
    if (!state.connected) {
        showNotification("Wallet Not Connected", "Please connect your wallet to play.");
        return false;
    }
    
    // Check if numbers are selected
    if (state.selectedNumbers.length === 0) {
        showNotification("No Numbers Selected", "Please select at least one number to play.");
        return false;
    }
    
    // Check if wager amount is valid
    if (state.wagerAmount <= 0) {
        showNotification("Invalid Wager", "Please enter a valid wager amount.");
        return false;
    }
    
    return true;
}

// Process game result from contract event
function processGameResult(eventArgs) {
    // Extract data from event
    // This will depend on your contract event structure
    state.drawnNumbers = eventArgs.drawnNumbers || [];
    state.matchedNumbers = eventArgs.matchedNumbers || [];
    state.payout = eventArgs.payout ? parseFloat(ethers.formatEther(eventArgs.payout)) : 0;
    
    // Show results
    showGameResults();
}

// Simulate game result (for testing without contract)
function simulateGameResult() {
    // Generate random drawn numbers
    const totalNumbersToDraw = config.difficultySettings[state.difficulty].numbersToDraw;
    const drawnNumbers = [];
    
    // Generate unique random numbers (1-60)
    while (drawnNumbers.length < totalNumbersToDraw) {
        const num = Math.floor(Math.random() * config.totalNumbers) + 1;
        if (!drawnNumbers.includes(num)) {
            drawnNumbers.push(num);
        }
    }
    
    state.drawnNumbers = drawnNumbers;
    
    // Find matches
    state.matchedNumbers = state.selectedNumbers.filter(num => drawnNumbers.includes(num));
    
    // Calculate payout
    const matchCount = state.matchedNumbers.length;
    state.payout = matchCount > 0 ? state.wagerAmount * state.multiplier : 0;
    
    // Show results
    showGameResults();
}

// Show game results
function showGameResults() {
    // Highlight drawn and matched numbers
    document.querySelectorAll('.number-card').forEach(card => {
        const number = parseInt(card.dataset.number);
        
        // Remove previous classes
        card.classList.remove('drawn', 'match');
        
        // Add appropriate classes
        if (state.drawnNumbers.includes(number)) {
            card.classList.add('drawn');
        }
        
        if (state.matchedNumbers.includes(number)) {
            card.classList.add('match');
        }
    });
    
    // Update results section
    if (elements.matchesValue) {
        elements.matchesValue.textContent = state.matchedNumbers.length;
    }
    
    if (elements.payoutValue) {
        elements.payoutValue.textContent = state.payout.toFixed(4);
    }
    
    if (elements.multiplierValue) {
        elements.multiplierValue.textContent = `${state.multiplier}x`;
    }
    
    // Show winning animation if there's a payout
    if (elements.winningAnimation) {
        if (state.payout > 0) {
            elements.winningAnimation.textContent = "🎉 You Won! 🎉";
        } else {
            elements.winningAnimation.textContent = "Better luck next time!";
        }
    }
    
    // Show results section
    if (elements.resultsSection) {
        elements.resultsSection.style.display = 'block';
    }
    
    // Update contract and wallet balances
    updateContractBalance();
    updateWalletBalance();
}

// Reset game for a new round
function resetGame() {
    // Hide results section
    if (elements.resultsSection) {
        elements.resultsSection.style.display = 'none';
    }
    
    // Reset game state
    state.gameInProgress = false;
    state.drawnNumbers = [];
    state.matchedNumbers = [];
    state.payout = 0;
    
    // Reset number cards
    document.querySelectorAll('.number-card').forEach(card => {
        card.classList.remove('drawn', 'match');
    });
    
    // Enable play button if conditions are met
    updatePlayButtonState();
}

// Show transaction status
function showTxStatus(type, message) {
    if (!elements.txStatus) return;
    
    elements.txStatus.className = 'tx-status';
    elements.txStatus.classList.add(`tx-${type}`);
    elements.txStatus.textContent = message;
    elements.txStatus.style.display = 'block';
}

// Show notification modal
function showNotification(title, message) {
    if (!elements.notificationModal || !elements.modalTitle || !elements.modalBody) return;
    
    elements.modalTitle.textContent = title;
    elements.modalBody.textContent = message;
    elements.notificationModal.style.display = 'flex';
}

// Close notification modal
function closeModal() {
    if (elements.notificationModal) {
        elements.notificationModal.style.display = 'none';
    }
}

// Easter egg - floating pixel monkey
function triggerEasterEgg() {
    if (!elements.pixelMonkey) return;
    
    const pixelMonkey = elements.pixelMonkey;
    const maxX = window.innerWidth - 20;
    const maxY = window.innerHeight - 20;
    
    // Position randomly
    pixelMonkey.style.left = `${Math.random() * maxX}px`;
    pixelMonkey.style.top = `${Math.random() * maxY}px`;
    
    // Make visible
    pixelMonkey.classList.add('visible');
    
    // Hide after 5 seconds
    setTimeout(() => {
        pixelMonkey.classList.remove('visible');
    }, 5000);
}

// Initialize the game when the document is ready
document.addEventListener('DOMContentLoaded', initialize);

// Initialize the game
async function initialize() {
    // Initialize DOM elements
    initializeElements();
    
    // Set up the game board
    createGameBoard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI with initial difficulty settings
    updateDifficultyUI();
    
    // Check if Ethereum provider exists
    if (window.ethereum) {
        try {
            // Check if already connected
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                connectWallet();
            }
            
            // Set up provider event listeners
            setupProviderListeners();
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        }
    } else {
        showNotification(
            "Wallet Not Detected", 
            "No Ethereum wallet was detected. Please install MetaMask or another Web3 wallet to play."
        );
    }
}

// Setup event listeners
function setupEventListeners() {
    // Wallet connection
    if (elements.connectWalletBtn) {
        elements.connectWalletBtn.addEventListener('click', connectWallet);
    }
    
    // Difficulty buttons
    if (elements.easyBtn) {
        elements.easyBtn.addEventListener('click', () => setDifficulty('easy'));
    }
    
    if (elements.mediumBtn) {
        elements.mediumBtn.addEventListener('click', () => setDifficulty('medium'));
    }
    
    if (elements.hardBtn) {
        elements.hardBtn.addEventListener('click', () => setDifficulty('hard'));
    }
    
    // Wager amount input
    if (elements.wagerAmount) {
        elements.wagerAmount.addEventListener('input', updateMultiplier);
    }
    
    // Game action buttons
    if (elements.clearBtn) {
        elements.clearBtn.addEventListener('click', clearSelection);
    }
    
    if (elements.randomBtn) {
        elements.randomBtn.addEventListener('click', selectRandom);
    }
    
    if (elements.playBtn) {
        elements.playBtn.addEventListener('click', playGame);
    }
    
    if (elements.playAgainBtn) {
        elements.playAgainBtn.addEventListener('click', resetGame);
    }
    
    // Easter egg
    const monkeyLogo = document.getElementById('monkeyLogo');
    if (monkeyLogo) {
        monkeyLogo.addEventListener('click', triggerEasterEgg);
    }
    
    if (elements.pixelMonkey) {
        elements.pixelMonkey.addEventListener('click', () => {
            elements.pixelMonkey.classList.remove('visible');
        });
    }
    
    // Modal buttons
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeModal);
    }
    
    if (elements.modalConfirmBtn) {
        elements.modalConfirmBtn.addEventListener('click', closeModal);
    }
}

// Setup provider event listeners
function setupProviderListeners() {
    if (!window.ethereum) return;
    
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            disconnectWallet();
        } else {
            // User switched accounts
            state.account = accounts[0];
            updateWalletUI();
        }
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
        // Convert from hex to decimal
        const networkId = parseInt(chainId, 16);
        state.networkId = networkId;
        updateNetworkUI();
        
        // Reconnect to contract on the new chain
        initializeContract();
    });
}


