import StellarSdk, { AccountResponse, Server } from "stellar-sdk";
export default class TokenInfo {
  protected server: Server;
  protected tokenName: string;
  protected tokenInfo: string;
  constructor(
    tokenName: string,
    issuerPublicKey: string,
    networkType: string = "test",
  ) {
    this.server = new StellarSdk.Server(
      networkType == "main"
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org",
    );
    this.tokenName = tokenName;
    this.tokenInfo = new StellarSdk.Asset(this.tokenName, issuerPublicKey);
  }
  async createTrust(receiverPrivateKey: string): Promise<any> {
    let receiverKeyPair = StellarSdk.Keypair.fromSecret(receiverPrivateKey);
    let self = this;
    return self.server
      .loadAccount(receiverKeyPair.publicKey())
      .then(function (receiver: AccountResponse) {
        let transaction = new StellarSdk.TransactionBuilder(receiver, {
          fee: 100,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          // The `changeTrust` operation creates (or alters) a trustline
          // The `limit` parameter below is optional
          .addOperation(
            StellarSdk.Operation.changeTrust({
              asset: self.tokenInfo,
              //   limit: "100",
            }),
          )
          // setTimeout is required for a transaction
          .setTimeout(1000)
          .build();
        transaction.sign(receiverKeyPair);
        return self.server.submitTransaction(transaction);
      });
  }
}
