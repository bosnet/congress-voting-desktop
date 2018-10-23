import wire from '@/lib/wire';
import wallet from '@/lib/wallet';
import assert from 'assert';

describe('Wallet&Sebak library', function () {
  it('sha256', function () {
    const seed = 'SAU2GZJXASXDAB5DI4ZI2H6SJO27UIRXW6LMGOWWC7RGULVMAW4TVIVK';
    const address = 'GCNOVP44M34SDWFQAQQ2RER6CQ72IVEOMGTF55UCCJX55PTYMORMWL2T';
    const account = wallet.createFreezeAccount(seed, 1);
    const tx = wire.createFreezeAccountTx(address, 100000000000, 10000, 1, account.publicKey());

    return wallet.hash(tx.nestedArrays()).then((hash) => {
      assert.equal(hash, '5FvwzQBd5w5o2fQLtZcasQmDiQi3agmT4HNogdjV7FTJ');
      assert.equal(
        wallet.sign(seed, hash),
        'StkHsNP6YqDBh3q8fAMCLZfCfAyXXuLK31cQS7yKPxeM3fYxK77jgYN2Jh9DZ6jzJNJ2zoB5CBxrJhmzMEr5gAk',
      );
    });
  });
});
