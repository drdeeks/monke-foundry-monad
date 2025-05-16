// Play game
async function playGame() {
    // Check if can play
    if (!state.connected || state.selectedNumbers.length === 0 || state.wagerAmount <= 0 || !state.contract) {
        console.error("Cannot play game. Check wallet connection and selections.");
        return;
    }
    
    // Update UI
    state.gameInProgress = true;
    elements.playBtn.disabled = true;
    elements.txStatus.textContent = "Transaction pending...";
    elements.txStatus.style.display = "block";
    
    try {
        // Convert wager to wei
        const wagerInWei = ethers.parseEther(state.wagerAmount.toString());
        
        // Call contract function
        const tx = await state.contract.playKeno(
            state.selectedNumbers, 
            state.difficulty,
            { value: wagerInWei }
        );
        
        // Update status
        elements.txStatus.textContent = "Transaction sent! Waiting for confirmation...";
        
        // Wait for transaction
        const receipt = await tx.wait();
        
        // Find the GamePlayed event in the logs
        const iface = new ethers.Interface(config.contractABI);
        let gameEvent = null;
        
        for (const log of receipt.logs) {
            try {
                const parsedLog = iface.parseLog({
                    topics: log.topics,
                    data: log.data
                });
                
                if (parsedLog && parsedLog.name === "GamePlayed") {
                    gameEvent = parsedLog;
                    break;
                }
            } catch (e) {
                // Not the event we're looking for
                continue;
            }
        }
        
        if (gameEvent) {
            const args = gameEvent.args;
            // Get drawn numbers and payout from event
            state.drawnNumbers = Array.from(args[2]).map(n => Number(n));
            state.matchedNumbers = state.selectedNumbers.filter(num => state.drawnNumbers.includes(num));
            state.payout = Number(ethers.formatEther(args[5]));
            
            // Store game result
            state.lastGameResult = {
                drawnNumbers: state.drawnNumbers,
                matchedNumbers: state.matchedNumbers,
                matches: state.matchedNumbers.length,
                payout: state.payout,
                won: state.payout > 0
            };
        } else {
            // If we couldn't find the event, get data from transaction return values
            console.warn("Couldn't find GamePlayed event, using return values");
            const receipt = await state.provider.getTransactionReceipt(tx.hash);
            if (receipt && receipt.status === 1) {
                // Get data from return value
                const result = await state.contract.playKeno.staticCall(
                    state.selectedNumbers,
                    state.difficulty,
                    { value: wagerInWei }
                );
                
                state.drawnNumbers = Array.from(result[0]).map(n => Number(n));
                const matches = Number(result[1]);
                state.matchedNumbers = state.selectedNumbers.filter(num => 
                    state.drawnNumbers.includes(Number(num))
                );
                
                // Estimate payout based on matches and wager
                state.payout = state.wagerAmount * state.multiplier * (matches > 0 ? 1 : 0);
                
                // Store game result
                state.lastGameResult = {
                    drawnNumbers: state.drawnNumbers,
                    matchedNumbers: state.matchedNumbers,
                    matches: matches,
                    payout: state.payout,
                    won: state.payout > 0
                };
            }
        }
        
        // Update wallet balance
        updateWalletBalance();
        
        // Show result
        showGameResult();
    } catch (error) {
        console.error("Error playing game:", error);
        elements.txStatus.textContent = "Transaction failed. See console for details.";
        showNotification("Game Error", "Failed to play the game. Please try again.");
        
        // Reset game state
        resetGame();
    }
}

