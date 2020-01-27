const path = require('path');
const express = require('express');
const web3 = require('./utils/web3');
const { interface, bytecode } = require('./compile');

let accounts, tokenize, app = express();
let port = process.env.PORT || 3000;

app.get('/getMessage', async (req, res) => 
{
    if(!tokenize)
        return res.json({status: false, msg: 'Contract is not deployed yet'});
    const message = await tokenize.methods.message().call();
    return res.json({status: true, msg: 'Fetched message value from contract', data: message});
});

app.get('/setMessage/:msg', async (req, res)=>
{
    let message = req.params.msg;
    if(!message)
        return res.json({status: false, msg: 'Please provide message'});
    if(!tokenize)
        return res.json({status: false, msg: 'Contract is not deployed yet'});

    const {gasLimit} = await web3.eth.getBlock("pending");
    await tokenize.methods.setMessage('bye').send({from: accounts[0], gas: gasLimit});
    return res.json({status: true, msg: 'Message updated successfully'});
});

app.listen(port,() => console.log(`listening to ${port}`));

const deploy = async()=>
{
    accounts = await web3.eth.getAccounts();
    console.log(`Attempting to deploy from account ${accounts[0]}`);
    
    const balance = await web3.eth.getBalance(accounts[0]);
    const {gasLimit} = await web3.eth.getBlock("pending");

    console.log(`balance = ${balance}`);
    console.log(`gasLimit = ${gasLimit}`);

    // let status = balance > gasLimit;
    tokenize = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: `0x${bytecode}`, arguments: ['Malik Mousa', 'MKR', 5000]})
            // .deploy({data: `0x${bytecode}`, arguments: ['Malik Mousa']})
            .send({from: accounts[0], gas: gasLimit});

    console.log(`ABI = `, interface);
    console.log(`ByteCode = `, bytecode);
    console.log(`Contract deployed to ${tokenize.options.address}`);
}
deploy();