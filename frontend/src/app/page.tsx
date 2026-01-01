"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2, Wallet, Coins, Image as ImageIcon } from "lucide-react";
import { processChat, executeActions } from "@/lib/agent";
import { CONFIG, ABIs } from "@/lib/constants";
import { ethers } from "ethers";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Derive the wallet address from the private key
  const walletAddress = CONFIG.privateKey ? new ethers.Wallet(CONFIG.privateKey).address : "Not Connected";
  const displayAddress = walletAddress !== "Not Connected" 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
    : "Not Connected";

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Ask AI to reason and generate actions
      const aiDecision = await processChat(input);
      
      const aiMsg = { 
        role: "assistant", 
        content: aiDecision.reasoning,
        actions: aiDecision.actions 
      };
      setMessages(prev => [...prev, aiMsg]);

      // 2. Execute on Mantle
      if (aiDecision.actions && aiDecision.actions.length > 0) {
        setMessages(prev => [...prev, { role: "system", content: "Executing on Mantle..." }]);
        const receipt = await executeActions(aiDecision.actions);
        
        // Parse logs to find created asset addresses
        const factoryInterface = new ethers.Interface(ABIs.factory);
        let createdAssetMsg = "";
        
        receipt.logs.forEach((log: any) => {
          try {
            const parsed = factoryInterface.parseLog(log);
            if (parsed?.name === "TokenCreated") {
              createdAssetMsg = `\n\n✅ New Token Address: ${parsed.args[0]}`;
            } else if (parsed?.name === "NFTCreated") {
              createdAssetMsg = `\n\n✅ New NFT Collection: ${parsed.args[0]}`;
            }
          } catch (e) {
            // Log might not be from the factory, ignore
          }
        });

        setMessages(prev => [...prev, { 
          role: "system", 
          content: `Success! Transaction: ${receipt.hash}${createdAssetMsg}` 
        }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: "system", content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Mantle AI Agent</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-sm border border-slate-700">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="font-mono">{displayAddress}</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-3xl mx-auto w-full p-4 space-y-6">
          {messages.length === 0 && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Bot className="w-16 h-16 opacity-20" />
              <p className="text-lg text-center px-4">How can I help you on Mantle today?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md px-4 mt-4">
                <button onClick={() => setInput("Create a token named Mantle with symbol MNT and supply 1000000")} 
                  className="p-3 text-left bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-sm">
                  "Create a token named Mantle..."
                </button>
                <button onClick={() => setInput("Create an NFT collection called Mantle Warriors with symbol MWAR")} 
                  className="p-3 text-left bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-sm">
                  "Create an NFT collection..."
                </button>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                m.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : m.role === 'system'
                  ? 'bg-slate-800/50 text-slate-400 text-sm border border-slate-700 font-mono italic break-all'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}>
                <div className="flex items-start gap-3">
                  {m.role === 'assistant' && <Bot className="w-5 h-5 mt-1 text-emerald-400 shrink-0" />}
                  <div className="space-y-2 overflow-hidden">
                    <p className="leading-relaxed break-words">{m.content}</p>
                    {m.actions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.actions.map((a: any, j: number) => (
                          <div key={j} className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-md text-xs border border-slate-700">
                            {a.type === 'TOKEN_CREATE' ? <Coins className="w-3 h-3 text-yellow-400" /> : <ImageIcon className="w-3 h-3 text-purple-400" />}
                            {a.type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-4">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your Mantle agent..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-3 uppercase tracking-widest font-semibold">
          Powered by Gemini 1.5 Flash & Mantle Network
        </p>
      </footer>
    </div>
  );
}
