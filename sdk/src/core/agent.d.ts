import type { AgentConfig, ExecutionResult } from "../types";
import type { ILLMProvider } from "../llm/provider";
import { Observer } from "./observer";
export declare class Agent {
    private config;
    private llm;
    private observer;
    private wallet;
    private executorContract;
    constructor(config: AgentConfig, llm: ILLMProvider, observer: Observer);
    /**
     * Run one iteration of the Observe-Decide-Act loop.
     */
    runIteration(systemPrompt: string): Promise<ExecutionResult>;
}
//# sourceMappingURL=agent.d.ts.map