// Show game result
function showGameResult() {
    if (!state.lastGameResult) return;
    
    // Update the game board to show drawn numbers
    document.querySelectorAll('.number-card').forEach(card => {
        const number = parseInt(card.dataset.number);
        
        // Reset previous styling
        card.classList.remove('drawn', 'matched');
        
        // Add appropriate class
        if (state.drawnNumbers.includes(number)) {
            card.classList.add('drawn');
            
            if (state.matchedNumbers.includes(number)) {
                card.classList.add('matched');
            }
        }
    });
    
    // Update result section values
    if (elements.matchesValue) {
        elements.matchesValue.textContent = state.lastGameResult.matches;
    }
    
    if (elements.payoutValue) {
        elements.payoutValue.textContent = state.lastGameResult.payout.toFixed(4);
    }
    
    if (elements.multiplierValue) {
        elements.multiplierValue.textContent = state.multiplier + 'x';
    }
    
    // Show result overlay
    showGameResultOverlay();
    
    // Show animation for wins
    if (state.lastGameResult.won && elements.winningAnimation && elements.pixelMonkey) {
        elements.winningAnimation.style.display = 'block';
        elements.pixelMonkey.style.animation = 'dance 1s infinite';
        
        // Only hide animation after 3 seconds
        setTimeout(() => {
            elements.winningAnimation.style.display = 'none';
            elements.pixelMonkey.style.animation = '';
        }, 3000);
    }
    
    // Update transaction status
    elements.txStatus.textContent = state.lastGameResult.won ? 
        "You won! Transaction confirmed." : 
        "Better luck next time! Transaction confirmed.";
    
    // Auto-reset for next game after a slight delay
    // This is key for your requirement to remove "Play Again" button
    setTimeout(() => {
        // Reset the game state but keep the drawn/matched visual indicators
        state.gameInProgress = false;
        updatePlayButtonState();
        elements.txStatus.style.display = "none";
    }, 2000);
}

// Show game result overlay
function showGameResultOverlay() {
    if (!elements.gameResultOverlay || !state.lastGameResult) return;
    
    const overlay = elements.gameResultOverlay;
    const resultStatus = overlay.querySelector('.result-status');
    const matchesCount = overlay.querySelector('.matches-count');
    const payoutAmount = overlay.querySelector('.payout-amount');
    
    // Update result content
    if (resultStatus) {
        resultStatus.textContent = state.lastGameResult.won ? 'You Won!' : 'Try Again!';
        resultStatus.className = 'result-status ' + (state.lastGameResult.won ? 'win' : 'lose');
    }
    
    if (matchesCount) matchesCount.textContent = state.lastGameResult.matches;
    if (payoutAmount) payoutAmount.textContent = state.lastGameResult.payout.toFixed(4);
    
    // Position overlay over the game board
    positionGameResultOverlay();
    
    // Show overlay
    overlay.style.display = 'flex';
    
    // Auto-hide overlay after a delay
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 5000);
}

// Position the game result overlay over the game board
function positionGameResultOverlay() {
    if (!elements.gameResultOverlay || !elements.gameBoard) return;
    
    const boardRect = elements.gameBoard.getBoundingClientRect();
    const overlay = elements.gameResultOverlay;
    
    // Set the overlay to position:absolute with the same dimensions
    overlay.style.position = 'absolute';
    overlay.style.top = boardRect.top + window.scrollY + 'px';
    overlay.style.left = boardRect.left + window.scrollX + 'px';
    overlay.style.width = boardRect.width + 'px';
    overlay.style.height = boardRect.height + 'px';
}

// Reset game state for a new game
function resetGame() {
    // Keep selected numbers, just reset game state
    state.gameInProgress = false;
    state.drawnNumbers = [];
    state.matchedNumbers = [];
    state.payout = 0;
    
    // Remove drawn/matched classes from the board
    document.querySelectorAll('.number-card').forEach(card => {
        card.classList.remove('drawn', 'matched');
    });
    
    // Hide result overlay if it's showing
    if (elements.gameResultOverlay) {
        elements.gameResultOverlay.style.display = 'none';
    }
    
    // Hide transaction status
    if (elements.txStatus) {
        elements.txStatus.style.display = 'none';
    }
    
    // Reset winning animation
    if (elements.winningAnimation && elements.pixelMonkey) {
        elements.winningAnimation.style.display = 'none';
        elements.pixelMonkey.style.animation = '';
    }
    
    // Enable play button if conditions are met
    updatePlayButtonState();
}

// Show notification
function showNotification(title, message) {
    if (!elements.notificationModal || !elements.modalTitle || !elements.modalBody) return;
    
    elements.modalTitle.textContent = title;
    elements.modalBody.textContent = message;
    elements.notificationModal.style.display = 'block';
}

