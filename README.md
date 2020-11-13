# Stellar Token

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/manan5439/stellar-coin)

This is Simple Stellar Based Token module, which allow its developer to issue stellar based ICO, wallet, trade and many more.

# New Features!

- You can create ICO by just providing your Token name, supply and publish it from issuing account to distributor account.
- you can permanently block your issuing account so you can make sure no one issue more token afterword, in order to overcome trust issue by creating more token than total supply.
- you can create trust for your buyer, so he can trade your token
- you can create wallet for your buyer
- buyer can trade your token easily

### Tech

links for information and overview about stellar project

- [issuing token overview] Stellar official document

### Installation

Install the dependencies.

`npm i stellar-token --save or yarn add stellar-token`

### How to create wallet and fund test Token (public key private key)

- you can create wallet and get private and public key.

```
import {CreateWallet} from "stellar-token";

let issuingWallet = new Wallet();

console.log( issuingWallet.getPrivateKey(),issuingWallet.getPublicKey())

// in order to fundtest account use , but for mainNet you have to use real XLM

await issuingWallet.fundTestAmount()
```

### How to create new token and transfer it to the distributor account.

- first you need to create two account issuer account who will issue a token, and distributor account who is responsible in order to distribute your token. And use private key as given below example.

```
import {StellarToken} from "stellar-token";

// make sure this keys are very confidential so don\'t use it directly, instead you should use env or other key management mechanism

// feel free to use given keys, however this keys i used as testing so issuing keys are blocked already. so you can not create more token, it will throw exception. So i recommend you to create new token by using create token class and fund it buy using

fundTestAmount() for test net

let issuingKeys = "SDDXF3KY4NXXDOBIZNOH76ONXYE5GUNONJZR7N5B23GVKDOY2NQQO7O5";

let distributor = "SAZMHZM6NYVYRV53GV2LDWUKUL2TMG46HPUTE5CTZD2TAV3G375MJTPH";

let tokenName = "TESTT";
```

- make sure you have funded your account with xlm for more info ping [issuing asset]. Unless your account will not appear on stellar database, and you are not able to use your private keys
- now create instance of your class and provide following constructor argument 'StallerToken.StellarToken(tokenName,issungPublicKey,networkType)'.default networkType is test if you want to use mainNet then pass "main" in third argument. use folling example

```
import {StallerToken,CreateWallet} from "stellar-token";

let issuingKeys = "SDDXF3KY4NXXDOBIZNOH76ONXYE5GUNONJZR7N5B23GVKDOY2NQQO7O5";

let issuingPublicKey =
"GAZPNXHR26OE44VR7OITWXFI7KGKJCTV5JBB3VSAOWWDJ7X4HYQU6BMD";

let distributor = "SAZMHZM6NYVYRV53GV2LDWUKUL2TMG46HPUTE5CTZD2TAV3G375MJTPH";

let distributorPublicKey =
"GBMX77MCYNMSAKH5NULCSUNBZFAGAFTMYX2ZCYQ5G3ASZ54M2J3BEQUE";

let tokenName = "TESTT";

let totalSupply = "10000"

const st = new StellarToken(
tokenName,
issuingPublicKey,
"test", // use "main" for mainNet, we are currently using "test" net
);

(async () => {
try {
let createTrust = await newToken.createTrust(distributor); // create trust by distributor account

let issueToken = await newToken.issueToken(
issuingKeys,
totalSupply,
distributorPublicKey,
);

let limitSupply = await newToken.limitSupply(issuingKeys); // if you want to limit supply of your token then use limitSupply(issuingKeys) but it is not mandatory.
}
catch (e) {}

})();

```

###### warning: if you will use limitSupply your issuer private key's weight will be 0 so you won't be able to use this private key furthermore. Ping [options] for more information.

### check balance of your new token by using distributor public key

- you can check your balance by using static method of StallerToken class

```
import {StallerToken} from "stellar-token";

let distributorPublicKey =
"GBMX77MCYNMSAKH5NULCSUNBZFAGAFTMYX2ZCYQ5G3ASZ54M2J3BEQUE";

const {balances} = await StallerToken.getBalance(distributorPublicKey,"test") // second argument is for network use "main" for mai net

```

### How to Trade and issue ICO with fixed price

##### sell your token

- in order to sell your token to the public first you have to sell your token from your distributor account.
- price will be in native token

```
import {CreateWallet} from "stellar-token";
let distributor = "SAZMHZM6NYVYRV53GV2LDWUKUL2TMG46HPUTE5CTZD2TAV3G375MJTPH";

let issuingPublicKey =
"GAZPNXHR26OE44VR7OITWXFI7KGKJCTV5JBB3VSAOWWDJ7X4HYQU6BMD";

let sell = new TradeToken(
tokenName,
issuingPublicKey,
"test", // network testNet
distributor, // seller private key in our case all token is transfer to distributor account.
);

const res = await sell.sellToken({ amount: "50000", price: 10 })
// amount of your token and price will be in (XLM) native token. It means you are selling 50000 of your token with 10 xlm for each.
math 50000\*10 = 500000 worth of xml you are selling

```

###### tip: sell half of your total supply

##### buy token

- now you have sold your token from distributor account now time to make interface that buyer can buy your token. Before buying make sure buyers have sufficient xlm in their account. In example make sure buyer Key have minimum 200\*10 = 2000 xlm.

```
import {CreateWallet} from "stellar-token";
let buyerKey = "SAZMHZM6NYVYRV53GV2LDWUKUL2TMG46HPUTE5CTZD2TAV3G375MJTPH";

let issuingPublicKey =
"GAZPNXHR26OE44VR7OITWXFI7KGKJCTV5JBB3VSAOWWDJ7X4HYQU6BMD";

let buyToken = new TradeToken(
tokenName,
issuingPublicKey,
"test", // network testNet
buyerKey, // buyer account can buy your token.
);

//you can check balance and has trusred or not before buying
let balance = await buyToken.getBalance();

// before buying token buyer have to create trust wi
th your token
let createTrust = await buyToken.createTrust();

const res = await buyToken.buyToken({ buyAmount: "200", price: 10 });

```

### Upcoming version

- Transfer your token to receiver
- retrieve your token's current price
- cancel your order.
- event listener so you can display your live buy and sell orders

## License

MIT

**LinkedIn URL**
https://www.linkedin.com/in/manan-desai-765233110/

**Contact**
desai.manan@outlook.com

**Donate and support**
**_staller_**
staller adress: GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A

memo:1031799814

**_paypal_**

[![PayPal this](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif "PayPal – The safer, easier way to pay online!")](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HEQ98PHL34MMS&source=url)

[//]: #
[issuing token overview]: https://developers.stellar.org/docs/issuing-assets/
[issuing asset]: https://developers.stellar.org/docs/issuing-assets/how-to-issue-an-asset/
[options]: https://www.stellar.org/developers/guides/concepts/list-of-operations.html#set-options
