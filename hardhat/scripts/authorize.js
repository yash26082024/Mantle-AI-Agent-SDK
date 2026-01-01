const hre = require("hardhat");

async function main() {
  const executorAddress = "0x46Ac132785eC02B6d8903985eb934EbCED8b6ea3";
  const agentAddress = "0x4943F90888e9Dc97fAd243b1216FD148d820Fe10";

  console.log(`Authorizing agent ${agentAddress} on executor ${executorAddress}...`);

  const MantleAgentExecutor = await hre.ethers.getContractFactory("MantleAgentExecutor");
  const executor = await MantleAgentExecutor.attach(executorAddress);

  const tx = await executor.authorizeAgent(agentAddress, true);
  await tx.wait();

  console.log("Agent authorized successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
