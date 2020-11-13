import StellarToken from "../StellarToken";
import StellarSdk from "stellar-sdk";
describe("createToken", () => {
  let issuingKeys = "SDDXF3KY4NXXDOBIZNOH76ONXYE5GUNONJZR7N5B23GVKDOY2NQQO7O5";
  let distributor = "SAZMHZM6NYVYRV53GV2LDWUKUL2TMG46HPUTE5CTZD2TAV3G375MJTPH";
  let tokenName = "TESTT";
  let newToken = new StellarToken(
    tokenName,
    StellarSdk.Keypair.fromSecret(issuingKeys).publicKey(),
    "test",
  );
  it("Should create Trust", async () => {
    let createTrust = await newToken.createTrust(distributor);
    expect(createTrust.successful).toBe(true);
  }, 20000);
  it("Should issue Token Trust", async () => {
    try {
      let issueToken = await newToken.issueToken(
        issuingKeys,
        "10000",
        StellarSdk.Keypair.fromSecret(distributor).publicKey(),
      );
      expect(issueToken.successful).toBe(true);
    } catch (e) {
      expect(e.response.statusText).toEqual("Bad Request");
    }
  }, 20000);

  it("can block issuer to produce more assests in order to control supply", async () => {
    try {
      let limitSupply = await newToken.limitSupply(issuingKeys);
      let issueToken = await newToken.issueToken(
        issuingKeys,
        "10000",
        StellarSdk.Keypair.fromSecret(distributor).publicKey(),
      );
      expect(true).toBe(false);
    } catch (e) {
      expect(e.response.status).toEqual(400);
    }
  }, 20000);
  it("should getBalance", async () => {
    let balance = await StellarToken.getBalance(
      StellarSdk.Keypair.fromSecret(distributor).publicKey(),
      "test",
    );
    console.log(balance);
    expect(balance.balances).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          asset_code: tokenName,
          asset_issuer: StellarSdk.Keypair.fromSecret(issuingKeys).publicKey(),
        }),
      ]),
    );
  });
});
