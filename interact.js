// //SPDX-License-Identifier: MIT
// pragma solidity ^0.4.17;

const Web3 = require('web3');

//Load config.json
const CONFIG = require('./config.json')
const contract_ABI = require("./contractABI")

//Connect to a Node
const web3Node = new Web3(CONFIG["nodeURL"])

// console.log(Web3);
async function transaction(_number){
    //check if node is connected
    var isConnected = await web3Node.eth.net.isListening();
    if( !isConnected ){
        console.log("Cannot connect to node");
    }
    console.log("Successfully connected to node");

    //connect to contract
    const storageContract = new web3Node.eth.Contract(contract_ABI, CONFIG["contractAddress"])
    console.log("Initialized Contract");

    //get the gas price
    var gasPrice = await web3Node.eth.getGasPrice();
    console.log("Current Gas Price", gasPrice);

    //create transaction
    var txn = await storageContract.methods.setNumber(_number);
    console.log("Transaction: ", txn);

    // Reading txn
    // txn = await storageContract.methods.getNumber().call()

    var options = {
        to: CONFIG["contractAddress"],
        data: txn.encodeABI(),
        gas: await txn.estimateGas({ from : CONFIG["accountAddress"] }),
        gasPrice: gasPrice
    }

    //sign it
    var signedTransaction = await web3Node.eth.accounts.signTransaction( options, CONFIG["privateKey"]);

    //send it
    var receipt = await web3Node.eth.sendSignedTransaction( signedTransaction.rawTransaction);

    console.log(receipt);
}

transaction(15);
