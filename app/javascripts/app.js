// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/Votes.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Votes = contract(metacoin_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

let nbVotes = 0;
let voteLog = [0];

function populateTr(name, i, votes) {
  votes.candidates(i)
  .then(candidate => { votes.nbCandidate()
    .then(nb => { votes.voters(web3.eth.accounts[0])
      .then((voter) => {
        let vote = candidate[1].toString() || '0';
        voteLog[i] = parseInt(vote, 10);
        let tr = '';
        let classe = '';
        if (candidate[2].toString() == web3.eth.accounts[0].toString()) {
          classe = 'myCandidate';
          $('.classCandidate').attr('hidden', true);
        }
        tr = `<tr><td class = ${classe}>${name}</td><td class='hidden'>${vote}</td><td><button class='${i} voting'>Vote</button></td></tr>`;
        $("tbody").append(tr);
        if (voter.toString() != '0' && parseInt(voter.toString(), 10) - 1 != i) {
          $(`.${i}`).attr('disabled', true);
        }
        votes.owner({ from: web3.eth.accounts[0], gas: 1000000 })
        .then((owner1) => {
          let owner = owner1;
          if (web3.eth.accounts[0] === owner) {
           $(".hidden").removeClass("hidden");
          }
        });
        $(`.${i}`).click((e) => {
          votes.voting(web3.toAscii(candidate[0]), { from: web3.eth.accounts[0], gas: 1000000 }).then(() => {
          });
        });
      });
      nbVotes = parseInt(nbVotes, 10) + parseInt(candidate[1], 10);
      $(".nbVotes").html(nbVotes + " person have voted.");
    })
  })
}

window.App = {
  start: function() {
    var self = this;

    Votes.setProvider(web3.currentProvider);
    let address = "0x60c35208b8d0c840e9ae60aa06e4e3e63f0a3c4f";

    //Votes.new({ from: web3.eth.accounts[0], gas:1000000 }); // deployed contract


    //fill the table with current candidates
    //we loop through the candidate 
    Votes.at(address)
    .then((votes) => { votes.nbCandidate().then((nb) => {
        for (let i=0;i < nb; i++) {
          votes.candidates(i)
          .then((candidate) => {
            let name = web3.toAscii(candidate[0]);
            populateTr(name, i, votes);
            $(`.${i}`).click((e) => {
              $('.voting').attr('disabled', true); //il faudrait tout disabled sauf le i          
              votes.voting(web3.toAscii(candidate[0]), { from: web3.eth.accounts[0], gas: 1000000 }).then(() => {
              });
            });
          });
        }
    
        votes.owner({ from: web3.eth.accounts[0], gas: 1000000 })
        .then((owner1) => {
          let owner = owner1;
          if (web3.eth.accounts[0] === owner) {
            $(".hidden").removeClass("hidden");
          }
        });
      })

      //check if the user doens't already add a candidate and if the candidate's name isn't already taken.
      //we loop through all candidate and y++ if the candidate is different from the candidate the user want to add.
      //if y == nb (current nb of candidate) means the candidate the user wants to add has a unique name and is the first add of the user.
      //then we add the candidate.
      $("#addCandidate").click((e) => {
        let value = $("#newCandidate")[0].value;
        let y = 0;
        votes.nbCandidate()
        .then((nb) => {
          for (let i = 0; i < nb; i++) {
            votes.candidates(i)
            .then((candidate) => {
              if (web3.toAscii(candidate[0]) != value && candidate[2].toString() != web3.eth.accounts[0].toString()) {
                y++;
              }
              if (i == nb - 1 && y == nb) { //add meme si meme nom qu'un autre candidat, "web3.toAscii(candidate[0]) !== value" ne marche pas
                votes.addCandidate(web3.fromAscii(value), { from: web3.eth.accounts[0], gas: 1000000 })
                .then(() => {
                  populateTr(value, parseInt(nb, 10) - 1, votes);
                })
              } else if (i == nb - 1 && y != nb) {
                $(".error").html("You can't add a new candidate. Check if you haven't already add your project or if the project's name isn't already taken.");
              }
            });
          }

          if (nb == 0) {
            votes.addCandidate(web3.fromAscii(value), { from: web3.eth.accounts[0], gas: 1000000 })
            .then(() => {
              populateTr(value, parseInt(nb, 10), votes);
            })
          }
        });
      });


      //if you added a candidate, check if you have the most votes -> winning, tied for the first place or losing.
      //we loop through all candidate and use a dummy variable (x) to parse the votes.
      //we use voteLog, filled in "populateTr" with the current votes.
      $("#whatPosition").click((e) => {
        votes.nbCandidate()
        .then((nb) => {
          let userVote = -1;
          for (let j = 0; j < nb; j++) {
            votes.candidates(j)
            .then((candidate_j) => {
              let x = 0;
              if (candidate_j[2].toString() == web3.eth.accounts[0].toString()) {
                userVote = parseInt(candidate_j[1].toString(), 10);
                for (let k = 0; k < nb; k++) {
                  let tmpVote = voteLog[k];
                  if (j != k && x != -1 && userVote == tmpVote) {
                    x++;
                  } else if (j != k && x != -1 && userVote < tmpVote) {
                    x = -1;
                  }
                }
                if (x == -1) {
                  $(".position").html("You are currently losing the vote.");
                } else if (x == 0) {
                  $(".position").html("You are currently winning the vote.");
                } else {
                  $(".position").html("You are currently tied for the first place with " + x + " other project."); 
                }
              }
              if (userVote == -1) { //sinon hidden le button
                $(".position").html("You don't have any candidates.");
              }
            });
          }
        });
      });

      //only the owner can check who wins. Close the election ?
      $("#whoWin").click((e) => {
        votes.whoWin({ from: web3.eth.accounts[0], gas: 1000000 })
        .then((candidate) => {
          $('.winner').html(web3.toAscii(candidate));
          //self destruct /  arret de l'election ?
        });
      });
    });
  },
}


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
