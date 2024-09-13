// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structure to hold the details of a candidate
    struct Candidate {
        string name;
        uint voteCount;
    }

    // Array of candidates
    Candidate[] public candidates;

    // Mapping to keep track of who has voted
    mapping(address => bool) public hasVoted;

    // Address of the contract owner
    address public owner;

    // Constructor to initialize the candidates
    constructor(string[] memory candidateNames) {
        owner = msg.sender; // Owner of the contract is the one who deploys it
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
        }
    }

    // Modifier to allow only the owner to execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // Function to vote for a candidate
    function vote(uint candidateIndex) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(candidateIndex < candidates.length, "Invalid candidate index.");

        hasVoted[msg.sender] = true; // Mark the sender as having voted
        candidates[candidateIndex].voteCount += 1; // Increment the vote count for the chosen candidate
    }

    // Function to get the result with no vote, tie, and winner handling
    function getResult()
        public
        view
        returns (bool hasVotes, bool isTie, uint candidateIndex, uint voteCount)
    {
        uint highestVoteCount = 0;
        uint winnerCount = 0;
        uint winningCandidate = 0;

        // No need to redeclare `hasVotes` here, it's already a return variable

        // Loop through all the candidates to find the highest vote count and check if any votes were cast
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > 0) {
                hasVotes = true; // At least one vote has been cast
            }

            if (candidates[i].voteCount > highestVoteCount) {
                highestVoteCount = candidates[i].voteCount;
                winnerCount = 1; // Reset winner count since we found a new highest vote
                winningCandidate = i; // Store the index of the candidate with the highest vote
            } else if (candidates[i].voteCount == highestVoteCount) {
                winnerCount += 1; // Another candidate has the same highest vote
            }
        }

        // If no votes have been cast, return that no votes were made
        if (!hasVotes) {
            return (false, false, 0, 0); // No votes cast
        }

        // If there is more than one candidate with the highest vote count, it's a tie
        if (winnerCount > 1) {
            return (true, true, 0, highestVoteCount); // It's a tie, return the highest vote count
        }

        // Return the candidate with the highest votes and the vote count
        return (true, false, winningCandidate, highestVoteCount); // Return the winner and vote count
    }

    // Function to get the total number of candidates
    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }

    // Function to get candidate details by index
    function getCandidate(
        uint index
    ) public view returns (string memory, uint) {
        require(index < candidates.length, "Invalid candidate index.");
        return (candidates[index].name, candidates[index].voteCount);
    }
}
