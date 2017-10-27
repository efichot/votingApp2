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

function populateTr(name, i) {
  let vote = 0;
  let tr = `<tr><td>${name}</td><td class='hidden'>${vote}</td><td><button class='${i} voting'>Vote</button></td></tr>`;
  $("tbody").append(tr);
}

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Votes.setProvider(web3.currentProvider);
    let address = "0xe36100480b0cd690009fc10df5afd42644e9472c";

    Votes.at(address).then((votes) => {

      console.log("e");
      //console.log(web3.toAscii(votes.candidates().name));
      votes.nbCandidate().then((nb) => {
        for (let i=0;i < nb; i++) {
          console.log("kek");  
          votes.candidates(i).then((candidate) => {
            console.log("f");
            let name = web3.toAscii(candidate[0]);
            populateTr(name, i);
            
          }); 

          votes.owner().then((owner1) => {
            let owner = owner1;
            if (web3.eth.accounts[0] === owner) {
              $(".hidden").removeClass("hidden");
            }
          });
          
          
        }
        
      })
     
      
     
      $("#addCandidate").click((e) => {
        let value = $("#newCandidate")[0].value;
        votes.addCandidate(web3.fromAscii(value), { from: web3.eth.accounts[0], gas: 1000000 }).then(() => {
          votes.nbCandidate().then((nb) => {
            populateTr(value, nb - 1);         
          });

          votes.owner().then((owner1) => {
            let owner = owner1;
            if (web3.eth.accounts[0] === owner) {
              $(".hidden").removeClass("hidden");
            }
          });
        });
      });
      $("#whoWin").click((e) => {
        votes.whoWin({ from: web3.eth.accounts[0], gas: 1000000 }).then((candidate) => {
          console.log(web3.toAscii(candidate));
        });
      });
    

      
    });
      //console.log(typeof value);

    // Votes.at("0xffe9d99bfba995064d4dd4c66e0eff544c40018a").then((votes) => {
    //   console.log(votes.address);
    //   console.log(votes);
    //   //votes.whoWin().then((candidate) => { console.log(web3.toAscii(candidate.toString())); });
    //   //console.log(web3.fromAscii("Etienne"));
    //   votes.addCandidate(web3.fromAscii("toto"), {from: web3.eth.accounts[0], gas: 1000000}).then(() => {
    //     console.log("addCandidate");        
    //     votes.voting(web3.fromAscii("toto"), { from: web3.eth.accounts[3], gas: 1000000}).then(() => {
    //       console.log("voting");
    //       votes.whoWin({ from: web3.eth.accounts[0], gas: 1000000}).then((candidateName) => {
    //         console.log(web3.toAscii(candidateName));
    //       });
          
    //     })
    //    });
    //});
    // Get the initial account balance so it can be displayed.
 
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
