import React from "react";
import "./CandidateCard.css";

const CandidateCard = ({ name, voteCount, onVote, hasVoted }) => {
  return (
    <div className="candidate-card">
      <h2>{name}</h2>
      <p>Votes: {voteCount}</p> {/* Display the vote count */}
      <button onClick={onVote} disabled={hasVoted}>
        {hasVoted ? "Already Voted" : "Vote"}
      </button>
    </div>
  );
};

export default CandidateCard;
