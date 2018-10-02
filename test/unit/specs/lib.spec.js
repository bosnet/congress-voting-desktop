import { Sebak } from '@/lib/sebak';
import wallet from '@/lib/wallet';
import assert from 'assert';

describe('Wallet&Sebak library', function () {
  it('sha256', function () {
    const seed = 'SAU2GZJXASXDAB5DI4ZI2H6SJO27UIRXW6LMGOWWC7RGULVMAW4TVIVK';
    const address = 'GCNOVP44M34SDWFQAQQ2RER6CQ72IVEOMGTF55UCCJX55PTYMORMWL2T';
    const account = wallet.createFreezeAccount(seed, 1);
    const tx = Sebak.createFreezeAccountTx(address, 10000000000, 1, account.publicKey());

    return wallet.hash(tx.nestedArrays()).then((hash) => {
      assert.equal(hash, '5Dj7PZqGNx5ZxuMZu83eDSpctDLZhDUtbKWyVY7SdjgR');
      assert.equal(
        wallet.sign(seed, hash),
        '2b7EhdJT9ukdVXT15Jczb3QHsKvfXiuhcuR1oxRMnLstx93BPw5s6UChz2nN3cNNXSDLippqJ6GF26CtigS1tUe3',
      );
    });
  });
});
