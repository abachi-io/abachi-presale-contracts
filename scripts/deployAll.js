const { ethers } = require("hardhat");

const dai = { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'} // required
const daoTreasury = { address: '0x4f33Ff9A7910d04c7FC77563090ae106899988Aa'} // required

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account: ' + deployer.address);
    console.log('----------------------------------------------------------------------------------')

    const AABI = await ethers.getContractFactory('aAbachi');
    console.log('Deploying aAbachi.sol')
    const aabi = await AABI.deploy();
    console.log( "aAbachi: " + aabi.address + '\n');

    const PresaleAbachi = await ethers.getContractFactory('PresaleAbachi');
    console.log('Deploying PresaleAbachi.sol')
    const presaleAbachi = await PresaleAbachi.deploy(aabi.address, dai.address, daoTreasury.address);
    console.log( "PresaleAbachi: " + presaleAbachi.address + '\n');

    console.log('Interacting with aABI to setPresale address to: ' + presaleAbachi.address);
    await aabi.setPresale(presaleAbachi.address);
    console.log('setPresale() Successful \n');

    console.log('Interacting with aABI to pushPolicy address to: ' + guardian.address)
    await aabi.pushPolicy(guardian.address);
    console.log('pushPolicy() Successful \n');

    console.log('Interacting with aABI to MINT auction tokens to: ' + deployer.address);
    await aabi.mintAuction()
    console.log('mintAuction() Successful \n');


    console.log('----------------------------------------------------------------------------------')
    console.log( "aAbachi: " + aabi.address);
    console.log( "PresaleAbachi: " + presaleAbachi.address);
    console.log( "Dai: " + dai.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})
