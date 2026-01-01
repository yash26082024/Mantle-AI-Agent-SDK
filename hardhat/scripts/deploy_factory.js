const hre = require("hardhat");

async function main() {
  console.log("Deploying ONLY MantleAssetFactory...");

  const MantleAssetFactory = await hre.ethers.getContractFactory("MantleAssetFactory");
  const factory = await MantleAssetFactory.deploy();

  await factory.waitForDeployment();

  console.log("MantleAssetFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

