import axios, {
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosInstance,
} from "axios";
import StellarSdk, { Keypair } from "stellar-sdk";
export default class CreateAccount {
  private keyPair: Keypair;
  constructor() {
    this.keyPair = StellarSdk.Keypair.random();
  }
  getKeyPair(): Keypair {
    return this.keyPair;
  }
  getPublicKey(): string {
    return this.keyPair.publicKey();
  }
  getPrivateKey(): string {
    return this.keyPair.secret();
  }
  async fundTestAmount() {
    return axios.get(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        this.getPublicKey(),
      )}`,
    );
  }
}
