const Web3 = require('web3')

const EstateContractAbi = require('./build/contracts/RealEstateToken.json');
const OwnerTokenAbi = require('./build/contracts/OwnerToken.json'); 

const localProvider = new Web3.providers.WebsocketProvider('http://localhost:7545')

const web3 = new Web3(localProvider)

const pk1 = "0xe4ef7ba7b4d6d594a81b274f602770eeea7cee2212bfc6720dd510ff50a5846a";
const pk2 = "0xe5b73a45214b92ae726bc431aa67dd9766a60a1c81415819cf903df2f2691a69";

const estateContractAddr = '0xeF5755E84b30282cf89f7EBdA432D1946Ff5453A';

//'0xD2d9981bD30ED863aFdcb7F7706B80343De29295';

//0x31313F8411C0861DBdaA6A810c0B285696ec27c1';

//0xc10Ed0d0f51e73e66542CBf8B4Ab23d0921bAAD2';
//'0x0deD98d62e1456F522f0a229d1262428732F11F6'

const account = web3.eth.accounts.privateKeyToAccount(pk1);
const account2 = web3.eth.accounts.privateKeyToAccount(pk2);
const estateContract = new web3.eth.Contract(EstateContractAbi.abi, estateContractAddr)

const allow = async (from, tokenId, amount) => {

    const ownerTokenAddr = await estateContract.methods.getOwnerTokenAddress(tokenId).call();
    const ownerTokenContract = new web3.eth.Contract(OwnerTokenAbi.abi, ownerTokenAddr);

    const amt = amount ? amount : await ownerTokenContract.methods.balanceOf(from.address).call();
    
    const meth = ownerTokenContract.methods.approve(
        estateContract.options.address,
        amt
    );
    const gas = await meth.estimateGas({
        from: from.address,
    })
    const res = await meth.send({
        from: from.address,
        gas
    })
    return res;

}

module.exports = {
    web3,
    accounts: {
        [account.address]: account,
        [account2.address]: account2
    },
    estateContract,
    allow
}