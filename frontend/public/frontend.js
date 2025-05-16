<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lottery Game</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .game-container {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 100%;
            max-width: 600px;
            text-align: center;
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 30px;
        }

        .numbers-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-bottom: 30px;
            position: relative;
        }

        .number {
            background-color: #e0e0e0;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: bold;
            margin: 0 auto;
            transition: all 0.4s ease;
        }

        .number.selected {
            background-color: #3498db;
            color: white;
            transform: scale(1.1);
        }

        .play-button {
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 15px 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .play-button:hover {
            background-color: #27ae60;
        }

        .play-button:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
        }

        .status {
            margin-top: 20px;
            font-size: 18px;
            min-height: 50px;
        }

        .result-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease;
            z-index: 10;
        }

        .result-overlay.visible {
            opacity: 1;
            visibility: visible;
        }

        .result-message {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .win {
            color: #27ae60;
        }

        .lose {
            color: #e74c3c;
        }

        .balance {
            margin-top: 20px;
            font-size: 20px;
            font-weight: bold;
        }

        .loading-indicator {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-left: 10px;
            vertical-align: middle;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .transaction-hash {
            font-size: 14px;
            word-break: break-all;
            margin-top: 10px;
            color: #7f8c8d;
        }

        .connect-button {
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-bottom: 20px;
        }

        .connect-button:hover {
            background-color: #2980b9;
        }

        .network-indicator {
            font-size: 14px;
            color: #7f8c8d;
            margin-bottom: 15px;
        }

        .error-message {
            color: #e74c3c;
            margin-top: 10px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>Lottery Game</h1>
        
        <div id="connectSection">
            <button id="connectButton" class="connect-button">Connect Wallet</button>
            <div id="networkIndicator" class="network-indicator"></div>
        </div>
        
        <div class="numbers-container" id="numbersContainer">
            <!-- Numbers will be generated dynamically -->
            <div class="result-overlay" id="resultOverlay">
                <div class="result-message" id="resultMessage"></div>
            </div>
        </div>
        
        <button id="playButton" class="play-button" disabled>
            Play
            <span id="loadingIndicator" class="loading-indicator" style="display: none;"></span>
        </button>
        
        <div class="status" id="status">Please connect your wallet to play</div>
        <div class="transaction-hash" id="transactionHash"></div>
        <div class="balance" id="balance">Balance: -- ETH</div>
        <div class="error-message" id="errorMessage"></div>
    </div>

    <!-- Import ethers.js library -->
    <script src="https://cdn.ethers.io/lib/ethers-5.7.0.umd.min.js" type="application/javascript"></script>
    
    <script>
        // Your contract address
        const contractAddress = "0x56Df969bc8C91989FA5d6cBa7E9B91486e728080";
        
        // Contract ABI (Application Binary Interface)
        const contractABI = [
            {
                "inputs": [],
                "name": "play",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "won",
                        "type": "bool"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "numbers",
                        "type": "uint256[]"
                    }
                ],
                "name": "GamePlayed",
                "type": "event"
            }
        ];

        // Global variables
        let provider;
        let signer;
        let contract;
        let isConnected = false;

        document.addEventListener('DOMContentLoaded', async function() {
            // Generate numbers
            const numbersContainer = document.getElementById('numbersContainer');
            for (let i = 1; i <= 5; i++) {
                const numberElement = document.createElement('div');
                numberElement.className = 'number';
                numberElement.id = `number-${i}`;
                numberElement.textContent = '?';
                numbersContainer.appendChild(numberElement);
            }

            // Set up connect button
            const connectButton = document.getElementById('connectButton');
            connectButton.addEventListener('click', connectWallet);

            // Set up play button
            const playButton = document.getElementById('playButton');
            playButton.addEventListener('click', playGame);

            // Check if already connected
            checkConnection();
        });

        // Check if already connected
        async function checkConnection() {
            if (window.ethereum) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                
                // Check if already connected
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    await connectWallet();
                }
                
                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        connectWallet();
                    } else {
                        disconnectWallet();
                    }
                });
                
                // Listen for network changes
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });
            } else {
                document.getElementById('errorMessage').textContent = "MetaMask not detected. Please install MetaMask to play.";
                document.getElementById('connectButton').disabled = true;
            }
        }

        // Connect wallet function
        async function connectWallet() {
            try {
                if (window.ethereum) {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    signer = provider.getSigner();
                    contract = new ethers.Contract(contractAddress, contractABI, signer);
                    
                    // Get connected account
                    const address = await signer.getAddress();
                    const shortAddress = address.slice(0, 6) + '...' + address.slice(-4);
                    
                    // Get connected network
                    const network = await provider.getNetwork();
                    
                    // Update UI
                    document.getElementById('connectButton').textContent = shortAddress;
                    document.getElementById('networkIndicator').textContent = `Network: ${network.name}`;
                    document.getElementById('playButton').disabled = false;
                    document.getElementById('status').textContent = "Connected! Press Play to start.";
                    document.getElementById('errorMessage').textContent = "";
                    
                    // Get initial balance
                    await updateBalance('before');
                    
                    isConnected = true;
                }
            } catch (error) {
                console.error("Connection error:", error);
                document.getElementById('errorMessage').textContent = `Connection error: ${error.message}`;
            }
        }

        // Disconnect wallet function
        function disconnectWallet() {
            document.getElementById('connectButton').textContent = "Connect Wallet";
            document.getElementById('networkIndicator').textContent = "";
            document.getElementById('playButton').disabled = true;
            document.getElementById('status').textContent = "Please connect your wallet to play";
            document.getElementById('balance').textContent = "Balance: -- ETH";
            isConnected = false;
        }

        // Play game function
        async function playGame() {
            if (!isConnected) {
                document.getElementById('status').textContent = "Please connect your wallet first!";
                return;
            }
            
            try {
                // Disable button and show loading
                const playButton = document.getElementById('playButton');
                const loadingIndicator = document.getElementById('loadingIndicator');
                const statusElement = document.getElementById('status');
                const resultOverlay = document.getElementById('resultOverlay');
                const resultMessage = document.getElementById('resultMessage');
                const errorMessage = document.getElementById('errorMessage');
                
                // Reset UI state
                resultOverlay.classList.remove('visible');
                statusElement.textContent = 'Playing...';
                playButton.disabled = true;
                loadingIndicator.style.display = 'inline-block';
                errorMessage.textContent = "";
                
                // Reset numbers to question marks
                for (let i = 1; i <= 5; i++) {
                    const number = document.getElementById(`number-${i}`);
                    number.textContent = '?';
                    number.classList.remove('selected');
                }

                // Get user balance BEFORE playing
                await updateBalance('before');
                
                // Call the smart contract to play the game
                const receipt = await playGameWithContract();
                
                // Process receipt to get game results
                const gameEvent = receipt.events.find(event => event.event === 'GamePlayed');
                
                if (gameEvent) {
                    const won = gameEvent.args.won;
                    const numbers = gameEvent.args.numbers.map(n => n.toNumber());
                    
                    // Display numbers with animation
                    for (let i = 0; i < 5; i++) {
                        await new Promise(resolve => setTimeout(resolve, 400));
                        const numberElement = document.getElementById(`number-${i+1}`);
                        numberElement.textContent = numbers[i];
                        numberElement.classList.add('selected');
                    }
                    
                    // After numbers are displayed, show result
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    // Show the result overlay
                    resultMessage.textContent = won ? 
                        `You Win!` : 
                        `You Lose!`;
                    resultMessage.className = `result-message ${won ? 'win' : 'lose'}`;
                    resultOverlay.classList.add('visible');
                    
                    // Update status
                    statusElement.textContent = won ? 
                        'Congratulations! You won!' : 
                        'Better luck next time!';
                } else {
                    // Fallback if event not found - should never happen with proper contract
                    statusElement.textContent = "Game played, but couldn't get result details";
                }
                
                // Get user balance AFTER playing
                await updateBalance('after');
                
            } catch (error) {
                console.error("Error playing game:", error);
                document.getElementById('errorMessage').textContent = `Error: ${error.message}`;
                document.getElementById('status').textContent = "Error occurred while playing";
            } finally {
                // Re-enable the play button
                document.getElementById('playButton').disabled = false;
                document.getElementById('loadingIndicator').style.display = 'none';
            }
        }

        // Update balance function
        async function updateBalance(timepoint = '') {
            try {
                if (!isConnected) return;
                
                const balanceElement = document.getElementById('balance');
                let currentBalanceText = balanceElement.textContent;
                let currentBalance = parseFloat(currentBalanceText.replace('Balance: ', ''));
                
                // Get actual balance from contract/wallet
                const balance = await getContractBalance();
                
                if (timepoint === 'before') {
                    // Initial balance display
                    balanceElement.textContent = `Balance: ${balance} ETH`;
                    console.log("Retrieved initial balance:", balance);
                } 
                else if (timepoint === 'after') {
                    // After gameplay - highlight change
                    const prevBalance = currentBalance;
                    const change = balance - prevBalance;
                    
                    // Animate the balance change
                    balanceElement.style.transition = 'color 1s';
                    balanceElement.style.color = change >= 0 ? '#27ae60' : '#e74c3c';
                    balanceElement.textContent = `Balance: ${balance} ETH`;
                    
                    setTimeout(() => {
                        balanceElement.style.color = '#2c3e50';
                    }, 1500);
                    
                    console.log("Updated balance after game:", balance);
                }
                else {
                    // General balance check
                    balanceElement.textContent = `Balance: ${balance} ETH`;
                }
                
                return balance;
            } catch (error) {
                console.error("Error updating balance:", error);
                document.getElementById('balance').textContent = "Balance: Error";
                document.getElementById('errorMessage').textContent = `Error updating balance: ${error.message}`;
            }
        }

        // Actually play the game via contract
        async function playGameWithContract() {
            try {
                if (!isConnected) {
                    throw new Error("Wallet not connected");
                }
                
                // Play the game - we'll send 0.01 ETH with the transaction
                const tx = await contract.play({ 
                    value: ethers.utils.parseEther("0.01"),
                    gasLimit: 500000 // Set appropriate gas limit
                });
                
                document.getElementById('status').textContent = "Transaction sent! Waiting for confirmation...";
                document.getElementById('transactionHash').textContent = `Transaction Hash: ${tx.hash}`;
                
                // Wait for transaction to be mined
                const receipt = await tx.wait();
                console.log("Transaction successful:", receipt);
                
                return receipt;
            } catch (error) {
                console.error("Error in contract interaction:", error);
                throw error;
            }
        }
        
        // Get wallet/contract balance
        async function getContractBalance() {
            try {
                if (!isConnected) {
                    throw new Error("Wallet not connected");
                }
                
                // Get user's account
                const userAddress = await signer.getAddress();
                
                // Get user's ETH balance
                const balanceWei = await provider.getBalance(userAddress);
                const balanceEth = ethers.utils.formatEther(balanceWei);
                
                // Return formatted balance with 4 decimal places
                return parseFloat(balanceEth).toFixed(4);
            } catch (error) {
                console.error("Error getting balance:", error);
                throw error;
            }
        }
    </script>
</body>
</html>

