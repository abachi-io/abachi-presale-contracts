const { ethers } = require("hardhat");

const governor = { address: '0xA805fEDb79c9cAd5857623ae73f9fCfD973eC474'} // required
const guardian  = { address: '0xA805fEDb79c9cAd5857623ae73f9fCfD973eC474'} // required
const policy = { address: '0xA805fEDb79c9cAd5857623ae73f9fCfD973eC474'} // required
const vault = { address: '0x0000000000000000000000000000000000000000'} // set later

const dai = { address: '0x89bF27B58b18334116949539d220FF28B240EA54'} // required
const frax = { address: '0x8fE678dc1f1C1aB4F612Bf6D679C301a65Bc773F'} // required
const dao = { address: '0xA805fEDb79c9cAd5857623ae73f9fCfD973eC474'} // required
const warchest = { address: '0xA805fEDb79c9cAd5857623ae73f9fCfD973eC474'} // required

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account: ' + deployer.address);
    console.log('----------------------------------------------------------------------------------')

    const AbachiAuthority = await ethers.getContractFactory('AbachiAuthority');
    console.log('Deploying AbachiAuthority.sol')
    const abachiAuthority = await AbachiAuthority.deploy(governor.address, guardian.address, policy.address, vault.address);
    console.log( "AbachiAuthority: " + abachiAuthority.address + '\n');

    const AABI = await ethers.getContractFactory('aAbachi');
    console.log('Deploying aAbachi.sol')
    const aabi = await AABI.deploy();
    console.log( "aAbachi: " + aabi.address + '\n');

    const ABI = await ethers.getContractFactory('Abachi');
    console.log('Deploying Abachi.sol')
    const abi = await ABI.deploy(abachiAuthority.address);
    console.log( "Abachi: " + abi.address + '\n');

    const PresaleAbachi = await ethers.getContractFactory('PresaleAbachi');
    console.log('Deploying PresaleAbachi.sol')
    const presaleAbachi = await PresaleAbachi.deploy(aabi.address, abi.address, dai.address, frax.address, dao.address, warchest.address);
    console.log( "PresaleAbachi: " + presaleAbachi.address + '\n');

    console.log('Interacting with aABI to setPresale address to: ' + presaleAbachi.address)
    await aabi.setPresale(presaleAbachi.address)
    console.log('setPresale Successful \n')

    console.log('Interacting with aABI to pushPolicy address to: ' + guardian.address)
    await aabi.pushPolicy(guardian.address)
    console.log('pushPolicy Successful \n')

    console.log('----------------------------------------------------------------------------------')
    console.log( "AbachiAuthority: " + abachiAuthority.address);
    console.log( "aAbachi: " + aabi.address);
    console.log( "Abachi: " + abi.address);
    console.log( "PresaleAbachi: " + presaleAbachi.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})
