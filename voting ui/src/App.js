import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import CandidateCard from "./components/CandidateCard";
import VotingResults from "./components/VotingResults";

// Contract ABI
const contractABI = [
  {
    inputs: [
      {
        internalType: "string[]",
        name: "candidateNames",
        type: "string[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "candidateIndex",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getCandidate",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCandidateCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getResult",
    outputs: [
      {
        internalType: "bool",
        name: "hasVotes",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isTie",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "candidateIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Contract Address (Change it to your deployed contract address)
const contractAddress = "0xd76A3D41fB8768B13742637DD722a73FE2496cd8";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votingResult, setVotingResult] = useState(null);
  const [userVoted, setUserVoted] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          const votingContract = new ethers.Contract(
            contractAddress,
            contractABI,
            web3Signer
          );

          setProvider(web3Provider);
          setSigner(web3Signer);
          setContract(votingContract);

          // Load candidates
          const candidateCount = await votingContract.getCandidateCount();
          let candidatesData = [];
          for (let i = 0; i < candidateCount; i++) {
            const candidate = await votingContract.getCandidate(i);
            candidatesData.push({
              name: candidate[0],
              voteCount: candidate[1].toString(),
              index: i,
            });
          }
          setCandidates(candidatesData);
        } catch (err) {
          console.error("Failed to connect with Ethereum:", err);
        }
      }
    };

    init();
  }, []);

  const vote = async (index) => {
    if (contract) {
      try {
        const hasVoted = await contract.hasVoted(signer.getAddress());
        if (hasVoted) {
          alert("You have already voted.");
          return;
        }

        const tx = await contract.vote(index, { gasLimit: 300000 }); // Explicit gas limit
        await tx.wait();
        setUserVoted(true);
        alert("You have successfully voted!");
      } catch (error) {
        console.error("Full error object:", error); // Log full error object
        alert("Error during voting.");
      }
    }
  };

  const getResults = async () => {
    if (contract) {
      try {
        // Fetch result from the contract
        const result = await contract.getResult();

        // Extract values explicitly from the result proxy
        const hasVotes = result[0];
        const isTie = result[1];
        const candidateIndex = Number(result[2]);
        const voteCount = Number(result[3]); // Convert big number to a regular number

        // Debugging to check the correct values
        console.log("Has Votes:", hasVotes);
        console.log("Is Tie:", isTie);
        console.log("Candidate Index:", candidateIndex);
        console.log("Vote Count:", voteCount);

        // Update the votingResult state with the extracted values
        setVotingResult({
          hasVotes,
          isTie,
          candidateIndex,
          voteCount,
        });
      } catch (error) {
        console.error("Error retrieving results:", error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Voting System</h1>
        <p>Cast your vote for your favorite candidate.</p>
        <p>Contract Address: {contractAddress}</p>{" "}
        {/* Display contract address */}
      </header>

      <div className="candidates-section">
        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <CandidateCard
              key={index}
              name={candidate.name}
              voteCount={candidate.voteCount}
              onVote={() => vote(candidate.index)}
              hasVoted={userVoted}
            />
          ))
        ) : (
          <p>Loading candidates...</p>
        )}
      </div>

      <button className="result-button" onClick={getResults}>
        Get Voting Results
      </button>

      {votingResult && (
        <VotingResults
          hasVotes={votingResult.hasVotes}
          isTie={votingResult.isTie}
          candidateIndex={votingResult.candidateIndex}
          voteCount={votingResult.voteCount} // Ensure voteCount is passed
          candidates={candidates}
        />
      )}
    </div>
  );
}

export default App;
