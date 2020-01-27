const assert = require('assert');
const web3 = require('../utils/web3');
const { interface, bytecode } = require('../compile');

let inbox;
let accounts;
let initialMessage = `Hi There !!`;
beforeEach(async ()=>
{
    accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    const {gasLimit} = await web3.eth.getBlock("pending");

    // console.log(`balance = ${balance}`);
    // console.log(`gasLimit = ${gasLimit}`);

    let status = balance > gasLimit;
    assert.ok(status);
    inbox = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: bytecode, arguments: [initialMessage]})
            .send({from: accounts[0], gas: gasLimit});
});

describe('Inbox', ()=>
{
    it(`deploys a contract`, ()=> 
    {
        assert.ok(inbox.options.address);
    });

    it(`has a default message`, async ()=> 
    {
        const message = await inbox.methods.message().call();
        assert.equal(message, initialMessage);
    });

    it(`can change the message`, async ()=> 
    {
        await inbox.methods.setMessage('bye').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});