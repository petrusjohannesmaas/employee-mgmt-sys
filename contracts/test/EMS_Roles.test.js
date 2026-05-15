const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EMS_Roles", function () {
  let emsRoles, owner, addr1;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();
    emsRoles = await ethers.deployContract("EMS_Roles");
  });

  it("should set deployer as owner and grant them ADMIN_ROLE", async () => {
    const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN"));
    expect(await emsRoles.owner()).to.equal(owner.address);
    expect(await emsRoles.hasRole(owner.address, ADMIN_ROLE)).to.be.true;
  });

  it("should grant and revoke roles", async () => {
    const MANAGER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MANAGER"));

    await emsRoles.grantRole(addr1.address, MANAGER_ROLE);
    expect(await emsRoles.hasRole(addr1.address, MANAGER_ROLE)).to.be.true;

    await emsRoles.revokeRole(addr1.address, MANAGER_ROLE);
    expect(await emsRoles.hasRole(addr1.address, MANAGER_ROLE)).to.be.false;
  });

  it("should reject non-owner grant attempts", async () => {
    const EMPLOYEE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("EMPLOYEE"));
    await expect(
      emsRoles.connect(addr1).grantRole(addr1.address, EMPLOYEE_ROLE)
    ).to.be.revertedWith("Not owner");
  });
});
