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

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Votes.setProvider(web3.currentProvider);
    Votes.deployed(["Etienne"], { from: "0x47767807CDd32d3Bf79558046e3F28135ffb6d62", gas:1000000}).then((votes) => {
      console.log(votes.address);
      //votes.whoWin().then((candidate) => { console.log(web3.toAscii(candidate.toString())); });
      //console.log(web3.fromAscii("Etienne"));
      votes.addCandidate(web3.fromAscii("Etienne"), {from: "0x47767807CDd32d3Bf79558046e3F28135ffb6d62"}).then(() => {
        console.log("tata");        
        votes.voting(web3.fromAscii("Etienne"), {from: "0x47767807CDd32d3Bf79558046e3F28135ffb6d62", gas: 1000000}).then(() => {
          votes.whoWin({from: "0x47767807CDd32d3Bf79558046e3F28135ffb6d62", gas: 1000000}).then((candidateName) => {
            console.log(web3.toAscii(candidateName));
          });
          console.log("tata");
        })
       });
    });
    // Get the initial account balance so it can be displayed.
  
  },
};

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
