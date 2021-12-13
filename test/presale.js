const chai = require("chai");
const { ethers } = require("hardhat");
const { expect } = chai;
chai.use(require("chai-as-promised"));

describe("Presale", () => {

  let DAI, aABI, DAO, presale, user, user1, user2;

  beforeEach(async () => {
    [owner, DAO, user, user1, user2] = await ethers.getSigners();
    const DAIContract = await ethers.getContractFactory("ERC20Mock");
    const DaiToken = await DAIContract.deploy("DAI", "DAI", 18, owner.address, 100000000);

    const aABIContract = await ethers.getContractFactory("aAbachi");
    const aAbiToken = await aABIContract.deploy();

    DAI = DaiToken.address;    
    aABI = aAbiToken.address;    

    const PresaleContract = await ethers.getContractFactory("PresaleAbachi");
    presale = await PresaleContract.deploy(aABI, DAI, DAO.address);

    aAbiToken.setPresale(presale.address);
  });

  describe("sale", () => {
    it("Start sale", async () => {
      await expect(presale.start()).to.emit(presale, "SaleStarted");
      expect(await presale.started()).to.equal(true);
    });
    
    it("End sale", async () => {
      await expect(presale.end()).to.be.rejected;
      await presale.start();
      await expect(presale.end()).to.emit(presale, "SaleEnded");
      expect (await presale.ended()).to.equal(true);
    });

    it ("pause sale", async () => {
      await presale.togglePause();
      expect(await presale.contractPaused()).to.equal(true);
      
      await presale.togglePause();
      expect(await presale.contractPaused()).to.equal(false);
    });
  });

  describe("whitelist", () => {
    it("Should be able to whitelist multiple users", async () => {
      await presale.addMultipleWhitelist([user.address, user1.address]);
      expect(await presale.whitelisted(user.address)).to.equal(true);
      expect(await presale.whitelisted(user1.address)).to.equal(true);
      expect(await presale.whitelisted(user2.address)).to.equal(false); // not whitelisted user
    });
  
    it("Should be able to remove whitelist", async () => {
      await presale.addMultipleWhitelist([user.address]);
      expect(await presale.whitelisted(user.address)).to.equal(true);
  
      await presale.removeWhitelist(user.address);    
      expect(await presale.whitelisted(user.address)).to.equal(false);
    });
  });

  describe("deposits", () => {
    it("Should accept deposit from whitelist user", async () => {
      const DAIContract = await ethers.getContractFactory("ERC20Mock");
      const DaiToken = await DAIContract.attach(DAI);
      await DaiToken.mint(user.address, BigInt(10000000 * 1e18));
  
      await presale.addWhitelist(user.address);
      await presale.start();
  
      await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
      await expect(presale.connect(user).deposit(BigInt(1000 * 1e18))).to.emit(presale, "Deposit").withArgs(user.address, BigInt(1000 * 1e18));
    });


    it("Deposits should go to DAO and aAbachi to user", async () => {
      const DAIContract = await ethers.getContractFactory("ERC20Mock");
      const DaiToken = await DAIContract.attach(DAI);
      await DaiToken.mint(user.address, BigInt(10000000 * 1e18));

      const aABIContract = await ethers.getContractFactory("aAbachi");
      const aABIToken = await aABIContract.attach(aABI);
  
      await presale.addWhitelist(user.address);
      await presale.start();
  
      await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
      await presale.connect(user).deposit(BigInt(1000 * 1e18));

      expect(await DaiToken.balanceOf(DAO.address)).to.equal(BigInt(1000 * 1e18));
      expect(await aABIToken.balanceOf(user.address)).to.equal(BigInt(50 * 1e9));
    });


  
    it("Should not accept less or greater than deposit cap from whitelist user", async () => {
      const DAIContract = await ethers.getContractFactory("ERC20Mock");
      const DaiToken = await DAIContract.attach(DAI);
      await DaiToken.mint(user.address, BigInt(10000000 * 1e18));
  
      await presale.addWhitelist(user.address);
      await presale.start();
  
      await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
      await expect(presale.connect(user).deposit(100)).to.be.rejectedWith("Deposit must equal 1000 DAI");
    });
  
    it("Should not accept deposit from non whitelist user", async () => {
      const DAIContract = await ethers.getContractFactory("ERC20Mock");
      const DaiToken = await DAIContract.attach(DAI);
      // await DaiToken.mint(user.address, BigInt(10000000 * 1e18));
      
      await presale.start();
  
      await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
      await expect(presale.connect(user).deposit(100)).to.be.rejectedWith("msg.sender is not whitelisted user");
    });

    it ("should not accept deposits when sale is paused", async () => {
      const DAIContract = await ethers.getContractFactory("ERC20Mock");
      const DaiToken = await DAIContract.attach(DAI);
      // await DaiToken.mint(user.address, BigInt(10000000 * 1e18));
      await presale.start();
      
      await presale.togglePause();  
      await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
      await expect(presale.connect(user).deposit(100)).to.be.rejectedWith("contract is paused");
    }); 
    
    it ("should not accept deposits before or after sale", async () => {
      const DAIContract = await ethers.getContractFactory("ERC20Mock");
      const DaiToken = await DAIContract.attach(DAI);
      // await DaiToken.mint(user.address, BigInt(10000000 * 1e18));

      // before sale started
      await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
      await expect(presale.connect(user).deposit(100)).to.be.rejectedWith("Sale has not started");
      
      await presale.start();

      // After sale end
      await presale.end();
      await expect(presale.connect(user).deposit(100)).to.be.rejectedWith("Sale has ended");

      
    }); 
  });

  // describe ("Claims", () => {

  //   it ("Should allow claim unlock after the sale ends", async () => {
  //     await presale.start();
  //     await presale.end();
  //     await expect(presale.claimUnlock()).to.emit(presale, "ClaimUnlocked");
  //   });

  //   it ("Should allow claim unlock token supply is greater than or equal to debt", async () => {
      
  //     await presale.start();
  //     // Deposit DAI to increase debt
  //     const DAIContract = await ethers.getContractFactory("ERC20Mock");
  //     const DaiToken = await DAIContract.attach(DAI);
  //     await DaiToken.mint(user.address, BigInt(10000000 * 1e18));      
    
  //     await presale.addWhitelist(user.address);
  //     await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
  //     await presale.connect(user).deposit(BigInt(1000 * 1e18));
  //     await presale.end();
      
  //     await abiToken.connect(DAO).mint(owner.address, 1000);
      
  //     await expect(presale.claimUnlock()).to.emit(presale, "ClaimUnlocked");
  //   });

  //   it ("Should not allow claim unlock when the sale didn't end", async () => {
  //     await presale.start();      
  //     await expect(presale.claimUnlock()).to.be.rejectedWith("Sale has not ended");
  //   });

  //   it ("Should not allow claim unlock is total supply of ABI is not enough", async () => {
  //     await presale.start();

  //     // Deposit DAI to increase debt
  //     const DAIContract = await ethers.getContractFactory("ERC20Mock");
  //     const DaiToken = await DAIContract.attach(DAI);
  //     await DaiToken.mint(user.address, BigInt(10000000 * 1e18));      
     
  //     await presale.addWhitelist(user.address);
  //     await DaiToken.connect(user).approve(presale.address, BigInt(1000 * 1e18));
  //     await presale.connect(user).deposit(BigInt(1000 * 1e18));

  //     await presale.end();
  //     await expect(presale.claimUnlock()).to.be.rejectedWith("not enough ABI in contract");
  //   });
  //});
  
});