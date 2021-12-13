
const chai = require("chai");
const { ethers } = require("hardhat");
const { expect } = chai;
chai.use(require("chai-as-promised"));


describe("aAbachi token", () => {

  let aAbachi, owner, address, newOwner;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("aAbachi");
    aAbachi = await Token.deploy();
    [owner, newOwner] = await ethers.getSigners();
    address = newOwner.address;
    
  });

  it("Tokens for auction should be credited to owner", async () => {    

    let ownerBalance = await aAbachi.balanceOf(owner.address);
    await aAbachi.mintAuction();

    ownerBalance = await aAbachi.balanceOf(owner.address);    
    expect(await aAbachi.totalSupply()).to.equal(ownerBalance);
    expect(await aAbachi.totalSupply()).to.equal(BigInt("167500000000000"));
  });

  it("Tokens for auction should not be minted twice", async () => {    
    await aAbachi.mintAuction();
    await expect(aAbachi.mintAuction()).to.be.rejected;
  });

  it("Owner should not be able to mint whitelist aAbachi token without setting presale", async () => {
    const address = newOwner.address;
    await expect(aAbachi.mint(address, 100)).to.be.rejected; 
  });

  it("Owner should be able to mint whitelist aAbachi token with presale", async () => {    
    await aAbachi.setPresale(await owner.getAddress());
    await aAbachi.mint(address, 100);
    expect(await aAbachi.balanceOf(address)).to.equal(BigInt(100));
  });

  it("updating owner in policy should allow only the new owner to mint", async () => {    
    await aAbachi.pushPolicy(address);

    await aAbachi.connect(newOwner).pullPolicy();
    await aAbachi.connect(newOwner).setPresale(await newOwner.getAddress());

    await expect(aAbachi.mint(address, 100)).to.be.rejected; //reject if minted by old owner
    
    await aAbachi.connect(newOwner).mint(address, 100);
    expect(await aAbachi.balanceOf(address)).to.equal(BigInt(100));    
  });

  it("should not allow minting after renounce", async () => {
    await aAbachi.renouncePolicy();
    await expect(aAbachi.setPresale(await owner.getAddress())).to.be.rejected;
  });

  it("should not mint beyond max supply", async () => {    
    await aAbachi.setPresale(await owner.getAddress());
    await expect(aAbachi.mint(address, BigInt(192500 * 10**9 + 1))).to.be.rejected;
    await expect(aAbachi.mint(address, BigInt(192500 * 10**9))).not.to.be.rejected;
  });

  it("should not mint auction tokens beyond max supply", async () => {    
    await aAbachi.setPresale(await owner.getAddress());
    await aAbachi.mint(address, BigInt(25000 * 10**9 + 1)); // max supply available for whitelist
    await expect(aAbachi.mintAuction()).to.be.rejected;
  });
});

