const { ethers } = require("hardhat");

async function main() {
  const emsRoles = await ethers.deployContract("EMS_Roles");
  await emsRoles.waitForDeployment();

  console.log("EMS_Roles deployed to:", await emsRoles.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
