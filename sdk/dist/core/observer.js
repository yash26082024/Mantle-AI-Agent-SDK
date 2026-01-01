import { ethers } from "ethers";
/**
 * Abstract class for observing on-chain or off-chain state.
 * Developers should extend this to define what data the agent sees.
 */
export class Observer {
    provider;
    constructor(rpcUrl) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }
}
//# sourceMappingURL=observer.js.map