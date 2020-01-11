pragma solidity ^0.4.24;

contract Inbox
{
    string public message;
    
    constructor(string intitalMessage) public{
        message = intitalMessage;
    }
    
    function setMessage(string newMessage) public
    {
        message = newMessage;
    }
}