pragma solidity ^0.4.2;

contract Votes {
    
    struct Voter {
        uint voted;
        address delegate;
        uint weight;
    }

    struct Candidate {
        string name;
        uint vote;
    }

    mapping(address => Voter) voters;
    Candidate[] public candidates;
    address public owner;

    modifier restricted {
        if (msg.sender == owner) _;
    }

    function Votes(string[] candidateNames) {
        owner = msg.sender;
        for (i = 0; i < candidateNames.length; i++) {
            candidates[i].name = candidateNames[i];
            candidates[i].vote = 0;
        }
    }

    function public voting(string candidateName) {
        address memory voter = msg.sender;
        voters[voter].voted = 1;
        
    }

    function public whoWin() constant returns (string candidateName) restricted {
        string winner;
        uint nbrVote = 0;

        for (i = 0; i < candidates.length; i++) {
            if (candidates[i].vote > nbrVote) {
                nbrVote = candidates[i].vote;
                winner = candidates[i].name;
            }
        }
        selfdestruct(owner);
        return winner;
    }
}