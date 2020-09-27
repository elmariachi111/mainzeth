const {estateContract, accounts, web3} = require('./lib')
const OwnerTokenAbi = require('./build/contracts/OwnerToken.json'); 

const tokenMeta = async(account, index) => {
    const tokenId = await estateContract.methods.tokenOfOwnerByIndex(account.address, index).call({
        from: account.address,
    })
    const tokenUri = await estateContract.methods.tokenURI(tokenId).call({
        from: account.address
    })
    const ownerTokenAddr = await estateContract.methods.getOwnerTokenAddress(tokenId).call()

    const ownerTokenContract = new web3.eth.Contract(OwnerTokenAbi.abi, ownerTokenAddr);
    const otBalance = await ownerTokenContract.methods.balanceOf(account.address).call();

    return {
        tokenId,
        tokenUri,
        ownerTokenAddress: ownerTokenAddr,
        otBalance
    }
}
const bal = async (account) => {
    const tokenBalance = await estateContract.methods.balanceOf(account.address).call({
        from: account.address,
    })

    const p = [];
    for (let i = tokenBalance; i--> 0;) {
        p.push(tokenMeta(account, i));
    }

    const res = await Promise.all(p);

    return {
        total: tokenBalance,
        tokens: res
    };
}

(async () => {

    try {
        const acc = process.argv[2] || 0
        const account = accounts[Object.keys(accounts)[acc]]
        console.log(account.address);
    
        const b = await bal(account);
        console.log("total", b.total);
        console.table(b.tokens)
    } finally {
        web3.currentProvider.connection.close()
    }
    
})()