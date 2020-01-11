const path = require('path');
const express = require('express');
const web3 = require('./utils/web3');
const { interface, bytecode } = require('./compile');

let accounts, inbox, app = express();
let port = process.env.PORT || 3000;

app.get('/getMessage', async (req, res) => 
{
    if(!inbox)
        return res.json({status: false, msg: 'Contract is not deployed yet'});
    const message = await inbox.methods.message().call();
    return res.json({status: true, msg: 'Fetched message value from contract', data: message});
});

app.get('/setMessage/:msg', async (req, res)=>
{
    let message = req.params.msg;
    if(!message)
        return res.json({status: false, msg: 'Please provide message'});
    if(!inbox)
        return res.json({status: false, msg: 'Contract is not deployed yet'});

    const {gasLimit} = await web3.eth.getBlock("pending");
    await inbox.methods.setMessage('bye').send({from: accounts[0], gas: gasLimit});
    return res.json({status: true, msg: 'Message updated successfully'});
});

app.listen(port,() => console.log(`listening to ${port}`));

const deploy = async()=>
{
    accounts = await web3.eth.getAccounts();
    console.log(`Attempting to deploy from account ${accounts[0]}`);
    
    const balance = await web3.eth.getBalance(accounts[0]);
    const {gasLimit} = await web3.eth.getBlock("pending");

    // console.log(`balance = ${balance}`);
    // console.log(`gasLimit = ${gasLimit}`);

    // let status = balance > gasLimit;
    inbox = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: bytecode, arguments: ['Hi There!']})
            .send({from: accounts[0], gas: gasLimit});

    console.log(`Contract deployed to ${inbox.options.address}`);
}
deploy();