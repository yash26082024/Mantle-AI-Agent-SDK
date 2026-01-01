import { ethers } from "ethers";
import { Observer } from "./observer";
const MANTLE_EXECUTOR_ABI = [
    "function execute(tuple(address target, uint256 value, bytes data)[] actions, string agentId, bytes32 reasoningHash) external payable returns (bytes[])",
    "event ActionExecuted(string agentId, address indexed target, bytes data, uint256 value, bytes result, bytes32 reasoningHash)"
];
export class Agent {
    config;
    llm;
    observer;
    wallet;
    executorContract;
    constructor(config, llm, observer) {
        this.config = config;
        this.llm = llm;
        this.observer = observer;
        const provider = new ethers.JsonRpcProvider(config.mantleRpcUrl);
        this.wallet = new ethers.Wallet(config.privateKey, provider);
        this.executorContract = new ethers.Contract(config.executorAddress, MANTLE_EXECUTOR_ABI, this.wallet);
    }
    /**
     * Run one iteration of the Observe-Decide-Act loop.
     */
    async runIteration(systemPrompt) {
        try {
            // 1. Observe
            const observationData = await this.observer.observe();
            // 2. Decide (Reason)
            const decision = await this.llm.reason(systemPrompt, observationData);
            if (decision.actions.length === 0) {
                return { success: true, results: [], error: "No actions determined by LLM" };
            }
            // 3. Act (Execute on Mantle)
            // Sanitize actions: ensure value is a valid BigInt string
            const sanitizedActions = decision.actions.map(action => ({
                ...action,
                value: action.value.toString().includes('.')
                    ? ethers.parseEther(action.value.toString()).toString() // Convert from MNT to Wei if it looks like a decimal
                    : action.value.toString()
            }));
            // For the reasoningHash, we'll use a simple keccak256 hash of the reasoning string
            // In a real scenario, this could be an IPFS CID.
            const reasoningHash = ethers.id(decision.reasoning);
            // Calculate total value to send with the transaction
            const totalValue = sanitizedActions.reduce((acc, action) => acc + BigInt(action.value), BigInt(0));
            const tx = await this.executorContract.getFunction("execute")(sanitizedActions, this.config.agentId, reasoningHash, { value: totalValue } // Send the required MNT with the call
            );
            const receipt = await tx.wait();
            if (!receipt) {
                throw new Error("Transaction failed or was dropped");
            }
            return {
                success: true,
                transactionHash: receipt.hash,
                results: receipt.logs.map((log) => log.data)
            };
        }
        catch (error) {
            console.error("Agent iteration failed:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}
//# sourceMappingURL=agent.js.map