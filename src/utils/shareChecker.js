const ethers = require('ethers');
const fs = require('fs');

const rpc = process.env.RPC_URL;

const rawData = fs.readFileSync('./abi.json')
const abi = JSON.parse(rawData);

const contractAddress = "0xcf205808ed36593aa40a44f10c7f7c2f67d4a4d4";
const provider = new ethers.providers.JsonRpcProvider(rpc);

const contract = new ethers.Contract(contractAddress, abi, provider);

async function checkSharesBalance(sharesSubject, address) {
    try {
        let sharesBalanceRaw = await contract.sharesBalance(sharesSubject, address);
        let sharesBalance = Number(sharesBalanceRaw);

        if (sharesBalance > 0) {
            console.log('User is elegible for role');
            return true;
        } else {
            return false;
        }

    } catch (e) {
        console.error('Error getting sharesBalance - ', e);
    }
}

module.exports = { checkSharesBalance };