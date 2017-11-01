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

function populateTr(name, i, votes) {
  votes.candidates(i).then(candidate => {
    //console.log(votes.voters);
    votes.voters(web3.eth.accounts[0]).then((voter) => {
      //console.log("test1");
      let vote = candidate[1].toString() || '0';
      let tr = `<tr><td>${name}</td><td class='hidden'>${vote}</td><td><button class='${i} voting'>Vote</button></td></tr>`;    
      $("tbody").append(tr);
      if (voter[0]['c'][0] != 0 && voter[0]['c'][0] - 1 != i) {
        // console.log(voter);
        // console.log(voter[0]);
        // console.log(voter[0]['c'][0]);
        // console.log(i);
        $(`.${i}`).attr('disabled', true);
      }
      votes.owner({ from: web3.eth.accounts[0], gas: 1000000 }).then((owner1) => {
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
  })
}

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Votes.setProvider(web3.currentProvider);
    let address = "0xcb5a7d708e044f747674e5d2446bc38e64b7e9fb";

    //Votes.new(["etienne", "tim"], { from: web3.eth.accounts[0], gas:1000000 }); // deployed contract

    Votes.at(address).then((votes) => {
      votes.nbCandidate().then((nb) => {
        for (let i=0;i < nb; i++) {
          votes.candidates(i).then((candidate) => {
            let name = web3.toAscii(candidate[0]);
            populateTr(name, i, votes);
            $(`.${i}`).click((e) => {
              $('.voting').attr('disabled', true);              
              votes.voting(web3.toAscii(candidate[0]), { from: web3.eth.accounts[0], gas: 1000000 }).then(() => {
              });
            });
          });
        }
 
        votes.owner({ from: web3.eth.accounts[0], gas: 1000000 }).then((owner1) => {
          let owner = owner1;
          if (web3.eth.accounts[0] === owner) {
            $(".hidden").removeClass("hidden");
          }
        });
      })

      $("#addCandidate").click((e) => {
        let value = $("#newCandidate")[0].value;
        votes.addCandidate(web3.fromAscii(value), { from: web3.eth.accounts[0], gas: 1000000 }).then(() => {
          votes.nbCandidate().then((nb) => {
            populateTr(value, parseInt(nb, 10) - 1, votes); 
          });
        });
      });
      $("#whoWin").click((e) => {
        votes.whoWin({ from: web3.eth.accounts[0], gas: 1000000 }).then((candidate) => {
          console.log(web3.toAscii(candidate));
          $('.winner').html(web3.toAscii(candidate));
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
