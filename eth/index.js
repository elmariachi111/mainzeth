//const Trie = require('merkle-patricia-tree/secure');
const Trie = require('merkle-patricia-tree').SecureTrie
const levelup = require('levelup');
const leveldown = require('leveldown');
const RLP = require('rlp');
const Account = require('ethereumjs-account');
const EthUtils = require('ethereumjs-util');

const Web3 = require('web3')

const web3 = new Web3("http://localhost:7545")

const db = levelup(leveldown('.ganache'));
//0xe2d04a28dc6ca3907081b18ac795473c43cea735c0e0e2c4495f2c304b36eb9a

const initTrie = async (blockNumber) => {    
    const block = await web3.eth.getBlock(blockNumber);
    const stateRoot = EthUtils.toBuffer(block.stateRoot);
    console.log("State Root", stateRoot);
    const trie = new Trie(db, stateRoot);
    return trie;
}

async function run() {
    
    const block = process.argv[2] || 0;
    
    const trie = await initTrie(block)
    
    const address = EthUtils.toBuffer((process.argv[3] || "0x8Dccb0559a7c33e9e612537840600dAaaEFE18A9").toLowerCase());
    console.log("Address", address)
    const raw = await trie.get(address)

    console.log(raw);

    /*const account = new Account(raw)
    console.log('Account Address: ' + address);
    console.log('Balance: ' + (Web3.utils.BN(account.balance)).toString());*/
}

run();

/*
//Adding the "stateRoot" value from the block so that we can inspect the state root at that block height.
var root = '0x8c77785e3e9171715dd34117b047dffe44575c32ede59bde39fbf5dc074f2976';

//Creating a trie object of the merkle-patricia-tree library
var trie = new Trie(db, root);

//Creating a nodejs stream object so that we can access the data
var stream = trie.createReadStream()

//Turning on the stream (because the node js stream is set to pause by default)
stream.on('data', function (data){
  //printing out the keys of the "state trie"
  console.log(data.key);
});
*/