// Close notification
function closeNotification() {
    if (!elements.notificationModal) return;
    elements.notificationModal.style.display = 'none';
}

// Initialize the application
function initialize() {
    // Initialize UI elements
    initializeElements();
    
    // Create game board
    createGameBoard();
    
    // Set default difficulty
    setDifficulty('easy');
    
    // Add event listeners
    addEventListeners();
    
    // Check for wallet connection
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectWallet();
    }
}

// Add event listeners
function addEventListeners() {
    // Wallet connection
    if (elements.connectWalletBtn) {
        elements.connectWalletBtn.addEventListener('click', connectWallet);
    }
    
    // Difficulty buttons
    if (elements.easyBtn) elements.easyBtn.addEventListener('click', () => setDifficulty('easy'));
    if (elements.mediumBtn) elements.mediumBtn.addEventListener('click', () => setDifficulty('medium'));
    if (elements.hardBtn) elements.hardBtn.addEventListener('click', () => setDifficulty('hard'));
    
    // Game controls
    if (elements.clearBtn) elements.clearBtn.addEventListener('click', clearSelection);
    if (elements.randomBtn) elements.randomBtn.addEventListener('click', selectRandom);
    if (elements.playBtn) elements.playBtn.addEventListener('click', playGame);
    
    // Wager amount input
    if (elements.wagerAmount) {
        elements.wagerAmount.addEventListener('input', updateMultiplier);
        elements.wagerAmount.addEventListener('change', updatePlayButtonState);
    }
    
    // Modal close buttons
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeNotification);
    }
    if (elements.modalConfirmBtn) {
        elements.modalConfirmBtn.addEventListener('click', closeNotification);
    }
    
    // Add window resize event to reposition overlay
    window.addEventListener('resize', () => {
        if (elements.gameResultOverlay && elements.gameResultOverlay.style.display !== 'none') {
            positionGameResultOverlay();
        }
    });
    
    // Handle network/account changes
    if (window.ethereum) {
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
        
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                window.location.reload();
            }
        });
    }
}

// Add CSS for the new components
function addCustomStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Game Board Styles */
        .game-board {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 8px;
            margin: 20px auto;
            max-width: 800px;
            padding: 15px;
            background-color: #333;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .number-card {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            background-color: #555;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        
        .number-card:hover {
            background-color: #777;
            transform: scale(1.05);
        }
        
        .number-card.selected {
            background-color: #3f51b5;
            font-weight: bold;
        }
        
        /* Selected Numbers Display */
        .selected-numbers-display {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: #252525;
        }
        
        .selected-numbers-display h4 {
            margin: 0 0 10px 0;
            text-align: center;
            color: #ddd;
        }
        
        .number-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        }
        
        .number-chip {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #4caf50;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .number-chip:hover {
            transform: scale(1.1);
            background-color: #388e3c;
        }
        
        /* Game Result Overlay */
        .game-result-overlay {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 100;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s;
        }
        
        .result-content {
            background-color: #333;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            max-width: 300px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .result-status {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .result-status.win {
            color: #4caf50;
        }
        
        .result-status.lose {
            color: #f44336;
        }
        
        .result-details {
            font-size: 18px;
            margin-bottom: 20px;
        }
        
        .play-again-button {
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        
        .play-again-button:hover {
            background-color: #388e3c;
        }
        
        /* Contract Verification Status */
        .contract-status {
            display: flex;
            align-items: center;
            margin-top: 8px;
            font-size: 14px;
        }
        
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-indicator.verified {
            background-color: #4caf50;
        }
        
        .status-indicator.not-verified {
            background-color: #f44336;
        }
        
        /* Game Board Selection Styles */
        .number-card.drawn {
            background-color: #7986cb;
            color: white;
        }
        
        .number-card.matched {
            background-color: #4caf50;
            color: white;
            transform: scale(1.1);
            z-index: 10;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Call initialize function when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initialize();
    addCustomStyles();
});
