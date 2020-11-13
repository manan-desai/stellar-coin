import TradeToken from "../TradeToken";
import StellarSdk from "stellar-sdk";

describe("test valid token", () => {
  let issuingKey = "SDDXF3KY4NXXDOBIZNOH76ONXYE5GUNONJZR7N5B23GVKDOY2NQQO7O5";
  let buyerKey = "SB4W6PTC36JNOF5GJJSPLZ2MGKCQQTHXBTS5THTJGKSOWVJA2V2RXXZ2";
  let distributor = "SAZMHZM6NYVYRV53GV2LDWUKUL2TMG46HPUTE5CTZD2TAV3G375MJTPH";
  let tokenName = "TESTT";
  let buyToken = new TradeToken(
    tokenName,
    StellarSdk.Keypair.fromSecret(issuingKey).publicKey(),
    "test",
    buyerKey,
  );
  let sellToken = new TradeToken(
    tokenName,
    StellarSdk.Keypair.fromSecret(issuingKey).publicKey(),
    "test",
    distributor,
  );
  it("Should create Trust", async () => {
    let createTrust = await buyToken.createTrust();
    expect(createTrust.successful).toBe(true);
  }, 20000);
  it("should getBalance", async () => {
    let balance = await buyToken.getBalance();
    // console.log(balance);
    expect(balance.balances).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          asset_code: tokenName,
          asset_issuer: StellarSdk.Keypair.fromSecret(issuingKey).publicKey(),
        }),
      ]),
    );
  });

  // it("should buy token", async () => {
  //   let buyTokenRes = await buyToken.buyToken({ buyAmount: "20", price: 1 });
  //   // console.log(buyTokenRes.offerResults);
  // }, 10000);

  // it("should sell token", async () => {
  //   let sellTokenRes = await sellToken.sellToken({ amount: "4000", price: 18 });
  //   // console.log(sellTokenRes.offerResults[0]);
  // }, 10000);
  describe("should retrieve account's order", () => {
    it("should retrieve sell order", async () => {
      let sellOrders = await sellToken.getAccountOffers({ limit: 2 });
      expect(sellOrders.records).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            seller: StellarSdk.Keypair.fromSecret(distributor).publicKey(),
          }),
        ]),
      );
    }, 10000);
    it("should retrieve buy order", async () => {
      let buyOrders = await buyToken.getAccountOffers({ limit: 2 });
      console.log(buyOrders);
      expect(buyOrders.records).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            seller: StellarSdk.Keypair.fromSecret(buyerKey).publicKey(),
          }),
        ]),
      );
    }, 10000);
  });
});
