const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const express = require('express')

async function startupDbs(nodeId, address) {
    const swarmPort = 4000 + nodeId;
    const apiPort = 5000 + nodeId;
    const ipfs = await IPFS.create({
        repo: `.ipfs-${nodeId}`,
        config: {
            "Addresses": {
                "Swarm": [
                  `/ip4/0.0.0.0/tcp/${swarmPort}`,
                ],
                "API": `/ip4/127.0.0.1/tcp/${apiPort}`,
              }
        }
    })
    
    const instance =  await OrbitDB.createInstance(ipfs, { directory: `./.orbitdb-${nodeId}` })
    
    const accessController = {
        type: 'orbitdb',
    }
    if (nodeId === 1) {
        accessController.write = [instance.identity.id]
    }

    const db = await instance.keyvalue(address, {
        accessController
    })

    db.events.on('replicated', () => {
        console.log("replicated")
    })

    await db.load()

    console.debug("address", db.address.toString());
    console.debug("identity", db.identity.toJSON());

    return db;
}

function initApp() {
    const app = express()
    app.use(express.json()) // for parsing application/json
    //app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    return app;
}
async function start(nodeId, address) {

    const orbitDb = await startupDbs(nodeId, address);
    const port = process.env.PORT || 3000 + nodeId

    const app = initApp();
    
    app.get('/', (req, res) => {
        res.json({
            server: nodeId,
            dbAddress: orbitDb.address.toString(),
            identity: orbitDb.identity.toJSON()
        })
    })

    app.post('/grant/:publickey', async (req, res) => {
        try {
            await orbitDb.access.grant('write', req.params.publickey) 
            res.json({granted: req.params.publickey})    
        } catch (e) {
            res.status(500).json({
                error: e.message
            })
        }
    })

    app.get('/store/:key', (req, res) => {
        const value = orbitDb.get(req.params.key)
        res.json(value)
    })

    app.post('/store/:key', async (req, res) => {
        try {
            await orbitDb.put(req.params.key, req.body, { pin: true })
            res.json(req.body)
        } catch (e) {
            console.log(e.message);
            res.status(500).json({error: e.message})
        }
    })

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}

console.log();

const nodeId = process.argv[2] ? parseInt(process.argv[2]) : 1
const address = process.argv[3] || "mainz-db"

start(nodeId, address);