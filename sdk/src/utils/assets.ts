import { ethers } from "ethers";
import type { AgentAction } from "../types";

const FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 initialSupply, address receiver) external returns (address)",
  "function createNFT(string name, string symbol) external returns (address)",
  "function createNFTWithMint(string name, string symbol, string tokenURI, address receiver) external returns (address)"
];

/**
 * Utility class for creating Mantle assets via the MantleAssetFactory.
 */
export class AssetUtils {
  private static factoryInterface = new ethers.Interface(FACTORY_ABI);

  /**
   * Generates an action to create a new ERC20 token.
   * @param factoryAddress The address of the deployed MantleAssetFactory.
   * @param name Token name.
   * @param symbol Token symbol.
   * @param initialSupply Initial supply in absolute units (e.g., use ethers.parseEther).
   */
  static createTokenAction(
    factoryAddress: string,
    name: string,
    symbol: string,
    initialSupply: bigint | string
  ): AgentAction {
    const data = this.factoryInterface.encodeFunctionData("createToken", [
      name,
      symbol,
      BigInt(initialSupply)
    ]);

    return {
      target: factoryAddress,
      value: 0,
      data: data
    };
  }

  /**
   * Generates an action to create a new ERC721 NFT collection.
   * @param factoryAddress The address of the deployed MantleAssetFactory.
   * @param name Collection name.
   * @param symbol Collection symbol.
   */
  static createNFTAction(
    factoryAddress: string,
    name: string,
    symbol: string
  ): AgentAction {
    const data = this.factoryInterface.encodeFunctionData("createNFT", [
      name,
      symbol
    ]);

    return {
      target: factoryAddress,
      value: 0,
      data: data
    };
  }

  /**
   * Generates an action to create a new ERC721 NFT collection and mint the first token.
   * @param factoryAddress The address of the deployed MantleAssetFactory.
   * @param name Collection name.
   * @param symbol Collection symbol.
   * @param tokenURI The URI for the first token's metadata/image.
   * @param receiver The address to receive the first minted NFT.
   */
  static createNFTWithMintAction(
    factoryAddress: string,
    name: string,
    symbol: string,
    tokenURI: string,
    receiver: string
  ): AgentAction {
    const data = this.factoryInterface.encodeFunctionData("createNFTWithMint", [
      name,
      symbol,
      tokenURI,
      receiver
    ]);

    return {
      target: factoryAddress,
      value: 0,
      data: data
    };
  }
}

