import type { BigNumberish, BytesLike } from "ethers";
export interface AgentAction {
    target: string;
    value: BigNumberish;
    data: BytesLike;
}
export interface ExecutionResult {
    success: boolean;
    transactionHash?: string;
    results?: string[];
    error?: string;
}
export interface AgentConfig {
    agentId: string;
    mantleRpcUrl: string;
    executorAddress: string;
    privateKey: string;
}
export interface ReasoningResult {
    actions: AgentAction[];
    reasoning: string;
}
//# sourceMappingURL=types.d.ts.map