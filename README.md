# Abachi Smart Contracts

## Table of Contents
- [Required Tools](#required-tools)
- [Getting Started](#getting-started)
- [Contracts](#contracts)
- [Contribution](#contribution)


## Required Tools
* Node v14
* Git

## Getting Started

#### Setup
```
git clone https://github.com/abachi-io/abachi-presale-contracts.git

cd abachiContracts

npm i

cp .env.example .env
```

* Edit `.env` file
* Edit scripts/deployAll.js and fill out `//required` addresses

#### Compile Contracts

`npx hardhat compile`

#### Deploy

`npx hardhat run scripts/deployAll.js --network [NETWORK]`

#### Verify Contracts on Etherscan/Polyscan (optional)

`npx hardhat verify --network [NETWORK] [CONTRACT ADDRESS] [CONSTRUCTOR PARAM 1] [CONSTRUCTOR PARAM 2]`


## Contracts

#### Matic Mainnet (Polygon)

|       Contract    | Address |
|     ------------- | ------------- |
| AbachiAuthority   | TBA  |
| Abachi            | TBA  |
| aAbachi           | TBA  |
| presaleAbachi     | TBA  |

#### Matic Testnet (Mumbai)

|       Contract    | Address |
|     ------------- | ------------- |
| AbachiAuthority   | [0x66E67C8222309b5751201DB135fa67F09b2dbB63](https://mumbai.polygonscan.com/address/0x66E67C8222309b5751201DB135fa67F09b2dbB63)  |
| Abachi            | [0x60aB0c3967aF21328fAeD1d424b7A78BfbcF76f3](https://mumbai.polygonscan.com/address/0x60aB0c3967aF21328fAeD1d424b7A78BfbcF76f3)  |
| aAbachi           | [0xCb51312312D642844500c35df6890488b7626df6](https://mumbai.polygonscan.com/address/0xCb51312312D642844500c35df6890488b7626df6)  |
| presaleAbachi     | [0x89C5BF08342543Ef2514147a080B781A93dCD4bb](https://mumbai.polygonscan.com/address/0x89C5BF08342543Ef2514147a080B781A93dCD4bb)  |

## Contribution

Thank you for considering to help out with the source code! We welcome contributions from anyone on the internet, and are grateful for even the smallest of fixes!

If you'd like to contribute to Abachi, please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base.

Please make sure your contributions adhere to our coding guidelines:

* Pull requests need to be based on and opened against the master branch.
* Pull request should have a detailed explanation about the enhancement or fix
* Commit messages should be prefixed with the file they modify.

Please see the [First Contributer's Guide](documentation/CONTRIBUTE.md) for more details on how to configure your git environment.
