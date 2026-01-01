import { GoogleGenerativeAI } from "@google/generative-ai";
export class GeminiProvider {
    genAI;
    model;
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    }
    async reason(systemPrompt, observationData) {
        const prompt = `
      ${systemPrompt}
      
      Observation Data:
      ${observationData}
      
      Respond ONLY with a JSON object in the following format:
      {
        "reasoning": "Explain your thought process here",
        "actions": [
          {
            "target": "0x...",
            "value": "0", 
            "data": "0x..."
          }
        ]
      }
      
      IMPORTANT: The "value" field must be a string representing the amount in WEI (1 MNT = 10^18 WEI). It must be a whole integer, NO decimals.
    `;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Simple JSON extraction from the LLM response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse JSON from LLM response");
        }
        try {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                reasoning: parsed.reasoning || "",
                actions: parsed.actions || []
            };
        }
        catch (e) {
            throw new Error(`Invalid JSON format from LLM: ${text}`);
        }
    }
}
