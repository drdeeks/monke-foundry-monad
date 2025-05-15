# MonKe Keno Game

A blockchain-based Keno game built on the Monad network using Foundry for smart contract development.

## Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- [Node.js](https://nodejs.org/) for the frontend
- A Monad RPC endpoint

## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/monke-keno-foundry.git
cd monke-keno-foundry
```

2. Install dependencies
```bash
# Install Foundry dependencies
make install

# Install Node.js dependencies (if using a package manager for frontend)
cd public
npm install
cd ..
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

## Development

Build the contracts:
```bash
forge build
```

Run tests:
```bash
forge test
```

## Deployment

Deploy to Monad:
```bash
make deploy-monad
```

After deployment, save the contract address to an environment variable:
```bash
export CONTRACT_ADDRESS=<your_contract_address>
# Replace <your_contract_address> with the actual address of your deployed contract
```

Then save deployment info for the frontend:
```bash
forge script script/Save_Deployment_Info.s.sol --rpc-url https://testnet-rpc.monad.xyz MONAD_RPC_URL
```

## Frontend

The frontend files are located in the `public` directory. You can serve them with any static file server.

```bash
# Example using Node.js http-server
npx http-server ./public
```

## Contract Verification

Verify your contract on the Monad block explorer:
```bash
make verify
```

## License

MIT