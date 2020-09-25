const {web3, estateContract, accounts} = require('./lib')

const allow = async (from, tokenId) => {
    const meth = estateContract.methods.allow(
        tokenId
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
const transfer = async (from, to, tokenId ) => {

    const allowance = await allow(from, tokenId);
    if (!allowance)
        return;
        
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
    const acc_f = process.argv[2] || 0
    const acc_t = process.argv[3] || 1
    const tokenId = process.argv[4]

    const from = accounts[Object.keys(accounts)[acc_f]]
    const to = accounts[Object.keys(accounts)[acc_t]]

    const b = await transfer(from, to, tokenId);
    console.log(b)
    web3.currentProvider.connection.close()
})()