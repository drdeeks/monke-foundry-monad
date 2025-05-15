// MonKe Keno Game - Frontend Logic (ES Module Version)
// Compatible with Foundry and Monad Blockchain

import { config } from './constants.js';

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

const elements = {
    connectWalletBtn: document.getElementById('connectWalletBtn'),
    walletInfo: document.getElementById('walletInfo'),
    contractAddress: document.getElementById('contractAddress'),
    contractBalance: document.getElementById('contractBalance'),
    wagerAmount: document.getElementById('wagerAmount'),
    difficultyBtns: document.querySelectorAll('.difficulty-btn'),
    easyBtn: document.getElementById('easyBtn'),
    mediumBtn: document.getElementById('mediumBtn'),
    hardBtn: document.getElementById('hardBtn'),
    multiplierDisplay: document.getElementById('multiplierDisplay'),
    maxSelectable: document.getElementById('maxSelectable'),
    numbersToDraw: document.getElementById('numbersToDraw'),
    selectionCount: document.getElementById('selectionCount'),
    maxSelectionCount: document.getElementById('maxSelectionCount'),
    gameBoard: document.getElementById('gameBoard'),
    clearBtn: document.getElementById('clearBtn'),
    randomBtn: document.getElementById('randomBtn'),
    playBtn: document.getElementById('playBtn'),
    resultsSection: document.getElementById('resultsSection'),
    matchesValue: document.getElementById('matchesValue'),
    payoutValue: document.getElementById('payoutValue'),
    multiplierValue: document.getElementById('multiplierValue'),
    winningAnimation: document.getElementById('winningAnimation'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    pixelMonkey: document.getElementById('pixelMonkey'),
    txStatus: document.getElementById('txStatus'),
    networkInfo: document.getElementById('networkInfo'),
    networkIndicator: document.getElementById('networkIndicator'),
    notificationModal: document.getElementById('notificationModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    closeModal: document.getElementById('closeModal')
};

function createGameBoard() {
    elements.gameBoard.innerHTML = '';
    for (let i = 1; i <= config.totalNumbers; i++) {
        const numberCard = document.createElement('div');
        numberCard.className = 'number-card bg-gray-700 text-white flex items-center justify-center rounded cursor-pointer';
        numberCard.textContent = i;
        numberCard.dataset.number = i;
        numberCard.addEventListener('click', () => toggleNumberSelection(i));
        elements.gameBoard.appendChild(numberCard);
    }
}

function toggleNumberSelection(number) {
    const index = state.selectedNumbers.indexOf(number);
    const maxSelectable = config.difficultySettings[state.difficulty].maxSelectable;
    const card = document.querySelector(`.number-card[data-number="${number}"]`);
    if (index === -1) {
        if (state.selectedNumbers.length < maxSelectable) {
            state.selectedNumbers.push(number);
            card.classList.add('bg-yellow-500', 'text-black');
        }
    } else {
        state.selectedNumbers.splice(index, 1);
        card.classList.remove('bg-yellow-500', 'text-black');
    }
}

async function connectWallet() {
    if (!window.ethereum) {
        showNotification("No Wallet Detected", "Please install MetaMask or another Web3 wallet to connect.");
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        state.account = accounts[0];
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        state.networkId = parseInt(chainId, 16);
        state.provider = new ethers.BrowserProvider(window.ethereum);
        state.signer = await state.provider.getSigner();
        await initializeContract();
        state.connected = true;
        updateWalletUI();
        updateNetworkUI();
        updatePlayButtonState();
    } catch (error) {
        console.error("Error connecting wallet:", error);
        showNotification("Connection Error", "Failed to connect wallet. Please try again.");
    }
}

function disconnectWallet() {
    state.connected = false;
    state.account = null;
    state.signer = null;
    state.contract = null;
    elements.connectWalletBtn.textContent = "Connect Wallet";
    elements.walletInfo.innerHTML = `<button class="connect-wallet-btn" id="connectWalletBtn">Connect Wallet</button><div id="networkInfo" style="display: none;"><span class="network-indicator" id="networkIndicator">Network</span></div>`;
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    elements.contractAddress.textContent = "Not connected";
    elements.contractBalance.textContent = "N/A";
    elements.playBtn.disabled = true;
}

async function initializeContract() {
    if (!state.signer) return;
    try {
        state.contract = new ethers.Contract(config.contractAddress, config.contractABI, state.signer);
        elements.contractAddress.textContent = config.contractAddress;
        await updateContractBalance();
    } catch (error) {
        console.error("Error initializing contract:", error);
        showNotification("Contract Error", "Failed to connect to the MonKe contract. Please check your network.");
    }
}

async function updateContractBalance() {
    if (!state.contract || !state.provider) return;
    try {
        const balance = await state.provider.getBalance(config.contractAddress);
        elements.contractBalance.textContent = ethers.formatEther(balance);
    } catch (error) {
        console.error("Error getting contract balance:", error);
        elements.contractBalance.textContent = "Error";
    }
}

function updateWalletUI() {
    if (!state.connected || !state.account) {
        elements.connectWalletBtn.textContent = "Connect Wallet";
        return;
    }
    const shortAddress = `${state.account.substring(0, 6)}...${state.account.substring(state.account.length - 4)}`;
    elements.walletInfo.innerHTML = `<div class="wallet-balance" id="walletBalance">Fetching...</div><div class="wallet-address">${shortAddress}</div><div id="networkInfo" style="display: block;"><span class="network-indicator" id="networkIndicator">Network</span></div>`;
    updateWalletBalance();
}

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

function updateNetworkUI() {
    const network = config.networks[state.networkId] || config.networks.default;
    elements.networkInfo.style.display = 'block';
    elements.networkIndicator.textContent = network.shortName;
    elements.networkIndicator.className = 'network-indicator ' + network.class;
}

function showNotification(title, message) {
    elements.modalTitle.textContent = title;
    elements.modalBody.textContent = message;
    elements.notificationModal.style.display = 'flex';
}

function closeModal() {
    elements.notificationModal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
    elements.connectWalletBtn.addEventListener('click', connectWallet);
    elements.closeModal.addEventListener('click', closeModal);
    elements.modalConfirmBtn.addEventListener('click', closeModal);
});
