const {web3, estateContract, accounts, allow} = require('./lib')

const share = async (from, to, tokenId, amount) => {

    const allowance = await allow(from, tokenId, amount);
    if (!allowance)
        throw new Error("not allowed");
    
    const meth = estateContract.methods.share(
        to.address, amount, tokenId
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

(async () => {
    const acc_from = process.argv[2] || 0
    const acc_to = process.argv[3] || 1
    const tokenId = process.argv[4]
    const amount = process.argv[5]

    const from = accounts[Object.keys(accounts)[acc_from]]
    const to = accounts[Object.keys(accounts)[acc_to]]

    const b = await share(from, to, tokenId, amount);
    console.log(b)
    web3.currentProvider.connection.close()
})()