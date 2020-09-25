const {estateContract} = require('./lib');


const emitter = estateContract.events.Transfer();

emitter.on("data", (evt) => {
    console.log("%s: %s => %s",
        evt.returnValues.tokenId, 
        evt.returnValues.from, 
        evt.returnValues.to
    )
})

//while(true);
