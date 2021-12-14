// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./ERC20Permit.sol";

import "./Policy.sol";

contract PresaleOwned is Policy {
  using SafeMath for uint256;
  address internal _presale;

  function setPresale( address presale_ ) external onlyPolicy() returns ( bool ) {
    _presale = presale_;
    return true;
  }

  /**
   * @dev Returns the address of the current vault.
   */
  function presale() public view returns (address) {
    return _presale;
  }

  /**
   * @dev Throws if called by any account other than the vault.
   */
  modifier onlyPresale() {
    require( _presale == msg.sender, "PresaleOwned: caller is not the Presale" );
    _;
  }

}

contract aAbachi is ERC20Permit, PresaleOwned {

  using SafeMath for uint256;

    address public owner = msg.sender;
    bool public hasMintedAuction = false;
    uint256 public auctionMintAmount = 142500 * 10**9;
    uint256 public maxMint = 192500 * 10**9;

    constructor()
    ERC20("Alpha Abachi", "aABI", 9)
    ERC20Permit("Alpha Abachi"){}


    modifier onlyOwner() {
       require(owner == msg.sender, "Not allowed");
      _;
    }

    function mint(address account_, uint256 amount_) external onlyPresale() {
        require(totalSupply().add(amount_) < maxMint, 'Exceeds maximum allowed tokens to be minted');
        _mint(account_, amount_);
    }

    function mintAuction() external onlyOwner {
        require(!hasMintedAuction, 'Already minted');
        require(totalSupply().add(auctionMintAmount) < maxMint, 'Exceeds maximum allowed tokens to be minted');
        hasMintedAuction = true;
        _mint(owner, auctionMintAmount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual {
        _burn(msg.sender, amount);
    }

    /*
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */

    function burnFrom(address account_, uint256 amount_) public virtual {
        _burnFrom(account_, amount_);
    }

    function _burnFrom(address account_, uint256 amount_) public virtual {
        uint256 decreasedAllowance_ =
            allowance(account_, msg.sender).sub(
                amount_,
                "ERC20: burn amount exceeds allowance"
            );

        _approve(account_, msg.sender, decreasedAllowance_);
        _burn(account_, amount_);
    }
}
