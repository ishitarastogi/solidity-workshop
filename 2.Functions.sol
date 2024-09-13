// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Functions {
    uint256 number = 5;

    function store(uint _number) public {
        number = _number;
    }

    function get() public view returns (uint) {
        return number;
    }
}
