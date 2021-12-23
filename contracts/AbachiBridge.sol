// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./SafeMath.sol";
import "./IERC20.sol";
import "./Ownable.sol";
import "./Address.sol";

/**
 * @notice This contract handles the 1:1 swap of the aABI ERC20 token for the ABI ERC20 token.
 *         The aABI tokens transfered in this contract cannot be transfered out.
 */
contract AbachiBridge is Ownable {
    using SafeMath for uint256;
    using Address for address;
    IERC20 public aABI;
    IERC20 public ABI;
    bool public paused = false;

    /**
     * @param _aABI Address of aABI ERC20 contract.
     * @param _ABI Address of ABI ERC20 contract.
     */
    constructor(address _aABI, address _ABI) {
        require(_aABI != address(0) && _aABI.isContract(), "Invalid aABI address");
        require(_ABI != address(0) && _ABI.isContract(), "Invalid ABI address");
        aABI = IERC20(_aABI);
        ABI = IERC20(_ABI);
    }

    /**
     * @notice Pauses swapping, preventing any further calls to swap() from succeeding until
     *         unpause() is called.
     */
    function pause() external onlyOwner {
        require(!paused, "Bridge already already paused");
        paused = true;
    }

    /**
     * @notice Unpauses swapping if it was paused previously.
     */
    function unpause() external onlyOwner {
        require(paused, "Bridge is not paused");
        paused = false;
    }

    /**
     * @notice Swaps all the aABI held by the caller to ABI.
     *         Emits Swap event if the swap is successful.
     */
    function swap() external {
        _swapFor(msg.sender, aABI.balanceOf(msg.sender));
    }

    /**
     * @notice Deducts some aABI from the caller and transfers the corresponding amount of ABI to the another account.
     * @param _recipient Account that will receive the ABI tokens.
     * @param _amount Amount of aABI tokens to swap.
     */
    function swapFor(address _recipient, uint256 _amount) external {
        _swapFor(_recipient, _amount);
    }

    /**
     * @notice Transfers some ABI from the contract to another account.
     * @param _recipient Account that will receive the ABI tokens.
     * @param _amount Amount of ABI tokens to transfer.
     */
    function withdrawTo(address _recipient, uint256 _amount) external onlyOwner {
        require(ABI.transfer(_recipient, _amount), "Failed to transfer ABI");
    }

    function _swapFor(address _recipient, uint256 _amount) private {
        require(!paused, "Bridge is paused");
        require(_amount > 0, "Invalid aABI amount");

        require(
            aABI.transferFrom(msg.sender, address(this), _amount),
            "Failed to transfer aABI"
        );

        require(ABI.transfer(_recipient, _amount), "Failed to transfer ABI");
    }
}
