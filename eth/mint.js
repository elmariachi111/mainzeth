const {web, estateContract, accounts} = require('./lib')

const mintNewEstate = async (account, name) => {

    const meth = estateContract.methods.mintEstate(
        account.address, name
    );

    const gas = await meth.estimateGas({
        from: account.address,
    })
    
    const res = await meth.send({
        from: account.address,
        gas
    })
    return res;
}

(async () => {
    const acc = process.argv[2] || 0
    const account = accounts[Object.keys(accounts)[acc]]
    const name = process.argv[3]
    const b = await mintNewEstate(account, name);
    console.log(b)
})()