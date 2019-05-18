const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const fs = require("fs");
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/hM4sFGiBdqbnGTxk5YT2"));

const ABIPath = "ABI/version10/";
const oedaxABI = fs.readFileSync(ABIPath + "Oedax.abi", "ascii");
const curveABI = fs.readFileSync(ABIPath + "Curve.abi", "ascii");
const tokenABI = fs.readFileSync(ABIPath + "DummyToken.abi", "ascii");
const auctionABI = fs.readFileSync(ABIPath + "Auction.abi", "ascii");

// test account:
const deployAddr = "0xe20cf871f1646d8651ee9dc95aab1d93160b3467";  // accounts[0]
const deployerPrivKey = "7c71142c72a019568cf848ac7b805d21f2e0fd8bc341e8314580de11c6a397bf";

const oedaxAddress = "0xc87d291C40C9F2754be26391878f715277c134B8";
const curveAddress = "0x44Cd575E35F580b12702127b25421e3128525F2B";
const fooTokenAddress = "0xD0ef9379c783E5783BA499ceBA78734794B67E72";
const barTokenAddress = "0x4FF214811F164dAB1889c83b1fe2c8c27d3dB615";

// const OedaxContract = new web3.eth.Contract(JSON.parse(oedaxABI));
// const CurveContract = new web3.eth.Contract(JSON.parse(curveABI));
// const TokenContract = new web3.eth.Contract(JSON.parse(tokenABI));
// const AuctionContract = new web3.eth.Contract(JSON.parse(auctionABI));

const oedaxInstance = new web3.eth.Contract(JSON.parse(oedaxABI), oedaxAddress);
const curveInstance = new web3.eth.Contract(JSON.parse(curveABI), curveAddress);
const fooToken = new web3.eth.Contract(JSON.parse(tokenABI), fooTokenAddress);
const barToken = new web3.eth.Contract(JSON.parse(tokenABI), barTokenAddress);

const feeRecipient = "0xc0ff3f78529ab90f765406f7234ce0f2b1ed69ee"; // accounts[1]
const bidder1 = "0x611db73454c27e07281d2317aa088f9918321415"; // accounts[2]
const bidder2 = "0x23a51c5f860527f971d0587d130c64536256040d"; // accounts[3]
const bidder1PrivKey = "04b9e9d7c1385c581bab12600834f4f90c6e19142faae6c2de670bfb4b5a08c4";
const bidder2PrivKey = "a99a8d27d06380565d1cf6c71974e7707a81676c4e7cb3dad2c43babbdca2d23";

const asker1 = "0xfda769a839da57d88320e683cd20075f8f525a57"; // accounts[4]
const asker2 = "0xf5b3ab72f6e80d79202dbd37400447c11618f21f"; // accounts[5]
const asker1PrivKey = "9fda7156489be5244d8edc3b2dafa6976c14c729d54c21fb6fd193fb72c4de0d";
const asker2PrivKey = "2949899bb4312754e11537e1e2eba03c0298608effeab21620e02a3ef68ea58a";


// sign and send
// @param txData { nonce, gasLimit, gasPrice, to, from, value }
function sendSigned(txData, privKey, cb) {
  const privateKey = new Buffer(privKey, 'hex');
  const transaction = new Tx(txData);
  transaction.sign(privateKey);
  const serializedTx = transaction.serialize().toString('hex');
  console.log("serializedTx:", serializedTx);
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb);
}

async function sendTx(txDataBin, sender, toAddr, privKey, ethVal = "0x0") {
  const addressFrom = sender;
  const txCount = await web3.eth.getTransactionCount(addressFrom);

  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6500000),
    gasPrice: web3.utils.toHex(5e9),
    from: addressFrom,
    to: toAddr,
    data: txDataBin,
    value: ethVal,  // create auction need 1 eth be sended.
  };

  sendSigned(txData, privKey, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("tx send succeeded!");
    }
  });
}

function numToBN(num) {
  return web3.utils.toBN("0x" + num.toString(16), 16);
}

async function test() {
  // const updateSettingsBin = oedaxInstance.methods.updateSettings(
  //   feeRecipient, curveAddress, 5, 20, 1, 10, 15, 25, 35, 1
  // ).encodeABI();

  // await sendTx(updateSettingsBin, deployAddr, oedaxInstance.address, deployerPrivKey);

  // const setFooTokenRankBin = oedaxInstance.methods.setTokenRank(
  //   fooToken.address, 10).encodeABI();
  // await sendTx(setFooTokenRankBin, deployAddr, oedaxInstance.address, deployerPrivKey);
  // const setBarTokenRankBin = oedaxInstance.methods.setTokenRank(
  //   barToken.address, 100).encodeABI();
  // await sendTx(setBarTokenRankBin, deployAddr, oedaxInstance.address, deployerPrivKey);

  // console.log(fooToken.address, barToken.address);

  // const createAuctionBin1 =  oedaxInstance.methods.createAuction(
  //   fooToken.address, barToken.address, 1, 1, 10, 5, 2, 60, 120
  // ).encodeABI();

  // await sendTx(createAuctionBin1, deployAddr, oedaxInstance.address, deployerPrivKey);

  // transfer eth to askers and bidders:
  // await sendTx("", deployAddr, asker1, deployerPrivKey, numToBN(5e17));
  // await sendTx("", deployAddr, bidder1, deployerPrivKey, numToBN(5e17));

  // const setBalanceBin1 = fooToken.methods.setBalance(asker1, "1000000000000000000000000").encodeABI();
  // await sendTx(setBalanceBin1, asker1, fooToken.address, asker1PrivKey);
  // const approveBin1 = fooToken.methods.setBalance(oedaxAddress, "1000000000000000000000000").encodeABI();
  // await sendTx(approveBin1, asker1, fooToken.address, asker1PrivKey);

  // const setBalanceBin2 = barToken.methods.setBalance(bidder1, "1000000000000000000000000").encodeABI();
  // await sendTx(setBalanceBin2, bidder1, barToken.address, bidder1PrivKey);
  // const approveBin2 = barToken.methods.setBalance(oedaxAddress, "1000000000000000000000000").encodeABI();
  // await sendTx(approveBin2, bidder1, barToken.address, bidder1PrivKey);


  // await fooToken.approve(oedaxInstance.address, numToBN(100000));
  // await barToken.approve(oedaxInstance.address, numToBN(1000000000));

  const auctionAddr1 = "0xB08bD3aB221da3326eC5C826317705B1fbA227F2";
  const auctionInstance1 = new web3.eth.Contract(JSON.parse(auctionABI), auctionAddr1);

  const bidBin1 = auctionInstance1.methods.bid("10000000000").encodeABI();
  await sendTx(bidBin1, bidder1, auctionAddr1, bidder1PrivKey);

}

test();