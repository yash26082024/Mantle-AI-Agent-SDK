import type { ReasoningResult } from "../types";

export interface ILLMProvider {
  /**
   * Processes the observed data and returns the agent's next actions.
   * @param systemPrompt Instructions for the agent.
   * @param observationData Contextual data from the chain or environment.
   */
  reason(systemPrompt: string, observationData: string): Promise<ReasoningResult>;
}

