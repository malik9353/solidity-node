const path = require('path');
const express = require('express');
const Tx = require("ethereumjs-tx");
const web3 = require('./utils/web3');
const TKUSD = require('./contracts/TKUSD');

let app = express();
let port = process.env.PORT || 3000;

app.get('/getMessage', async (req, res) => 
{
    if(!TKUSD) return res.json({status: false, msg: 'Contract is not deployed yet'});

    const name = await TKUSD.methods.name().call();
    const supply = await TKUSD.methods.supply().call();
    const symbol = await TKUSD.methods.symbol().call();
    const founder = await TKUSD.methods.founder().call();
    const totalSupply = await TKUSD.methods.totalSupply().call();
    const numberOfTX = await web3.eth.getTransactionCount(founder, "pending");
    const balanceOf = await TKUSD.methods.balanceOf('0xaE0443175518b16f927eEEfcDAfE0C02D23b2C99').call();
    return res.json({status: true, msg: 'Fetched message value from contract', data: {name, supply, symbol, founder, totalSupply, numberOfTX, balanceOf}});
});

app.get('/sendMoney', async (req, res)=>
{
    if(!TKUSD) return res.json({status: false, msg: 'Contract is not deployed yet'});
    let amount = 50;
    let address = '0xaE0443175518b16f927eEEfcDAfE0C02D23b2C99';
    let founder = await TKUSD.methods.founder().call();
    let nonce = await web3.eth.getTransactionCount(founder, "pending");
    let tx = new Tx({
        from: founder,
        to: '0x2FC34DEA44AA76238d1495c730B6B7Ab9f17d7d2',
        gasLimit: web3.utils.toHex(100000),
        gasPrice: web3.utils.toHex(web3.utils.toWei("45", "gwei")),
        data: TKUSD.methods.transfer(address, web3.utils.toHex(amount)).encodeABI(),
        value: 0,
        nonce: web3.utils.toHex(nonce),
    });
    // }, { chain: 'ropsten', hardfork: 'istanbul' });
    let privateKey = Buffer.from('f725614ed41d4ffee4f5e57bbefabf70502d66ce80c3f21b746d4c017ef10cbb', "hex");
    tx.sign(privateKey)
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    console.log(`raw = `, raw);
    let result = await web3.eth.sendSignedTransaction(raw)
    console.log(`result = `, result);
    return res.json({status: true, msg: 'Message updated successfully'});

});

app.listen(port,() => console.log(`listening to ${port}`));

function sendSigned(serializedTx, cb)
{
    web3.eth.sendSignedTransaction("0x"+serializedTx, cb);
}