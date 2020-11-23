import StellarSdk, { AccountResponse, Server } from "stellar-sdk";
import TokenInfo from "./TokenInformation";
class StellarToken extends TokenInfo {
  constructor(tokenName: string, issuerPublicKey: string, networkType: string) {
    super(tokenName, issuerPublicKey, networkType);
  }

  async issueToken(
    issuerPrivateKey: string,
    issuingAmount: string,
    receiverPublicKey: string,
  ): Promise<any> {
    let self = this;
    let issuerKeyPair = StellarSdk.Keypair.fromSecret(issuerPrivateKey);
    return self.server
      .loadAccount(issuerKeyPair.publicKey())
      .then(function (issuer: AccountResponse) {
        let transaction = new StellarSdk.TransactionBuilder(issuer, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase:
            self.networkType == "main"
              ? StellarSdk.Networks.PUBLIC
              : StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: receiverPublicKey,
              asset: self.tokenInfo,
              amount: issuingAmount,
            }),
          )
          // setTimeout is required for a transaction
          .setTimeout(100)
          .build();
        transaction.sign(issuerKeyPair);
        return self.server.submitTransaction(transaction);
      });
  }
  async limitSupply(issuerPrivateKey: string) {
    let self = this;
    let issuerKeyPair = StellarSdk.Keypair.fromSecret(issuerPrivateKey);
    return self.server
      .loadAccount(issuerKeyPair.publicKey())
      .then(function (issuer: AccountResponse) {
        let transaction = new StellarSdk.TransactionBuilder(issuer, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase:
            self.networkType == "main"
              ? StellarSdk.Networks.PUBLIC
              : StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.setOptions({
              masterWeight: 0,
              lowThreshold: 1,
              medThreshold: 1,
              highThreshold: 1,
            }),
          )
          // setTimeout is required for a transaction
          .setTimeout(100)
          .build();
        transaction.sign(issuerKeyPair);
        return self.server.submitTransaction(transaction);
      });
  }
  static async getBalance(
    publicKey: string,
    networkType: string,
  ): Promise<any> {
    const server = new StellarSdk.Server(
      networkType == "main"
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org",
    );
    return server.accounts().accountId(publicKey).call();
  }
}

export default StellarToken;
