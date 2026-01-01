require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
      evmVersion: "paris",
    },
  },
  networks: {
    mantleSepolia: {
      url: "https://rpc.sepolia.mantle.xyz",
      accounts: ["0x7edb0edc228e343a384d94cd8138b4ab3096fd482991f3a74aed40dad76cee16"],
      timeout: 300000, // 5 minutes
    },
  },
};
