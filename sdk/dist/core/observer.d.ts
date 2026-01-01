import { ethers } from "ethers";
/**
 * Abstract class for observing on-chain or off-chain state.
 * Developers should extend this to define what data the agent sees.
 */
export declare abstract class Observer {
    protected provider: ethers.JsonRpcProvider;
    constructor(rpcUrl: string);
    /**
     * Returns a string representation of the observed data.
     */
    abstract observe(): Promise<string>;
}
//# sourceMappingURL=observer.d.ts.map