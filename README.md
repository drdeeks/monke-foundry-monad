# MonKe Keno Game 🎮

A decentralized Keno game built on the Monad blockchain, featuring an interactive UI and smart contract integration.

## 🎯 Overview

MonKe Keno is a blockchain-based lottery game where players select numbers and bet on matching them with randomly drawn numbers. The game features multiple difficulty levels, dynamic multipliers, and instant payouts through smart contracts.

## 🚀 Features

- **Multiple Difficulty Levels**:
  - Easy: Select up to 10 numbers, 20 numbers drawn
  - Medium: Select up to 8 numbers, 15 numbers drawn
  - Hard: Select up to 6 numbers, 10 numbers drawn

- **Dynamic Multipliers**:
  - Easy Mode: 1x-5x multiplier
  - Medium Mode: 2x-10x multiplier
  - Hard Mode: 3x-25x multiplier

- **Interactive UI**:
  - Animated number selection
  - Real-time drawn number reveals
  - Dynamic winning animations
  - Responsive design for all devices

- **Blockchain Integration**:
  - Seamless wallet connection
  - Automatic smart contract interaction
  - Real-time balance updates
  - Secure transaction handling

## 🛠 Installation

### Prerequisites
- Node.js (v14 or higher)
- Web3 wallet (MetaMask recommended)
- Access to Monad testnet

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/monke-foundry-monad.git
   cd monke-foundry-monad
   ```

2. **Install Dependencies**
   ```bash
   # For the frontend
   cd frontend
   npm install

   # For the smart contract (if modifying)
   cd ../contracts
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   # In the frontend directory
   npm run dev
   ```

## 🎮 How to Play

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Ensure you're on Monad testnet
   - Approve wallet connection

2. **Choose Difficulty**
   - Select Easy, Medium, or Hard mode
   - Each mode has different number limits and multipliers

3. **Select Numbers**
   - Click numbers on the game board
   - Use "Random" for quick picks
   - Use "Clear" to reset selection

4. **Place Bet**
   - Enter wager amount
   - Check multiplier potential
   - Click "Play" to start game

5. **Watch Results**
   - Numbers are drawn one by one
   - Matching numbers are highlighted
   - Winnings are calculated and displayed
   - Automatic payout to wallet

## 💰 Payout Structure

### Easy Mode (20 numbers drawn)
- 1-3 matches: 1x multiplier
- 4-5 matches: 2x multiplier
- 6-8 matches: 3x multiplier
- 9-10 matches: 5x multiplier

### Medium Mode (15 numbers drawn)
- 1-3 matches: 2x multiplier
- 4-5 matches: 4x multiplier
- 6-7 matches: 6x multiplier
- 8 matches: 10x multiplier

### Hard Mode (10 numbers drawn)
- 1-2 matches: 3x multiplier
- 3-4 matches: 7x multiplier
- 5 matches: 15x multiplier
- 6 matches: 25x multiplier

## 🔧 Technical Details

### Smart Contract
- Built with Solidity
- Implements provably fair random number generation
- Includes automated payout system
- Features owner controls and emergency functions

### Frontend
- Built with vanilla JavaScript
- Uses ethers.js for blockchain interaction
- Implements responsive design
- Features modern CSS animations

### Security Features
- Input validation
- Transaction confirmation
- Error handling
- Secure wallet integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Monad blockchain team
- Foundry framework
- ethers.js team
- Community contributors

## 📞 Support

For support, please open an issue in the repository or contact the team at [your-email@example.com].

## ⚠️ Disclaimer

This is a testnet implementation. Always verify smart contract addresses and test with small amounts first on mainnet.
