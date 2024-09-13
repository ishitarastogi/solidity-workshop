// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Mappings {
    mapping(address => bool) public hasVoted;

    // Function to set hasVoted to true
    function vote() public {
        hasVoted[msg.sender] = true;
    }
}
