const fs = require('fs');
const path = require('path');
const solc = require('solc');

const contract = path.resolve(__dirname, 'contracts', 'Tokenize.sol');
const source = fs.readFileSync(contract, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Tokenize'];