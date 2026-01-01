import * as dotenv from "dotenv";
import { Agent, Observer, GeminiProvider } from "@mantle-agent-sdk/core";
import { ethers } from "ethers";
dotenv.config();
/**
 * Custom Observer for the Demo Agent.
 * Monitors the balance of a specific wallet on Mantle.
 */
class BalanceObserver extends Observer {
    walletAddress;
    constructor(rpcUrl, walletAddress) {
        super(rpcUrl);
        this.walletAddress = walletAddress;
    }
    async observe() {
        const balance = await this.provider.getBalance(this.walletAddress);
        return `Current balance of ${this.walletAddress} is ${ethers.formatEther(balance)} MNT.`;
    }
}
async function main() {
    const config = {
        agentId: "mantle-balance-monitor-001",
        mantleRpcUrl: process.env.MANTLE_RPC_URL || "https://rpc.sepolia.mantle.xyz",
        executorAddress: process.env.EXECUTOR_ADDRESS || "",
        privateKey: process.env.PRIVATE_KEY || "0x...",
    };
    const geminiApiKey = process.env.GEMINI_API_KEY || "";
    const treasuryAddress = "";
    const observer = new BalanceObserver(config.mantleRpcUrl, new ethers.Wallet(config.privateKey).address);
    const llm = new GeminiProvider(geminiApiKey);
    const agent = new Agent(config, llm, observer);
    const systemPrompt = `
    You are a financial curation agent for a DAO on Mantle.
    Your goal is to maintain a balance of 0.03 MNT in the operational wallet.
    If the balance exceeds 0.03 MNT, transfer the surplus to the treasury address: ${treasuryAddress}.
    If the balance is 0.03 MNT or less, take no action.
    
    The treasury address is ${treasuryAddress}.
    The operational wallet is the one you are observing.
  `;
    console.log("Running agent iteration...");
    const result = await agent.runIteration(systemPrompt);
    if (result.success) {
        console.log("Iteration successful!");
        if (result.transactionHash) {
            console.log(`Transaction Hash: ${result.transactionHash}`);
        }
        else {
            console.log(result.error || "No actions taken.");
        }
    }
    else {
        console.error("Iteration failed:", result.error);
    }
}
main().catch(console.error);
