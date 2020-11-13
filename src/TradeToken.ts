import StellarSdk, { AccountResponse, Keypair, Server } from "stellar-sdk";
import { Collection } from "typescript";
import TokenInfo from "./TokenInformation";

interface sellOptions {
  amount: string;
  price: any;
  offerId?: number | string;
  source?: string;
}
interface buyOptions {
  buyAmount: string;
  price: any;
  offerId?: number | string;
  source?: string;
}
interface orderDetailsOptions {
  limit?: number;
  cursor?: string;
  order?: "asc" | "desc";
}

export default class TradeToken extends TokenInfo {
  private keyPair: Keypair;
  constructor(
    tokenName: string,
    issuerPublicKey: string,
    networkType: string,
    tradeAccountKey: string,
  ) {
    super(tokenName, issuerPublicKey, networkType);
    this.keyPair = StellarSdk.Keypair.fromSecret(tradeAccountKey);
  }
  async getBalance(): Promise<any> {
    return this.server.accounts().accountId(this.keyPair.publicKey()).call();
  }

  async createTrust(): Promise<any> {
    let receiverKeyPair = this.keyPair;
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

  async sellToken(options: sellOptions): Promise<any> {
    let self = this;
    return this.server
      .loadAccount(this.keyPair.publicKey())
      .then(function (receiver) {
        var transaction = new StellarSdk.TransactionBuilder(receiver, {
          fee: 100,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.manageSellOffer({
              ...{
                selling: self.tokenInfo,
                buying: StellarSdk.Asset.native(),
                offerId: 0,
              },
              ...options,
            }),
          )
          // setTimeout is required for a transaction
          .setTimeout(1000)
          .build();
        transaction.sign(self.keyPair);
        return self.server.submitTransaction(transaction);
      });
  }
  async buyToken(options: buyOptions): Promise<any> {
    let self = this;
    return this.server
      .loadAccount(this.keyPair.publicKey())
      .then(function (receiver) {
        var transaction = new StellarSdk.TransactionBuilder(receiver, {
          fee: 100,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.manageBuyOffer({
              ...{
                buying: self.tokenInfo,
                selling: StellarSdk.Asset.native(),
              },
              ...options,
            }),
          )
          // setTimeout is required for a transaction
          .setTimeout(1000)
          .build();
        transaction.sign(self.keyPair);
        return self.server.submitTransaction(transaction);
      });
  }
  async getAccountOffers(
    options?: orderDetailsOptions | undefined,
    streamCallBack?: any,
  ): Promise<any> {
    if (streamCallBack) {
      return this.server
        .offers()
        .forAccount(this.keyPair.publicKey())
        .limit(options?.limit || 10)
        .cursor(options?.cursor || "")
        .order(options?.order || "desc")
        .stream({ onmessage: streamCallBack });
    }
    return this.server
      .offers()
      .forAccount(this.keyPair.publicKey())
      .limit(options?.limit || 10)
      .cursor(options?.cursor || "")
      .order(options?.order || "desc")
      .call();
  }
}
