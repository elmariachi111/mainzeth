const {web3, estateContract, accounts, allow} = require('./lib')

const transfer = async (from, to, tokenId) => {

    const allowance = await allow(from, tokenId);
    if (!allowance)
        throw new Error("not allowed");
    
    const meth = estateContract.methods.safeTransferFrom(
        from.address, to.address, tokenId
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

    const from = accounts[Object.keys(accounts)[acc_from]]
    const to = accounts[Object.keys(accounts)[acc_to]]
    try {
        const b = await transfer(from, to, tokenId);
        console.log(b)
    }
    catch(e) {
        console.error(e);
    } finally {
        web3.currentProvider.connection.close()
    }
})()