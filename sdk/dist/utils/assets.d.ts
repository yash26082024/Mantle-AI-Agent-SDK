import type { AgentAction } from "../types";
/**
 * Utility class for creating Mantle assets via the MantleAssetFactory.
 */
export declare class AssetUtils {
    private static factoryInterface;
    /**
     * Generates an action to create a new ERC20 token.
     * @param factoryAddress The address of the deployed MantleAssetFactory.
     * @param name Token name.
     * @param symbol Token symbol.
     * @param initialSupply Initial supply in absolute units (e.g., use ethers.parseEther).
     */
    static createTokenAction(factoryAddress: string, name: string, symbol: string, initialSupply: bigint | string): AgentAction;
    /**
     * Generates an action to create a new ERC721 NFT collection.
     * @param factoryAddress The address of the deployed MantleAssetFactory.
     * @param name Collection name.
     * @param symbol Collection symbol.
     */
    static createNFTAction(factoryAddress: string, name: string, symbol: string): AgentAction;
    /**
     * Generates an action to create a new ERC721 NFT collection and mint the first token.
     * @param factoryAddress The address of the deployed MantleAssetFactory.
     * @param name Collection name.
     * @param symbol Collection symbol.
     * @param tokenURI The URI for the first token's metadata/image.
     * @param receiver The address to receive the first minted NFT.
     */
    static createNFTWithMintAction(factoryAddress: string, name: string, symbol: string, tokenURI: string, receiver: string): AgentAction;
}
//# sourceMappingURL=assets.d.ts.map