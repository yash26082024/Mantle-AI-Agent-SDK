import { ethers } from "ethers";

/**
 * Abstract class for observing on-chain or off-chain state.
 * Developers should extend this to define what data the agent sees.
 */
export abstract class Observer {
  protected provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Returns a string representation of the observed data.
   */
  abstract observe(): Promise<string>;
}

