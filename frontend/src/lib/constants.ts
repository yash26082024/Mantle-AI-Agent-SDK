import { ethers } from "ethers";

const MANTLE_EXECUTOR_ABI = [
  "function execute(tuple(address target, uint256 value, bytes data)[] actions, string agentId, bytes32 reasoningHash) external payable returns (bytes[])",
  "event ActionExecuted(string agentId, address indexed target, bytes data, uint256 value, bytes result, bytes32 reasoningHash)",
  "event TokenCreated(address indexed tokenAddress, string name, string symbol, address indexed creator)",
  "event NFTCreated(address indexed nftAddress, string name, string symbol, address indexed creator)"
];

const ASSET_FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 initialSupply, address receiver) external returns (address)",
  "function createNFT(string name, string symbol) external returns (address)",
  "function createNFTWithMint(string name, string symbol, string tokenURI, address receiver) external returns (address)",
  "event TokenCreated(address indexed tokenAddress, string name, string symbol, address indexed receiver)",
  "event NFTCreated(address indexed nftAddress, string name, string symbol, address indexed receiver)"
];

export const CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_MANTLE_RPC_URL || "https://rpc.sepolia.mantle.xyz",
  executorAddress: process.env.NEXT_PUBLIC_EXECUTOR_ADDRESS || "0x46Ac132785eC02B6d8903985eb934EbCED8b6ea3",
  factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0x6346c84E65db504faA791d87378D59d9E698743C",
  privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
  geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
};

export const ABIs = {
  executor: MANTLE_EXECUTOR_ABI,
  factory: ASSET_FACTORY_ABI
};

