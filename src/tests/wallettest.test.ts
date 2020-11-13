import Wallet from "../CreateWallet";

describe("test valid token", () => {
  let issuingWallet = new Wallet();
  it("Should valid key ", async () => {
    expect(issuingWallet.getKeyPair().canSign()).toBe(true);
  });
  it("Should valid key ", async () => {
    let secret = Buffer.from("This is secret", "utf8");
    let signature = issuingWallet.getKeyPair().sign(secret);
    expect(issuingWallet.getKeyPair().verify(secret, signature)).toBe(true);
  });
});
