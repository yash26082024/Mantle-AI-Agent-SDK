# Mantle AI Agent SDK

The core TypeScript SDK for building autonomous, verifiable AI agents on the Mantle blockchain.

## Features

- **Observe-Decide-Act**: Standardized lifecycle for AI agents.
- **Verifiable Reasoning**: Link LLM decisions to on-chain transactions via reasoning hashes.
- **Mantle Native**: Optimized for Mantle's gas model and high-throughput execution.
- **Pluggable LLMs**: Default support for Gemini 1.5 Flash with swappable provider interface.
- **Asset Utilities**: Built-in helpers for on-demand Token and NFT creation.

## Installation

```bash
npm install @mantle-agent-sdk/core
```

## Quick Start

### 1. Initialize the Agent

```typescript
import { Agent, GeminiProvider, Observer } from "@mantle-agent-sdk/core";

// Define what your agent should see on-chain
class MyObserver extends Observer {
  async observe() {
    const balance = await this.provider.getBalance("0x...");
    return `Current balance is ${ethers.formatEther(balance)} MNT.`;
  }
}

const config = {
  agentId: "my-agent-001",
  mantleRpcUrl: "https://rpc.sepolia.mantle.xyz",
  executorAddress: "0x...", // Your deployed MantleAgentExecutor
  privateKey: "0x..."
};

const agent = new Agent(
  config,
  new GeminiProvider(process.env.GEMINI_API_KEY),
  new MyObserver(config.mantleRpcUrl)
);
```

### 2. Run an Iteration

```typescript
const systemPrompt = "If the balance is above 1 MNT, transfer the surplus to 0x...";
const result = await agent.runIteration(systemPrompt);

if (result.success) {
  console.log("Action executed:", result.transactionHash);
}
```

### 3. Create Assets

```typescript
import { AssetUtils } from "@mantle-agent-sdk/core";

// Create an ERC20 Token
const tokenAction = AssetUtils.createTokenAction(
  factoryAddress,
  "My Token",
  "TKN",
  ethers.parseEther("1000000"),
  receiverAddress
);

// Create an empty ERC721 NFT Collection
const nftAction = AssetUtils.createNFTAction(
  factoryAddress,
  "My Collection",
  "MC"
);

// Create an NFT Collection and mint the first token immediately
const nftWithMintAction = AssetUtils.createNFTWithMintAction(
  factoryAddress,
  "Art Collection",
  "ART",
  "https://ipfs.io/ipfs/Qm...", // Image/Metadata URI
  receiverAddress
);
```

## Examples

A complete, runnable demo agent can be found in the `examples/demo-agent` directory. This example demonstrates how to:
- Monitor a wallet balance on Mantle Sepolia.
- Use Gemini to reason about transferring surplus funds.
- Execute the transaction via the SDK.

To run it:
```bash
cd examples/demo-agent
npm install
npm start
```

## License
MIT
