// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.7.5;

import "./IAbachiAuthority.sol";

abstract contract AbachiAccessControlled {

    /* ========== EVENTS ========== */

    event AuthorityUpdated(IAbachiAuthority indexed authority);

    string UNAUTHORIZED = "UNAUTHORIZED"; // save gas

    /* ========== STATE VARIABLES ========== */

    IAbachiAuthority public authority;


    /* ========== Constructor ========== */

    constructor(IAbachiAuthority _authority) {
        authority = _authority;
        emit AuthorityUpdated(_authority);
    }
    

    /* ========== MODIFIERS ========== */
    
    modifier onlyGovernor() {
        require(msg.sender == authority.governor(), UNAUTHORIZED);
        _;
    }
    
    modifier onlyGuardian() {
        require(msg.sender == authority.guardian(), UNAUTHORIZED);
        _;
    }
    
    modifier onlyPolicy() {
        require(msg.sender == authority.policy(), UNAUTHORIZED);
        _;
    }

    modifier onlyVault() {
        require(msg.sender == authority.vault(), UNAUTHORIZED);
        _;
    }
    
    /* ========== GOV ONLY ========== */
    
    function setAuthority(IAbachiAuthority _newAuthority) external onlyGovernor {
        authority = _newAuthority;
        emit AuthorityUpdated(_newAuthority);
    }
}