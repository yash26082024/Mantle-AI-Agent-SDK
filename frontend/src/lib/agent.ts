import { GoogleGenerativeAI } from "@google/generative-ai";
import { ethers } from "ethers";
import { CONFIG, ABIs } from "./constants";

const genAI = new GoogleGenerativeAI(CONFIG.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const factoryInterface = new ethers.Interface(ABIs.factory);

export async function processChat(message: string) {
  const systemPrompt = `
    You are an AI Agent on the Mantle Blockchain. Your goal is to help users create tokens, NFTs, and execute actions.
    
    The user wants: "${message}"
    
    Respond ONLY with a JSON object:
    {
      "reasoning": "Explain what you are doing",
      "actions": [
        {
          "type": "TOKEN_CREATE",
          "params": {
            "name": "Token Name",
            "symbol": "SYM",
            "initialSupply": "1000000000000000000000" 
          }
        },
        {
          "type": "NFT_CREATE",
          "params": {
            "name": "Collection Name",
            "symbol": "SYM",
            "tokenURI": "optional image link/metadata URI"
          }
        }
      ]
    }
    
    If the user provides an image link or metadata URI for an NFT, include it in the "tokenURI" parameter.
    If creating a token, use 18 decimals for initialSupply (e.g., 1000 tokens = 1000000000000000000000).
  `;

  const result = await model.generateContent(systemPrompt);
  const response = await result.response;
  const text = response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) throw new Error("AI failed to generate valid action");
  return JSON.parse(jsonMatch[0]);
}

export async function executeActions(actions: any[]) {
  const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
  const wallet = new ethers.Wallet(CONFIG.privateKey, provider);
  const executor = new ethers.Contract(CONFIG.executorAddress, ABIs.executor, wallet);
  const factoryInterface = new ethers.Interface(ABIs.factory);

  const formattedActions = actions.map(a => {
    let data = "0x";
    if (a.type === 'TOKEN_CREATE') {
      data = factoryInterface.encodeFunctionData("createToken", [
        a.params.name,
        a.params.symbol,
        BigInt(a.params.initialSupply),
        wallet.address // Pass the wallet address as the receiver
      ]);
    } else if (a.type === 'NFT_CREATE') {
      if (a.params.tokenURI) {
        data = factoryInterface.encodeFunctionData("createNFTWithMint", [
          a.params.name,
          a.params.symbol,
          a.params.tokenURI,
          wallet.address
        ]);
      } else {
        data = factoryInterface.encodeFunctionData("createNFT", [
          a.params.name,
          a.params.symbol
        ]);
      }
    }

    return {
      target: CONFIG.factoryAddress,
      value: BigInt(0),
      data: data
    };
  });

  const totalValue = formattedActions.reduce((acc, a) => acc + a.value, BigInt(0));
  const reasoningHash = ethers.id("chat-reasoning");
  const agentId = "chat-agent";

  // 1. Estimate Gas
  let gasLimit;
  try {
    const estimation = await executor.execute.estimateGas(
      formattedActions,
      agentId,
      reasoningHash,
      { value: totalValue }
    );
    // Add 30% buffer to the estimation
    gasLimit = (estimation * BigInt(130)) / BigInt(100);
  } catch (error) {
    console.warn("Gas estimation failed, using fallback limit:", error);
    gasLimit = BigInt(150000000); // Fallback to a high but reasonable limit if estimation fails
  }

  // 2. Execute Transaction
  const tx = await executor.execute(
    formattedActions,
    agentId,
    reasoningHash,
    { 
      value: totalValue,
      gasLimit: gasLimit
    }
  );

  const receipt = await tx.wait();
  return receipt;
}

