import hre from "hardhat";

async function main() {
  console.log("Starting deployment on Mantle Sepolia...");

  // 1. Deploy MantleAgentExecutor
  console.log("Deploying MantleAgentExecutor...");
  const MantleAgentExecutor = await hre.ethers.getContractFactory("MantleAgentExecutor");
  const executor = await MantleAgentExecutor.deploy();
  await executor.waitForDeployment();
  const executorAddress = await executor.getAddress();
  console.log("MantleAgentExecutor deployed to:", executorAddress);

  // 2. Deploy MantleAssetFactory
  console.log("Deploying MantleAssetFactory...");
  const MantleAssetFactory = await hre.ethers.getContractFactory("MantleAssetFactory");
  const factory = await MantleAssetFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("MantleAssetFactory deployed to:", factoryAddress);

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("Executor:", executorAddress);
  console.log("Asset Factory:", factoryAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
