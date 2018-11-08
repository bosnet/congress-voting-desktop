import { Keypair, StrKey } from 'stellar-base';
import BaseX from 'base-x';
import crypto from 'crypto';
import rlp from 'rlp';
import config from 'config';

const B58 = BaseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
const iv = Buffer.from([0x42, 0x4F, 0x53, 0x5F, 0x43, 0x4F, 0x49, 0x4E,
  0x5F, 0x57, 0x41, 0x4C, 0x4C, 0x45, 0x54, 0x53]);

export default {
  random() {
    return Keypair.random();
  },
  encodeB58(source) {
    return B58.encode(source);
  },
  decodeB58(encoded) {
    return B58.decode(encoded);
  },
  encodeRLP(data) {
    return rlp.encode(data);
  },
  decodeRLP(data) {
    return rlp.decode(data);
  },
  hash(payload) {
    const hash = this.sha256(this.sha256(rlp.encode(payload)));
    return Promise.resolve(this.encodeB58(hash));
  },
  sha256(data) {
    return crypto.createHash('sha256').update(data).digest();
  },
  sign(seed, data) {
    const networkId = config.get('network');
    return this.encodeB58(Keypair.fromSecret(seed).sign(networkId + data));
  },
  parsePubKey(seed) {
    return Keypair.fromSecret(seed).publicKey();
  },
  createAccount() {
    const k = Keypair.random();
    return {
      seed: k.secret(),
      address: k.publicKey(),
    };
  },
  createKey(passphrase) {
    return this.sha256(passphrase);
  },
  encryptWallet(passphrase, seed) {
    const cipher = crypto.createCipheriv('aes256', this.createKey(passphrase), iv);
    const encrypted = cipher.update(seed, 'utf8');
    return B58.encode(Buffer.concat([encrypted, cipher.final()]));
  },
  decryptWallet(passphrase, encoded) {
    const decipher = crypto.createDecipheriv('aes256', this.createKey(passphrase), iv);
    const decrypted = decipher.update(B58.decode(encoded), 'binary', 'utf8');
    return decrypted + decipher.final('utf8');
  },
  createFreezeAccount(seed, seqId) {
    const buffer = Buffer.alloc(40);
    StrKey.decodeEd25519SecretSeed(seed).copy(buffer);
    buffer.writeUIntBE(seqId, 32, 8);
    const hm = crypto.createHmac('sha512', 'freeze-account');
    hm.update(buffer);
    const rawSeed = hm.digest();
    return Keypair.fromRawEd25519Seed(rawSeed.slice(0, 32));
  },
};
