pragma solidity ^0.4.2;

contract Votes {
    
    struct Voter {
        uint voted;
    }

     struct Candidate {
        bytes32 name;
        uint vote;
        address owner;
    }

    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    address public owner;
    uint public nbCandidate;

    function Votes(bytes32[] candidatesName) {
        owner = msg.sender;
        for (uint i = 0; i < candidatesName.length; i++) {
            nbCandidate++;
                candidates.push(Candidate({
                    name: candidatesName[i],
                    vote: 0,
                    owner: 0
                }));
            }
    }

    function voting(bytes32 candidateName) public {
        address voter = msg.sender;
        if (voters[voter].voted != 0) {
            candidates[voters[voter].voted - 1].vote--;
            voters[voter].voted = 0;
        } else {
            for (uint i = 0; i < candidates.length; i++) {
                if (candidates[i].name == candidateName) {
                    candidates[i].vote++;
                    voters[voter].voted = i + 1;
                }
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
        //require(msg.sender == owner);
        for (uint i = 0; i < candidates.length; i++) {
            require(candidates[i].owner != msg.sender);
            require(candidates[i].name != candidateName);
        }
        nbCandidate++;
        candidates.push(Candidate({
            name: candidateName,
            vote: 0,
            owner: msg.sender
            }));
    }

}