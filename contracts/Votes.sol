pragma solidity ^0.4.2;

contract Votes {
    
    struct Voter {
        uint voted;
        bytes32 name;
        bytes32 surname;
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

    function Votes(bytes32[] candidatesName) {
        owner = msg.sender;
        for (uint i = 0; i < candidatesName.length; i++) {
                candidates.push(Candidate({
                    name: candidatesName[i],
                    vote: 0
                }));
            }
    }

    function voting(bytes32 candidateName) public {
        address voter = msg.sender;
        require(voters[voter].voted == 0);
        if (voters[voter].voted == 0) voters[voter].voted = 1;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].name == candidateName) {
                candidates[i].vote++;
            }
        }
    }

    function whoWin() public constant returns (bytes32 candidateName) {
        require(msg.sender == owner);
        bytes32 winner;
        uint nbrVote = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].vote > nbrVote) {
                nbrVote = candidates[i].vote;
                winner = candidates[i].name;
            }
        }
        //selfdestruct(owner);
        return winner;
    }
    
    function addCandidate(bytes32 candidateName) public {
        require(msg.sender == owner);
        candidates.push(Candidate({
            name: candidateName,
            vote: 0
            }));
    }

}