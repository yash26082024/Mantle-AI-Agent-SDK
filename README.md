# Mantle AI Agent SDK & Chat Interface

A production-ready infrastructure toolkit for building verifiable AI agents on the Mantle blockchain. This project provides a modular SDK for agent orchestration and a conversational frontend that bridges natural language to on-chain execution.

## Project Overview

The Mantle AI Agent SDK allows developers to build agents that observe on-chain state, reason off-chain using Large Language Models, and execute verifiable actions on Mantle. By treating Mantle as the execution and audit layer, the SDK ensures that every AI decision is linked to an on-chain receipt.

## Mantle AI SDK Npm Package

[npm Package](https://www.npmjs.com/package/@yash26082024/mantle-agent-sdk-core)

## Demo

Watch the AI Agent Chat Interface in action:
[Mantle AI Agent Demo](https://youtu.be/OohBLlis8_Q)

## Key Features

- **Observe-Decide-Act Lifecycle**: A structured orchestration flow that manages the full lifecycle of an autonomous agent.
- **Verifiable AI Reasoning**: Every action taken by the agent is cryptographically linked to an off-chain **Reasoning Hash** stored on-chain for full auditability.
- **Automatic Asset Creation**: On-demand deployment of **ERC20 Tokens** and **ERC721 NFT Collections** (with metadata/images) through natural language commands.
- **Batched Execution**: Execute multiple complex on-chain actions in a **single atomic transaction** to save gas and ensure state consistency.
- **Pluggable LLM Providers**: Built-in support for **Gemini 1.5 Flash**, with a swappable interface for other models like GPT-4 or Claude.
- **Mantle-Native Infrastructure**: Fully optimized for **Mantle's L1 Data Fee** and high-throughput environment.

---

## Deployed Infrastructure (Mantle Sepolia)

The following core infrastructure contracts are live and verified on the **Mantle Sepolia Testnet**:

| Contract | Address |
| :--- | :--- |
| **MantleAgentExecutor** | `0x46Ac132785eC02B6d8903985eb934EbCED8b6ea3` |
| **MantleAssetFactory** | `0x6346c84E65db504faA791d87378D59d9E698743C` |

---

## Tech Stack

-   **Blockchain**: Mantle Network (High-throughput, low-fee L2 execution and audit layer).
-   **AI Reasoning**: Google Gemini 1.5 Flash (Low-latency, cost-effective reasoning engine).
-   **Smart Contracts**: Solidity (0.8.19), OpenZeppelin (Secure standard assets).
-   **Frontend**: Next.js 15, Tailwind CSS, Ethers.js v6.
-   **Tooling**: Hardhat (Deployment & Testing), TypeScript (Type-safe SDK).

---

## How to Use the SDK

The SDK is designed to be integrated into any TypeScript project.

### 1. Initialize the Agent
```typescript
import { Agent, GeminiProvider, MyCustomObserver } from "@mantle-agent-sdk/core";

const config = {
  agentId: "my-agent-001",
  mantleRpcUrl: "https://rpc.sepolia.mantle.xyz",
  executorAddress: "0x...",
  privateKey: "0x..."
};

const agent = new Agent(
  config,
  new GeminiProvider(process.env.GEMINI_API_KEY),
  new MyCustomObserver(config.mantleRpcUrl)
);
```

### 2. Run an Iteration
```typescript
const result = await agent.runIteration("Observe the floor price and buy if it drops below 1 MNT.");
console.log("Transaction Hash:", result.transactionHash);
```

### 3. Create Assets Programmatically
```typescript
import { AssetUtils } from "@mantle-agent-sdk/core";

// Encode an action to create a token
const action = AssetUtils.createTokenAction(
  factoryAddress,
  "My AI Token",
  "AIT",
  ethers.parseEther("1000000"),
  userAddress
);
```

---

## Future Scope

### Automatic Contract Creation & Management
The current SDK allows for the immediate deployment of standard ERC20 and ERC721 contracts. The future roadmap includes:
-   **Dynamic Logic Synthesis**: Agents that can write, compile, and deploy custom smart contract logic on Mantle based on evolving user requirements.
-   **Autonomous Treasury Management**: Agents that manage their own liquidity pools and rebalance assets across Mantle DeFi protocols.
-   **Verifiable Reasoning Logs**: Integration with decentralized storage (like IPFS or Mantle DA) to store full LLM reasoning chains, linked cryptographically to the `reasoningHash` emitted on Mantle.

---

## Images

<img width="793" height="501" alt="tokenchat" src="https://github.com/user-attachments/assets/fddcce7f-f827-474e-8b47-4680bb635f1c" />

<img width="1470" height="382" alt="tokenexample" src="https://github.com/user-attachments/assets/7c6d19b8-05c3-4b08-80c6-f6ad9e0ba7de" />

<img width="764" height="526" alt="nftchat" src="https://github.com/user-attachments/assets/f6f6f5c7-7871-413b-bf33-956fd5d5e7a3" />

<img width="1470" height="426" alt="nftexample" src="https://github.com/user-attachments/assets/a168cddd-289c-4097-86f8-0311ab2064d2" />


## License
MIT
