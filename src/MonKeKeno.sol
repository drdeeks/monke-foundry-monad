// MonKeKeno.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MonKeKeno
 * @dev A Keno game with MonKe theme for the Monad blockchain
 */
contract MonKeKeno {
    // Game configuration
    uint256 public constant TOTAL_NUMBERS = 60;
    uint256 public constant MAX_SELECTIONS = 10;
    
    // Difficulty settings
    struct DifficultySettings {
        uint256 maxSelections;
        uint256 numbersToDraw;
        uint256 difficultyFactor; // Multiplied by 100 (e.g., 150 = 1.5x)
    }
    
    mapping(string => DifficultySettings) public difficulties;
    
    // Game state
    address public owner;
    uint256 public totalGamesPlayed;
    uint256 public totalPayout;
    
    // Events
    event GamePlayed(
        address indexed player,
        uint256[] selectedNumbers,
        uint256[] drawnNumbers,
        uint256 matches,
        uint256 wager,
        uint256 payout,
        string difficulty
    );
    
    event FundsAdded(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    // Constructor
    constructor() payable {
        owner = msg.sender;
        
        // Set up difficulty levels
        difficulties["easy"] = DifficultySettings(10, 20, 100);    // 1.0x
        difficulties["medium"] = DifficultySettings(8, 15, 150);   // 1.5x
        difficulties["hard"] = DifficultySettings(6, 10, 220);     // 2.2x
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    // Play Keno game
    function playKeno(uint256[] memory selectedNumbers, string memory difficulty) 
        external 
        payable 
        returns (uint256[] memory, uint256) 
    {
        // Validate inputs
        require(msg.value > 0, "Wager must be greater than 0");
        require(selectedNumbers.length > 0, "Must select at least one number");
        
        // Validate difficulty exists
        DifficultySettings memory settings = difficulties[difficulty];
        require(settings.maxSelections > 0, "Invalid difficulty level");
        
        // Validate number of selections
        require(selectedNumbers.length <= settings.maxSelections, "Too many numbers selected");
        
        // Validate selected numbers are within range and unique
        for (uint256 i = 0; i < selectedNumbers.length; i++) {
            require(selectedNumbers[i] > 0 && selectedNumbers[i] <= TOTAL_NUMBERS, "Selected number out of range");
            
            // Check for duplicates
            for (uint256 j = i + 1; j < selectedNumbers.length; j++) {
                require(selectedNumbers[i] != selectedNumbers[j], "Duplicate numbers selected");
            }
        }
        
        // Ensure contract has enough balance to pay potential winnings
        uint256 maxPayout = calculateMaxPayout(selectedNumbers.length, difficulty, msg.value);
        require(address(this).balance >= maxPayout, "Contract has insufficient funds for potential payout");
        
        // Draw random numbers
        uint256[] memory drawnNumbers = drawNumbers(settings.numbersToDraw);
        
        // Calculate matches
        uint256 matches = countMatches(selectedNumbers, drawnNumbers);
        
        // Calculate payout
        uint256 payout = calculatePayout(selectedNumbers.length, matches, difficulty, msg.value);
        
        // Update game stats
        totalGamesPlayed++;
        
        // Transfer winnings to player if any
        if (payout > 0) {
            totalPayout += payout;
            payable(msg.sender).transfer(payout);
        }
        
        // Emit event
        emit GamePlayed(
            msg.sender,
            selectedNumbers,
            drawnNumbers,
            matches,
            msg.value,
            payout,
            difficulty
        );
        
        return (drawnNumbers, payout);
    }
    
    // Draw random numbers for the game
    function drawNumbers(uint256 count) private view returns (uint256[] memory) {
        require(count <= TOTAL_NUMBERS, "Cannot draw more numbers than total");
        
        uint256[] memory numbers = new uint256[](count);
        uint256[] memory availableNumbers = new uint256[](TOTAL_NUMBERS);
        
        // Initialize available numbers
        for (uint256 i = 0; i < TOTAL_NUMBERS; i++) {
            availableNumbers[i] = i + 1;
        }
        
        // Draw random numbers
        for (uint256 i = 0; i < count; i++) {
            // Generate random index
            uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i))) % (TOTAL_NUMBERS - i);
            
            // Select number at random index
            numbers[i] = availableNumbers[randomIndex];
            
            // Replace used number with the last available number
            availableNumbers[randomIndex] = availableNumbers[TOTAL_NUMBERS - i - 1];
        }
        
        return numbers;
    }
    
    // Count matches between selected and drawn numbers
    function countMatches(uint256[] memory selectedNumbers, uint256[] memory drawnNumbers) 
        private 
        pure 
        returns (uint256) 
    {
        uint256 matches = 0;
        
        for (uint256 i = 0; i < selectedNumbers.length; i++) {
            for (uint256 j = 0; j < drawnNumbers.length; j++) {
                if (selectedNumbers[i] == drawnNumbers[j]) {
                    matches++;
                    break;
                }
            }
        }
        
        return matches;
    }
    
    // Calculate payout based on matches and difficulty
    function calculatePayout(uint256 spots, uint256 matches, string memory difficulty, uint256 wager) 
        private 
        view 
        returns (uint256) 
    {
        // No matches, no payout
        if (matches == 0) {
            return 0;
        }
        
        // Get difficulty factor
        uint256 difficultyFactor = difficulties[difficulty].difficultyFactor;
        
        // Base multiplier based on spots and matches
        uint256 baseMultiplier = getBaseMultiplier(spots, matches);
        
        // Apply difficulty factor
        uint256 adjustedMultiplier = (baseMultiplier * difficultyFactor) / 100;
        
        // Calculate payout (0 if multiplier is 0)
        if (adjustedMultiplier == 0) {
            return 0;
        }
        
        return (wager * adjustedMultiplier);
    }
    
    // Calculate maximum possible payout for a game
    function calculateMaxPayout(uint256 spots, string memory difficulty, uint256 wager) 
        private 
        view 
        returns (uint256) 
    {
        // Get difficulty factor
        uint256 difficultyFactor = difficulties[difficulty].difficultyFactor;
        
        // Maximum multiplier is when all spots match
        uint256 maxMultiplier = getBaseMultiplier(spots, spots);
        
        // Apply difficulty factor
        uint256 adjustedMaxMultiplier = (maxMultiplier * difficultyFactor) / 100;
        
        return (wager * adjustedMaxMultiplier);
    }
    
    // Get base multiplier based on spots chosen and matches
    function getBaseMultiplier(uint256 spots, uint256 matches) 
        private 
        pure 
        returns (uint256) 
    {
        // Return 0 if matches is greater than spots (should never happen)
        if (matches > spots) {
            return 0;
        }
        
        // Define base multipliers for different spot counts
        if (spots == 1) {
            return matches == 1 ? 3 : 0;
        } else if (spots == 2) {
            if (matches == 1) return 1;
            if (matches == 2) return 4;
            return 0;
        } else if (spots == 3) {
            if (matches == 2) return 2;
            if (matches == 3) return 5;
            return 0;
        } else if (spots == 4) {
            if (matches == 2) return 1;
            if (matches == 3) return 3;
            if (matches == 4) return 8;
            return 0;
        } else if (spots == 5) {
            if (matches == 3) return 2;
            if (matches == 4) return 6;
            if (matches == 5) return 15;
            return 0;
        } else if (spots == 6) {
            if (matches == 3) return 1;
            if (matches == 4) return 4;
            if (matches == 5) return 10;
            if (matches == 6) return 25;
            return 0;
        } else if (spots == 7) {
            if (matches == 4) return 2;
            if (matches == 5) return 6;
            if (matches == 6) return 15;
            if (matches == 7) return 40;
            return 0;
        } else if (spots == 8) {
            if (matches == 4) return 1;
            if (matches == 5) return 3;
            if (matches == 6) return 10;
            if (matches == 7) return 25;
            if (matches == 8) return 60;
            return 0;
        } else if (spots == 9) {
            if (matches == 5) return 2;
            if (matches == 6) return 5;
            if (matches == 7) return 15;
            if (matches == 8) return 40;
            if (matches == 9) return 85;
            return 0;
        } else if (spots == 10) {
            if (matches == 5) return 1;
            if (matches == 6) return 3;
            if (matches == 7) return 10;
            if (matches == 8) return 25;
            if (matches == 9) return 50;
            if (matches == 10) return 120;
            return 0;
        }
        
        return 0;
    }
    
    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Add funds to the contract
    function addFunds() external payable {
        require(msg.value > 0, "Must send a positive amount");
        emit FundsAdded(msg.sender, msg.value);
    }
    
    // Withdraw funds (owner only)
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount > 0, "Must withdraw a positive amount");
        require(amount <= address(this).balance, "Insufficient contract balance");
        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(msg.sender, amount);
    }
    
    // Change contract owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
    
    // Fallback function to receive funds
    receive() external payable {
        emit FundsAdded(msg.sender, msg.value);
    }
}