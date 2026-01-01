import type { ILLMProvider } from "./provider";
import type { ReasoningResult } from "../types";
export declare class GeminiProvider implements ILLMProvider {
    private genAI;
    private model;
    constructor(apiKey: string);
    reason(systemPrompt: string, observationData: string): Promise<ReasoningResult>;
}
//# sourceMappingURL=gemini.d.ts.map