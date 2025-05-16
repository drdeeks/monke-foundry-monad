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
