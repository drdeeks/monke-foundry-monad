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
    </style>
</head>
<body>
    <div class="game-container">
        <h1>Lottery Game</h1>
        
        <div class="numbers-container" id="numbersContainer">
            <!-- Numbers will be generated dynamically -->
            <div class="result-overlay" id="resultOverlay">
                <div class="result-message" id="resultMessage"></div>
            </div>
        </div>
        
        <button id="playButton" class="play-button">
            Play
            <span id="loadingIndicator" class="loading-indicator" style="display: none;"></span>
        </button>
        
        <div class="status" id="status"></div>
        <div class="transaction-hash" id="transactionHash"></div>
        <div class="balance" id="balance">Balance: 0 ETH</div>
    </div>

    <script>
        // Mock values for testing - replace these with your actual contract values
        const contractAddress = "0xYourContractAddress";
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
            }
        ];

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

            // Setup web3 provider (uncomment when ready to use with real contract)
            /*
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    updateBalance();
                } catch (error) {
                    console.error("User denied account access");
                }
            }
            */

            // Set up play button
            const playButton = document.getElementById('playButton');
            playButton.addEventListener('click', playGame);
        });

        async function playGame() {
            try {
                // Disable button and show loading
                const playButton = document.getElementById('playButton');
                const loadingIndicator = document.getElementById('loadingIndicator');
                const statusElement = document.getElementById('status');
                const resultOverlay = document.getElementById('resultOverlay');
                const resultMessage = document.getElementById('resultMessage');
                
                // Reset UI state
                resultOverlay.classList.remove('visible');
                statusElement.textContent = 'Playing...';
                playButton.disabled = true;
                loadingIndicator.style.display = 'inline-block';
                
                // Reset numbers to question marks
                for (let i = 1; i <= 5; i++) {
                    const number = document.getElementById(`number-${i}`);
                    number.textContent = '?';
                    number.classList.remove('selected');
                }

                // In a real implementation, connect to your contract here
                // For now, we'll simulate the transaction with a setTimeout
                
                // Simulate the contract interaction delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Generate random numbers and animate their selection
                const selectedNumbers = [];
                for (let i = 1; i <= 5; i++) {
                    // Generate a random number between 1 and 99
                    const randomNum = Math.floor(Math.random() * 99) + 1;
                    selectedNumbers.push(randomNum);
                    
                    // Update UI with a delay for visual effect
                    await new Promise(resolve => setTimeout(resolve, 400));
                    const numberElement = document.getElementById(`number-${i}`);
                    numberElement.textContent = randomNum;
                    numberElement.classList.add('selected');
                }

                // Determine if player won (for demo purposes: win if the sum is even)
                const sum = selectedNumbers.reduce((a, b) => a + b, 0);
                const won = sum % 2 === 0;
                
                // Simulate waiting for transaction confirmation
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update transaction hash (for demo)
                document.getElementById('transactionHash').textContent = 
                    `Transaction Hash: 0x${Math.random().toString(16).substr(2, 40)}`;
                
                // Show the result overlay after the numbers are displayed
                resultMessage.textContent = won ? 
                    `You Win! Sum: ${sum}` : 
                    `You Lose! Sum: ${sum}`;
                resultMessage.className = `result-message ${won ? 'win' : 'lose'}`;
                
                // Wait a moment after all numbers are displayed before showing the result
                await new Promise(resolve => setTimeout(resolve, 800));
                resultOverlay.classList.add('visible');
                
                // Update status and balance
                statusElement.textContent = won ? 'Congratulations! You won!' : 'Better luck next time!';
                updateBalance(); // In a real implementation, this would get the actual balance
                
                // Re-enable the play button
                playButton.disabled = false;
                loadingIndicator.style.display = 'none';
                
            } catch (error) {
                console.error("Error playing game:", error);
                document.getElementById('status').textContent = `Error: ${error.message}`;
                document.getElementById('playButton').disabled = false;
                document.getElementById('loadingIndicator').style.display = 'none';
            }
        }

        // Mock function to update balance (replace with actual contract call)
        async function updateBalance() {
            // In a real implementation, you would get this from your contract
            const mockBalance = (Math.random() * 10).toFixed(4);
            document.getElementById('balance').textContent = `Balance: ${mockBalance} ETH`;
        }

        // This would be your actual contract interaction in a real implementation
        async function playGameWithContract() {
            try {
                // Check if Web3 is injected by MetaMask
                if (window.ethereum) {
                    // Request access to the user's MetaMask accounts
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    
                    // Create a Web3 provider
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    
                    // Create contract instance
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);
                    
                    // Call the play function
                    const tx = await contract.play({ value: ethers.utils.parseEther("0.01") });
                    
                    // Wait for transaction to be mined
                    const receipt = await tx.wait();
                    console.log("Transaction successful:", receipt);
                    
                    // Update transaction hash display
                    document.getElementById('transactionHash').textContent = `Transaction Hash: ${tx.hash}`;
                    
                    // Get the result from the transaction receipt (this would depend on your contract implementation)
                    // For this example, we're assuming the contract emits an event with the result
                    
                    // Update the balance
                    const balance = await contract.getBalance();
                    document.getElementById('balance').textContent = `Balance: ${ethers.utils.formatEther(balance)} ETH`;
                    
                    return receipt;
                } else {
                    throw new Error("MetaMask is not installed. Please install MetaMask and try again.");
                }
            } catch (error) {
                console.error("Error in contract interaction:", error);
                throw error;
            }
        }
    </script>
</body>
</html>
