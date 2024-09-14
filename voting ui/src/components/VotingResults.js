import React from "react";
import "./VotingResults.css";

const VotingResults = ({
  hasVotes,
  isTie,
  candidateIndex,
  voteCount,
  candidates,
}) => {
  return (
    <div className="voting-results">
      {hasVotes ? (
        isTie ? (
          <p>It's a tie with {voteCount} votes each!</p>
        ) : (
          <p>
            {candidates[candidateIndex].name} wins with {voteCount} votes!
          </p>
        )
      ) : (
        <p>No votes have been cast.</p>
      )}
    </div>
  );
};

export default VotingResults;
