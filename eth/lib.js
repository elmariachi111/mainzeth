const Web3 = require('web3')

const EstateContractAbi = require('./build/contracts/RealEstateToken.json');

const localProvider = new Web3.providers.WebsocketProvider('http://localhost:7545')

const web3 = new Web3(localProvider)

const pk1 = "0xe4ef7ba7b4d6d594a81b274f602770eeea7cee2212bfc6720dd510ff50a5846a";
const pk2 = "0xe5b73a45214b92ae726bc431aa67dd9766a60a1c81415819cf903df2f2691a69";

const estateContractAddr = '0x0deD98d62e1456F522f0a229d1262428732F11F6'

const account = web3.eth.accounts.privateKeyToAccount(pk1);
const account2 = web3.eth.accounts.privateKeyToAccount(pk2);
const estateContract = new web3.eth.Contract(EstateContractAbi.abi, estateContractAddr)

module.exports = {
    web3,
    accounts: {
        [account.address]: account,
        [account2.address]: account2
    },
    estateContract
}