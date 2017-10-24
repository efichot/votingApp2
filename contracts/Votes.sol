pragma solidity ^0.4.2;

contract Votes {
    
    struct Voter {
        uint voted;
        address delegate;
        uint weight;
    }

     struct Candidate {
        bytes32 name;
        uint vote;
    }

    mapping(address => Voter) voters;
    Candidate[] public candidates;
    address public owner;

    function Votes(bytes32[] candidateNames) {
        owner = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates[i].name = candidateNames[i];
            candidates[i].vote = 0;
        }
    }

    function voting(bytes32 candidateName) public {
        address voter = msg.sender;
        if (voters[voter].voted == 0) voters[voter].voted = 1;
        else throw;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].name == candidateName) {
                candidates[i].vote++;
            }
        }
    }

    function whoWin() public constant returns (bytes32 candidateName) {
        if (msg.sender != owner) throw;
        bytes32 winner;
        uint nbrVote = 0;
        winner = "ee";
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].vote > nbrVote) {
                nbrVote = candidates[i].vote;
                winner = candidates[i].name;
            }
        }
        //selfdestruct(owner);
        return winner;
    }
}