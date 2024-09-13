// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract storages {
    uint[] numbers;
    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate public candidates = Candidate("Alice", 10);
    // Array of candidates
    //     Candidate[] public candidates;

    // function add_person(string memory _name, uint256 _count) public {
    //     candidates.push(Candidate(_name, _count ));
    // }
}
